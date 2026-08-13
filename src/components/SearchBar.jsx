export default function SearchBar({ value, onChange, onToggleFilters }) {
  return (
    <div className="searchbar">
      <div className="searchbar__input-wrap">
        <input
          type="text"
          className="searchbar__input"
          placeholder="Buscar postagens..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Buscar postagens"
        />
        <svg
          className="searchbar__icon"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="none"
        >
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2.2" />
          <line
            x1="16.2"
            y1="16.2"
            x2="21"
            y2="21"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <button
        className="searchbar__filter"
        onClick={onToggleFilters}
        aria-label="Filtrar postagens"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <line x1="4" y1="7" x2="20" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="4" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <line x1="4" y1="17" x2="12" y2="17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
