import ShowCard from './ShowCard.jsx';

export default function ShowGrid({ items, favorites, onToggleFavorite, onOpenModal }) {
  return (
    <section className="grid" aria-label="Resultados">
      {items.map((s) => (
        <ShowCard
          key={s.id}
          show={s}
          isFavorite={favorites.includes(s.id)}
          onToggleFavorite={() => onToggleFavorite(s.id)}
          onOpenModal={() => onOpenModal(s.id)}
        />
      ))}
    </section>
  );
}
