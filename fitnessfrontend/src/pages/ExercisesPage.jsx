import React, { useState } from 'react';
import ExerciseList from '../components/Workout/ExerciseList';
import { motion } from 'framer-motion';

const ExercisesPage = () => {
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900 mb-8"
        >
          Exercise Library
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <select 
              value={selectedMuscle}
              onChange={(e) => setSelectedMuscle(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              <option value="all">All Muscle Groups</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="arms">Arms</option>
              <option value="shoulders">Shoulders</option>
              <option value="core">Core</option>
            </select>
            
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md px-3 py-2 flex-grow"
            />
          </div>
          
          <ExerciseList 
            muscleGroup={selectedMuscle} 
            searchTerm={searchTerm} 
          />
        </motion.div>
      </div>
    </div>
  );
};

export default ExercisesPage;