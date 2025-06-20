import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WorkoutPlan from '../components/Workout/WorkoutPlan';
import WorkoutForm from '../components/Workout/WorkoutForm';
import WorkoutLogForm from '../components/Workout/WorkoutLogForm';
import WorkoutHistory from '../components/Progress/WorkoutHistory';
import api from '../utils/api';
import useUserData from '../hooks/useUserData';

const WorkoutPage = () => {
  const { userData } = useUserData();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [completedRoutines, setCompletedRoutines] = useState([]);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const generateWorkoutPlan = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
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
      const response = await api.get('/workout-plans/current/');
      if (response.data) {
        setWorkoutPlan(response.data);
      }
    } catch (err) {
      console.error('Error fetching current workout:', err);
    }
  };

  // Fetch completed routines for today
  useEffect(() => {
    fetchCurrentWorkout();
  }, []);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.get('/workouts/completed/');
        const today = new Date().toISOString().slice(0, 10);
        setCompletedRoutines(
          res.data.filter(c => c.date === today).map(c => c.routine_id)
        );
      } catch (err) {
        setCompletedRoutines([]);
      }
    };
    if (workoutPlan) {
      fetchCompleted();
    }
  }, [workoutPlan]);

  const handleCompleteRoutine = async (routineId) => {
    try {
      await api.post('/workouts/completed/', { routine_id: routineId });
      setCompletedRoutines([...completedRoutines, routineId]);
      // Optionally, trigger a refresh in ActivityFeed if you want instant update
    } catch (err) {
      alert('Failed to mark as completed.');
    }
  };

  // Pass this to WorkoutLogForm so it can refresh WorkoutHistory after logging
  const handleLogged = () => setRefreshHistory(r => !r);

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
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Log Your Workout</h2>
              {workoutPlan.routines && workoutPlan.routines.length > 0 ? (
                workoutPlan.routines.map((routine) => {
                  const isCompleted = completedRoutines.includes(routine.id);
                  return (
                    <div key={routine.id} className="mb-8">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        {routine.day}
                        {isCompleted && (
                          <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded text-xs">Completed</span>
                        )}
                      </h3>
                      {routine.exercises && routine.exercises.length > 0 ? (
                        routine.exercises.map((exercise) => (
                          <div key={exercise.id} className="mb-6 p-4 bg-white rounded shadow">
                            <div className="font-medium mb-2">{exercise.name}</div>
                            <div className="text-sm text-gray-600 mb-2">
                              Sets: {exercise.sets} &nbsp; | &nbsp; Reps: {exercise.reps} &nbsp; | &nbsp; {exercise.weight ? `Weight: ${exercise.weight}` : ''}
                            </div>
                            <WorkoutLogForm defaultExercise={exercise.name} onLogged={handleLogged} />
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 mb-4">No exercises for this routine.</div>
                      )}
                      <button
                        onClick={() => handleCompleteRoutine(routine.id)}
                        className={`mt-2 px-4 py-2 rounded ${isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'}`}
                        disabled={isCompleted}
                      >
                        {isCompleted ? 'Completed' : 'Mark as Completed'}
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-gray-500">No routines found in this plan.</div>
              )}
            </div>
            {/* Show WorkoutHistory below the routines */}
            <div className="mt-10">
              <WorkoutHistory key={refreshHistory} />
            </div>
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