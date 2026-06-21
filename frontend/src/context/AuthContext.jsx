import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getProfile } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('sn_token'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('sn_token');
    localStorage.removeItem('sn_user');
    setToken(null);
    setUser(null);
  };

  const hydrateFromStorage = () => {
    const storedUser = localStorage.getItem('sn_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (_error) {
        localStorage.removeItem('sn_user');
      }
    }
  };

  useEffect(() => {
    const initialize = async () => {
      hydrateFromStorage();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile();
        setUser(response.user);
        localStorage.setItem('sn_user', JSON.stringify(response.user));
      } catch (_error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (nextToken, nextUser) => {
    localStorage.setItem('sn_token', nextToken);
    localStorage.setItem('sn_user', JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  };

  const contextValue = useMemo(
    () => ({
      token,
      user,
      loading,
      isAuthenticated: Boolean(user && token),
      isAdmin: user?.role === 'admin',
      login,
      logout,
      refreshProfile: async () => {
        const response = await getProfile();
        setUser(response.user);
        localStorage.setItem('sn_user', JSON.stringify(response.user));
      },
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider.');
  return context;
}