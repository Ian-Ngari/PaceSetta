import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../../utils/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faDumbbell, 
  faFire, 
  faTrophy, 
  faUserPlus
} from '@fortawesome/free-solid-svg-icons';

const formatDateTime = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/social/activity/');
        setActivities(response.data);
      } catch (err) {
        setError('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const getActivityIcon = (type, action) => {
    if (type) {
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
    }
    if (action && action.includes('completed')) return <FontAwesomeIcon icon={faDumbbell} className="text-blue-500" />;
    return <FontAwesomeIcon icon={faDumbbell} />;
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
                 {getActivityIcon(activity.type, activity.action)}
               </div>
               <div className="flex-1">
                 <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{activity.username}</p>
                   <span className="text-sm text-gray-500">
                     {activity.time ? formatDateTime(activity.time) : ''}
                   </span>
                 </div>
                 <p className="text-gray-700 mt-1">{activity.action}</p>
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