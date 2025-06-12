import React from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="dashboard-container"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Fitness Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
            <p className="text-gray-600">No workout scheduled</p>
            <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Generate Workout
            </button>
          </motion.div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
            <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Progress charts will appear here</p>
            </div>
          </motion.div>

         
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Log Workout
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                View History
              </button>
              <button className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                Update Profile
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;