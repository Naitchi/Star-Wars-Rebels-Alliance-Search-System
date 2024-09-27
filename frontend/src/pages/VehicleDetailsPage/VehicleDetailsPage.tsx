import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getFilms, setFilms } from '../../store/filmsSlice';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { getVehicles } from '../../store/vehiclesSlice';

// Components
import Displayer from '../../components/Displayer/Displayer';
import Header from '../../components/Header/Header';

// Css
import style from './VehicleDetailsPage.module.css';

// Services
import { getAll, getOneElement } from '../../services/data.service';

// Types
import { Films, People, Vehicle } from '../../types/types';
type isLoadingType = {
  films: boolean;
  people: boolean;
  vehicles: boolean;
};
type StateType = {
  selectedFilms: Films[];
  selectedPeople: People[];
  selectedVehicles?: Vehicle;
};

// Composant affichant un élèment de la catégorie films en particulier
export default function VehicleDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    films: true,
    people: true,
    vehicles: true,
  });
  const [state, setState] = useState<StateType>({
    selectedFilms: [],
    selectedPeople: [],
    selectedVehicles: undefined,
  });
  const { id } = useParams();
  const people: People[] = useSelector(getPeople);
  const films: Films[] = useSelector(getFilms);
  const vehicles: Vehicle[] = useSelector(getVehicles);

  // Récupération de l'élèment
  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading((prevState) => ({ ...prevState, vehicles: true }));
      if (!id) return;
      try {
        const response = (await getOneElement('vehicles', id)) as Vehicle;
        if (!response) {
          navigate('/NotFound');
        }
        setState((prevState) => ({ ...prevState, selectedVehicles: response }));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, vehicles: false }));
    };
    if (!vehicles.length) fetchItem();
    else {
      const item: Vehicle = vehicles.filter(
        (item) => item.url == `https://swapi.dev/api/vehicles/${id}/`,
      )[0];
      if (!item) {
        navigate('/NotFound');
      }
      setState((prevState) => ({ ...prevState, selectedVehicles: item }));
      setIsLoading((prevState) => ({ ...prevState, vehicles: false }));
    }
  }, [dispatch, navigate, vehicles, id]);
  // Récupération des personnages en rapport à l'élèment
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading((prevState) => ({ ...prevState, people: true }));
      try {
        const response = await getAll('people');
        dispatch(setPeople(response as People[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, people: false }));
    };
    const selector = () => {
      const selectedElements: People[] = [];
      state.selectedVehicles?.pilots.forEach((url) => {
        const matchedElements = people.filter((item) => item.url === url);
        selectedElements.push(...matchedElements);
      });
      setState((prevState) => ({ ...prevState, selectedPeople: selectedElements }));
    };
    if (!people.length) fetchItems();
    else {
      selector();
      setIsLoading((prevState) => ({ ...prevState, people: false }));
    }
  }, [dispatch, people, state.selectedVehicles]);
  // Récupération des films en rapport à l'élèment
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading((prevState) => ({ ...prevState, films: true }));
      try {
        const response = await getAll('films');
        dispatch(setFilms(response as Films[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, films: false }));
    };
    const selector = () => {
      const selectedElements: Films[] = [];
      state.selectedVehicles?.films.forEach((url) => {
        const matchedElements = films.filter((item) => item.url === url);
        selectedElements.push(...matchedElements);
      });
      setState((prevState) => ({ ...prevState, selectedFilms: selectedElements }));
    };
    if (!films.length) fetchItems();
    else {
      selector();
      setIsLoading((prevState) => ({ ...prevState, films: false }));
    }
  }, [dispatch, films, state.selectedVehicles]);

  return (
    <div className={style.app}>
      <Header />
      {isLoading.vehicles ? (
        <p>Loading...</p>
      ) : (
        state.selectedVehicles && (
          <div className={style.container}>
            <h1>{state.selectedVehicles.name}</h1>
            <p>Cargo Capacity : {state.selectedVehicles.cargo_capacity}</p>
            <Displayer
              label="Pilots"
              isLoading={isLoading.people}
              selected={state.selectedPeople}
            />
            <Displayer label="Films" isLoading={isLoading.films} selected={state.selectedFilms} />
            <p>Consumables: {state.selectedVehicles.consumables}</p>
            <p>Cost In Credits: {state.selectedVehicles.cost_in_credits}</p>
            <p>Crew: {state.selectedVehicles.crew}</p>
            <p>Length: {state.selectedVehicles.length}</p>
            <p>Manufacturer: {state.selectedVehicles.manufacturer}</p>
            <p>Max Atmosphering Speed: {state.selectedVehicles.max_atmosphering_speed}</p>
            <p>Model: {state.selectedVehicles.model}</p>
            <p>Passengers: {state.selectedVehicles.passengers}</p>
            <p>Vehicle Class: {state.selectedVehicles.vehicle_class}</p>
            <p className={style.subtext}>
              created the{' '}
              {new Date(state.selectedVehicles.created).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className={style.subtext}>
              edited the{' '}
              {new Date(state.selectedVehicles.edited).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        )
      )}
    </div>
  );
}
