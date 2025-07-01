import React, { useState, useEffect } from 'react';
import RestTimer from '../components/Tools/RestTimer';
import WorkoutNotes from '../components/Tools/WorkoutNotes';
import VoiceNotes from '../components/Tools/VoiceNotes';
import { motion } from 'framer-motion';
import { FaTools, FaClock, FaStickyNote, FaMicrophone } from 'react-icons/fa';


const ToolsPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <FaTools className="text-3xl text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Workout Tools</h1>
        </motion.div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-blue-900/30 p-4 flex items-center">
              <FaClock className="text-xl text-blue-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Rest Timer</h2>
            </div>
            <div className="p-6">
              <RestTimer />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-purple-900/30 p-4 flex items-center">
              <FaStickyNote className="text-xl text-purple-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Workout Notes</h2>
            </div>
            <div className="p-6">
              <WorkoutNotes />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-green-900/30 p-4 flex items-center">
              <FaMicrophone className="text-xl text-green-400 mr-3" />
              <h2 className="text-xl font-semibold text-white">Voice Notes</h2>
            </div>
            <div className="p-6">
              <VoiceNotes />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="md:col-span-2 lg:col-span-3"
          >
            
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;