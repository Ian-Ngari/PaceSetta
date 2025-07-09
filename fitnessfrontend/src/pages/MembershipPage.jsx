import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { FaCrown, FaCheck, FaFire, FaChartLine, FaUserFriends, FaStar, FaRobot } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';  

const stripePromise = loadStripe('pk_test_your_publishable_key');
const bgImage = "https://images.unsplash.com/photo-1731514399535-2747d0e71e59?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const MembershipPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();

   const goToAIChat = () => {
    navigate('/ai-chat');
  };

  const features = [
    {
      icon: <FaCrown className="text-2xl text-yellow-400" />,
      title: "Premium Workouts",
      description: "Access exclusive workout plans designed by professionals"
    },
    {
      icon: <FaChartLine className="text-2xl text-blue-400" />,
      title: "Advanced Analytics",
      description: "Detailed progress tracking and performance insights"
    },
    {
      icon: <FaFire className="text-2xl text-orange-400" />,
      title: "Challenges & Badges",
      description: "Participate in monthly challenges and earn achievements"
    },
    {
      icon: <FaUserFriends className="text-2xl text-purple-400" />,
      title: "Priority Support",
      description: "Get faster responses from our support team"
    },
    {
      icon: <FaRobot className="text-2xl text-green-400" />,
      title: "AI Fitness Assistant",
      description: "Get personalized workout advice from our AI assistant"
    }
  ];

  // Check premium status on load
  useEffect(() => {
    checkPremiumStatus();
    
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');
    
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('https://fitgenius1.onrender.com/account/status/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setIsPremium(data.is_premium);
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const handleSubscribe = async () => {
  setIsLoading(true);
  try {
    const token = localStorage.getItem('access_token');
    const response = await api.post('/api/payments/create-checkout-session/');
    
    if (response.data.url) {
      window.location.href = response.data.url;
    } else {
      throw new Error(response.data.error || 'Failed to create checkout session');
    }
  } catch (error) {
    console.error('Subscription error:', error);
    alert(error.message);
    setIsLoading(false);
  }
};

 const verifyPayment = async (sessionId) => {
  try {
    setIsLoading(true);
    const response = await api.get(`/api/payments/check-payment-status/?session_id=${sessionId}`);
    
    if (response.data.status === 'payment_verified') {
      // Force refresh the token to get updated claims
      try {
        const refreshResponse = await api.post('/token/refresh/', {
          refresh: localStorage.getItem('refresh_token')
        });
        
        localStorage.setItem('access_token', refreshResponse.data.access);
        
        // Verify premium status again with new token
        const statusResponse = await api.get('/account/status/');
        setIsPremium(statusResponse.data.is_premium);
        
        if (statusResponse.data.is_premium) {
          setPaymentStatus('success');
          navigate('/ai-chat', { 
            replace: true,
            state: { paymentCompleted: true } 
          });
        } else {
          setPaymentStatus('pending');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        setPaymentStatus('error');
      }
    } else {
      setPaymentStatus('pending');
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    setPaymentStatus('error');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      <img
        src={bgImage}
        alt="Premium Features Preview"
        className="absolute inset-0 w-full h-full object-cover blur-lg brightness-50 z-0"
        style={{ filter: 'blur(10px) brightness(0.5)' }}
      />
      
      {/* Overlay content */}
      <div className="relative z-10 w-full max-w-6xl px-4 py-12">
        {/* Payment status alerts */}
        {paymentStatus === 'success' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-800/80 rounded-lg text-white text-center"
          >
            <p className="font-bold">🎉 Payment successful! Premium features unlocked.</p>
          </motion.div>
        )}
        
        {paymentStatus === 'error' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-800/80 rounded-lg text-white text-center"
          >
            <p>⚠️ Payment verification failed. Please contact support.</p>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-500 to-yellow-300 text-white px-4 py-2 rounded-full mb-4">
            <FaCrown className="mr-2" />
            <span className="font-semibold">PREMIUM</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isPremium ? 'Welcome Premium Member!' : 'Upgrade Your Fitness Journey'}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isPremium 
              ? 'You have full access to all premium features' 
              : 'Unlock premium features and take your workouts to the next level'}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Membership Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-yellow-500/30"
          >
            <div className={`p-6 text-center ${isPremium ? 'bg-gradient-to-r from-green-600 to-green-500' : 'bg-gradient-to-r from-yellow-600 to-yellow-500'}`}>
              <h2 className="text-2xl font-bold text-white">Premium Membership</h2>
              <div className="flex items-center justify-center mt-4">
                {isPremium ? (
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-white flex items-center">
                      <FaCheck className="mr-2 text-xl" /> Active
                    </span>
                    <p className="text-gray-200 mt-2">Thank you for subscribing!</p>
                  </div>
                ) : (
                  <>
                    <span className="text-4xl font-bold text-white">$10</span>
                    <span className="text-gray-200 ml-1">/month</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-yellow-400 mr-3 mt-1">{feature.icon}</span>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-gray-300">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              {isPremium ? (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={goToAIChat}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white font-bold rounded-lg shadow-lg transition-all flex items-center justify-center"
                >
                  <FaRobot className="mr-2" /> Go to Premium AI Assistant
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className={`w-full py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-lg shadow-lg transition-all ${
                    isLoading ? 'opacity-75' : 'hover:from-yellow-600 hover:to-yellow-700'
                  }`}
                >
                  {isLoading ? 'Processing...' : 'Subscribe Now'}
                </motion.button>
              )}
              
              <p className="mt-4 text-center text-gray-400 text-sm">
                {isPremium ? 'Your subscription is active' : 'Cancel anytime. No hidden fees.'}
              </p>
            </div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-gray-950 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full border-2 border-yellow-500"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-white">Sarah Johnson</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The AI fitness assistant helped me achieve results I never thought possible. Worth every penny!"
              </p>
            </div>
            
            <div className="bg-gray-950 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full border-2 border-yellow-500"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-white">Michael Chen</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The AI gave me personalized workout advice that transformed my training approach."
              </p>
            </div>
            
            <div className="bg-gray-950 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <img 
                    src="https://randomuser.me/api/portraits/women/68.jpg" 
                    alt="User" 
                    className="w-12 h-12 rounded-full border-2 border-yellow-500"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-white">Emma Rodriguez</h3>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-300 italic">
                "The AI assistant keeps me motivated with personalized recommendations!"
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 bg-gray-950 backdrop-blur-sm rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                question: "Can I cancel anytime?",
                answer: "Yes, you can cancel your subscription at any time and you'll retain access until the end of your billing period."
              },
              {
                question: "How do I access the AI assistant?",
                answer: "After subscribing, click the 'Go to AI Assistant' button to start chatting with our fitness AI."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards as well as PayPal for subscription payments."
              },
              {
                question: "How do I access premium features?",
                answer: "Immediately after subscribing, all premium features will be unlocked in your account."
              }
            ].map((item, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4">
                <h3 className="font-semibold text-white mb-2">{item.question}</h3>
                <p className="text-gray-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MembershipPage;