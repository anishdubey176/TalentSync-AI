import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const stored = localStorage.getItem('ts_is_logged_in');
    return stored === 'true';
  });

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('ts_user_profile');
    if (stored) {
      return JSON.parse(stored);
    }
    return null;
  });

  // Listen for changes in localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ts_is_logged_in') {
        setIsLoggedIn(e.newValue === 'true');
      }
      if (e.key === 'ts_user_profile' && e.newValue) {
        setProfile(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (email, password) => {
    const trimmedEmail = email.trim();
    
    let userProfile = null;
    const stored = localStorage.getItem('ts_user_profile');
    
    if (stored) {
      const parsed = JSON.parse(stored);
      if (trimmedEmail.toLowerCase() === parsed.email.toLowerCase()) {
        if (password !== parsed.password) {
          return { success: false, error: 'Incorrect password.' };
        }
        userProfile = parsed;
      }
    }

    if (!userProfile) {
      const emailParts = trimmedEmail.split('@');
      const namePart = emailParts[0];
      const nameWords = namePart.split(/[\._-]/);
      const parsedName = nameWords
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      userProfile = {
        fullName: parsedName || "Candidate",
        email: trimmedEmail,
        role: "Candidate",
        location: "India",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${namePart}`,
        password: password
      };
    }

    localStorage.setItem('ts_user_profile', JSON.stringify(userProfile));
    localStorage.setItem('ts_is_logged_in', 'true');
    
    setProfile(userProfile);
    setIsLoggedIn(true);
    
    return { success: true };
  };

  const logout = () => {
    localStorage.setItem('ts_is_logged_in', 'false');
    setIsLoggedIn(false);
  };

  const updateProfile = (newProfile) => {
    localStorage.setItem('ts_user_profile', JSON.stringify(newProfile));
    setProfile(newProfile);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, profile, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
