// API client for communicating with HackMate backend
const API_BASE = '/api';

export const api = {
  // Login with email & password
  login: async (email, password) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Login failed. Please check your credentials.');
    }
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

  // Fetch student profiles with branch, skill, and search filters
  getStudents: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.skill && params.skill !== 'all') query.set('skill', params.skill);
    if (params.college && params.college !== 'all') query.set('college', params.college);
    if (params.branch && params.branch !== 'all') query.set('branch', params.branch);

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

  // Connection Requests
  sendConnectionRequest: async (fromEmail, targetStudentId) => {
    const res = await fetch(`${API_BASE}/connections/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromEmail, targetStudentId }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send connection request');
    }
    return res.json();
  },

  // Chatbox Direct Messages
  getMessages: async (user1, user2) => {
    const res = await fetch(
      `${API_BASE}/messages?user1=${encodeURIComponent(user1)}&user2=${encodeURIComponent(user2)}`
    );
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  sendMessage: async (senderEmail, receiverEmail, text) => {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senderEmail, receiverEmail, text }),
    });
    if (!res.ok) throw new Error('Failed to send message');
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
