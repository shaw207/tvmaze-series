import { useEffect, useRef } from 'react';

function summaryParagraphs(html) {
  if (typeof html !== 'string' || !html.trim()) return ['Sin descripción.'];
  const fragment = document.createElement('template');
  fragment.innerHTML = html;
  fragment.content.querySelectorAll('script, style').forEach(node => node.remove());
  fragment.content.querySelectorAll('p, div, br').forEach(node => node.after('\n'));
  const paragraphs = fragment.content.textContent.split('\n').map(text => text.trim()).filter(Boolean);
  return paragraphs.length ? paragraphs : ['Sin descripción.'];
}

export default function ShowModal({ show, onClose }) {
  const dialog = useRef(null);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    return () => element.close();
  }, []);

  function closeBackdrop(event) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const outside = event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom;
    if (outside) onClose();
  }

  return (
    <dialog ref={dialog} className="modal" aria-labelledby="show-title"
      onClick={closeBackdrop} onCancel={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Cerrar ficha">×</button>
      <h2 id="show-title">{show.name}</h2>
      <p><strong>Idioma:</strong> {show.language}</p>
      <p><strong>Estado:</strong> {show.status}</p>
      <p><strong>Estreno:</strong> {show.premiered}</p>
      <p><strong>Rating:</strong> {show.rating?.average ?? '—'}</p>
      {show.image?.medium && (
        <img src={show.image.medium} alt={show.name} style={{ maxWidth: '100%' }} />
      )}
      <div className="summary">
        {summaryParagraphs(show.summary).map((text, index) => <p key={index}>{text}</p>)}
      </div>
    </dialog>
  );
}
