import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDumbbell, 
  faFire, 
  faTrophy, 
  faUserPlus,
  faComment
} from '@fortawesome/free-solid-svg-icons';

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        // In a real app, you would fetch from your API
        // const response = await api.get('/social/activity/');
        
        // Mock data - replace with real API call
        const mockActivities = [
          {
            id: 1,
            user: 'FitnessPro',
            action: 'completed a Chest Workout',
            time: '2 hours ago',
            type: 'workout',
            likes: 12,
            comments: 3
          },
          {
            id: 2,
            user: 'GymLover',
            action: 'achieved a new PR in Deadlift (315 lbs)',
            time: '1 day ago',
            type: 'pr',
            likes: 24,
            comments: 8
          },
          {
            id: 3,
            user: 'HealthyLife',
            action: 'started following you',
            time: '2 days ago',
            type: 'follow',
            likes: 0,
            comments: 0
          },
          {
            id: 4,
            user: 'IronMan',
            action: 'completed a 5-day workout streak',
            time: '3 days ago',
            type: 'streak',
            likes: 18,
            comments: 5
          }
        ];
        
        setActivities(mockActivities);
      } catch (err) {
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type) => {
    switch(type) {
      case 'workout':
        return <FontAwesomeIcon icon={faDumbbell} className="text-blue-500" />;
      case 'pr':
        return <FontAwesomeIcon icon={faTrophy} className="text-yellow-500" />;
      case 'follow':
        return <FontAwesomeIcon icon={faUserPlus} className="text-green-500" />;
      case 'streak':
        return <FontAwesomeIcon icon={faFire} className="text-red-500" />;
      default:
        return <FontAwesomeIcon icon={faDumbbell} />;
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-100 text-red-700 rounded-md">
      {error}
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b pb-4 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                  <p className="text-gray-700 mt-1">{activity.action}</p>
                  
                  <div className="flex items-center mt-3 space-x-4">
                    <button className="flex items-center text-sm text-gray-500 hover:text-blue-500">
                      <FontAwesomeIcon icon={faComment} className="mr-1" />
                      <span>{activity.comments} comments</span>
                    </button>
                    <button className="flex items-center text-sm text-gray-500 hover:text-red-500">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-4 w-4 mr-1" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                        />
                      </svg>
                      <span>{activity.likes} likes</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {activities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No activities found. Start working out to see activity here!
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;