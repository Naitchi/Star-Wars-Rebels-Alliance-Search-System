import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Store
import { getAll } from '../../services/data.service';
import { useDispatch, useSelector } from 'react-redux';
import { getPlanets, setPlanets } from '../../store/planetsSlice';

// Components
import Header from '../../components/Header/Header';

// Css
import './PlanetDetailsPage.css';

// Types
import { Planet } from '../../types/types';

export default function PlanetDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);
  const planets: Planet[] = useSelector(getPlanets);
  console.log('Planetfrom state:', planets);

  const item = planets[Number(id) - 1];
  console.log(item);
  // TODO mettre une redirection quand item est vide

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('planets');
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

      {item && (
        <div className="container">
          <h1>{item.name}</h1>
          <p>
            {/* TODO Mettre des icones Font-Awesome */}Climate : {item.climate}
          </p>
          {/* TODO Mettre un Carousel avec les films et personnages */}
          <p>Gravity: {item.gravity}</p>
          <p>Orbital Period: {item.orbital_period}</p>
          <p>Diameter: {item.diameter}</p>
          <p>Population: {item.population}</p>
          <p>Rotation Period: {item.rotation_period}</p>
          <p>Surface Water: {item.surface_water}</p>
          <p>Terrain : {item.terrain}</p>
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
