import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Store
import { getAll } from '../../services/data.service';
import { useDispatch, useSelector } from 'react-redux';
import { getFilms, setFilms } from '../../store/filmsSlice';

// Components
import Header from '../../components/Header/Header';

// Css
import style from './FilmDetailsPage.module.css';

// Types
import { Films } from '../../types/types';

export default function FilmDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);
  const films: Films[] = useSelector(getFilms);
  console.log('Filmfrom state:', films);

  const item = films[Number(id) - 1];
  console.log(item);
  // TODO mettre une redirection quand item est vide

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('films');
        dispatch(setFilms(response));
      } catch (err) {
        console.log(err);
      }
    };

    if (!films.length) {
      fetchItems();
    }
  }, [dispatch, films]);

  return (
    <div className={style.app}>
      <Header />

      {item && (
        <div className={style.container}>
          <h1>{item.title}</h1>
          <p>
            By Director: {item.director} and Producer : {item.producer}
          </p>
          <p>
            {/* TODO Mettre des icones Font-Awesome */}Opening Crawl : {item.opening_crawl}
          </p>
          {/* TODO Mettre un Carousel avec les vehicles, vaisseaux, especes, planetes et personnages */}
          <p>
            Release Date:{' '}
            {new Date(item.release_date).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className={style.subtext}>
            created the{' '}
            {new Date(item.created).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className={style.subtext}>
            edited the{' '}
            {new Date(item.edited).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      )}
    </div>
  );
}
