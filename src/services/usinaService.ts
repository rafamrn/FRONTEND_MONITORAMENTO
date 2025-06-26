import api from "@/lib/api";

export const getUsinas = async () => {
  const response = await api.get("/usina");
  console.log("Dados brutos da API:", response.data);
  return response.data;
};
