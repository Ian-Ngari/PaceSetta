import React, { useState, useEffect } from 'react';
import WorkoutForm from '../components/Workout/WorkoutForm';
import api from '../utils/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/calendar-tailwind.css'; 

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
        setWorkoutData(response.data);

        // Calendar: unique dates
        const uniqueDates = [...new Set(response.data.map(log => log.date))];
        setCalendarDates(uniqueDates);

        // Chart: group by month (or date)
        const grouped = {};
        response.data.forEach(log => {
          // Use log.date for daily, or log.date.slice(0, 7) for monthly
          const key = log.date;
          if (!grouped[key]) grouped[key] = { weight: 0, count: 0 };
          grouped[key].weight += log.weight || 0;
          grouped[key].count += 1;
        });
        const chartData = Object.entries(grouped).map(([date, obj]) => ({
          date,
          weight: obj.weight,
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

  // Calendar highlight
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
    <div className="max-w-3xl mx-auto py-8">
      <WorkoutForm onLogged={() => setRefresh(r => !r)} />

      {/* Progress Chart */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-6">Strength Progress (Total Weight per Day)</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="weight" fill="#2563eb" name="Total Weight (lbs)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workout Calendar */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Workout Calendar</h2>
        <Calendar tileClassName={tileClassName} />
      </div>

      {/* Workout History Table */}
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
    </div>
  );
};

export default ProgressPage;