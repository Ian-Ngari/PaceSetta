import React, { useState } from 'react';

const WorkoutForm = ({ onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState({
    goal: '',
    level: '',
    days: 3,
    preferences: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg mb-6 max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Create Workout Plan</h2>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Goal</label>
        <select
          name="goal"
          value={form.goal}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full"
          required
        >
          <option value="">Select goal</option>
          <option value="build_muscle">Build Muscle</option>
          <option value="lose_fat">Lose Fat</option>
          <option value="increase_strength">Increase Strength</option>
          <option value="general_fitness">General Fitness</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Experience Level</label>
        <select
          name="level"
          value={form.level}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full"
          required
        >
          <option value="">Select level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Days per Week</label>
        <input
          type="number"
          name="days"
          min={2}
          max={5}
          value={form.days}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium">Preferences (optional)</label>
        <input
          type="text"
          name="preferences"
          value={form.preferences}
          onChange={handleChange}
          className="border rounded-md px-3 py-2 w-full"
          placeholder="e.g. dumbbells, bodyweight"
        />
      </div>
      <div className="flex gap-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={isLoading}
        >
          {isLoading ? 'Generating...' : 'Generate Plan'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default WorkoutForm;