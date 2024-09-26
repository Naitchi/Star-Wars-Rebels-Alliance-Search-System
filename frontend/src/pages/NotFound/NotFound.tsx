// Css
import { Link } from 'react-router-dom';
import style from './NotFound.module.css';

function NotFound() {
  return (
    <div className={style.page}>
      <div className={style.body}>
        <h1>404</h1>
        <h2>Oups! This page doesn't exist.</h2>
        <Link className={style.link} to="/">
          Go back to the home page.
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
