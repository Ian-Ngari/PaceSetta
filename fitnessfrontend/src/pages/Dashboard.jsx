import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useUserData from '../hooks/useUserData';

const Dashboard = () => {
  const { userData } = useUserData();

  const features = [
    {
      title: "Workout Plans",
      description: "Get personalized workout plans based on your goals",
      icon: "🏋️",
      path: "/workouts",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Exercise Library",
      description: "Browse our extensive exercise database",
      icon: "📚",
      path: "/exercises",
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Progress Tracking",
      description: "Track your fitness journey with detailed analytics",
      icon: "📊",
      path: "/progress",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Social Feed",
      description: "Connect with friends and share achievements",
      icon: "👥",
      path: "/social",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Workout Tools",
      description: "Timer, notes and other workout utilities",
      icon: "🛠️",
      path: "/tools",
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl"
          >
            Welcome back, {userData?.username || 'Athlete'}!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-xl mx-auto text-xl text-gray-500"
          >
            Ready to crush your fitness goals today?
          </motion.p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Link to={feature.path} className="block">
                <div className={`p-6 ${feature.color}`}>
                  <div className="flex items-center">
                    <span className="text-3xl mr-4">{feature.icon}</span>
                    <h2 className="text-2xl font-bold">{feature.title}</h2>
                  </div>
                </div>
                <div className="px-6 py-4 bg-white">
                  <p className="text-gray-700">{feature.description}</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                      Get started →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-600">Workouts</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-600">Current Streak</p>
                <p className="text-2xl font-bold">5 days</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-yellow-600">Calories</p>
                <p className="text-2xl font-bold">3,450</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-purple-600">Minutes</p>
                <p className="text-2xl font-bold">245</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;