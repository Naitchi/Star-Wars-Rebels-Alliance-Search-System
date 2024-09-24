import { useEffect } from 'react';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/CardFilms/CardFilms';

// Css
import './PlanetsPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getAll } from '../../services/data.service';
import { Planet } from '../../types/types';
import { getPlanets, setPlanets } from '../../store/planetsSlice';

export default function PlanetsPage() {
  const dispatch = useDispatch();
  const planets: Planet[] = useSelector(getPlanets);
  console.log(planets);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('planets');
        console.log(response);
        dispatch(setPlanets(response));
      } catch (err) {
        console.log(err);
      }
    };

    if (!planets.length) {
      fetchItems();
    }
  }, [dispatch, planets]);

  return (
    <div className="app">
      <Header />
      <div className="container">
        {planets.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
