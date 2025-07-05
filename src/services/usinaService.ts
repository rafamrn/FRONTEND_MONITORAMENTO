export async function getUsinas() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/solarcloud/usinas`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar usinas");
  }

  return await res.json();
}

// Exemplo de função auxiliar já mencionada no Dashboard:
export async function fetchWithToken(url: string) {
  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Erro na requisição: ${url}`);
  }

  return await res.json();
}
