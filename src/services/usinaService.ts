import api from "@/lib/api";

export const getUsinas = async () => {
  const response = await api.get("/usina");
  return response.data;
};