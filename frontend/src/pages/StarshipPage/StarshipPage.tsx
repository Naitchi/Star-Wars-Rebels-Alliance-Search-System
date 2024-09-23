import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';

// Css
import './StarshipPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getAll } from '../../services/data.service';
import { Starship } from '../../types/types';
import { getStarship, setStarship } from '../../store/starshipSlice';

export default function StarshipPage() {
  const dispatch = useDispatch();
  const { name } = useParams();
  const starship: Starship[] = useSelector(getStarship);
  console.log(starship);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('starship');
        console.log(response);
        dispatch(setStarship(response));
      } catch (err) {
        console.log(err);
      }
    };

    if (!starship.length) {
      fetchItems();
    }
  }, [dispatch, starship, name]);

  return (
    <div className="app">
      <Header />
      <div className="container">
        {starship.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
