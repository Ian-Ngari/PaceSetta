import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell, FaChartLine, FaUsers } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
const workoutImage = "https://images.unsplash.com/photo-1740895307943-7878df384db1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
import Footer from '../components/Layout/Footer';

const LandingPage = () => {
  const [ref1, inView1] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ref2, inView2] = useInView({ threshold: 0.1, triggerOnce: true });

  const features = [
    {
      icon: <FaDumbbell className="text-4xl text-blue-600" />,
      title: "Personalized Workouts",
      description: "AI-generated plans tailored to your goals and fitness level"
    },
    {
      icon: <FaChartLine className="text-4xl text-blue-600" />,
      title: "Progress Tracking",
      description: "Visualize your improvement with detailed analytics"
    },
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      title: "Community Support",
      description: "Connect with other fitness enthusiasts for motivation"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      
      <div 
  className="relative bg-cover bg-center min-h-screen"
  style={{ backgroundImage: `url(${workoutImage})` }}
>
  <div className="absolute inset-0 bg-black/30"></div>
  {/* ... */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white">
                Transform Your <span className="text-blue-400">Fitness Journey</span>
              </h1>
              <p className="mt-6 text-xl text-blue-100 max-w-2xl">
                AI-powered personalized workout plans tailored to your goals and fitness level. 
                Achieve your dream physique with our intelligent fitness platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-lg text-white shadow-lg"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-white hover:bg-gray-100 rounded-lg font-medium text-lg text-blue-600"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      
      <div className="py-24 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={ref1} className="text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-3xl font-bold text-gray-100"
            >
              Why Choose Our Platform
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={inView1 ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-4 max-w-2xl mx-auto text-gray-300"
            >
              Discover the power of AI-driven fitness planning
            </motion.p>
          </div>

          <div ref={ref2} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      
      <div className="py-16 bg-gray-800">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6 text-white-900">What Our Users Say</h2>
          <div className="bg-[#CAF0F8] p-8 rounded-xl shadow-inner">
            <p className="text-xl italic text-gray-700 mb-6">
              "This platform completely transformed my fitness routine. The personalized plans helped me achieve results I never thought possible!"
            </p>
            <div className="flex items-center justify-center">
              <img 
                src="https://randomuser.me/api/portraits/women/44.jpg" 
                alt="User" 
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div className="ml-4 text-left">
                <p className="font-bold text-gray-900">Sarah Johnson</p>
                <p className="text-blue-600">Fitness Enthusiast</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    
      <Footer />
    </div>
  );
};

export default LandingPage;