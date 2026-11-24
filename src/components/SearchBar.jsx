export default function SearchBar({ value, onChange }) {
  return (
    <label className="search">
      <span className="sr-only">Filtrar por nombre</span>
      <input
        className="search-input"
        placeholder="Filtra por nombre… (p.ej. office)"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="search"
        autoComplete="off"
        aria-label="Filtrar por nombre"
      />
    </label>
  );
}
