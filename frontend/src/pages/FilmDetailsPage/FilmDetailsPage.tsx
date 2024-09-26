import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getFilms } from '../../store/filmsSlice';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { getPlanets, setPlanets } from '../../store/planetsSlice';
import { getSpecies, setSpecies } from '../../store/speciesSlice';
import { getStarship, setStarship } from '../../store/starshipSlice';
import { getVehicles, setVehicles } from '../../store/vehiclesSlice';

// Components
import Displayer from '../../components/Displayer/Displayer';
import Header from '../../components/Header/Header';

// Css
import style from './FilmDetailsPage.module.css';

// Services
import { getAll, getOneElement } from '../../services/data.service';

// Types
import { Films, People, Planet, Species, Starship, Vehicle } from '../../types/types';
type isLoadingType = {
  films: boolean;
  people: boolean;
  planets: boolean;
  species: boolean;
  starships: boolean;
  vehicles: boolean;
};
type StateType = {
  selectedFilms?: Films;
  selectedPeople: People[];
  selectedPlanets: Planet[];
  selectedSpecies: Species[];
  selectedStarships: Starship[];
  selectedVehicles: Vehicle[];
};

export default function FilmDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    films: true,
    people: true,
    planets: true,
    species: true,
    starships: true,
    vehicles: true,
  });
  const [state, setState] = useState<StateType>({
    selectedFilms: undefined,
    selectedPeople: [],
    selectedPlanets: [],
    selectedSpecies: [],
    selectedStarships: [],
    selectedVehicles: [],
  });

  const { id } = useParams();
  const films: Films[] = useSelector(getFilms);
  const people: People[] = useSelector(getPeople);
  const planets: Planet[] = useSelector(getPlanets);
  const species: Species[] = useSelector(getSpecies);
  const starships: Starship[] = useSelector(getStarship);
  const vehicles: Vehicle[] = useSelector(getVehicles);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading((prevState) => ({ ...prevState, films: true }));
      if (!id) return;
      try {
        const response = (await getOneElement('films', id)) as Films;
        if (!response) {
          navigate('/NotFound');
        }
        setState((prevState) => ({ ...prevState, selectedFilms: response }));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, films: false }));
    };
    if (!films.length) fetchItem();
    else {
      const item = films[Number(id) - 1];
      if (!item) {
        navigate('/NotFound');
      }
      setState((prevState) => ({ ...prevState, selectedFilms: item }));
      setIsLoading((prevState) => ({ ...prevState, films: false }));
    }
  }, [dispatch, navigate, films, id]); // TODO voir si le endpoint remarche
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
    const selector = () => {
      const selectedElements: Planet[] = [];
      state.selectedFilms?.planets.forEach((url) => {
        const matchedElements = planets.filter((item) => item.url === url);
        selectedElements.push(...matchedElements);
      });
      setState((prevState) => ({ ...prevState, selectedPlanets: selectedElements }));
    };
    if (!planets.length) fetchItems();
    else {
      selector();
      setIsLoading((prevState) => ({ ...prevState, planets: false }));
    }
  }, [dispatch, planets, state.selectedFilms]);
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
    const selector = () => {
      if (state.selectedFilms) {
        const selectedElements: Vehicle[] = state.selectedFilms.vehicles
          .map((url) => vehicles.find((item) => item.url === url))
          .filter((vehicle): vehicle is Vehicle => vehicle !== undefined); // Filtre les résultats non définis

        setState((prevState) => ({ ...prevState, selectedVehicles: selectedElements }));
      }
    };

    if (!vehicles.length) fetchItems();
    else {
      selector();
      setIsLoading((prevState) => ({ ...prevState, vehicles: false }));
    }
  }, [dispatch, vehicles, state.selectedFilms]);
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
    const selector = () => {
      if (state.selectedFilms) {
        const selectedElements: Starship[] = [];
        state.selectedFilms.starships.forEach((url) => {
          const matchedElements = starships.filter((item) => item.url === url);
          selectedElements.push(...matchedElements);
        });
        setState((prevState) => ({ ...prevState, selectedStarships: selectedElements }));
      }
    };
    if (!starships.length) fetchItems();
    else {
      selector();
      setIsLoading((prevState) => ({ ...prevState, starships: false }));
    }
  }, [dispatch, starships, state.selectedFilms]);
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
      state.selectedFilms?.characters.forEach((url) => {
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
  }, [dispatch, people, state.selectedFilms]);
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading((prevState) => ({ ...prevState, species: true }));
      try {
        const response = await getAll('species');
        dispatch(setSpecies(response as Species[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, species: false }));
    };
    const selector = () => {
      const selectedElements: Species[] = [];
      state.selectedFilms?.species.forEach((url) => {
        const matchedElements = species.filter((item) => item.url === url);
        selectedElements.push(...matchedElements);
      });
      setState((prevState) => ({ ...prevState, selectedSpecies: selectedElements }));
    };

    if (!species.length) fetchItems();
    else {
      selector();
      setIsLoading((prevState) => ({ ...prevState, species: false }));
    }
  }, [dispatch, species, state.selectedFilms]);

  return (
    <div className={style.app}>
      <Header />
      {isLoading.films ? (
        <p>Loading...</p>
      ) : (
        state.selectedFilms && (
          <div className={style.container}>
            <h1>{state.selectedFilms.title}</h1>
            <p>
              By Director: {state.selectedFilms.director} and Producer :{' '}
              {state.selectedFilms.producer}
            </p>
            <p>Opening Crawl : {state.selectedFilms.opening_crawl}</p>
            <Displayer
              label="Characters featured in the movie"
              isLoading={isLoading.people}
              selected={state.selectedPeople}
            />
            <Displayer
              label="Starships featured in the movie"
              isLoading={isLoading.starships}
              selected={state.selectedStarships}
            />
            <Displayer
              label="Vehicle featured in the movie"
              isLoading={isLoading.vehicles}
              selected={state.selectedVehicles}
            />
            <Displayer
              label="Planets featured in the movie"
              isLoading={isLoading.planets}
              selected={state.selectedPlanets}
            />
            <Displayer
              label="Species featured in the movie"
              isLoading={isLoading.species}
              selected={state.selectedSpecies}
            />
            <p>
              Release Date:{' '}
              {new Date(state.selectedFilms.release_date).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className={style.subtext}>
              created the{' '}
              {new Date(state.selectedFilms.created).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className={style.subtext}>
              edited the{' '}
              {new Date(state.selectedFilms.edited).toLocaleDateString('en-GB', {
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
