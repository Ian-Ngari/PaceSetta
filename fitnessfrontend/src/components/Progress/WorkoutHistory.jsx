import React, { useEffect, useState } from 'react';
import api from '../../utils/api';

const WorkoutHistory = () => {
  const [workoutData, setWorkoutData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/workouts/logs/');
        setWorkoutData(response.data);
      } catch (error) {
        setWorkoutData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Workout History</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exercise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reps</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {workoutData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">No workout history found.</td>
                </tr>
              ) : (
                workoutData.map((workout, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workout.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{workout.exercise}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workout.sets}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workout.reps}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workout.weight} lbs</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;