// Css
import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="page">
      <div className="body">
        <h1>404</h1>
        <h2>Oups! La page que vous demandez n'existe pas.</h2>
        <Link to="/">Retourner sur la page d’accueil</Link>
      </div>
    </div>
  );
}

export default NotFound;
