import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6 bg-white p-8 rounded shadow" onSubmit={onSubmit}>
          {error && showModal && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              {error}
            </div>
          )}
          {showModal && !error && (
            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded text-center">
              Registration successful!
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={onChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={onChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={onChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password2" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                id="password2"
                name="password2"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.password2}
                onChange={onChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="fitness_goal" className="block text-sm font-medium text-gray-700">Fitness Goal</label>
              <select
                id="fitness_goal"
                name="fitness_goal"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                value={formData.fitness_goal}
                onChange={onChange}
              >
                <option value="">Select your fitness goal</option>
                <option value="build_muscle">Build Muscle</option>
                <option value="lose_fat">Lose Fat</option>
                <option value="increase_strength">Increase Strength</option>
                <option value="general_fitness">General Fitness</option>
              </select>
            </div>
            <div className="mb-6">
              <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">Experience Level</label>
              <select
                id="experience_level"
                name="experience_level"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                value={formData.experience_level}
                onChange={onChange}
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Register
          </button>
          <div className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-700 hover:underline">Login</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;