import { useEffect, useMemo, useRef, useState } from 'react';
import SearchBar from './components/SearchBar.jsx';
import GenreFilter from './components/GenreFilter.jsx';
import ShowGrid from './components/ShowGrid.jsx';
import FavoriteSection from './components/FavoriteSection.jsx';
import ShowModal from './components/ShowModal.jsx';

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem('favorites') || '[]');
    return Array.isArray(saved) ? saved.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [shows, setShows] = useState([]);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All');
  const [favorites, setFavorites] = useState(readFavorites);
  const [selectedShow, setSelectedShow] = useState(null);
  const detailRequest = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const request = new AbortController();

    async function loadCatalog() {
      try {
        const response = await fetch('https://api.tvmaze.com/shows?page=0', {
          signal: request.signal,
        });
        if (!response.ok) throw new Error('HTTP ' + response.status);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('El catálogo recibido no es válido.');
        setShows(data);
      } catch (err) {
        if (!request.signal.aborted) setError('Error al cargar el catálogo: ' + err.message);
      } finally {
        if (!request.signal.aborted) setLoading(false);
      }
    }

    loadCatalog();
    return () => {
      request.abort();
      detailRequest.current?.abort();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch {
      // La selección sigue disponible en memoria cuando el navegador bloquea el almacenamiento.
    }
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const openModal = async (id) => {
    detailRequest.current?.abort();
    const request = new AbortController();
    detailRequest.current = request;
    try {
      const response = await fetch('https://api.tvmaze.com/shows/' + id, {
        signal: request.signal,
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const show = await response.json();
      if (show?.id !== id) throw new Error('La ficha recibida no es válida.');
      if (!request.signal.aborted) setSelectedShow(show);
    } catch (err) {
      if (!request.signal.aborted) alert('Error al cargar el detalle: ' + err.message);
    }
  };

  const allGenres = useMemo(() => {
    const set = new Set();
    shows.forEach((s) => (s.genres || []).forEach((g) => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [shows]);

  const visible = useMemo(() => {
    let list = [...shows];
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((s) => (s.name || '').toLowerCase().includes(q));
    if (genre !== 'All') list = list.filter((s) => s.genres?.includes(genre));
    return list;
  }, [shows, query, genre]);

  return (
    <div className="app">
      <header className="header container">
        <h1 className="title">Series (TVMaze)</h1>
        <div className="toolbar">
          <SearchBar value={query} onChange={setQuery} />
          <GenreFilter options={allGenres} value={genre} onChange={setGenre} />
          <div className="meta">
            Total: <span className="count">{shows.length}</span> · Mostrando:{' '}
            <span className="count">{visible.length}</span>
          </div>
        </div>
      </header>

      <main className="container">
        {loading && <div className="note">Cargando listado…</div>}
        {!loading && error && <div className="note error">{error}</div>}
        {!loading && !error && visible.length === 0 && (
          <div className="note">No hay resultados para “{query}”.</div>
        )}
        {!loading && !error && visible.length > 0 && (
          <ShowGrid
            items={visible}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenModal={openModal}
          />
        )}
      </main>

      <FavoriteSection
        shows={shows}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      {selectedShow && (
        <ShowModal show={selectedShow} onClose={() => setSelectedShow(null)} />
      )}
    </div>
  );
}
