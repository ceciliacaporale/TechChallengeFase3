function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('pt-BR')
}

export default function PostCard({ post }) {
  if (!post) {
    // Card vazio, usado como placeholder de layout (skeleton simples)
    return <article className="post-card post-card--empty" aria-hidden="true" />
  }

  return (
    <article className="post-card">
      <h2 className="post-card__titulo">{post.titulo}</h2>
      <p className="post-card__conteudo">{post.conteudo}</p>
      <footer className="post-card__footer">
        <span className="post-card__autor">{post.autor}</span>
        <span className="post-card__data">{formatDate(post.data)}</span>
      </footer>
    </article>
  )
}
