import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('hackmate_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [pendingEmail, setPendingEmail] = useState(() => {
    return localStorage.getItem('hackmate_pending_email') || '';
  });

  const [pendingPassword, setPendingPassword] = useState(() => {
    return localStorage.getItem('hackmate_pending_password') || '';
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('hackmate_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('hackmate_user');
    }
  }, [user]);

  useEffect(() => {
    if (pendingEmail) {
      localStorage.setItem('hackmate_pending_email', pendingEmail);
    } else {
      localStorage.removeItem('hackmate_pending_email');
    }
  }, [pendingEmail]);

  useEffect(() => {
    if (pendingPassword) {
      localStorage.setItem('hackmate_pending_password', pendingPassword);
    } else {
      localStorage.removeItem('hackmate_pending_password');
    }
  }, [pendingPassword]);

  const loginWithCredentials = async (email, password) => {
    setLoading(true);
    try {
      const result = await api.login(email, password);
      if (result.isNewUser) {
        setPendingEmail(result.email);
        setPendingPassword(result.password || password);
        setUser(null);
        return { isNewUser: true, email: result.email };
      } else {
        setUser(result.user);
        setPendingEmail('');
        setPendingPassword('');
        return { isNewUser: false, user: result.user };
      }
    } finally {
      setLoading(false);
    }
  };

  const completeOnboarding = async (formData) => {
    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        email: formData.email || pendingEmail,
        password: formData.password || pendingPassword || 'password123',
      };
      const result = await api.onboard(dataToSave);
      setUser(result.user);
      setPendingEmail('');
      setPendingPassword('');
      return result.user;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const logout = () => {
    setUser(null);
    setPendingEmail('');
    setPendingPassword('');
    localStorage.removeItem('hackmate_user');
    localStorage.removeItem('hackmate_pending_email');
    localStorage.removeItem('hackmate_pending_password');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingEmail,
        pendingPassword,
        setPendingEmail,
        setPendingPassword,
        loading,
        loginWithCredentials,
        completeOnboarding,
        updateUserProfile,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
