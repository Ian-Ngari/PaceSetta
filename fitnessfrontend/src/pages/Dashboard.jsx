import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaDumbbell, FaChartLine, FaUsers, FaTools, FaAppleAlt, FaHistory, FaCrown, FaFire, FaTrophy, FaHeartbeat } from 'react-icons/fa';
import useUserData from '../hooks/useUserData';

const Dashboard = () => {
  const { userData } = useUserData();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/user-stats/');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        
        setStats({
          workoutsCompleted: data.workoutsCompleted || 0,
          currentStreak: data.currentStreak || 0,
          totalCalories: data.totalCalories || 0,
          totalExercises: data.totalExercises || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        setStats({
          workoutsCompleted: 0,
          currentStreak: 0,
          totalCalories: 0,
          totalExercises: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Calculate changes (you can enhance this with real data later)
  const calculateChange = (current) => {
    return current > 0 ? `+${current}` : '+0';
  };

  const statCards = [
    { 
      label: "Workouts", 
      value: stats?.workoutsCompleted || 0,
      change: calculateChange(stats?.workoutsCompleted || 0),
      changeType: "positive",
      icon: <FaDumbbell className="text-blue-500" />
    },
    { 
      label: "Current Streak", 
      value: stats?.currentStreak ? `${stats.currentStreak} days` : '0 days',
      change: calculateChange(stats?.currentStreak || 0),
      changeType: "positive",
      icon: <FaFire className="text-orange-500" />
    },
    { 
      label: "Calories Burned", 
      value: stats?.totalCalories?.toLocaleString() || '0',
      change: calculateChange(stats?.totalCalories ? Math.floor(stats.totalCalories/100) : 0),
      changeType: "positive",
      icon: <FaHeartbeat className="text-red-500" />
    },
    { 
      label: "Exercises Logged", 
      value: stats?.totalExercises || '0',
      change: calculateChange(stats?.totalExercises || 0),
      changeType: "positive",
      icon: <FaTrophy className="text-yellow-500" />
    }
  ];
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
    {statCards.map((stat, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-gray-950 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-gray-400 text-sm">{stat.label}</p>
          <div className="text-lg">
            {stat.icon}
          </div>
        </div>
        <div className="flex items-baseline">
          <p className="text-2xl font-bold text-white">
            {loading ? (
              <span className="inline-block h-6 w-16 bg-gray-800 rounded animate-pulse"></span>
            ) : (
              stat.value
            )}
          </p>
          <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
            stat.changeType === 'positive' 
              ? 'bg-green-900 text-green-300' 
              : 'bg-red-900 text-red-300'
          }`}>
            {stat.change}
          </span>
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
      </div>
    </div>
  );
};

export default Dashboard;