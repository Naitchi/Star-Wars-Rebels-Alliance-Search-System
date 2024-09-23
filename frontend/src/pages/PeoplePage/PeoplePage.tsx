import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';

// Css
import './PeoplePage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getAll } from '../../services/data.service';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { People } from '../../types/types';

export default function PeoplePage() {
  const dispatch = useDispatch();
  const { name } = useParams();
  const people: People[] = useSelector(getPeople);
  console.log(people);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('people');
        console.log(response);
        dispatch(setPeople(response));
      } catch (err) {
        console.log(err);
      }
    };

    if (!people.length) {
      fetchItems();
    }
  }, [dispatch, people, name]);

  return (
    <div className="app">
      <Header />
      <div className="container">
        {people.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
