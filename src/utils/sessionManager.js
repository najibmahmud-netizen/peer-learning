// src/utils/sessionManager.js

// We maintain an in-memory variable instead of using localStorage, sessionStorage, or cookies.
let _memorySession = null;

export const createSession = (user, token = null) => {
  _memorySession = {
    user,
    token,
    createdAt: new Date().toISOString(),
    expiresAt: token ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
  };
  return _memorySession;
};

export const getSession = () => {
  return _memorySession;
};

export const getSessionToken = () => {
  return _memorySession?.token || null;
};

export const isSessionValid = () => {
  if (!_memorySession) return false;

  if (_memorySession.expiresAt) {
    const expiryDate = new Date(_memorySession.expiresAt);
    return expiryDate > new Date();
  }

  return true;
};

export const clearSession = () => {
  _memorySession = null;
};

export const refreshSession = (user, token = null) => {
  clearSession();
  return createSession(user, token);
};

export const getSessionUser = () => {
  return _memorySession?.user || null;
};

export const getAuthHeaders = (additionalHeaders = {}) => {
  const token = getSessionToken();
  const headers = {
    'Content-Type': 'application/json',
    ...additionalHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const authenticatedFetch = async (url, options = {}) => {
  const headers = getAuthHeaders(options.headers);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

let _memoryBookings = [];

export const createBooking = (bookingData) => {
  const newBooking = {
    id: String(Date.now()),
    bookedAt: new Date().toISOString(),
    ...bookingData
  };
  _memoryBookings.unshift(newBooking);
  return newBooking;
};


export const getBookings = () => {
  return _memoryBookings; 
};