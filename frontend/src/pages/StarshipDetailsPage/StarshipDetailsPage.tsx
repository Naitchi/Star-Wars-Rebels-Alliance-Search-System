import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Store
import { getAll } from '../../services/data.service';
import { useDispatch, useSelector } from 'react-redux';
import { getStarship, setStarship } from '../../store/starshipSlice';

// Components
import Header from '../../components/Header/Header';

// Css
import style from './StarshipDetailsPage.module.css';

// Types
import { Starship } from '../../types/types';

export default function StarshipDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);
  const starships: Starship[] = useSelector(getStarship);
  console.log('Starshipfrom state:', starships);

  const item = starships[Number(id) - 1];
  console.log(item);
  // TODO mettre une redirection quand item est vide

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('starship');
        dispatch(setStarship(response as Starship[])); //TODO modifié ça pour le getOneElement
      } catch (err) {
        console.log(err);
      }
    };

    if (!starships.length) {
      fetchItems();
    }
  }, [dispatch, starships]);

  return (
    <div className={style.app}>
      <Header />
      {item && (
        <div className={style.container}>
          <h1>{item.name}</h1>
          <p>
            {/* TODO Mettre des icones Font-Awesome */}Megalight per hour: {item.MGLT}
          </p>
          {/* TODO Mettre un Carousel avec pilots et les films*/}
          <p>Cargo Capacity: {item.cargo_capacity}</p>
          <p>Consumables: {item.consumables}</p>
          <p>Cost In Credits: {item.cost_in_credits}</p>
          <p>Crew: {item.crew}</p>
          <p>Hyperdrive Rating: {item.hyperdrive_rating}</p>
          <p>Length: {item.length}</p>
          <p>Manufacturer : {item.manufacturer}</p>
          <p>Max Atmosphering Speed : {item.max_atmosphering_speed}</p>
          <p>Model : {item.model}</p>
          <p>Passengers : {item.passengers}</p>
          <p>Starship Class : {item.starship_class}</p>
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
