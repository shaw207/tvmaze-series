export default function ShowCard({ show, isFavorite, onToggleFavorite, onOpenModal }) {
  const img = show?.image?.medium || '';
  const name = show?.name || 'Untitled';
  const rating = show?.rating?.average ?? '—';
  const genres = Array.isArray(show?.genres) ? show.genres.slice(0, 4) : [];

  return (
    <article className="card">
      <button type="button" className="card-open" onClick={onOpenModal} aria-label={'Ver ficha de ' + name} />
      <div className="poster">
        {img ? <img src={img} alt={name} loading="lazy" /> : <div className="ph">Sin imagen</div>}
        <button
          className={`fav-btn ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={isFavorite}
          title={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          ★
        </button>
      </div>

      <div className="card-body">
        <div className="row">
          <div className="card-title">{name}</div>
          <div className="rating">★ {rating}</div>
        </div>
        {genres.length > 0 && (
          <div className="genres">
            {genres.map((g) => (
              <span key={g} className="chip">{g}</span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
