import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Store
import { getAll } from '../../services/data.service';
import { useDispatch, useSelector } from 'react-redux';
import { getSpecies, setSpecies } from '../../store/speciesSlice';

// Components
import Header from '../../components/Header/Header';

// Css
import './SpecieDetailsPage.css';

// Types
import { Species } from '../../types/types';

export default function SpecieDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);
  const species: Species[] = useSelector(getSpecies);
  console.log('Speciefrom state:', species);

  const item = species[Number(id) - 1];
  console.log(item);
  // TODO mettre une redirection quand item est vide

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('species');
        dispatch(setSpecies(response));
      } catch (err) {
        console.log(err);
      }
    };

    if (!species.length) {
      fetchItems();
    }
  }, [dispatch, species]);

  return (
    <div className="app">
      <Header />
      {item && (
        <div className="container">
          <h1>{item.name}</h1>
          <p>
            {/* TODO Mettre des icones Font-Awesome */}Average height: {item.average_height} cm
          </p>
          {/* TODO Mettre un Carousel avec les films, planet et personnages */}
          <p>Average Lifespan: {item.average_lifespan} years</p>
          <p>Classification: {item.classification}</p>
          <p>Designation: {item.designation}</p>
          <p>Eye Colors: {item.eye_colors}</p>
          <p>Hair Colors: {item.hair_colors}</p>
          <p>Language: {item.language}</p>
          <p>Skin Colors : {item.skin_colors}</p>
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
