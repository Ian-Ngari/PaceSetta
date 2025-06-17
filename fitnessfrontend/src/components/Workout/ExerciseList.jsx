import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';

const ExerciseList = ({ muscleGroup, equipment, searchTerm }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          `/exercises/?muscle=${muscleGroup}&equipment=${equipment}`
        );
        setExercises(response.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [muscleGroup, equipment]);

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedExercise(exercise)}
              className="border rounded-lg p-4 cursor-pointer bg-white shadow-sm hover:shadow-md"
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
                </div>
              )}

              {selectedExercise?.name === exercise.name && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t"
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExercise(null);
                    }}
                    className="mt-2 text-sm text-blue-600"
                  >
                    Close details
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseList;