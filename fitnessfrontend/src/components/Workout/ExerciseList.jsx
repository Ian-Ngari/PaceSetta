import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaDumbbell, FaPlay, FaFire, FaTrophy } from 'react-icons/fa';
import api from '../utils/api';

const muscleOptions = [
  { value: 'all', label: 'All Muscle Groups' },
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'arms', label: 'Arms' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'core', label: 'Core' },
];

const equipmentOptions = [
  { value: 'all', label: 'All Equipment' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'barbell', label: 'Barbell' },
  { value: 'pull-up bar', label: 'Pull-up Bar' },
  { value: 'cable machine', label: 'Cable Machine' },
  { value: 'machine', label: 'Machine' },
];

const ExercisesPage = () => {
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedEquipment, setSelectedEquipment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(
          `/exercises/?muscle=${selectedMuscle}&equipment=${selectedEquipment}`
        );
        setExercises(response.data);
      } catch (err) {
        setError('Failed to load exercises. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [selectedMuscle, selectedEquipment]);

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyBadge = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner':
        return 'bg-green-900/50 text-green-300';
      case 'intermediate':
        return 'bg-yellow-900/50 text-yellow-300';
      case 'advanced':
        return 'bg-red-900/50 text-red-300';
      default:
        return 'bg-gray-700 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <div className="p-3 bg-blue-900/20 rounded-xl">
            <FaDumbbell className="text-3xl text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Exercise Library</h1>
            <p className="text-gray-400">Browse our collection of exercises</p>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaFilter className="text-gray-400" />
                  </div>
                  <select
                    value={selectedMuscle}
                    onChange={e => setSelectedMuscle(e.target.value)}
                    className="pl-10 w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {muscleOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                
                <div className="relative flex-1">
                  <select
                    value={selectedEquipment}
                    onChange={e => setSelectedEquipment(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {equipmentOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="bg-red-900/50 text-red-300 p-4 rounded-lg inline-block">
                {error}
              </div>
            </div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-center py-8">
              <div className="bg-gray-800 text-gray-400 p-4 rounded-lg inline-block">
                No exercises found matching your criteria
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-gray-700 hover:border-blue-500/30"
                >
                  <div className="flex items-start mb-4">
                    <div className="bg-blue-900/20 p-3 rounded-lg mr-4">
                      <FaDumbbell className="text-blue-400 text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-lg mb-1">{exercise.name}</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-900/50 text-blue-300 px-2 py-1 rounded text-xs capitalize">
                          {exercise.muscle_group || exercise.target}
                        </span>
                        <span className="bg-purple-900/50 text-purple-300 px-2 py-1 rounded text-xs">
                          {exercise.equipment || 'Bodyweight'}
                        </span>
                        {exercise.difficulty && (
                          <span className={`${getDifficultyBadge(exercise.difficulty)} px-2 py-1 rounded text-xs`}>
                            {exercise.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {exercise.video_url && (
                    <div className="mt-4">
                      <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden relative">
                        <iframe
                          src={exercise.video_url.replace('watch?v=', 'embed/')}
                          title={exercise.name}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button 
                            onClick={() => window.open(exercise.video_url, '_blank')}
                            className="p-3 bg-black/50 rounded-full text-white hover:bg-black/70 transition"
                          >
                            <FaPlay />
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <a
                          href={exercise.video_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
                        >
                          Watch on YouTube
                        </a>
                        <div className="flex items-center space-x-2">
                          <span className="flex items-center text-xs text-gray-400">
                            <FaFire className="mr-1 text-orange-400" /> 24k
                          </span>
                          <span className="flex items-center text-xs text-gray-400">
                            <FaTrophy className="mr-1 text-yellow-400" /> 1.2k
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ExercisesPage;