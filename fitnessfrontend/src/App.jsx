import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Register from './components/Auth/register';
import Login from './components/Auth/login';
import Dashboard from './components/Auth/Dashboard/Dashboard';
import PrivateRoute from './components/Auth/PrivateRoute';
import Navbar from './components/Layout/Navbar';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;