import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar-tailwind.css';
import { FaCalendarAlt, FaChartBar, FaHistory } from 'react-icons/fa';
import { motion } from 'framer-motion';


const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
const ProgressPage = () => {
  const [refresh, setRefresh] = useState(false);
  const [workoutData, setWorkoutData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [calendarDates, setCalendarDates] = useState([]);
  const [progressData, setProgressData] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await api.get('/workouts/logs/');
        // Format dates for display
        const formattedWorkoutData = response.data.map(log => ({
          ...log,
          displayDate: formatDate(log.date)
        }));
        setWorkoutData(formattedWorkoutData);

        // For calendar - use original date strings
        const uniqueDates = [...new Set(response.data.map(log => log.date.split('T')[0]))];
        setCalendarDates(uniqueDates);

        // Group by date and sum calories
        const grouped = {};
        response.data.forEach(log => {
          const key = log.date.split('T')[0];
          if (!grouped[key]) grouped[key] = { calories: 0, count: 0 };
          grouped[key].calories += Number(log.calories) || 0;
          grouped[key].count += 1;
        });
        
        // Format chart data with readable dates
        const chartData = Object.entries(grouped).map(([date, obj]) => ({
          date: formatDate(date),
          rawDate: date,
          calories: obj.calories,
        }));
        setProgressData(chartData);
      } catch (error) {
        setWorkoutData([]);
        setCalendarDates([]);
        setProgressData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [refresh]);

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dateString = date.toISOString().split('T')[0];
      if (calendarDates.includes(dateString)) {
        return 'bg-blue-200 rounded-full';
      }
    }
    return null;
  };


  return (
    <div className="min-h-screen bg-black pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <FaChartBar className="text-3xl text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Progress Tracking</h1>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Progress Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-950 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FaChartBar className="text-xl text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Calories Burned Over Time</h2>
            </div>
         <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
                  <XAxis dataKey="date" stroke="#E5E7EB" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#E5E7EB" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      borderColor: '#374151', 
                      borderRadius: '0.5rem' 
                    }}
                    formatter={(value) => [value, 'Calories']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Legend />
                  <Bar dataKey="calories" fill="#3B82F6" name="Calories Burned" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Workout Calendar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-950 p-6 rounded-xl shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-6">
              <FaCalendarAlt className="text-xl text-blue-500" />
              <h2 className="text-xl font-semibold text-white">Workout Calendar</h2>
            </div>
            <Calendar 
              tileClassName={tileClassName}
              className="border-0 bg-gray-700 text-white rounded-lg p-2"
              
              view="month"
            />
          </motion.div>
        </div>

        {/* Workout History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-950 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center space-x-3 mb-6">
            <FaHistory className="text-xl text-blue-500" />
            <h2 className="text-xl font-semibold text-white">Workout History</h2>
          </div>
          
           {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Exercise</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sets</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Reps</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Calories Lost</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-950 divide-y divide-gray-700">
                  {workoutData.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 whitespace-nowrap text-center text-gray-400">
                        No workout history found.
                      </td>
                    </tr>
                  ) : (
                    workoutData.map((workout, index) => (
                      <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {workout.displayDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {workout.exercise}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {workout.sets}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {workout.reps}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {workout.calories || 0}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProgressPage;