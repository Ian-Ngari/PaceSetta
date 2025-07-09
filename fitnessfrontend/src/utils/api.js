import axios from 'axios';

const api = axios.create({
  baseURL: 'https://fitgenius1.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('API request with token:', config.url);
    } else {
      console.log('API request without token:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response) => {
    console.log('API response success:', response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.error('API response error:', {
      url: originalRequest.url,
      status: error.response?.status,
      message: error.message
    });

   
    if (error.response?.status === 401 && !originalRequest._retry) {
      console.log('Attempting token refresh...');
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const response = await axios.post(
          'https://fitgenius1.onrender.com/token/refresh/',
          { refresh: refreshToken },
          { withCredentials: true }
        );
        localStorage.setItem('access_token', response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed:', err);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);


function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[\s\-_/\\]+/g, ' ') 
    .replace(/[^\w\s]/g, '')     
    .trim();
}

// Fetch and merge ExerciseDB and Wger exercises
export async function fetchMergedExercises() {
  
  let exerciseDbExercises = [];
  try {
    
    const exerciseDbRes = await fetch('https://exercisedb.p.rapidapi.com/exercises', {
      headers: {
        'X-RapidAPI-Key': '155566486cmsh04126592945afe1p1f037fjsn2437c60b7baf',
        'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
      },
    });
    exerciseDbExercises = await exerciseDbRes.json();
  } catch (err) {
    console.error('Failed to fetch ExerciseDB:', err);
    return [];
  }

  // 2. Fetch from Wger (English, 200 per page)
  let wgerExercises = [];
  try {
    const wgerRes = await fetch('https://wger.de/api/v2/exerciseinfo/?language=2&limit=200');
    const wgerData = await wgerRes.json();
    wgerExercises = wgerData.results;
  } catch (err) {
    console.error('Failed to fetch Wger:', err);
    // Continue with ExerciseDB only
  }

  // 3. Build lookups
  const wgerByName = {};
  const wgerByMuscle = {};
  wgerExercises.forEach(w => {
    const normName = normalizeName(w.name);
    wgerByName[normName] = w;
    // Add by muscle group for fallback
    if (w.muscles && w.muscles.length > 0) {
      w.muscles.forEach(muscle => {
        if (!wgerByMuscle[muscle.name_en]) wgerByMuscle[muscle.name_en] = [];
        wgerByMuscle[muscle.name_en].push(w);
      });
    }
  });

  // 4. Merge: Try name, then partial, then muscle group
  return exerciseDbExercises.map(ex => {
    const normName = normalizeName(ex.name);
    let wgerMatch = wgerByName[normName];

    // If no exact match, try partial match
    if (!wgerMatch) {
      wgerMatch = wgerExercises.find(
        w =>
          normalizeName(w.name).includes(normName) ||
          normName.includes(normalizeName(w.name))
      );
    }

    // If still no match, try by target muscle
    if (!wgerMatch && ex.target) {
      const muscleMatches = wgerByMuscle[ex.target];
      if (muscleMatches && muscleMatches.length > 0) {
        wgerMatch = muscleMatches[0];
      }
    }

    return {
      ...ex,
      description: wgerMatch && wgerMatch.description
        ? wgerMatch.description.replace(/(<([^>]+)>)/gi, '')
        : 'No description available.',
      tips: wgerMatch && wgerMatch.comments
        ? wgerMatch.comments.replace(/(<([^>]+)>)/gi, '')
        : '',
    };
  });
}

export default api;