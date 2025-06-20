import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import ActivityFeed from '../components/Social/ActivityFeed';

// --- Leaderboard ---
const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/social/leaderboard/');
        setLeaderboardData(res.data);
      } catch {
        setLeaderboardData([]);
      }
    };
    fetchLeaderboard();
  }, []);

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
            <span className="text-2xl mr-3">{user.avatar || '🏋️'}</span>
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

// --- Social Page ---
const SocialPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Social Feed</h1>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ActivityFeed />
          </div>
          <div className="md:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;