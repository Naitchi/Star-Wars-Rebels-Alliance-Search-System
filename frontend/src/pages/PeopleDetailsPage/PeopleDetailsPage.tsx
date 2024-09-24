import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Store
import { getAll } from '../../services/data.service';
import { useDispatch, useSelector } from 'react-redux';
import { getPeople, setPeople } from '../../store/peopleSlice';

// Components
import Header from '../../components/Header/Header';

// Css
import './PeopleDetailsPage.css';

// Types
import { People } from '../../types/types';

export default function PeopleDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);
  const peoples: People[] = useSelector(getPeople);
  console.log('Peoplefrom state:', peoples);

  const item = peoples[Number(id) - 1];
  console.log(item);
  // TODO mettre une redirection quand item est vide

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('peoples');
        dispatch(setPeople(response));
      } catch (err) {
        console.log(err);
      }
    };

    if (!peoples.length) {
      fetchItems();
    }
  }, [dispatch, peoples]);

  return (
    <div className="app">
      <Header />
      {/*    species starships vehicles */}
      {item && (
        <div className="container">
          <h1>{item.name}</h1>
          <p>
            {/* TODO Mettre des icones Font-Awesome */}Birth Year : {item.birth_year}
          </p>
          {/* TODO Mettre un Carousel avec les films species starships vehicles et sa planet */}
          <p>Eye Color: {item.eye_color}</p>
          <p>Gender: {item.gender}</p>
          <p>Hair Color: {item.hair_color}</p>
          <p>Height: {item.height}</p>
          <p>Mass: {item.mass}</p>
          <p>Skin Color: {item.skin_color}</p>
          <p className="subtext">
            created the{' '}
            {new Date(item.created).toLocaleDateString('en-GB', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="subtext">
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
