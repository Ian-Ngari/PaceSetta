import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaPlay, FaPause, FaRedo } from 'react-icons/fa';

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
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-blue-900/30 p-4 flex items-center">
        <FaClock className="text-xl text-blue-400 mr-3" />
        <h2 className="text-xl font-semibold text-white">Rest Timer</h2>
      </div>
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-indigo-400">
            {formatTime(time)}
          </div>
        </div>
        <div className="flex justify-center space-x-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsActive(!isActive)}
            className={`flex items-center px-4 py-2 rounded-lg ${
              isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            } text-white`}
          >
            {isActive ? (
              <>
                <FaPause className="mr-2" /> Pause
              </>
            ) : (
              <>
                <FaPlay className="mr-2" /> Start
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsActive(false);
              setTime(90);
            }}
            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
          >
            <FaRedo className="mr-2" /> Reset
          </motion.button>
        </div>
        <div className="flex justify-between">
          {[30, 60, 90, 120].map((sec) => (
            <motion.button
              key={sec}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setTime(sec)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${
                time === sec ? 'bg-indigo-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
              }`}
            >
              {sec}s
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RestTimer;