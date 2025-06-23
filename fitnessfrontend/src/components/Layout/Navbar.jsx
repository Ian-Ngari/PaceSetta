import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaDumbbell, FaHome, FaChartLine, FaUsers, FaTools, FaSignOutAlt } from 'react-icons/fa';
// import logo from '../../assets/logo.png'; // Add your logo image

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('access_token');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  const navLinks = [
    { path: "/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/workouts", name: "Workouts", icon: <FaDumbbell /> },
    { path: "/progress", name: "Progress", icon: <FaChartLine /> },
    { path: "/social", name: "Social", icon: <FaUsers /> },
    { path: "/tools", name: "Tools", icon: <FaTools /> }
  ];

  return (
    <nav className="fixed top-0 w-full bg-blue shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center" >
          {/* <Link to="/" className="flex-shrink-0 flex items-center">
            <img src={logo} alt="FitGenius" className="h-8 w-auto" />
          </Link> */}
          
          {isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.path}
                  to={link.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path 
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <FaSignOutAlt className="mr-2" />
                Logout
              </motion.button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
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