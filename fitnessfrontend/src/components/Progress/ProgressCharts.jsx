import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProgressCharts = () => {
  const progressData = [
    { date: 'Jan', weight: 180, bodyFat: 22 },
    { date: 'Feb', weight: 178, bodyFat: 21 },
    { date: 'Mar', weight: 175, bodyFat: 20 },
    { date: 'Apr', weight: 173, bodyFat: 19 },
    { date: 'May', weight: 170, bodyFat: 18 }
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
            <Bar yAxisId="left" dataKey="weight" fill="#8884d8" name="Weight (KG)" />
            <Bar yAxisId="right" dataKey="bodyFat" fill="#82ca9d" name="Body Fat (%)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressCharts;