import { Link } from 'react-router-dom';
import { Species } from '../../types/types';
import './CardSpecies.css';

export default function CardSpecies(
  props: Readonly<{
    item: Species;
  }>,
) {
  const extractIdFromUrl = (url: string): number => {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]); // Récupère l'avant-dernier, le chiffre
  };

  return (
    <Link className="link" to={`/species/${extractIdFromUrl(props.item.url)}`}>
      <h2>{props.item.name}</h2>
    </Link>
  );
}
