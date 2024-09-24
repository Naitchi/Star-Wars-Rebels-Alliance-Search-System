import { Link } from 'react-router-dom';
import { Planet } from '../../types/types';
import './CardPlanets.css';

export default function CardPlanets(
  props: Readonly<{
    item: Planet;
  }>,
) {
  const extractIdFromUrl = (url: string): number => {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]); // Récupère l'avant-dernier, le chiffre
  };

  return (
    <Link className="link" to={`/planets/${extractIdFromUrl(props.item.url)}`}>
      <h2>{props.item.name}</h2>
    </Link>
  );
}
