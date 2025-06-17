import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const RestTimer = () => {
  const [time, setTime] = useState(90);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Rest Timer</h2>
      <div className="text-center mb-6">
        <div className="text-5xl font-bold text-indigo-600">
          {formatTime(time)}
        </div>
      </div>
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsActive(!isActive)}
          className={`px-4 py-2 rounded-md ${isActive ? 'bg-red-500' : 'bg-green-500'} text-white`}
        >
          {isActive ? 'Pause' : 'Start'}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsActive(false);
            setTime(90);
          }}
          className="px-4 py-2 bg-gray-200 rounded-md"
        >
          Reset
        </motion.button>
      </div>
      <div className="mt-6 flex justify-between">
        {[30, 60, 90, 120].map((sec) => (
          <motion.button
            key={sec}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setTime(sec)}
            className="px-3 py-1 bg-gray-100 rounded-md text-sm"
          >
            {sec}s
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default RestTimer;