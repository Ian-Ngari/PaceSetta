import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WorkoutPlan from '../components/Workout/WorkoutPlan';
import WorkoutForm from '../components/Workout/WorkoutForm';
import WorkoutLogForm from '../components/Workout/WorkoutLogForm';
import WorkoutHistory from '../components/Progress/WorkoutHistory';
import RestTimer from '../components/Tools/RestTimer';
import WorkoutNotes from '../components/Tools/WorkoutNotes';
import api from '../utils/api';
import useUserData from '../hooks/useUserData';

const EXERCISE_DB_API_KEY =  '155566486cmsh04126592945afe1p1f037fjsn2437c60b7baf';
const EXERCISE_DB_HOST = 'exercisedb.p.rapidapi.com';

const WorkoutPage = () => {
  const { userData } = useUserData();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [completedRoutines, setCompletedRoutines] = useState([]);
  const [refreshHistory, setRefreshHistory] = useState(false);

  // Helper: Map user goal/level to muscle groups and exercise types
   const getMuscleGroups = (goal) => {
    switch (goal) {
      case 'build_muscle':
        return ['chest', 'back', 'upper legs', 'shoulders', 'upper arms'];
      case 'lose_fat':
        return ['cardio', 'full body', 'lower legs', 'back', 'chest'];
      case 'increase_strength':
        return ['chest', 'back', 'upper legs', 'shoulders', 'upper arms'];
      default:
        return ['full body', 'cardio', 'upper legs', 'upper arms'];
    }
  };

  const getExerciseType = (level) => {
    switch (level) {
      case 'beginner':
        return { min: 6, max: 8 };
      case 'intermediate':
        return { min: 8, max: 10 };
      case 'advanced':
        return { min: 10, max: 12 };
      default:
        return { min: 6, max: 8 };
    }
  };

const generateWorkoutPlan = async (formData) => {
  setIsLoading(true);
  setError(null);
  try {
    // 1. Fetch all exercises
    const res = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': EXERCISE_DB_API_KEY,
        'X-RapidAPI-Host': EXERCISE_DB_HOST,
      },
    });
    const allExercises = await res.json();

    // 2. Filter by preferences (equipment/bodyweight)
    let filtered = allExercises;
    if (formData.preferences) {
      filtered = filtered.filter(ex =>
        ex.equipment.toLowerCase().includes(formData.preferences.toLowerCase())
      );
    }

    // 3. Filter by selected body parts, or fallback to goal-based muscle groups
    let bodyParts = formData.bodyParts && formData.bodyParts.length > 0
      ? formData.bodyParts
      : getMuscleGroups(formData.goal);

    filtered = filtered.filter(ex =>
      bodyParts.includes(ex.bodyPart.toLowerCase())
    );

    // 4. Shuffle and pick exercises for each day
    const { min, max } = getExerciseType(formData.level);
    const days = Number(formData.days) || 3;
    const routines = [];

    for (let d = 0; d < days; d++) {
      const usedExercises = new Set();
      const shuffled = [...filtered].sort(() => 0.5 - Math.random());
      const dayExercises = [];
      for (let i = 0; i < max && shuffled.length > 0; i++) {
        const ex = shuffled.pop();
        if (!usedExercises.has(ex.id)) {
          usedExercises.add(ex.id);
          dayExercises.push({
            id: ex.id,
            name: ex.name,
            sets: formData.level === 'advanced' ? 4 : 3,
            reps: formData.goal === 'build_muscle' ? 8 : 12,
            weight: '',
            notes: `${ex.bodyPart} | ${ex.equipment}`,
          });
        }
      }
      routines.push({
        day: `Day ${d + 1}`,
        exercises: dayExercises,
      });
    }

    // 5. Build plan object
    const plan = {
      name: 'Personalized Plan',
      goal: formData.goal.replace('_', ' '),
      level: formData.level,
      routines,
    };
    setWorkoutPlan(plan);
    setShowForm(false);
  } catch (err) {
    setError('Failed to generate workout plan. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  // Fetch completed routines for today (unchanged)
  useEffect(() => {
    // You can keep your backend fetch here if you want to support backend plans as well
  }, []);

  // Track which routines have all logs filled for completion
  const [routineLogs, setRoutineLogs] = useState({});

  // Called by WorkoutLogForm after a log is submitted
  const handleLogged = (routineDay, exerciseId) => {
    setRefreshHistory(r => !r);
    setRoutineLogs(prev => {
      const updated = { ...prev };
      if (!updated[routineDay]) updated[routineDay] = new Set();
      updated[routineDay].add(exerciseId);
      return updated;
    });
  };

  // Mark routine as completed only if all logs are filled
  const handleCompleteRoutine = (routine) => {
    if (
      routine.exercises &&
      routineLogs[routine.day] &&
      routineLogs[routine.day].size === routine.exercises.length
    ) {
      setCompletedRoutines([...completedRoutines, routine.day]);
    } else {
      alert('Please log all exercises for this routine before marking as completed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Workout Content */}
        <div className="flex-1">
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
                whilehover={{ scale: 1.05 }}
                whiletap={{ scale: 0.95 }}
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
                    const isCompleted = completedRoutines.includes(routine.day);
                    return (
                      <div key={routine.day} className="mb-8">
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
                                Sets: {exercise.sets} &nbsp; | &nbsp; Reps: {exercise.reps}
                              </div>
                              <WorkoutLogForm
                                defaultExercise={exercise.name}
                                onLogged={() => handleLogged(routine.day, exercise.id)}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 mb-4">No exercises for this routine.</div>
                        )}
                        <button
                          onClick={() => handleCompleteRoutine(routine)}
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

        {/* Sidebar with Rest Timer first, then Workout Notes */}
        <div className="lg:w-96 w-full flex flex-col gap-8 mt-10 lg:mt-0">
          <RestTimer />
          <WorkoutNotes />
        </div>
      </div>
    </div>
  );
};

export default WorkoutPage;