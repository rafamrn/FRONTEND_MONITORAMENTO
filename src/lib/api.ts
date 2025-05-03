import axios from "axios";

const api = axios.create({
  baseURL: "https://backendmonitoramento-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token a cada requisição automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
