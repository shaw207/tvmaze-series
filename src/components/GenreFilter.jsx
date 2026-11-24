export default function GenreFilter({ options, value, onChange }) {
  return (
    <select
      className="genre-filter"
      aria-label="Filtrar por género"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((g) => (
        <option key={g} value={g}>
          {g}
        </option>
      ))}
    </select>
  );
}
