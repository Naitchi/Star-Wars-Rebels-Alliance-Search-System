import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';

// Css
import './SpeciesPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getAll } from '../../services/data.service';
import { Species } from '../../types/types';
import { getSpecies, setSpecies } from '../../store/speciesSlice';

export default function SpeciesPage() {
  const dispatch = useDispatch();
  const { name } = useParams();
  const species: Species[] = useSelector(getSpecies);
  console.log(species);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('species');
        console.log(response);
        dispatch(setSpecies(response));
      } catch (err) {
        console.log(err);
      }
    };

    if (!species.length) {
      fetchItems();
    }
  }, [dispatch, species, name]);

  return (
    <div className="app">
      <Header />
      <div className="container">
        {species.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
