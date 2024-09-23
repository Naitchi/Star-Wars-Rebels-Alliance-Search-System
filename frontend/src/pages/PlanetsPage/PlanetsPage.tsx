import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';

// Css
import './PlanetsPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getAll } from '../../services/data.service';
import { Planet } from '../../types/types';
import { getPlanets, setPlanets } from '../../store/planetsSlice';

export default function PlanetsPage() {
  const dispatch = useDispatch();
  const { name } = useParams();
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
  }, [dispatch, planets, name]);

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
