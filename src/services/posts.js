const API_URL = import.meta.env.VITE_API_URL || "";

// Posts Mockados
const MOCK_INITIAL_POSTS = [
  {
    id: "1",
    titulo: "Introdução ao React 19 e Modern Web Development",
    conteudo:
      "O React evoluiu significativamente nos últimos anos. Com a chegada de hooks modernos, Server Components e otimizações de performance pelo React Compiler, a criação de interfaces ricas e responsivas tornou-se mais intuitiva e eficiente do que nunca. Neste artigo, exploramos os principais conceitos para aplicar na sua aplicação.",
    autor: "Prof. Dr. Eduardo Silva",
    data: "2026-03-10T14:30:00.000Z",
    comentarios: [
      {
        id: "c1",
        autor: "Ana Clara (Estudante)",
        texto: "Excelente artigo! Muito esclarecedor sobre as novidades do React.",
        data: "2026-03-11T09:15:00.000Z",
      },
      {
        id: "c2",
        autor: "Carlos Mendes",
        texto: "Gostei muito da explicação sobre a estrutura de hooks.",
        data: "2026-03-12T10:45:00.000Z",
      },
    ],
  },
  {
    id: "2",
    titulo: "Arquitetura REST APIs com Node.js e OutSystems",
    conteudo:
      "A integração entre plataformas Low-Code como OutSystems e back-ends em Node.js possibilita o desenvolvimento ágil de soluções corporativas escaláveis. Veja como estruturar endpoints REST limpos e padronizados para consumo seguro via aplicações web e mobile.",
    autor: "Profa. Dra. Mariana Costa",
    data: "2026-03-08T10:15:00.000Z",
    comentarios: [
      {
        id: "c3",
        autor: "Lucas Rocha",
        texto: "A integração com OutSystems facilitou muito nossos projetos aqui na empresa.",
        data: "2026-03-09T16:20:00.000Z",
      },
    ],
  },
  {
    id: "3",
    titulo: "Boas Práticas de Acessibilidade (WCAG) na Web",
    conteudo:
      "Garantir acessibilidade digital é dever de todo desenvolvedor. Desde o uso correto de HTML5 semântico até atributos ARIA e contraste de cores, este guia prático mostra como tornar seu blog verdadeiramente inclusivo para todos os usuários.",
    autor: "Prof. Roberto Almeida",
    data: "2026-03-01T16:45:00.000Z",
    comentarios: [],
  },
  {
    id: "4",
    titulo: "Gerenciamento de Estado com Context API e Redux",
    conteudo:
      "A escolha da ferramenta de gerenciamento de estado correta pode transformar a manutenibilidade da sua aplicação. Comparamos a simplicidade da Context API nativa do React com a robustez do Redux Toolkit em projetos de médio e grande porte.",
    autor: "Prof. Dr. Eduardo Silva",
    data: "2026-02-25T11:00:00.000Z",
    comentarios: [],
  },
];

function getLocalPosts() {
  const stored = localStorage.getItem("tech_challenge_posts");
  if (!stored) {
    localStorage.setItem("tech_challenge_posts", JSON.stringify(MOCK_INITIAL_POSTS));
    return MOCK_INITIAL_POSTS;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return MOCK_INITIAL_POSTS;
  }
}

function saveLocalPosts(posts) {
  localStorage.setItem("tech_challenge_posts", JSON.stringify(posts));
}

function normalizePost(raw) {
  if (!raw) return null;
  return {
    id: String(raw.id ?? raw._id ?? crypto.randomUUID()),
    titulo: raw.titulo ?? raw.title ?? "",
    conteudo: raw.conteudo ?? raw.content ?? raw.body ?? "",
    autor:
      typeof raw.autor === "object"
        ? raw.autor?.nome ?? raw.autor?.name ?? "Professor"
        : raw.autor ?? raw.author ?? raw.user?.name ?? "Professor",
    data: raw.data ?? raw.date ?? raw.createdAt ?? new Date().toISOString(),
    comentarios: Array.isArray(raw.comentarios)
      ? raw.comentarios
      : Array.isArray(raw.comments)
      ? raw.comments
      : [],
  };
}

export async function fetchPosts({ search = "", signal } = {}) {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal,
      });

      if (response.ok) {
        const data = await response.json();
        const list = Array.isArray(data) ? data : data.items ?? data.posts ?? [];
        let posts = list.map(normalizePost);
        if (search.trim()) {
          const q = search.toLowerCase();
          posts = posts.filter(
            (p) =>
              p.titulo.toLowerCase().includes(q) ||
              p.autor.toLowerCase().includes(q) ||
              p.conteudo.toLowerCase().includes(q)
          );
        }
        return posts;
      }
    } catch (err) {
      console.warn("Backend REST indisponível. Utilizando armazenamento local fallback:", err);
    }
  }

  let localPosts = getLocalPosts().map(normalizePost);
  if (search.trim()) {
    const q = search.toLowerCase();
    localPosts = localPosts.filter(
      (p) =>
        p.titulo.toLowerCase().includes(q) ||
        p.autor.toLowerCase().includes(q) ||
        p.conteudo.toLowerCase().includes(q)
    );
  }
  return localPosts;
}

export async function fetchPostById(id) {
  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        const data = await response.json();
        return normalizePost(data);
      }
    } catch (err) {
      console.warn("Erro ao buscar via API REST. Buscando no armazenamento local:", err);
    }
  }

  const localPosts = getLocalPosts();
  const found = localPosts.find((p) => String(p.id) === String(id));
  if (!found) {
    throw new Error("Post não encontrado.");
  }
  return normalizePost(found);
}
export async function createPost(postData) {
  const token = localStorage.getItem(
    "tech_challenge_token"
  );

  if (!token) {
    throw new Error(
      "Usuário não autenticado."
    );
  }

  const response = await fetch(
    `${API_URL}/posts`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        title: postData.titulo,
        content: postData.conteudo,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        `Erro HTTP ${response.status}`
    );
  }

  return normalizePost(data);
}

export async function updatePost(id, postData) {
  const token = localStorage.getItem("tech_challenge_token");

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const updatedPayload = {
    title: postData.title ?? postData.titulo,
    content: postData.content ?? postData.conteudo,
  };

  const response = await fetch(
    `${API_URL}/posts/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedPayload),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        `Erro HTTP ${response.status}`
    );
  }

  return normalizePost(data);
}

export async function deletePost(id) {
  const token = localStorage.getItem("tech_challenge_token");

  if (!token) {
    throw new Error("Usuário não autenticado.");
  }

  const response = await fetch(
    `${API_URL}/posts/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        `Erro HTTP ${response.status}`
    );
  }

  return true;
}

export async function addComment(postId, commentData) {
  const newComment = {
    id: `c_${Date.now()}`,
    autor: commentData.autor || "Estudante",
    texto: commentData.texto,
    data: new Date().toISOString(),
  };

  if (API_URL) {
    try {
      const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newComment),
      });
      if (response.ok) {
        return newComment;
      }
    } catch (err) {
      console.warn("Falha ao adicionar comentário via API. Salvando localmente:", err);
    }
  }

  const localPosts = getLocalPosts();
  const index = localPosts.findIndex((p) => String(p.id) === String(postId));
  if (index !== -1) {
    if (!Array.isArray(localPosts[index].comentarios)) {
      localPosts[index].comentarios = [];
    }
    localPosts[index].comentarios.push(newComment);
    saveLocalPosts(localPosts);
  }
  return newComment;
}