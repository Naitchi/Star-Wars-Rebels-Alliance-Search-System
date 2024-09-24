import { Films } from '../../types/types';
import './CardFilms.css';

export default function CardFilms(
  props: Readonly<{
    item: Films;
  }>,
) {
  const extractIdFromUrl = (url: string): number => {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]); // Récupère l'avant-dernier, le chiffre
  };

  return (
    <a className="link" href={`/films/${extractIdFromUrl(props.item.url)}`}>
      <h2>{props.item.title}</h2>
    </a>
  );
}
