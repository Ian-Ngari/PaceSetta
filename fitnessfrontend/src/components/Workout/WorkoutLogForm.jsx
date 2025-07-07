import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { FaPlus, FaSpinner, FaCalculator } from 'react-icons/fa';

const WorkoutLogForm = ({ 
  onLogged, 
  defaultExercise = '',
  estimateCalories 
}) => {
  const [form, setForm] = useState({
    exercise: defaultExercise,
    sets: '',
    reps: '',
    calories: '',
    duration: 10 // Default duration in minutes
  });
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEstimateCalories = async () => {
    if (!form.exercise || !form.duration) return;
    
    setCalculating(true);
    try {
      const calories = await estimateCalories(form.exercise, form.duration);
      setForm({ ...form, calories });
    } catch (error) {
      console.error('Failed to estimate calories', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async e => {
  e.preventDefault();
  setLoading(true);
  try {
    await api.post('/workouts/logs/', {
      exercise: form.exercise,
      sets: Number(form.sets),
      reps: Number(form.reps),
      calories: Number(form.calories),
      duration: Number(form.duration)
    });
    setForm({ 
      exercise: defaultExercise, 
      sets: '', 
      reps: '', 
      calories: '',
      duration: 10
    });
    if (onLogged) onLogged(); 
  } catch (error) {
    console.error('Error details:', error.response?.data); 
    alert('Failed to log workout. Please check your inputs.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="bg-gray-950 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-900/30 p-4 flex items-center">
        <h2 className="text-xl font-semibold text-white">Log Your Workout</h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Exercise</label>
            <input
              type="text"
              name="exercise"
              placeholder="Enter exercise name"
              value={form.exercise}
              onChange={handleChange}
              className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Sets</label>
              <input
                type="number"
                name="sets"
                placeholder="0"
                value={form.sets}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Reps</label>
              <input
                type="number"
                name="reps"
                placeholder="0"
                value={form.reps}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="1"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-300 mb-2">Duration (min)</label>
              <input
                type="number"
                name="duration"
                placeholder="10"
                value={form.duration}
                onChange={handleChange}
                className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Calories Burned</label>
              <div className="flex">
                <input
                  type="number"
                  name="calories"
                  placeholder="0"
                  value={form.calories}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEstimateCalories}
                  disabled={calculating}
                  className="ml-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center"
                >
                  {calculating ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaCalculator />
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`w-full flex items-center justify-center px-4 py-3 rounded-lg text-white ${
              loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-500'
            }`}
            disabled={loading}
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Logging...
              </>
            ) : (
              <>
                <FaPlus className="mr-2" />
                Log Workout
              </>
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutLogForm;