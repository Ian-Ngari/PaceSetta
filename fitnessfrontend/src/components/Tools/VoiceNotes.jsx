import React, { useState, useRef, useEffect } from 'react';

const LOCAL_KEY = 'voice_notes';

const VoiceNotes = () => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunks = useRef([]);

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  // Save notes to localStorage
  const saveNotes = (newNotes) => {
    setNotes(newNotes);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newNotes));
  };

  // Start recording
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

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Save note locally
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

  // Delete note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    saveNotes(updatedNotes);
  };

  // Format date/time
  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg h-full">
      <h2 className="text-xl font-semibold mb-4">Voice Notes</h2>
      <div className="mb-4">
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-md text-white ${recording ? 'bg-red-500' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
        {audioBlob && (
          <button
            onClick={saveNote}
            className="ml-2 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
          >
            Save Note
          </button>
        )}
      </div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {audioBlob && (
        <div className="mt-4">
          <audio controls src={URL.createObjectURL(audioBlob)} />
          <div className="text-xs text-gray-500 mt-1">Preview before saving</div>
        </div>
      )}
      <div className="mt-6">
        <h3 className="font-semibold mb-2">Saved Notes</h3>
        {notes.length === 0 && <div className="text-gray-500">No voice notes yet.</div>}
        <ul className="space-y-3">
          {notes.map(note => (
            <li key={note.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div>
                <audio controls src={note.audio} />
                <div className="text-xs text-gray-500">
                  {note.created_at ? formatDateTime(note.created_at) : ''}
                </div>
              </div>
              <button
                onClick={() => deleteNote(note.id)}
                className="ml-4 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceNotes;