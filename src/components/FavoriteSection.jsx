export default function FavoriteSection({ shows, favorites, onToggleFavorite }) {
  const favShows = shows.filter((s) => favorites.includes(s.id));
  if (favShows.length === 0) return null;

  return (
    <section className="container fav-section">
      <h2>Favoritos ({favShows.length})</h2>
      <div className="grid">
        {favShows.map((s) => (
          <article key={s.id} className="card">
            <div className="poster">
              {s.image?.medium ? (
                <img src={s.image.medium} alt={s.name} />
              ) : (
                <div className="ph">Sin imagen</div>
              )}
              <button
                className="fav-btn active"
                onClick={() => onToggleFavorite(s.id)}
                title="Quitar de favoritos"
              >
                ★
              </button>
            </div>
            <div className="card-body">
              <div className="card-title">{s.name}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
