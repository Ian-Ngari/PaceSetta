import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import fitnessImage from '../assets/images/fitness-landing.jpg.jpg'; 

const LandingPage = () => {
    return (
        <div className="relative overflow-hidden">
            
            <div className="relative h-screen">
                <img
                    src={fitnessImage}
                    alt="Fitness"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6 lg:px-8"
                >
                    <motion.h1 
                        className="text-4xl md:text-6xl font-extrabold text-white mb-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Transform Your Fitness Journey
                    </motion.h1>
                    
                    <motion.p 
                        className="text-xl md:text-2xl text-white mb-12 max-w-3xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                    >
                        AI-powered personalized workout plans tailored to your goals and fitness level.
                    </motion.p>
                    
                    <motion.div
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.9, duration: 0.8 }}
                    >
                        <Link to="/register">
                            <motion.button
                                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg text-lg hover:bg-indigo-700 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Get Started
                            </motion.button>
                        </Link>
                        <Link to="/login">
                            <motion.button
                                className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg text-lg hover:bg-gray-100 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Sign In
                            </motion.button>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
            
            
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Why Choose Our Fitness Planner
                        </h2>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
                            Discover the power of AI-driven fitness planning
                        </p>
                    </motion.div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                title: "Personalized Workouts",
                                description: "AI-generated plans based on your goals, fitness level, and preferences.",
                                icon: "🏋️"
                            },
                            {
                                title: "Progress Tracking",
                                description: "Visualize your improvement with detailed analytics and charts.",
                                icon: "📊"
                            },
                            {
                                title: "Social Motivation",
                                description: "Connect with friends, share achievements, and stay motivated.",
                                icon: "👥"
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                whileHover={{ y: -5 }}
                            >
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;