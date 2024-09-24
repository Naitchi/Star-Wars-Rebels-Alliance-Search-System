import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getAll } from '../../services/data.service';
import { getVehicles, setVehicles } from '../../store/vehiclesSlice';

// Components
import Header from '../../components/Header/Header';

// Css
import './VehicleDetailsPage.css';

// Types
import { Vehicle } from '../../types/types';

export default function VehicleDetailsPage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  console.log(id);
  const vehicles: Vehicle[] = useSelector(getVehicles);
  console.log('Vehiclefrom state:', vehicles);

  const item = vehicles[Number(id) - 1];
  console.log(item);
  // TODO mettre une redirection quand item est vide

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('vehicles');
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
      {item && (
        <div className="container">
          <h1>{item.name}</h1>
          <p>
            {/* TODO Mettre des icones Font-Awesome */}Cargo Capacity : {item.cargo_capacity}
          </p>
          {/* TODO Mettre un Carousel avec les films et personnages */}
          <p>Consumables: {item.consumables}</p>
          <p>Cost In Credits: {item.cost_in_credits}</p>
          <p>Crew: {item.crew}</p>
          <p>Length: {item.length}</p>
          <p>Manufacturer: {item.manufacturer}</p>
          <p>Max Atmosphering Speed: {item.max_atmosphering_speed}</p>
          <p>Model: {item.model}</p>
          <p>Passengers: {item.passengers}</p>
          <p>Vehicle Class: {item.vehicle_class}</p>
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
