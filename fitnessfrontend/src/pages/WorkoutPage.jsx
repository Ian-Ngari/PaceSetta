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
import { FaDumbbell, FaPlus, FaChartLine, FaHistory } from 'react-icons/fa';

const EXERCISE_DB_API_KEY = '155566486cmsh04126592945afe1p1f037fjsn2437c60b7baf';
const EXERCISE_DB_HOST = 'exercisedb.p.rapidapi.com';
const NUTRITIONIX_APP_ID = '0c8a16b1';
const NUTRITIONIX_API_KEY = '74dcec4e478ad41eada2edef1f2f4501';


const WorkoutPage = () => {
  const { userData } = useUserData();
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [completedRoutines, setCompletedRoutines] = useState([]);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [filters, setFilters] = useState({
    bodyParts: [],
    targetMuscles: [],
    equipment: []
  });
  const [availableFilters, setAvailableFilters] = useState({
    bodyParts: [],
    targetMuscles: [],
    equipment: []
  });

  // Load workout plan from localStorage on component mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('workoutPlan');
    if (savedPlan) {
      setWorkoutPlan(JSON.parse(savedPlan));
    }
    fetchAvailableFilters();
  }, []);

  // Save workout plan to localStorage whenever it changes
  useEffect(() => {
    if (workoutPlan) {
      localStorage.setItem('workoutPlan', JSON.stringify(workoutPlan));
    }
  }, [workoutPlan]);

  const fetchAvailableFilters = async () => {
    try {
      const bodyPartsRes = await fetch(
        `https://${EXERCISE_DB_HOST}/exercises/bodyPartList`,
        {
          headers: {
            "X-RapidAPI-Key": EXERCISE_DB_API_KEY,
            "X-RapidAPI-Host": EXERCISE_DB_HOST
          }
        }
      );
      const bodyParts = await bodyPartsRes.json();

      const targetRes = await fetch(
        `https://${EXERCISE_DB_HOST}/exercises/targetList`,
        {
          headers: {
            "X-RapidAPI-Key": EXERCISE_DB_API_KEY,
            "X-RapidAPI-Host": EXERCISE_DB_HOST
          }
        }
      );
      const targets = await targetRes.json();

      const equipmentRes = await fetch(
        `https://${EXERCISE_DB_HOST}/exercises/equipmentList`,
        {
          headers: {
            "X-RapidAPI-Key": EXERCISE_DB_API_KEY,
            "X-RapidAPI-Host": EXERCISE_DB_HOST
          }
        }
      );
      const equipment = await equipmentRes.json();

      setAvailableFilters({
        bodyParts,
        targetMuscles: targets,
        equipment
      });
    } catch (err) {
      console.error('Failed to fetch filters', err);
    }
  };

  const generateWorkoutPlan = async (formData) => {
  setIsLoading(true);
  setError(null);
  try {
    // Build query parameters based on selected filters
    const queryParams = new URLSearchParams();
    if (filters.bodyParts.length > 0) queryParams.append('bodyPart', filters.bodyParts.join(','));
    if (filters.targetMuscles.length > 0) queryParams.append('target', filters.targetMuscles.join(','));
    if (filters.equipment.length > 0) queryParams.append('equipment', filters.equipment.join(','));

    // Fetch exercises based on filters
    const url = `https://${EXERCISE_DB_HOST}/exercises?${queryParams.toString()}`;
    const headers = {
      "X-RapidAPI-Key": EXERCISE_DB_API_KEY,
      "X-RapidAPI-Host": EXERCISE_DB_HOST
    };
    
    const res = await fetch(url, { headers });
    const exercises = await res.json();

    // Generate workout plan structure
    const days = Number(formData.days) || 3;
    const exercisesPerDay = formData.level === 'beginner' ? 4 : 6;
    
    const plan = {
      name: 'Personalized Plan',
      goal: formData.goal,
      level: formData.level,
      routines: [],
    };

    // Create a copy of exercises array to avoid modifying the original
    const availableExercises = [...exercises];

    for (let i = 0; i < days; i++) {
      const dayExercises = [];
      // Select random exercises for each day
      for (let j = 0; j < exercisesPerDay && availableExercises.length > 0; j++) {
        const randomIndex = Math.floor(Math.random() * availableExercises.length);
        const exercise = availableExercises.splice(randomIndex, 1)[0];
        
 
dayExercises.push({
  id: exercise.id,
  name: exercise.name,
  sets: formData.level === 'advanced' ? 4 : 3,
  reps: formData.goal === 'build_muscle' ? '8-12' : '12-15',
  gifUrl: exercise.gifUrl, 
  bodyPart: exercise.bodyPart,
  target: exercise.target,
  equipment: exercise.equipment
});
      }
      
      plan.routines.push({
        day: `Day ${i + 1}`,
        exercises: dayExercises,
      });
    }
    
    setWorkoutPlan(plan);
    setShowForm(false);
  } catch (err) {
    setError('Failed to generate workout plan. Please try again.');
    console.error('Error generating workout plan:', err);
  } finally {
    setIsLoading(false);
  }
};

  const [routineLogs, setRoutineLogs] = useState({});

  const handleLogged = (routineDay, exerciseId) => {
    setRefreshHistory(r => !r);
    setRoutineLogs(prev => {
      const updated = { ...prev };
      if (!updated[routineDay]) updated[routineDay] = new Set();
      updated[routineDay].add(exerciseId);
      return updated;
    });
  };

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

  const estimateCalories = async (exerciseName, durationMinutes) => {
    try {
      const response = await fetch('https://trackapi.nutritionix.com/v2/natural/exercise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-id': NUTRITIONIX_APP_ID,
          'x-app-key': NUTRITIONIX_API_KEY,
          'x-remote-user-id': '0'
        },
        body: JSON.stringify({
          query: `${exerciseName} for ${durationMinutes} minutes`,
          gender: userData?.gender || 'male',
          weight_kg: userData?.weight || 70,
          height_cm: userData?.height || 175,
          age: userData?.age || 30
        })
      });
      
      const data = await response.json();
      if (data.exercises && data.exercises.length > 0) {
        return Math.round(data.exercises[0].nf_calories);
      }
      return 0;
    } catch (err) {
      console.error('Failed to estimate calories', err);
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Main Content */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center space-x-4">
                <FaDumbbell className="text-3xl text-blue-500" />
                <h1 className="text-3xl font-bold text-white">Workout Plans</h1>
              </div>
              
              {!workoutPlan && (
                <motion.button
                  onClick={() => setShowForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FaPlus className="mr-2" />
                  Create New Plan
                </motion.button>
              )}
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-500 text-red-100 rounded-lg"
              >
                <p>{error}</p>
              </motion.div>
            )}

            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {showForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="mb-8"
              >
                <WorkoutForm 
                  onSubmit={generateWorkoutPlan} 
                  onCancel={() => setShowForm(false)}
                  isLoading={isLoading}
                  availableFilters={availableFilters}
                  filters={filters}
                  setFilters={setFilters}
                />
              </motion.div>
            )}

            {workoutPlan && !showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                <WorkoutPlan 
                  plan={workoutPlan} 
                  onEdit={() => setShowForm(true)}
                  onNewPlan={() => {
                    setWorkoutPlan(null);
                    setShowForm(true);
                  }}
                />
                
                <div className="bg-gray-950 rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <FaChartLine className="text-2xl text-blue-500" />
                    <h2 className="text-2xl font-bold text-white">Log Your Workout</h2>
                  </div>
                  
                  {workoutPlan.routines && workoutPlan.routines.length > 0 ? (
                    workoutPlan.routines.map((routine) => {
                      const isCompleted = completedRoutines.includes(routine.day);
                      return (
                        <div key={routine.day} className="mb-8 bg-gray-950 rounded-lg p-6">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                              {routine.day}
                              {isCompleted && (
                                <span className="ml-2 px-2 py-1 bg-green-600 text-white rounded-full text-xs">
                                  Completed
                                </span>
                              )}
                            </h3>
                            <button
                              onClick={() => handleCompleteRoutine(routine)}
                              className={`px-4 py-2 rounded-lg ${
                                isCompleted 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-600 hover:bg-gray-500 text-white'
                              }`}
                              disabled={isCompleted}
                            >
                              {isCompleted ? 'Completed' : 'Mark Complete'}
                            </button>
                          </div>
                          
                          {routine.exercises && routine.exercises.length > 0 ? (
                            routine.exercises.map((exercise) => (
                              <div key={exercise.id} className="mb-6 p-4 bg-gray-950 rounded-lg shadow">
                                <div className="font-medium text-white mb-2">{exercise.name}</div>
                                <div className="text-sm text-gray-300 mb-4">
                                  <span className="bg-blue-900/50 px-2 py-1 rounded mr-2">
                                    Sets: {exercise.sets}
                                  </span>
                                  <span className="bg-purple-900/50 px-2 py-1 rounded">
                                    Reps: {exercise.reps}
                                  </span>
                                </div>
                                <WorkoutLogForm
                                  defaultExercise={exercise.name}
                                  onLogged={() => handleLogged(routine.day, exercise.id)}
                                  estimateCalories={estimateCalories}
                                />
                              </div>
                            ))
                          ) : (
                            <div className="text-gray-400 mb-4">No exercises for this routine.</div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-gray-400">No routines found in this plan.</div>
                  )}
                </div>

                <div className="bg-gray-950 rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-4 mb-6">
                    <FaHistory className="text-2xl text-blue-500" />
                    <h2 className="text-2xl font-bold text-white">Workout History</h2>
                  </div>
                  <WorkoutHistory key={refreshHistory} />
                </div>
              </motion.div>
            )}

            {!workoutPlan && !showForm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-950 shadow-lg rounded-xl p-8 text-center"
              >
                <div className="bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaDumbbell className="text-2xl text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">No Workout Plan Found</h2>
                <p className="text-gray-300 mb-6">
                  Create a personalized workout plan tailored to your goals and fitness level.
                </p>
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="flex items-center justify-center mx-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaPlus className="mr-2" />
                  Create Your Plan
                </motion.button>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:w-80 space-y-6">
            <RestTimer />
            <WorkoutNotes />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkoutPage;