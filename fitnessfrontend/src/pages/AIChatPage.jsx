import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaArrowLeft, FaPaperPlane, FaCrown, FaExclamationTriangle, FaSyncAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';


const AIChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [checkingPremium, setCheckingPremium] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPremiumStatus = async (initialCheck = true) => {
      let isVerified = false;
      let attempts = 0;
      const maxAttempts = 10;
      
      if (initialCheck) {
        setCheckingPremium(true);
      }

      while (!isVerified && attempts < maxAttempts) {
        try {
          const response = await api.get('/account/status/');
          
          if (response.data.is_premium) {
            setIsPremium(true);
            isVerified = true;
            setError(null);
            break;
          }
          
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        } catch (err) {
          console.error('Premium check failed:', err);
          attempts++;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      if (!isVerified) {
        setError('Premium membership required. Redirecting...');
        setTimeout(() => navigate('/membership'), 2000);
      }
      
      setCheckingPremium(false);
    };

    // Check for payment success parameter
    const queryParams = new URLSearchParams(window.location.search);
    const sessionId = queryParams.get('session_id');
    
    if (sessionId) {
      // Clear session_id from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      
      // Verify payment immediately
      setCheckingPremium(true);
      
      (async () => {
        try {
          await api.get(`/api/payments/check-payment-status/?session_id=${sessionId}`);
        } catch (err) {
          console.error('Payment verification failed:', err);
        }
        
        // Then verify premium status
        await verifyPremiumStatus(false);
      })();
    } else {
      // Regular check
      verifyPremiumStatus();
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
  if (!input.trim() || loading || !isPremium) return;
  
  const userMessage = { role: 'user', content: input };
  setMessages(msgs => [...msgs, userMessage]);
  setInput('');
  setLoading(true);
  setError(null);
  
  try {
    console.log("[FRONTEND] Sending message:", input); // Debug log
    const res = await api.post('/api/ai-chat/', { 
      message: input 
    }, {
      timeout: 15000 // 15 second timeout
    });
    
    console.log("[FRONTEND] Received response:", res.data); // Debug log
    if (res.data?.response) {
      setMessages(msgs => [...msgs, { 
        role: 'ai', 
        content: res.data.response 
      }]);
    } else {
      throw new Error('Empty response from server');
    }
  } catch (err) {
    console.error('[FRONTEND] Full error:', err);
    console.error('[FRONTEND] Error response:', err.response?.data);
    
    let errorMessage = 'Our AI assistant is currently unavailable. Please try again later.';
    if (err.response?.data?.error) {
      errorMessage = err.response.data.error;
    }
    
    setMessages(msgs => [...msgs, { role: 'ai', content: errorMessage }]);
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};
  const goBack = () => navigate(-1);

  const suggestedPrompts = [
    "Best chest exercises?",
    "How to lose belly fat?",
    "Beginner workout plan",
    "Pre-workout meal ideas",
    "How to improve my squat form?",
    "Best exercises for back pain"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center p-4">
         {checkingPremium && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="text-white text-4xl"
          >
            <FaSyncAlt />
          </motion.div>
          <p className="text-white ml-4">Verifying your membership...</p>
        </div>
      )}
      <div className="w-full max-w-2xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl overflow-hidden border border-purple-500/30">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 p-4 flex items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={goBack}
            className="bg-white/10 hover:bg-white/20 text-white p-2 rounded-full mr-3"
            aria-label="Go back"
          >
            <FaArrowLeft className="text-xl" />
          </motion.button>
          
          <div className="flex items-center">
            <FaRobot className="text-2xl text-yellow-400 mr-3" />
            <h2 className="text-xl font-bold text-white">Premium AI Fitness Assistant</h2>
          </div>
          
          <div className="ml-auto bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <FaCrown className="mr-1" /> PREMIUM
          </div>
        </div>
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-600/80 text-white p-3 flex items-center justify-center">
            <FaExclamationTriangle className="mr-2" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Chat Container */}
        <div className="h-[400px] overflow-y-auto bg-gray-800/50 p-4 flex flex-col">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <FaRobot className="text-5xl text-purple-500 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Welcome to your AI Fitness Assistant!</h3>
              <p className="text-gray-300 max-w-md mb-6">
                Ask me anything about fitness, nutrition, or workout plans. 
                I'm here to help you achieve your fitness goals!
              </p>
              
              <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
                {suggestedPrompts.map((prompt, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setInput(prompt)}
                    className="bg-gray-700 hover:bg-gray-600 text-gray-200 text-sm p-2 rounded-lg truncate"
                    disabled={!isPremium}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-br-none' 
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 text-gray-200 rounded-bl-none'
                }`}>
                  <div className="font-semibold mb-1 flex items-center">
                    {msg.role === 'user' ? 'You' : (
                      <>
                        <FaRobot className="text-purple-400 mr-2" /> AI Assistant
                      </>
                    )}
                  </div>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))
          )}
          
          {loading && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-700 text-gray-200 rounded-2xl rounded-bl-none p-4 max-w-[80%]">
                <div className="flex items-center">
                  <FaRobot className="text-purple-400 mr-2" /> AI Assistant
                </div>
                <div className="flex space-x-1 mt-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div className="p-4 bg-gray-800/80 border-t border-gray-700">
          <div className="flex">
            <input
              className="flex-1 rounded-l-xl px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              disabled={loading || !isPremium}
              placeholder={isPremium ? "Ask me anything about fitness..." : "Premium membership required"}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={sendMessage}
              disabled={loading || !input.trim() || !isPremium}
              className={`bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-5 rounded-r-xl flex items-center justify-center ${
                (loading || !input.trim() || !isPremium) ? 'opacity-70' : 'hover:from-purple-700 hover:to-indigo-800'
              }`}
              aria-label="Send message"
            >
              <FaPaperPlane />
            </motion.button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            {isPremium 
              ? "Premium AI powered by Gemini. Responses may take a few seconds."
              : "Upgrade to premium to access the AI assistant"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatPage;