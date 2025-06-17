import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
              onChange={e => setSelectedMuscle(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              {muscleOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={selectedEquipment}
              onChange={e => setSelectedEquipment(e.target.value)}
              className="border rounded-md px-3 py-2"
            >
              {equipmentOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search exercises..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="border rounded-md px-3 py-2 flex-grow"
            />
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : filteredExercises.length === 0 ? (
            <div className="text-gray-600 text-center py-8">No exercises found.</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md"
                >
                  <h3 className="font-bold text-lg">{exercise.name}</h3>
                  <p className="text-gray-600 capitalize">{exercise.muscle_group || exercise.target}</p>
                  <p className="text-gray-500 text-sm">Equipment: {exercise.equipment || 'Bodyweight'}</p>
                  <p className="text-gray-500 text-sm">Difficulty: {exercise.difficulty || 'N/A'}</p>
                  {exercise.video_url && (
                    <div className="mt-2">
                      <iframe
                        width="100%"
                        height="180"
                        src={exercise.video_url.replace('watch?v=', 'embed/')}
                        title={exercise.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                      <a
                        href={exercise.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 underline text-sm"
                      >
                        Watch on YouTube
                      </a>
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