export default function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Buscar por título, autor ou palavra-chave..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Buscar postagens"
        />
        {value ? (
          <button
            onClick={onClear}
            className="search-clear-btn"
            title="Limpar busca"
            type="button"
          >
            ✖
          </button>
        ) : (
          <span className="search-icon">🔍</span>
        )}
      </div>
    </div>
  );
}
