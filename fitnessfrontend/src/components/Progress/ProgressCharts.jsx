import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressCharts = () => {
  // Example data: replace with your real data source if needed
  const progressData = [
    { date: 'Jan', calories: 1200, bodyFat: 22 },
    { date: 'Feb', calories: 1500, bodyFat: 21 },
    { date: 'Mar', calories: 1700, bodyFat: 20 },
    { date: 'Apr', calories: 1600, bodyFat: 19 },
    { date: 'May', calories: 1800, bodyFat: 18 }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-6">Progress Over Time</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={progressData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="calories" fill="#8884d8" name="Calories Lost" />
            <Bar yAxisId="right" dataKey="bodyFat" fill="#82ca9d" name="Body Fat (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressCharts;