from django.urls import path
from .views import create_checkout_session, check_payment_status

urlpatterns = [
    path('create-checkout-session/', create_checkout_session),
    path('check-payment-status/', check_payment_status),
]