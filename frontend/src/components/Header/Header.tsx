import { Link } from 'react-router-dom';
import style from './Header.module.css';

export default function Header() {
  return (
    <header>
      <Link to="/">
        <img src="../img/logoStarWarsRebelle.png" className={style.logo} alt="Logo Rebelle" />
      </Link>
      <nav>
        <Link to="/all">All</Link>
        <Link to="/films">Films</Link>
        <Link to="/vehicles">Vehicles</Link>
        <Link to="/species">Species</Link>
        <Link to="/planets">Planets</Link>
        <Link to="/people">People</Link>
        <Link to="/starships">Starship</Link>
      </nav>
    </header>
  );
}
