import os
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from accounts.models import CustomUser
from django.utils import timezone

# Initialize Stripe with environment variable fallback
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", settings.STRIPE_SECRET_KEY)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    try:
        # Ensure the user is authenticated
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': settings.STRIPE_PRICE_ID,
                'quantity': 1,
            }],
            mode='subscription',
            success_url=f"{settings.FRONTEND_DOMAIN}/ai-chat?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.FRONTEND_DOMAIN}/membership-cancel",
            metadata={
                'user_id': request.user.id,
                'username': request.user.username
            }
        )
        return Response({'url': session.url})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_payment_status(request):
    session_id = request.query_params.get('session_id')
    if not session_id:
        return Response({'error': 'session_id required'}, status=400)

    try:
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status == 'paid':
            # Update user status
            user = request.user
            user.is_premium = True
            user.premium_since = timezone.now()
            user.save()
            
            return Response({
                'status': 'payment_verified',
                'is_premium': True
            })
        
        return Response({'status': 'payment_pending'})
        
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@csrf_exempt
@api_view(['POST'])
def stripe_webhook(request):
    print(f"WEBHOOK RECEIVED: {request.data}")
    
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = os.getenv('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
        print(f"WEBHOOK EVENT: {event['type']}")
    except ValueError as e:
        print(f"⚠️  Webhook error while parsing basic request: {str(e)}")
        return Response(status=400)
    except stripe.error.SignatureVerificationError as e:
        print(f"⚠️  Webhook signature verification failed: {str(e)}")
        return Response(status=400)
    
    # Handle event types
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        print(f"💰 Checkout session completed: {session.id}")
        handle_checkout_session(session)
    
    # ... rest of webhook handling ...
    elif event['type'] == 'customer.subscription.updated':
        subscription = event['data']['object']
        handle_subscription_update(subscription)
        
    elif event['type'] == 'customer.subscription.deleted':
        subscription = event['data']['object']
        handle_subscription_cancel(subscription)

    return Response({'status': 'success'}, status=status.HTTP_200_OK)

def handle_checkout_session(session):
    """
    Handle successful checkout session completion
    """
    print(f"Handling checkout session: {session}")  # Debug logging
    user_id = session.metadata.get('user_id')
    if not user_id:
        print("No user_id in session metadata")  # Debug logging
        return

    try:
        user = CustomUser.objects.get(id=user_id)
        print(f"Found user: {user.username}")  # Debug logging
        user.is_premium = True
        user.premium_since = timezone.now()
        user.stripe_customer_id = session.get('customer')
        user.stripe_subscription_id = session.get('subscription')
        user.save()
        print(f"User {user.username} upgraded to premium")  # Debug logging
    except CustomUser.DoesNotExist:
        print(f"User with ID {user_id} not found")  # Debug logging
    except Exception as e:
        print(f"Error updating user: {str(e)}")  # Debug logging
        
        # You might want to log this or send a welcome email
        print(f"User {user.username} upgraded to premium")
        
    except CustomUser.DoesNotExist:
        print(f"User with ID {user_id} not found")
    except Exception as e:
        print(f"Error updating user: {str(e)}")

def handle_subscription_update(subscription):
    """
    Handle subscription changes (renewals, cancellations, etc.)
    """
    customer_id = subscription.get('customer')
    if not customer_id:
        return

    try:
        user = CustomUser.objects.get(stripe_customer_id=customer_id)
        if subscription['status'] in ['active', 'trialing']:
            user.is_premium = True
        else:
            user.is_premium = False
        user.stripe_subscription_id = subscription.get('id')
        user.save()
        
    except CustomUser.DoesNotExist:
        print(f"Customer with ID {customer_id} not found")
    except Exception as e:
        print(f"Error updating subscription: {str(e)}")

def handle_subscription_cancel(subscription):
    """
    Handle subscription cancellation
    """
    customer_id = subscription.get('customer')
    if not customer_id:
        return

    try:
        user = CustomUser.objects.get(stripe_customer_id=customer_id)
        user.is_premium = False
        user.stripe_subscription_id = None
        user.save()
        
        # You might want to send a cancellation email
        print(f"User {user.username} cancelled subscription")
        
    except CustomUser.DoesNotExist:
        print(f"Customer with ID {customer_id} not found")
    except Exception as e:
        print(f"Error cancelling subscription: {str(e)}")