import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';

// Css
import './FilmsPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getFilms, setFilms } from '../../store/filmsSlice';

import { getAll } from '../../services/data.service';
import { Films } from '../../types/types';

export default function FilmsPage() {
  const dispatch = useDispatch();
  const { name } = useParams();
  const films: Films[] = useSelector(getFilms);
  console.log('Films from state:', films);

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
  }, [dispatch, films, name]);

  return (
    <div className="app">
      <Header />
      <div className="container">
        {films.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
