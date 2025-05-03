import axios from "axios";

const api = axios.create({
  baseURL: "https://backendmonitoramento-production.up.railway.app", // Altere para a URL do backend em produção
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Mude para true se for usar cookies/autenticação
});

export default api;