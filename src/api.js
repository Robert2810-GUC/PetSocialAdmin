// src/api.js
import axios from "axios";

// Use one, comment the other
export const API_BASE_URL = "https://petsocial.onrender.com/";
//export const API_BASE_URL = "https://localhost:7076/";

export const api = axios.create({
  baseURL: `${API_BASE_URL}`
});

// Attach stored JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Redirect to login on unauthorized responses
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && !error.config?.url?.includes('login')) {
      const currentPath = window.location.pathname + window.location.search;
      localStorage.removeItem('token');
      localStorage.setItem('redirectAfterLogin', currentPath);
      localStorage.setItem('authMessage', 'You are not logged in');
      window.location.href = currentPath;
    }
    return Promise.reject(error);
  }
);

// Optional: global GET failure redirect (disabled if using homepage check instead)
// let isServerCheckInProgress = false;
// api.interceptors.response.use(
//   response => response,
//   async error => {
//     const isGetRequest = error.config?.method?.toLowerCase() === "get";
//     const isApiDown = error.code === "ERR_NETWORK" || error.response?.status >= 500;
//     if (isGetRequest && isApiDown && !isServerCheckInProgress) {
//       isServerCheckInProgress = true;
//       window.location.href = "/server-down";
//     }
//     return Promise.reject(error);
//   }
// );
