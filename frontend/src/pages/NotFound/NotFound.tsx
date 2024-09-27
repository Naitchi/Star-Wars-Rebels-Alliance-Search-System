// Css
import { Link } from 'react-router-dom';
import style from './NotFound.module.css';

function NotFound() {
  return (
    <div className={style.page}>
      <div className={style.body}>
        <img className={style.img} src="./img/not-found.JPG" alt="404 not found" />
        <Link className={style.link} to="/">
          Go back to the home page.
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
