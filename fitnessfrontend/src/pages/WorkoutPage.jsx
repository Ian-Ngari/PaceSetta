import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WorkoutPlan from '../components/Workout/WorkoutPlan';
import WorkoutForm from '../components/Workout/WorkoutForm';
import api from '../utils/api';
import useUserData from '../hooks/useUserData';

const WorkoutPage = () => {
  const { userData } = useUserData();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const generateWorkoutPlan = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Correct endpoint: /workout-plans/
      const response = await api.post('/workout-plans/', {
        goal: formData.goal,
        level: formData.level,
        days: formData.days,
        preferences: formData.preferences,
        user_id: userData.id
      });

      setWorkoutPlan(response.data);
      setShowForm(false);
    } catch (err) {
      console.error('Error generating workout plan:', err);
      setError('Failed to generate workout plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentWorkout = async () => {
    try {
      // Correct endpoint: /workout-plans/current/
      const response = await api.get('/workout-plans/current/');
      if (response.data) {
        setWorkoutPlan(response.data);
      }
    } catch (err) {
      console.error('Error fetching current workout:', err);
    }
  };

  useEffect(() => {
    fetchCurrentWorkout();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Workout Plans</h1>
          {!workoutPlan && (
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create New Plan
            </button>
          )}
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700"
          >
            <p>{error}</p>
          </motion.div>
        )}

        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <WorkoutForm 
              onSubmit={generateWorkoutPlan} 
              onCancel={() => setShowForm(false)}
              isLoading={isLoading}
            />
          </motion.div>
        )}

        {workoutPlan && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <WorkoutPlan 
              plan={workoutPlan} 
              onEdit={() => setShowForm(true)}
              onNewPlan={() => {
                setWorkoutPlan(null);
                setShowForm(true);
              }}
            />
          </motion.div>
        )}

        {!workoutPlan && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white shadow rounded-lg p-8 text-center"
          >
            <h2 className="text-xl font-semibold mb-4">No Workout Plan Found</h2>
            <p className="text-gray-600 mb-6">Create a personalized workout plan tailored to your goals and fitness level.</p>
            <motion.button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your Plan
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WorkoutPage;