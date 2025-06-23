import React from 'react';
import { Link } from 'react-router-dom';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
// or import LandingPage1B from './pages/LandingPage1B';
import Register from './components/Auth/register';
import Login from './components/Auth/login';
import PrivateRoute from './components/Auth/PrivateRoute';
import Navbar from './components/Layout/Navbar';
import Dashboard from './pages/Dashboard';
import WorkoutPage from './pages/WorkoutPage';
import ExercisesPage from './pages/ExercisesPage';
import ProgressPage from './pages/ProgressPage';
import SocialPage from './pages/SocialPage';
import ToolsPage from './pages/ToolsPage';
import NutritionPage from './pages/NutritionPage';

function App() {
  const location = useLocation();
  
  const showNavbar = !['/', '/login', '/register'].includes(location.pathname);

  return (
    <div className="app">
      {showNavbar && <Navbar />}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route path="/" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LandingPage /> {/* or LandingPage1B */}
            </motion.div>
          } />
          
          <Route path="/register" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Register />
            </motion.div>
          } />
          
          <Route path="/login" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          } />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Dashboard />
              </motion.div>
            } />
            
            <Route path="/workouts" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <WorkoutPage />
              </motion.div>
            } />
            
            <Route path="/exercises" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ExercisesPage />
              </motion.div>
            } />
            
            <Route path="/progress" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProgressPage />
              </motion.div>
            } />
            
            <Route path="/social" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SocialPage />
              </motion.div>
            } />
            
            <Route path="/tools" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ToolsPage />
              </motion.div>
            } />

            <Route path="/nutrition" element={
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <NutritionPage />
              </motion.div>
            } />
          </Route>
          
          {/* 404 Fallback */}
          <Route path="*" element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center h-screen bg-[#CAF0F8]"
            >
              <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-xl text-gray-600">Page not found</p>
                <Link 
                  to="/" 
                  className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Return Home
                </Link>
              </div>
            </motion.div>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;