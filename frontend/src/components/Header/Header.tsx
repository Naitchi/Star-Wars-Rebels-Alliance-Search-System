import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  return (
    <header>
      <Link to="/">
        <img src="../img/logoStarWarsRebelle.png" className="logo" alt="Logo Rebelle" />
      </Link>
      <nav>
        <Link to="/">All</Link> {/* TODO Faire cette page avec un search via name uniquement*/}
        <Link to="/films">Films</Link>
        <Link to="/vehicles">Vehicles</Link>
        <Link to="/species">Species</Link>
        <Link to="/planets">Planets</Link>
        <Link to="/peoples">People</Link>
        <Link to="/starships">Starship</Link>
      </nav>
    </header>
  );
}
