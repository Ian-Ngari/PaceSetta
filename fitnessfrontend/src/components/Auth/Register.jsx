import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    fitness_goal: '',
    experience_level: ''
  });
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(null);
    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      setShowModal(true);
      return;
    }
    try {
      const { data } = await axios.post('http://localhost:8000/register/', formData);
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError('Registration failed. Please check your details and try again.');
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="mx-auto bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <FaUser className="text-2xl text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
            <p className="mt-2 text-gray-600">Fill in your details to get started</p>
          </div>
          
          {showModal && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 rounded-lg px-4 py-3 text-center ${
                error ? 'bg-red-100 border border-red-200 text-red-700' : 
                'bg-green-100 border border-green-200 text-green-700'
              }`}
            >
              {error || 'Registration successful!'}
            </motion.div>
          )}
          
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-500" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={onChange}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={onChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={onChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password2" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-500" />
                  </div>
                  <input
                    id="password2"
                    name="password2"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full pl-10 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm password"
                    value={formData.password2}
                    onChange={onChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-500 hover:text-gray-700" />
                    ) : (
                      <FaEye className="text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="fitness_goal" className="block text-sm font-medium text-gray-700 mb-2">
                  Fitness Goal
                </label>
                <div className="relative">
                  <select
                    id="fitness_goal"
                    name="fitness_goal"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    value={formData.fitness_goal}
                    onChange={onChange}
                  >
                    <option value="">Select goal</option>
                    <option value="build_muscle">Build Muscle</option>
                    <option value="lose_fat">Lose Fat</option>
                    <option value="increase_strength">Increase Strength</option>
                    <option value="general_fitness">General Fitness</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <div className="relative">
                  <select
                    id="experience_level"
                    name="experience_level"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg block w-full p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    value={formData.experience_level}
                    onChange={onChange}
                  >
                    <option value="">Select level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium shadow transition-all"
            >
              Create Account
            </motion.button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;