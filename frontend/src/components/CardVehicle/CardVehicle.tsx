import { Link } from 'react-router-dom';
import { Vehicle } from '../../types/types';
import './CardVehicle.css';

export default function CardVehicle(
  props: Readonly<{
    item: Vehicle;
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
