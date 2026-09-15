# Tech Challenge Fase 3 (Front-end): Blog Educacional

Front-End desenvolvido em **React** para uma plataforma educacional de blogging, permitindo que professores da rede pública publiquem e gerenciem conteúdos, enquanto alunos e visitantes podem consultar as postagens e interagir com os conteúdos.

O projeto foi desenvolvido como parte do **Tech Challenge - Fase 3 do Pós-Tech em Full Stack Development da FIAP**, consumindo a API REST desenvolvida na **Fase 2**.

A aplicação contempla autenticação de usuários, controle de acesso por perfil, gerenciamento de postagens, comentários e administração de usuários.

---

# Equipe

* Alana Sato
* Caroline Oliveira
* Donilo Pontes
* Maria Cecilia Caporale
* Levi Kondlatsch

---

## Deploy em Produção

Link: https://techchallenger.duckdns.org/web/

---

# 🚀 Tecnologias Utilizadas

* React 19
* Vite 8
* JavaScript
* React Router DOM 
* CSS 
* JWT (JSON Web Token)
* Docker
* GitHub Actions
* ESLint 10
* API REST — Back-End da Fase 2

---

# 📂 Estrutura do Projeto

```text
TechChallengeFase3/
│
├── .github/
│   └── workflows/
│       └── ci.yaml
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Header/
│   │   ├── PostCard/
│   │   ├── SearchBar/
│   │   ├── ConfirmModal/
│   │   ├── Notification/
│   │   └── ProtectedRoute/
│   │
│   ├── context/
│   │   ├── AuthContext
│   │   └── NotificationContext
│   │
│   ├── pages/
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── Post/
│   │   ├── CreatePost/
│   │   ├── EditPost/
│   │   ├── Admin/
│   │   ├── Users/
│   │   └── EditUser/
│   │
│   ├── services/
│   │   ├── posts.js
│   │   └── users.js
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── .env
├── .gitignore
├── Dockerfile
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
└── README.md
```

---

# 🏗️ Arquitetura

O Front-End utiliza uma arquitetura baseada em **componentes, páginas, contextos e serviços**, separando a apresentação da interface, o controle de navegação e a comunicação com a API.

### Components

Contém componentes reutilizáveis da interface, como:

* Cabeçalho;
* Cartões de postagem;
* Barra de busca;
* Modais de confirmação;
* Notificações;
* Proteção de rotas.

### Pages

Cada página representa uma rota da aplicação:

* Home;
* Login;
* Detalhe da postagem;
* Criação de postagem;
* Edição de postagem;
* Administração de postagens;
* Gerenciamento de usuários;
* Criação de usuários;
* Edição de usuários.

### Context

Responsável pelo estado global da aplicação utilizando a **Context API do React**.

São utilizados contextos para:

* Autenticação;
* Usuário atualmente logado;
* Token JWT;
* Notificações.

### Services

Centraliza a comunicação com a API REST.

```text
src/services/
├── posts.js
└── users.js
```

Os serviços são responsáveis pelas chamadas HTTP relacionadas a:

* Postagens;
* Usuários;
* Autenticação;
* Operações protegidas por JWT.

### Styles e Assets

Contêm os estilos CSS específicos das páginas e componentes, além dos recursos visuais estáticos utilizados pela aplicação.

---

# 🔐 Autenticação

A autenticação utiliza **JWT (JSON Web Token)**, seguindo o mesmo mecanismo implementado na API da Fase 2.

Após o login, o token e os dados do usuário autenticado são armazenados no `localStorage`.

Exemplo:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 4,
    "nome": "Professor FIAP",
    "email": "prof_fiap@example.com",
    "role": "docente"
  }
}
```

O token é enviado no cabeçalho das requisições que exigem autenticação:

```http
Authorization: Bearer <token>
```

O Front-End utiliza proteção de rotas para impedir o acesso a páginas que exigem autenticação ou uma determinada role.

### Perfis de acesso

| Perfil    | Permissões                                   |
| --------- | -------------------------------------------- |
| Visitante | Visualizar postagens e adicionar comentários |
| Aluno     | Visualizar postagens e adicionar comentários |
| Docente   | Criar, editar e excluir postagens            |
| Admin     | Gerenciar postagens e usuários               |

> **Importante:** o controle de acesso no Front-End tem como objetivo melhorar a experiência do usuário. A validação definitiva das permissões é realizada pela API.

---

# 🛠️ Rotas da Aplicação

O Front-End utiliza **React Router DOM** para controlar a navegação.

| Rota              | Tela                       | Acesso          |
| ----------------- | -------------------------- | --------------- |
| `/`               | Redirecionamento para Home | Público         |
| `/login`          | Login                      | Público         |
| `/home`           | Listagem de postagens      | Público         |
| `/post/:id`       | Detalhe da postagem        | Público         |
| `/criar`          | Criação de postagem        | Docente / Admin / Aluno |
| `/editar/:id`     | Edição de postagem         | Docente / Admin |
| `/admin`          | Gerenciamento de postagens | Docente / Admin |
| `/gerencia`       | Gerenciamento de usuários  | Admin           |
| `/users`          | Criação de usuário         | Admin           |
| `/editaruser/:id` | Edição de usuário          | Admin           |
| `*`               | Redirecionamento para Home | —               |

---

# 📖 Funcionalidades

## 🔑 Login

O usuário informa:

* E-mail;
* Senha.

Após autenticação, a aplicação identifica o perfil do usuário e libera as funcionalidades correspondentes.

---

## 📰 Buscar e visualizar postagens

Na página inicial são apresentadas as postagens disponíveis.

É possível realizar buscas por:

* Título;
* Autor;
* Conteúdo/palavra-chave.

Ao selecionar uma postagem, o usuário é direcionado para:

```text
/post/:id
```

onde pode visualizar o conteúdo completo e os comentários.

---

## ✍️ Criar postagem

Usuários com perfil **Docente** ou **Admin** podem acessar:

```text
/criar
```

O formulário contém:

* Título;
* Autor;
* Conteúdo.

Ao publicar, a aplicação realiza uma requisição:

```http
POST /posts
```

com o token JWT.

Exemplo:

```json
{
  "title": "Introdução ao React 19",
  "content": "Conteúdo completo da postagem..."
}
```

---

## ✏️ Editar postagem

Usuários **Docente** ou **Admin** podem editar uma postagem através da rota:

```text
/editar/:id
```

Primeiramente, os dados atuais são carregados:

```http
GET /posts/:id
```

Após a edição, os dados são enviados:

```http
PUT /posts/:id
```

---

## 🗑️ Excluir postagem

A exclusão pode ser realizada a partir de diferentes pontos da aplicação.

Antes da exclusão, a aplicação apresenta um pop-up de confirmação.

Após a confirmação:

```http
DELETE /posts/:id
```

Em caso de sucesso, uma notificação é apresentada ao usuário.

# 👤 Gerenciamento de Usuários

A área de gerenciamento de usuários é restrita ao perfil **Admin**.

Através da rota:

```text
/gerencia
```

é possível:

* Visualizar usuários;
* Criar usuários;
* Editar usuários;
* Excluir usuários.

As operações utilizam os endpoints da API:

```http
GET    /users
POST   /users
PUT    /users/:id
DELETE /users/:id
```

Todas as operações administrativas exigem autenticação via JWT.

---

# 🔌 Integração com a API

O Front-End consome a API REST desenvolvida durante a **Fase 2**.

Principais endpoints utilizados:

| Método | Endpoint     | Utilização            |
| ------ | ------------ | --------------------- |
| POST   | `/login`     | Autenticação          |
| GET    | `/posts`     | Listagem de postagens |
| GET    | `/posts/:id` | Detalhes da postagem  |
| POST   | `/posts`     | Criar postagem        |
| PUT    | `/posts/:id` | Editar postagem       |
| DELETE | `/posts/:id` | Excluir postagem      |
| GET    | `/users`     | Listar usuários       |
| POST   | `/users`     | Criar usuário         |
| PUT    | `/users/:id` | Editar usuário        |
| DELETE | `/users/:id` | Excluir usuário       |

---

# ⚙️ Configuração do Ambiente

## Pré-requisitos

Para executar o projeto localmente, é necessário ter instalado:

* Node.js 20 ou superior;
* npm;
* Docker;
* API do Back-End da Fase 2 em execução.

---

# 🚀 Executando o projeto

## 1. Clone o repositório

```bash
git clone https://github.com/ceciliacaporale/TechChallengeFase3.git

cd TechChallengeFase3
```

---

## 2. Instale as dependências

```bash
npm install
```

---

## 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:3000
```

A variável `VITE_API_URL` deve apontar para a API do Back-End da Fase 2.

---

# 💻 Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação ficará disponível, por padrão, em:

```text
http://localhost:5173
```

# 📦 Build de Produção

Para gerar o build otimizado:

```bash
npm run build
```

Os arquivos serão gerados na pasta:

```text
dist/
```

---

# ▶️ Servir o Build

Para executar o build de produção localmente:

```bash
npm start
```

Esse comando executa:

```bash
vite preview --host 0.0.0.0 --port 3000
```

---

# 🐳 Docker

O projeto possui suporte à execução através de Docker.

## Build da imagem

```bash
docker build -t blog-educacional-frontend .
```

## Executar o container

```bash
docker run -p 3000:3000 blog-educacional-frontend
```

A aplicação ficará disponível em:

```text
http://localhost:3000
```

### Importante sobre VITE_API_URL

As variáveis `VITE_*` são incorporadas pelo Vite durante o processo de build.

Portanto, `VITE_API_URL` precisa estar disponível **durante o `npm run build`**, e não somente quando o container for iniciado.

---

# ☁️ Deploy em Nuvem

O projeto possui pipeline de CI/CD preparado para gerar e publicar a imagem Docker.

Entretanto, para realizar o deploy do Front-End em produção, é necessário garantir que a variável:

```text
VITE_API_URL
```

seja disponibilizada durante o processo de build da imagem.

Uma solução recomendada é configurar o Dockerfile para receber a variável como `build argument`:

```dockerfile
ARG VITE_API_URL

ENV VITE_API_URL=$VITE_API_URL
```

antes da execução:

```dockerfile
RUN npm run build
```

Também é necessário cadastrar a URL da API de produção como Secret no GitHub e utilizá-la no processo de build da imagem.

---

# 🔄 CI/CD

O projeto utiliza **GitHub Actions** para automatizar o processo de Integração Contínua e Entrega Contínua.

O workflow está localizado em:

```text
.github/workflows/ci.yaml
```

O pipeline segue o fluxo:

```text
Clone
  ↓
Build
  ↓
Test
  ↓
Version
  ↓
Dockerização
  ↓
Push Registry
```

### Clone

Realiza o checkout do código-fonte do repositório.

### Build

Instala as dependências utilizando:

```bash
npm ci
```

### Test

Executa:

```bash
npm test --if-present
```

Como não existem testes automatizados configurados atualmente, a etapa é ignorada sem interromper o pipeline.

### Version

Gera automaticamente uma nova versão semântica utilizando a action:

```text
anothrNick/github-tag-action
```

### Dockerização

Realiza o build da imagem Docker utilizando o `Dockerfile` do projeto.

### Push Registry

Publica a imagem no Docker Hub com uma tag semelhante a:

```text
<usuario>/techchallange-2026:front-<versao>
```

---

# 🔐 Secrets do GitHub

O pipeline utiliza os seguintes Secrets:

```text
JWT_SECRET
DOCKERHUB_USERNAME
DOCKERHUB_TOKEN
GITHUB_TOKEN
```

O `GITHUB_TOKEN` é fornecido automaticamente pelo GitHub Actions.

Para um deploy em produção do Front-End, também deverá ser configurado:

```text
VITE_API_URL
```

como Secret/variável utilizada durante o build da imagem.

---

# 🧭 Fluxo de Navegação

```text
                         ┌─────────────┐
                         │     /       │
                         └──────┬──────┘
                                ↓
                         ┌─────────────┐
                         │    /home    │
                         │   Público   │
                         └──────┬──────┘
                                │
             ┌──────────────────┼──────────────────┐
             ↓                  ↓                  ↓
       ┌───────────┐      ┌─────────────┐    ┌───────────┐
       │ /post/:id │      │   /login    │    │   Busca   │
       │  Público  │      │   Público   │    │  Público  │
       └───────────┘      └──────┬──────┘    └───────────┘
                                 │
                    ┌────────────┴────────────┐
                    ↓                         ↓
              ┌───────────┐             ┌───────────┐
              │  Docente  │             │   Admin   │
              └─────┬─────┘             └─────┬─────┘
                    │                         │
             ┌──────┴──────┐          ┌───────┴────────┐
             ↓             ↓          ↓                ↓
          /criar      /editar/:id    /admin         /gerencia
                                                   │
                                             ┌─────┴─────┐
                                             ↓           ↓
                                           /users   /editaruser/:id
```

# Desafios Encontrados

Durante o desenvolvimento foram identificados alguns desafios técnicos:

* Adaptação da equipe à criação e configuração do Dockerfile;
* Integração entre Front-End e Back-End desenvolvidos em paralelo;
* Diferenças de nomenclatura das roles;
* Cria umas nova role, para gestão de acesso;
* Implantar a função de resetar senha por questões de segurança;
* Alterações no formato dos dados retornados pela API;
* Necessidade de normalização dos dados recebidos;
* Implementação de comentários sem endpoint correspondente na API;
* Configuração da variável `VITE_API_URL` durante o build Docker;
* Sincronização entre as diferentes partes desenvolvidas pela equipe;
* Ajustes no Back-End necessários para validar determinados fluxos do Front-End.

Para lidar com as alterações no formato dos dados da API, foi implementada uma camada de normalização das informações das postagens, tornando o Front-End mais tolerante a pequenas mudanças no contrato da API.

---

# Conclusão

A Fase 3 possibilitou a construção do **Front-End completo da plataforma educacional**, integrando a interface desenvolvida em **React** à API REST criada durante a Fase 2.

A aplicação contempla os principais fluxos necessários para a plataforma:

* Consulta pública de postagens;
* Busca de conteúdos;
* Visualização detalhada das postagens;
* Autenticação por token JWT;
* Controle de acesso por perfil;
* Criação de postagens;
* Edição de postagens;
* Exclusão de postagens;
* Comentários;
* Gerenciamento de usuários;
* Conteinerização com Docker;
* Integração contínua com GitHub Actions.

A solução foi estruturada utilizando <strong>React 19, Vite, React Router, Context API e uma camada de serviços para comunicação com a API</strong>, buscando manter a aplicação organizada, reutilizável e preparada para futuras evoluções.

Durante o desenvolvimento, um dos principais desafios foi transformar os requisitos e funcionalidades inicialmente pensados no código em uma interface visual que fosse clara, intuitiva e fácil de utilizar. Além da implementação técnica, foi necessário pensar na experiência do usuário, na organização das informações e no design das telas, buscando garantir que a navegação e as funcionalidades fossem facilmente compreendidas pelos diferentes perfis de usuários da plataforma. Como resultado, foi possível entregar uma aplicação com uma interface intuitiva, com controle de acesso baseado em perfis, recursos administrativos, autenticação e gerenciamento de usuários, além das funcionalidades de publicação e consulta de conteúdos educacionais.

O projeto também demonstrou a importância da integração entre <strong>design, experiência do usuário, Front-End e Back-End</strong>, mostrando que o desenvolvimento de uma aplicação completa exige não apenas a implementação das funcionalidades, mas também a preocupação com a forma como essas funcionalidades são apresentadas e utilizadas pelos usuários, seguindo os conceitos de UX e UI.

**Desenvolvido para o Tech Challenge — Fase 3 - Front-End — 2026**
