import React from 'react';
import ActivityFeed from '../components/Social/ActivityFeed';
import Leaderboard from '../components/Social/Leaderboard';

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