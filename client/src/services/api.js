// API client for communicating with StudentNexus backend
const API_BASE = '/api';

export const api = {
  // Login with email
  login: async (email) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  // Profile onboarding
  onboard: async (profileData) => {
    const res = await fetch(`${API_BASE}/auth/onboarding`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Onboarding failed');
    }
    return res.json();
  },

  // Fetch student profiles
  getStudents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.skill && params.skill !== 'all') query.set('skill', params.skill);
    if (params.college && params.college !== 'all') query.set('college', params.college);

    const url = `${API_BASE}/students${query.toString() ? `?${query.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch students');
    return res.json();
  },

  // Like or unlike a student
  toggleLike: async (studentId, userEmail) => {
    const res = await fetch(`${API_BASE}/students/${studentId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail }),
    });
    if (!res.ok) throw new Error('Failed to toggle like');
    return res.json();
  },

  // Fetch hackathons
  getHackathons: async (filter = 'all') => {
    const url = `${API_BASE}/hackathons?filter=${filter}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch hackathons');
    return res.json();
  },

  // Register for hackathon
  registerHackathon: async (hackathonId, studentEmail) => {
    const res = await fetch(`${API_BASE}/hackathons/${hackathonId}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentEmail }),
    });
    if (!res.ok) throw new Error('Failed to register for hackathon');
    return res.json();
  },
};
