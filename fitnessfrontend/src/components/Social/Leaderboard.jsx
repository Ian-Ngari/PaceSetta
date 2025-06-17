import React from 'react';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const leaderboardData = [
    { id: 1, username: 'FitnessPro', workouts: 28, avatar: '🏆' },
    { id: 2, username: 'GymLover', workouts: 24, avatar: '💪' },
    { id: 3, username: 'HealthyLife', workouts: 21, avatar: '🥗' },
    { id: 4, username: 'IronMan', workouts: 18, avatar: '🏋️' },
    { id: 5, username: 'Newbie', workouts: 12, avatar: '👶' }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Top Performers</h2>
      <ul className="space-y-3">
        {leaderboardData.map((user, index) => (
          <motion.li
            key={user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center p-3 rounded-md ${index < 3 ? 'bg-blue-50' : 'bg-gray-50'}`}
          >
            <span className="text-2xl mr-3">{user.avatar}</span>
            <div className="flex-1">
              <p className="font-medium">{user.username}</p>
              <p className="text-sm text-gray-600">{user.workouts} workouts</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
              index === 0 ? 'bg-yellow-200 text-yellow-800' : 
              index === 1 ? 'bg-gray-200 text-gray-800' : 
              index === 2 ? 'bg-amber-200 text-amber-800' : 'bg-gray-100'
            }`}>
              #{index + 1}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;