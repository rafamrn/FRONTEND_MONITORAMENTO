import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000", // Altere para a URL do backend em produção
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Mude para true se for usar cookies/autenticação
});

export default api;