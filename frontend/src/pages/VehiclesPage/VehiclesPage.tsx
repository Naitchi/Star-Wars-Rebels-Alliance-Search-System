import { useEffect } from 'react';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/CardFilms/CardFilms';

// Css
import './VehiclesPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getVehicles, setVehicles } from '../../store/vehiclesSlice';

import { getAll } from '../../services/data.service';
import { Vehicle } from '../../types/types';

export default function VehiclesPage() {
  const dispatch = useDispatch();
  const vehicles: Vehicle[] = useSelector(getVehicles);
  console.log(vehicles);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('vehicles');
        console.log(response);
        dispatch(setVehicles(response));
      } catch (err) {
        console.log(err);
      }
    };

    if (!vehicles.length) {
      fetchItems();
    }
  }, [dispatch, vehicles]);

  return (
    <div className="app">
      <Header />
      <div className="container">
        {vehicles.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
