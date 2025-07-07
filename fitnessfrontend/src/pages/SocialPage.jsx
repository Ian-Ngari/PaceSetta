import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaUsers, FaTrophy, FaFire, FaDumbbell } from 'react-icons/fa';

const formatActivityDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    return `${Math.floor(diffInHours / 24)}d ago`;
  }
};

const SocialPage = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both leaderboard and activity in parallel
        const [leaderboardRes, activityRes] = await Promise.all([
          api.get('/social/leaderboard/'),
          api.get('/social/activity/')
        ]);

        setLeaderboardData(leaderboardRes.data.sort((a, b) => b.workoutsCompleted - a.workoutsCompleted));
        setRecentActivity(activityRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLeaderboardData([]);
        setRecentActivity([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="min-h-screen bg-black pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-4 mb-8"
        >
          <FaUsers className="text-3xl text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Social Community</h1>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2"
          >
            <div className="bg-gray-950 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FaFire className="text-2xl text-orange-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">Recent Community Activity</h2>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-gray-400">No recent activity yet.</div>
                ) : (
                  recentActivity.map((activity, i) => (
                    <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-orange-900/20 p-2 rounded-lg mr-3 flex-shrink-0">
                          <FaDumbbell className="text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-white">{activity.username}</p>
                            <span className="text-sm text-gray-400">
                              {formatActivityDate(activity.time)}
                            </span>
                          </div>
                          <p className="text-gray-300 mt-1">{activity.action}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 space-y-6"
          >
            <div className="bg-gray-950 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FaTrophy className="text-2xl text-yellow-400 mr-3" />
                <h2 className="text-xl font-semibold text-white">Top Performers</h2>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ul className="space-y-3">
                  {leaderboardData.map((user, index) => (
                    <motion.li
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center p-3 rounded-md ${index < 3 ? 'bg-blue-900/20' : 'bg-gray-700/50'}`}
                    >
                      <span className="text-2xl mr-3">🏆</span>
                      <div className="flex-1">
                        <p className="font-medium text-white">{user.username}</p>
                        <p className="text-sm text-gray-300">{user.workoutsCompleted} workouts</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' : 
                        index === 1 ? 'bg-gray-300 text-gray-900' : 
                        index === 2 ? 'bg-amber-600 text-amber-900' : 'bg-gray-600 text-white'
                      }`}>
                        #{index + 1}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SocialPage;