import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaChartLine, FaUsers, FaTools, FaAppleAlt, FaHistory, FaCrown } from 'react-icons/fa';
import useUserData from '../hooks/useUserData';

const Dashboard = () => {
  const { userData } = useUserData();

  const features = [
    {
      icon: <FaDumbbell className="text-2xl text-blue-600" />,
      title: "Workout Plans",
      description: "Get personalized workout plans based on your goals",
      path: "/workouts",
    },
    {
      icon: <FaChartLine className="text-2xl text-blue-600" />,
      title: "Progress Tracking",
      description: "Track your fitness journey with detailed analytics",
      path: "/progress",
    },
      {
    icon: <FaDumbbell className="text-2xl text-blue-600" />,
    title: "Exercise Library",
    description: "Browse our collection of exercises with video tutorials",
    path: "/exercises",
  },
    {
      icon: <FaUsers className="text-2xl text-blue-600" />,
      title: "Social Feed",
      description: "Connect with friends and share achievements",
      path: "/social",
    },
    {
      icon: <FaTools className="text-2xl text-blue-600" />,
      title: "Workout Tools",
      description: "Timer, notes and other workout utilities",
      path: "/tools",
    },
    {
      icon: <FaAppleAlt className="text-2xl text-blue-600" />,
      title: "Nutrition",
      description: "Meal planning and nutrition tracking",
      path: "/nutrition",
    },
    {
      icon: <FaHistory className="text-2xl text-blue-600" />,
      title: "Workout History",
      description: "View your past workout sessions",
      path: "/workouts",
    }
  ];

  const stats = [
    { label: "Workouts", value: "12", change: "+2", changeType: "positive" },
    { label: "Current Streak", value: "5 days", change: "+1 day", changeType: "positive" },
    { label: "Calories Burned", value: "3,450", change: "+420", changeType: "positive" },
    { label: "Minutes Trained", value: "245", change: "+35", changeType: "positive" }
  ];

  return (
    <div className="min-h-screen bg-black pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-white mb-2"
          >
            Welcome back, <span className="text-blue-400">{userData?.username || 'Athlete'}</span>!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400"
          >
            Ready to crush your fitness goals today?
          </motion.p>
        </div>

        {/* Membership Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <FaCrown className="text-2xl text-white mr-4" />
              <div>
                <h2 className="text-xl font-bold text-white">Unlock Premium Features</h2>
                <p className="text-yellow-100">Get access to exclusive workouts and advanced analytics</p>
              </div>
            </div>
            <Link to="/membership">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white text-yellow-700 font-bold rounded-lg shadow hover:bg-gray-100 transition-colors"
              >
                Upgrade Now
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-950 rounded-xl p-6 shadow-lg"
            >
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                {stat.change && (
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-900 text-green-300' 
                      : 'bg-red-900 text-red-300'
                  }`}>
                    {stat.change}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link to={feature.path} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full bg-gray-950 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-700 hover:border-blue-500/30"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-900/20 flex items-center justify-center mr-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                </div>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <div className="flex items-center text-blue-400 hover:text-blue-300 transition">
                  <span className="mr-2">Get started</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-950 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-gray-700">
            {[
              { action: "Completed Chest Workout", time: "2 hours ago" },
              { action: "Achieved new PR in Deadlift", time: "1 day ago" },
              { action: "Logged 3 new exercises", time: "2 days ago" },
              { action: "Started new workout plan", time: "3 days ago" }
            ].map((activity, index) => (
              <div key={index} className="p-6 hover:bg-gray-700/50 transition-colors">
                <div className="flex justify-between">
                  <p className="text-white">{activity.action}</p>
                  <span className="text-gray-400 text-sm">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;