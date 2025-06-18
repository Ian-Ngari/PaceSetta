import React, { useState } from 'react';
import api from '../../utils/api';

const WorkoutForm = ({ onLogged, defaultExercise = '' }) => {
  const [form, setForm] = useState({
    exercise: defaultExercise,
    sets: '',
    reps: '',
    weight: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/workouts/logs/', {
        exercise: form.exercise,
        sets: Number(form.sets),
        reps: Number(form.reps),
        weight: Number(form.weight)
      });
      setForm({ exercise: defaultExercise, sets: '', reps: '', weight: '' });
      if (onLogged) onLogged();
    } catch (error) {
      alert('Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <h2 className="text-xl font-semibold mb-4">Log Workout</h2>
      <div className="mb-4">
        <input
          type="text"
          name="exercise"
          placeholder="Exercise"
          value={form.exercise}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full"
          required
        />
      </div>
      <div className="mb-4 flex gap-4">
        <input
          type="number"
          name="sets"
          placeholder="Sets"
          value={form.sets}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-1/3"
          required
        />
        <input
          type="number"
          name="reps"
          placeholder="Reps"
          value={form.reps}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-1/3"
          required
        />
        <input
          type="number"
          name="weight"
          placeholder="Weight (lbs)"
          value={form.weight}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-1/3"
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Logging...' : 'Log Workout'}
      </button>
    </form>
  );
};

export default WorkoutForm;