import { createContext, useContext, useState } from 'react';
import {
  createSession,
  clearSession,
  getSessionUser,
  isSessionValid,
} from '../utils/sessionManager';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  // Grab the data instantly inline on initial engine load instead of waiting for useEffect
  const [user, setUser] = useState(() => {
    const sessionUser = getSessionUser();
    return sessionUser && isSessionValid() ? sessionUser : null;
  });

  const login = (userData, token = null) => {
    createSession(userData, token);
    setUser(userData);
  };

  const logout = () => {
    clearSession();
    setUser(null);
  };

  const updateUser = (updatedData) => {
    const newUser = { ...user, ...updatedData };
    createSession(newUser);
    setUser(newUser);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
        loading: false, // Since memory hydration is instantaneous, loading is immediately false
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};