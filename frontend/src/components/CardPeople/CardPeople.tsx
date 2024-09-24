import { Link } from 'react-router-dom';
import { People } from '../../types/types';
import './CardPeople.css';

export default function CardPeople(
  props: Readonly<{
    item: People;
  }>,
) {
  const extractIdFromUrl = (url: string): number => {
    const parts = url.split('/');
    return Number(parts[parts.length - 2]); // Récupère l'avant-dernier, le chiffre
  };

  return (
    <Link className="link" to={`/people/${extractIdFromUrl(props.item.url)}`}>
      <h2>{props.item.name}</h2>
      <h3>from {props.item.homeworld}</h3>
    </Link>
  );
}
