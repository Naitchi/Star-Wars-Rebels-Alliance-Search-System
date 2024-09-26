import { Link } from 'react-router-dom';
import { Vehicle, People, Starship, Films, Planet, Species, All } from '../../types/types';
import style from './Card.module.css';

export default function Card(
  props: Readonly<{
    item: Films | Planet | Vehicle | People | Starship | Species | All;
  }>,
) {
  const extractIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    const length = parts.length;
    return `${parts[length - 3]}/${parts[length - 2]}`; // Récupère l'avant-dernier, le chiffre et la catégorie
  };

  return (
    <div className={style.linkContainer}>
      <Link className={style.link} to={`/${extractIdFromUrl(props.item.url)}`}>
        <h2 className={style.title}>
          {'title' in props.item ? props.item.title : props.item.name}
        </h2>
      </Link>
    </div>
  );
}
