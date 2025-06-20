import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LOCAL_KEY = 'workout_notes';

const WorkoutNotes = () => {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) setSavedNotes(JSON.parse(stored));
  }, []);

  // Save notes to localStorage whenever savedNotes changes
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(savedNotes));
  }, [savedNotes]);

  const handleSave = () => {
    if (!note.trim()) return;
    setIsSaving(true);
    setTimeout(() => {
      setSavedNotes(prev => [
        {
          id: Date.now(),
          text: note,
          date: new Date().toLocaleString(),
        },
        ...prev, // <-- Newest note at the top
      ]);
      setNote('');
      setIsSaving(false);
    }, 300); // Simulate save delay
  };

  const handleDelete = (id) => {
    setSavedNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4">Workout Notes</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="How did your workout feel today? Any notes on form or progress?"
        className="w-full border rounded-md p-3 mb-4 h-40"
      />
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSave}
        disabled={isSaving || !note.trim()}
        className={`px-4 py-2 rounded-md text-white ${isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
      >
        {isSaving ? 'Saving...' : 'Save Note'}
      </motion.button>
      {savedNotes.length > 0 && (
        <div className="mt-6">
          <h3 className="font-medium mb-2">Previous Notes</h3>
          <ul className="space-y-3 max-h-60 overflow-y-auto">
            {savedNotes.map(savedNote => (
              <motion.li
                key={savedNote.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-gray-50 rounded-md border flex justify-between items-start"
              >
                <div>
                  <p className="text-sm text-gray-600 mb-1">{savedNote.date}</p>
                  <p>{savedNote.text}</p>
                </div>
                <button
                  onClick={() => handleDelete(savedNote.id)}
                  className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  title="Delete note"
                >
                  Delete
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WorkoutNotes;