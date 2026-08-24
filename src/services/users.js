
const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => {
  const token = localStorage.getItem("tech_challenge_token");

  if (!token) {
    throw new Error("Token não informado. Faça login novamente.");
  }

  return token;
};

// ===============================
// CRIAR USUÁRIO
// ===============================
export const createUser = async ({
  nome,
  email,
  senha,
  role,
}) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/users`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      nome,
      email,
      senha,
      role,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Não foi possível criar o usuário."
    );
  }

  return data;
};

// ===============================
// LISTAR USUÁRIOS
// ===============================
export const fetchUsers = async () => {
  const token = getToken();

  const response = await fetch(`${API_URL}/users`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Não foi possível carregar os usuários."
    );
  }

  return data;
};

// ===============================
// BUSCAR USUÁRIO POR ID
// ===============================
export const fetchUserById = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Não foi possível carregar o usuário."
    );
  }

  return data;
};

// ===============================
// ATUALIZAR USUÁRIO
// ===============================
export const updateUser = async (
  id,
  { nome, email, senha, role }
) => {
  const token = getToken();

  const body = {
    nome,
    email,
    role,
  };

  // Só envia senha se ela tiver sido preenchida.
  // Isso permite editar o usuário sem obrigatoriamente
  // trocar a senha.
  if (senha && senha.trim()) {
    body.senha = senha;
  }

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Não foi possível atualizar o usuário."
    );
  }

  return data;
};

// ===============================
// EXCLUIR USUÁRIO
// ===============================
export const deleteUser = async (id) => {
  const token = getToken();

  const response = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
        data?.error ||
        "Não foi possível excluir o usuário."
    );
  }

  return data;
};

