import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('access_token');

  const handleLogout = async () => {
    try {
      await api.post('/logout/', {
        refresh: localStorage.getItem('refresh_token')
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex-shrink-0 flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold text-indigo-600"
            >
              FitGenius
            </motion.div>
          </Link>
          
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/workouts" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Workouts
              </Link>
              <Link 
                to="/progress" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Progress
              </Link>
              <Link 
                to="/social" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Social
              </Link>
              <motion.button
                onClick={handleLogout}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-gray-700 hover:text-indigo-600 transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;