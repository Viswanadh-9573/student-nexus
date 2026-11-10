import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('student_nexus_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [pendingEmail, setPendingEmail] = useState(() => {
    return localStorage.getItem('student_nexus_pending_email') || '';
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('student_nexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('student_nexus_user');
    }
  }, [user]);

  useEffect(() => {
    if (pendingEmail) {
      localStorage.setItem('student_nexus_pending_email', pendingEmail);
    } else {
      localStorage.removeItem('student_nexus_pending_email');
    }
  }, [pendingEmail]);

  const loginWithEmail = async (email) => {
    setLoading(true);
    try {
      const result = await api.login(email);
      if (result.isNewUser) {
        setPendingEmail(result.email);
        setUser(null);
        return { isNewUser: true, email: result.email };
      } else {
        setUser(result.user);
        setPendingEmail('');
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
      };
      const result = await api.onboard(dataToSave);
      setUser(result.user);
      setPendingEmail('');
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
    localStorage.removeItem('student_nexus_user');
    localStorage.removeItem('student_nexus_pending_email');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        pendingEmail,
        setPendingEmail,
        loading,
        loginWithEmail,
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
