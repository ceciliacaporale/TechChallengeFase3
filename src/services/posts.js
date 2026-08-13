const API_URL = import.meta.env.VITE_API_URL || "";

console.log("API_URL:", API_URL);


function normalizePost(raw) {
  return {
    id: raw.id ?? raw._id ?? crypto.randomUUID(),

    titulo: raw.titulo ?? raw.title ?? "",

    conteudo: raw.conteudo ?? raw.content ?? raw.body ?? "",

    autor:
      raw.autor?.nome ??
      raw.autor ??
      raw.author ??
      raw.user?.name ??
      "",

    data:
      raw.data ??
      raw.date ??
      raw.createdAt ??
      "",
  };
}


export async function fetchPosts({ search = "", signal } = {}) {
  console.log("Buscando posts...");
  console.log("URL:", `${API_URL}/posts`);

  const response = await fetch(`${API_URL}/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    signal,
  });

  console.log("Status da API:", response.status);

  if (!response.ok) {
    throw new Error(
      `Erro ao buscar postagens: ${response.status}`
    );
  }

  const data = await response.json();

  console.log("Dados recebidos:", data);

  const list = Array.isArray(data)
    ? data
    : data.items ?? data.posts ?? [];

  const posts = list.map(normalizePost);

  console.log("Posts normalizados:", posts);

  return posts;
}