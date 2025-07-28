import axios from "axios";

export const API_BASE_URL = "https://petsocial.onrender.com";

// Export a pre-configured axios instance (recommended!)
export const api = axios.create({
  baseURL: API_BASE_URL,
});
