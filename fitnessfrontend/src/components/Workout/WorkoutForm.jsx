import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDumbbell, FaPlus, FaTimes } from 'react-icons/fa';

const WorkoutForm = ({ 
  onSubmit, 
  onCancel, 
  isLoading,
  availableFilters,
  filters,
  setFilters
}) => {
  const [form, setForm] = useState({
    goal: '',
    level: '',
    days: 3,
    preferences: '',
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBodyPartsChange = e => {
    const options = Array.from(e.target.selectedOptions);
    setFilters({...filters, bodyParts: options.map(o => o.value)});
  };

  const handleTargetMusclesChange = e => {
    const options = Array.from(e.target.selectedOptions);
    setFilters({...filters, targetMuscles: options.map(o => o.value)});
  };

  const handleEquipmentChange = e => {
    const options = Array.from(e.target.selectedOptions);
    setFilters({...filters, equipment: options.map(o => o.value)});
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-gray-950 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FaDumbbell className="text-blue-500 mr-3" />
              Create Workout Plan
            </h2>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-gray-950 hover:text-white"
              >
                <FaTimes />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Goal</label>
                <select
                  name="goal"
                  value={form.goal}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select goal</option>
                  <option value="build_muscle">Build Muscle</option>
                  <option value="lose_fat">Lose Fat</option>
                  <option value="increase_strength">Increase Strength</option>
                  <option value="general_fitness">General Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Experience Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Days per Week</label>
                <input
                  type="number"
                  name="days"
                  min={2}
                  max={5}
                  value={form.days}
                  onChange={handleChange}
                  className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Body Parts</label>
                <select
                  multiple
                  value={filters.bodyParts}
                  onChange={handleBodyPartsChange}
                  className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                >
                  {availableFilters.bodyParts.map(bp => (
                    <option key={bp} value={bp}>
                      {bp}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Target Muscles</label>
                <select
                  multiple
                  value={filters.targetMuscles}
                  onChange={handleTargetMusclesChange}
                  className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                >
                  {availableFilters.targetMuscles.map(tm => (
                    <option key={tm} value={tm}>
                      {tm}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Equipment</label>
                <select
                  multiple
                  value={filters.equipment}
                  onChange={handleEquipmentChange}
                  className="w-full bg-gray-950 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                >
                  {availableFilters.equipment.map(eq => (
                    <option key={eq} value={eq}>
                      {eq}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              {onCancel && (
                <motion.button
                  type="button"
                  onClick={onCancel}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gray-950 hover:bg-gray-600 text-white rounded-lg"
                  disabled={isLoading}
                >
                  Cancel
                </motion.button>
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg text-white ${isLoading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-500'}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <>
                    <FaPlus className="inline mr-2" />
                    Generate Plan
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkoutForm;