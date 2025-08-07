// src/api.js
import axios from "axios";

// Use one, comment the other
export const API_BASE_URL = "https://petsocial.onrender.com/";
//export const API_BASE_URL = "https://localhost:7076/";

export const api = axios.create({
  baseURL: `${API_BASE_URL}`,
  withCredentials: true,
});

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
