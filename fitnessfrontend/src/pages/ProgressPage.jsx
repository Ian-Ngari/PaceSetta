import React from 'react';
import ProgressCharts from '../components/Progress/ProgressCharts';
import WorkoutHistory from '../components/Progress/WorkoutHistory';  // Default import
import { motion } from 'framer-motion';

const ProgressPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Your Progress
        </motion.h1>
        
        <div className="grid gap-8">
          <ProgressCharts />
          <WorkoutHistory />
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;