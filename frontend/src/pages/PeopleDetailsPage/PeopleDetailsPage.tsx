import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getFilms, setFilms } from '../../store/filmsSlice';
import { getPeople } from '../../store/peopleSlice';
import { getPlanets, setPlanets } from '../../store/planetsSlice';
import { getStarship, setStarship } from '../../store/starshipSlice';
import { getVehicles, setVehicles } from '../../store/vehiclesSlice';

// Components
import Displayer from '../../components/Displayer/Displayer';
import Header from '../../components/Header/Header';

// Css
import style from './PeopleDetailsPage.module.css';

// Services
import { getAll, getOneElement } from '../../services/data.service';

// Types
import { Films, People, Planet, Starship, Vehicle } from '../../types/types';
type isLoadingType = {
  films: boolean;
  people: boolean;
  planets: boolean;
  starships: boolean;
  vehicles: boolean;
};
type StateType = {
  selectedFilms: Films[];
  selectedPeople?: People;
  selectedPlanets: Planet[];
  selectedStarships: Starship[];
  selectedVehicles: Vehicle[];
};

// Composant affichant un élèment de la catégorie personage en particulier
export default function PeopleDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    films: true,
    people: true,
    planets: true,
    starships: true,
    vehicles: true,
  });
  const [state, setState] = useState<StateType>({
    selectedFilms: [],
    selectedPeople: undefined,
    selectedPlanets: [],
    selectedStarships: [],
    selectedVehicles: [],
  });
  const { id } = useParams();
  const people: People[] = useSelector(getPeople);
  const films: Films[] = useSelector(getFilms);
  const planets: Planet[] = useSelector(getPlanets);
  const starships: Starship[] = useSelector(getStarship);
  const vehicles: Vehicle[] = useSelector(getVehicles);

  // Récupération de l'élèment
  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading((prevState) => ({ ...prevState, people: true }));
      if (!id) return;
      try {
        const response = (await getOneElement('people', id)) as People;
        if (!response) {
          navigate('/NotFound');
        }
        setState((prevState) => ({ ...prevState, selectedPeople: response }));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, people: false }));
    };
    if (!people.length) fetchItem();
    else {
      const item: People = people.filter(
        (item) => item.url == `https://swapi.dev/api/people/${id}/`,
      )[0];
      if (!item) {
        navigate('/NotFound');
      }
      setState((prevState) => ({ ...prevState, selectedPeople: item }));
      setIsLoading((prevState) => ({ ...prevState, people: false }));
    }
  }, [dispatch, navigate, people, id]);

  // Récupération des planètes
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading((prevState) => ({ ...prevState, planets: true }));
      try {
        const response = await getAll('planets');
        dispatch(setPlanets(response as Planet[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, planets: false }));
    };
    if (!planets.length) fetchItems();
  }, [dispatch, planets]);
  // Récupération des vehicules
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading((prevState) => ({ ...prevState, vehicles: true }));
      try {
        const response = await getAll('vehicles');
        dispatch(setVehicles(response as Vehicle[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, vehicles: false }));
    };
    if (!vehicles.length) fetchItems();
  }, [dispatch, vehicles]);
  // Récupération des vaisseaux
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading((prevState) => ({ ...prevState, starships: true }));
      try {
        const response = await getAll('starships');
        dispatch(setStarship(response as Starship[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, starships: false }));
    };
    if (!starships.length) fetchItems();
  }, [dispatch, starships]);
  // Récupération des films
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
    if (!films.length) fetchItems();
  }, [dispatch, films]);

  // Logique de tri
  useEffect(() => {
    const selectPlanets = () => {
      const matchedElements: Planet[] = planets.filter(
        (item) => item.url == state.selectedPeople?.homeworld,
      );
      setState((prevState) => ({ ...prevState, selectedPlanets: matchedElements }));
    };
    const selectVehicles = () => {
      if (state.selectedPeople) {
        const selectedElements: Vehicle[] = [];
        state.selectedPeople.vehicles.forEach((url) => {
          const matchedVehicles = vehicles.filter((item) => item.url === url);
          selectedElements.push(...matchedVehicles);
        });
        setState((prevState) => ({ ...prevState, selectedVehicles: selectedElements }));
      }
    };
    const selectedStarships = () => {
      if (state.selectedPeople) {
        const selectedElements: Starship[] = [];
        state.selectedPeople.starships.forEach((url) => {
          const matchedElements = starships.filter((item) => item.url === url);
          selectedElements.push(...matchedElements);
        });
        setState((prevState) => ({ ...prevState, selectedStarships: selectedElements }));
      }
    };
    const selectedFilms = () => {
      if (state.selectedPeople) {
        const selectedElements: Films[] = [];
        state.selectedPeople.films.forEach((url) => {
          const matchedElements = films.filter((item) => item.url === url);
          selectedElements.push(...matchedElements);
        });
        setState((prevState) => ({ ...prevState, selectedFilms: selectedElements }));
      }
    };
    selectPlanets();
    selectVehicles();
    selectedStarships();
    selectedFilms();
  }, [planets, vehicles, starships, state.selectedPeople, films]);

  return (
    <div className={style.app}>
      <Header />
      {isLoading.people ? (
        <p>Loading...</p>
      ) : (
        state.selectedPeople && (
          <div className={style.container}>
            <h1>{state.selectedPeople.name}</h1>
            <p>Birth Year : {state.selectedPeople.birth_year}</p>
            <Displayer
              label="Films featuring this character"
              isLoading={isLoading.films}
              selected={state.selectedFilms}
            />
            <Displayer
              label="Starships this character traveled in"
              isLoading={isLoading.starships}
              selected={state.selectedStarships}
            />
            <Displayer
              label="Vehicles this character traveled with"
              isLoading={isLoading.vehicles}
              selected={state.selectedVehicles}
            />
            <Displayer
              label="His homeworld"
              isLoading={isLoading.planets}
              selected={state.selectedPlanets}
            />
            <p>Eye Color: {state.selectedPeople.eye_color}</p>
            <p>Gender: {state.selectedPeople.gender}</p>
            <p>Hair Color: {state.selectedPeople.hair_color}</p>
            <p>Height: {state.selectedPeople.height}</p>
            <p>Mass: {state.selectedPeople.mass}</p>
            <p>Skin Color: {state.selectedPeople.skin_color}</p>
            <p className={style.subtext}>
              created the{' '}
              {new Date(state.selectedPeople.created).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className={style.subtext}>
              edited the{' '}
              {new Date(state.selectedPeople.edited).toLocaleDateString('en-GB', {
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
