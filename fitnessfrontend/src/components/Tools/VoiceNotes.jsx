import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaStop, FaSave, FaTrash, FaPlay } from 'react-icons/fa';

const LOCAL_KEY = 'voice_notes';

const VoiceNotes = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newNotes));
  };

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new window.MediaRecorder(stream);
      audioChunks.current = [];
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunks.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      setError('Microphone access denied or not supported.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const saveNote = () => {
    if (!audioBlob) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      const newNote = {
        id: Date.now(),
        audio: base64,
        created_at: new Date().toISOString(),
      };
      const updatedNotes = [newNote, ...notes];
      saveNotes(updatedNotes);
      setAudioBlob(null);
    };
    reader.readAsDataURL(audioBlob);
  };

  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-950 rounded-xl shadow-lg overflow-hidden h-full">
      <div className="bg-green-900/30 p-4 flex items-center">
        <FaMicrophone className="text-xl text-green-400 mr-3" />
        <h2 className="text-xl font-semibold text-white">Voice Notes</h2>
      </div>
      <div className="p-6">
        <div className="mb-4 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={recording ? stopRecording : startRecording}
            className={`flex items-center px-4 py-2 rounded-lg ${
              recording ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
            } text-white`}
          >
            {recording ? (
              <>
                <FaStop className="mr-2" /> Stop Recording
              </>
            ) : (
              <>
                <FaMicrophone className="mr-2" /> Start Recording
              </>
            )}
          </motion.button>
          {audioBlob && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveNote}
              className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              <FaSave className="mr-2" /> Save Note
            </motion.button>
          )}
        </div>
        
        {error && <div className="text-red-400 mb-4 text-sm">{error}</div>}
        
        {audioBlob && (
          <div className="mt-4 bg-gray-700/50 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => new Audio(URL.createObjectURL(audioBlob)).play()}
                className="p-2 bg-gray-600 hover:bg-gray-500 rounded-full text-white"
              >
                <FaPlay size={12} />
              </button>
              <span className="text-gray-300 text-sm">Preview recording</span>
            </div>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold text-white mb-4">Saved Notes</h3>
          {notes.length === 0 ? (
            <div className="text-gray-400 text-center py-4">No voice notes yet</div>
          ) : (
            <ul className="space-y-3 max-h-60 overflow-y-auto">
              {notes.map(note => (
                <li key={note.id} className="bg-gray-700/50 p-3 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => new Audio(note.audio).play()}
                      className="p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white"
                    >
                      <FaPlay size={12} />
                    </button>
                    <div>
                      <div className="text-xs text-gray-400">
                        {note.created_at ? formatDateTime(note.created_at) : 'No date'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 text-red-400 hover:text-red-300 rounded-full"
                  >
                    <FaTrash size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceNotes;