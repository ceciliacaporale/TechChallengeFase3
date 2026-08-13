export default function Header() {
  return (
    <header className="header">
      <div className="header__logo" aria-hidden="true">
        <span className="header__logo-swoosh" />
      </div>
      <h1 className="header__title">Postagens</h1>
      <button className="header__user" aria-label="Conta do usuário">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
          <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M4.5 19.2c1.4-3.2 4.2-4.9 7.5-4.9s6.1 1.7 7.5 4.9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </header>
  )
}
