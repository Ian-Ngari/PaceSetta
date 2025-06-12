import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { faHome, faDumbbell, faChartLine, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="text-2xl font-bold text-indigo-600"
              >
                PaceSetta
              </motion.div>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
            <Link 
              to="/" 
              className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium"
            >
              <FontAwesomeIcon icon={faHome} className="mr-2" />
              Home
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium"
                >
                  <FontAwesomeIcon icon={faDumbbell} className="mr-2" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Logout
                </button>
              </>
            )}

            {!isAuthenticated && (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" />
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500 text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;