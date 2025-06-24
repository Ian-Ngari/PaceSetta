import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_...'); // Replace with your Stripe publishable key
const bgImage =
  "https://images.unsplash.com/photo-1731514399535-2747d0e71e59?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const MembershipPage = () => {
  const handleSubscribe = async () => {
    const token = localStorage.getItem('access_token');
    const response = await fetch('http://localhost:8000/api/payments/create-checkout-session/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || 'Failed to start checkout');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-900">
      {/* Blurred background image */}
      <img
        src={bgImage}
        alt="Premium Features Preview"
        className="absolute inset-0 w-full h-full object-cover blur-lg brightness-50 z-0"
        style={{ filter: 'blur(10px) brightness(0.5)' }}
      />
      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 rounded-xl bg-black/60 shadow-2xl">
        <h1 className="text-4xl font-bold mb-4 text-white">Become a Member</h1>
        <p className="mb-8 text-lg text-gray-300 max-w-xl text-center">
          Unlock premium features like advanced analytics, exclusive workouts, and more!<br />
          <span className="italic text-blue-300">Don’t miss out on the best of our platform.</span>
        </p>
        <button
          onClick={handleSubscribe}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-xl font-semibold shadow-lg"
        >
          Subscribe for $5/month
        </button>
        <p className="mt-4 text-sm text-gray-400">
          Cancel anytime. No hidden fees</p>
      </div>
    </div>
  );
};

export default MembershipPage;