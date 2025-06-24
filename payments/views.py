from django.shortcuts import render


import os
import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", settings.STRIPE_SECRET_KEY)

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_checkout_session(request):
    YOUR_DOMAIN = "http://localhost:5173"  
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            mode='subscription',
            line_items=[{
                'price': 'price_1Rd6mN4ZxM9ej8PKJfPfgFra',  
                'quantity': 1,
            }],
            customer_email=request.user.email,
            success_url=YOUR_DOMAIN + '/membership-success',
            cancel_url=YOUR_DOMAIN + '/membership-cancel',
        )
        return JsonResponse({'url': session.url})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)