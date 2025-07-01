import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { FaUser, FaDumbbell, FaFire, FaChartLine, FaEdit } from 'react-icons/fa';
import useUserData from '../hooks/useUserData';

const formatActivityDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ProfilePage = () => {
  const { userData } = useUserData();
  const [stats, setStats] = useState({
    workoutsCompleted: 0,
    totalCalories: 0,
    currentStreak: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    fitness_goal: '',
    experience_level: ''
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [activityLoading, setActivityLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userData?.id) return;
      setStatsLoading(true);
      try {
        const response = await api.get('/user/stats/');
        setStats(response.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, [userData]);

  useEffect(() => {
    const fetchUserActivity = async () => {
      if (!userData?.id) return;
      
      setActivityLoading(true);
      try {
        const [workoutsRes, activitiesRes] = await Promise.all([
          api.get('/workouts/logs/'),
          api.get('/social/activity/')
        ]);

        const userWorkouts = workoutsRes.data
          .filter(log => log.user === userData.id)
          .map(log => ({
            ...log,
            type: 'workout',
            action: `Completed ${log.exercise} (${log.sets}x${log.reps})`,
            time: log.date
          }));

        const userActivities = activitiesRes.data
          .filter(activity => activity.user === userData.id);

        const combined = [...userWorkouts, ...userActivities]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 5);

        setRecentActivity(combined);
      } catch (err) {
        console.error('Error fetching activity:', err);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchUserActivity();
  }, [userData]);

  const handleUpdateProfile = async () => {
    setUpdateLoading(true);
    try {
      await api.patch('/user/update/', formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
    setUpdateLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* Profile Sidebar */}
          <div className="bg-gray-800 rounded-xl shadow-lg p-6 w-full md:w-1/3">
            <div className="text-center mb-6">
              <div className="bg-blue-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUser className="text-4xl text-blue-400" />
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="bg-gray-700 text-white text-xl font-bold text-center rounded-lg px-3 py-2 mb-2 w-full"
                />
              ) : (
                <h2 className="text-2xl font-bold text-white">{userData?.username}</h2>
              )}
              <p className="text-gray-400">{userData?.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 mb-1">Fitness Goal</label>
                {isEditing ? (
                  <select
                    value={formData.fitness_goal}
                    onChange={(e) => setFormData({...formData, fitness_goal: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="build_muscle">Build Muscle</option>
                    <option value="lose_fat">Lose Fat</option>
                    <option value="increase_strength">Increase Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                ) : (
                  <p className="text-white capitalize">
                    {userData?.fitness_goal?.replace('_', ' ') || 'Not set'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-gray-400 mb-1">Experience Level</label>
                {isEditing ? (
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData({...formData, experience_level: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                ) : (
                  <p className="text-white capitalize">
                    {userData?.experience_level || 'Not set'}
                  </p>
                )}
              </div>
              
              <div className="pt-4">
                {isEditing ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                      disabled={updateLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                      disabled={updateLoading}
                    >
                      {updateLoading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-6">Fitness Stats</h2>
              {statsLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
                    <div className="bg-blue-900/20 p-3 rounded-lg mr-4">
                      <FaDumbbell className="text-blue-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-400">Workouts</p>
                      <p className="text-2xl font-bold text-white">{stats.workoutsCompleted}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
                    <div className="bg-orange-900/20 p-3 rounded-lg mr-4">
                      <FaFire className="text-orange-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-400">Calories Burned</p>
                      <p className="text-2xl font-bold text-white">{stats.totalCalories}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 p-4 rounded-lg flex items-center">
                    <div className="bg-green-900/20 p-3 rounded-lg mr-4">
                      <FaChartLine className="text-green-400 text-xl" />
                    </div>
                    <div>
                      <p className="text-gray-400">Current Streak</p>
                      <p className="text-2xl font-bold text-white">{stats.currentStreak} days</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Recent Activity</h2>
              {activityLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : recentActivity.length === 0 ? (
                <div className="text-gray-400">Complete a workout to see activity here!</div>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="p-3 bg-gray-700/50 rounded-lg">
                      <div className="flex items-start">
                        <div className="bg-blue-900/20 p-2 rounded-lg mr-3 flex-shrink-0">
                          <FaDumbbell className="text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white">{activity.action}</p>
                          <p className="text-gray-400 text-sm mt-1">
                            {formatActivityDate(activity.time)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;