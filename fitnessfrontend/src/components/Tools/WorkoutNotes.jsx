import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaStickyNote, FaTrash, FaSave } from 'react-icons/fa';

const LOCAL_KEY = 'workout_notes';

const WorkoutNotes = () => {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) setSavedNotes(JSON.parse(stored));
  }, []);

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
        ...prev,
      ]);
      setNote('');
      setIsSaving(false);
    }, 300);
  };

  const handleDelete = (id) => {
    setSavedNotes(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="bg-gray-950 rounded-xl shadow-lg overflow-hidden h-full">
      <div className="bg-purple-900/30 p-4 flex items-center">
        <FaStickyNote className="text-xl text-purple-400 mr-3" />
        <h2 className="text-xl font-semibold text-white">Workout Notes</h2>
      </div>
      <div className="p-6">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How did your workout feel today? Any notes on form or progress?"
          className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 mb-4 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          disabled={isSaving || !note.trim()}
          className={`flex items-center justify-center px-4 py-2 rounded-lg text-white w-full ${
            isSaving ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          <FaSave className="mr-2" />
          {isSaving ? 'Saving...' : 'Save Note'}
        </motion.button>
        
        {savedNotes.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium text-white mb-4">Previous Notes</h3>
            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
              {savedNotes.map(savedNote => (
                <motion.li
                  key={savedNote.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-gray-700/50 rounded-lg border border-gray-600 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 mb-1">{savedNote.date}</p>
                    <p className="text-gray-200">{savedNote.text}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(savedNote.id)}
                    className="ml-4 p-1 text-red-400 hover:text-red-300 rounded-full"
                    title="Delete note"
                  >
                    <FaTrash size={14} />
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutNotes;