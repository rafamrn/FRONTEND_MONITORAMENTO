export async function getUsinas() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${import.meta.env.VITE_API_URL}/usina`, {
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
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const textoErro = await res.text();
    console.error(`Erro na requisição (${res.status}): ${textoErro}`);
    throw new Error(`Erro na requisição: ${res.status}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return await res.json();
  } else {
    console.warn("⚠️ Conteúdo inesperado na resposta:", await res.text());
    return [];
  }
}
