import { Link } from 'react-router-dom';
import style from './Header.module.css';

export default function Header() {
  return (
    <header className={style.header}>
      <Link className={style.linkLogo} to="/">
        <img src="../img/logoStarWarsRebelle.png" className={style.logo} alt="Logo Rebelle" />
      </Link>
      <nav className={style.nav}>
        <Link className={style.link} to="/all">
          All
        </Link>
        <Link className={style.link} to="/films">
          Films
        </Link>
        <Link className={style.link} to="/vehicles">
          Vehicles
        </Link>
        <Link className={style.link} to="/species">
          Species
        </Link>
        <Link className={style.link} to="/planets">
          Planets
        </Link>
        <Link className={style.link} to="/people">
          People
        </Link>
        <Link className={style.link} to="/starships">
          Starship
        </Link>
      </nav>
    </header>
  );
}
