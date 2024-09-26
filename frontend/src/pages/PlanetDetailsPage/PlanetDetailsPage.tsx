import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getFilms, setFilms } from '../../store/filmsSlice';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { getPlanets } from '../../store/planetsSlice';

// Components
import Displayer from '../../components/Displayer/Displayer';
import Header from '../../components/Header/Header';

// Css
import style from './PlanetDetailsPage.module.css';

// Services
import { getAll, getOneElement } from '../../services/data.service';

// Types
import { Films, People, Planet } from '../../types/types';
type isLoadingType = {
  films: boolean;
  people: boolean;
  planets: boolean;
};
type StateType = {
  selectedFilms: Films[];
  selectedPeople: People[];
  selectedPlanets?: Planet;
};

export default function PlanetDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    films: true,
    people: true,
    planets: true,
  });
  const [state, setState] = useState<StateType>({
    selectedFilms: [],
    selectedPeople: [],
    selectedPlanets: undefined,
  });
  const { id } = useParams();
  const people: People[] = useSelector(getPeople);
  const films: Films[] = useSelector(getFilms);
  const planets: Planet[] = useSelector(getPlanets);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading((prevState) => ({ ...prevState, planets: true }));
      if (!id) return;
      try {
        const response = (await getOneElement('planets', id)) as Planet;
        if (!response) {
          navigate('/NotFound');
        }
        setState((prevState) => ({ ...prevState, selectedPlanets: response }));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, planets: false }));
    };
    if (!planets.length) fetchItem();
    else {
      const item: Planet = planets.filter(
        (item) => item.url == `https://swapi.dev/api/planets/${id}/`,
      )[0];
      console.log(item);
      if (!item) {
        navigate('/NotFound');
      }
      setState((prevState) => ({ ...prevState, selectedPlanets: item }));
      setIsLoading((prevState) => ({ ...prevState, planets: false }));
    }
  }, [dispatch, navigate, planets, id]);
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
      if (state.selectedPlanets) {
        const selectedElements: Films[] = [];
        state.selectedPlanets.films.forEach((url) => {
          const matchedElements = films.filter((item) => item.url === url);
          selectedElements.push(...matchedElements);
        });
        setState((prevState) => ({ ...prevState, selectedFilms: selectedElements }));
      }
    };
    if (!films.length) fetchItems();
    else {
      selector();
      setIsLoading((prevState) => ({ ...prevState, films: false }));
    }
  }, [dispatch, films, state.selectedPlanets]);
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
      state.selectedPlanets?.residents.forEach((url) => {
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
  }, [dispatch, people, state.selectedPlanets]);

  return (
    <div className={style.app}>
      <Header />

      {isLoading.people ? (
        <p>Loading...</p>
      ) : (
        state.selectedPlanets && (
          <div className={style.container}>
            <h1>{state.selectedPlanets.name}</h1>
            <p>Climate : {state.selectedPlanets.climate}</p>
            <Displayer
              label="Residents"
              isLoading={isLoading.people}
              selected={state.selectedPeople}
            />
            <Displayer
              label="Films featuring this planet"
              isLoading={isLoading.films}
              selected={state.selectedFilms}
            />
            <p>Gravity: {state.selectedPlanets.gravity}</p>
            <p>Orbital Period: {state.selectedPlanets.orbital_period}</p>
            <p>Diameter: {state.selectedPlanets.diameter}</p>
            <p>Population: {state.selectedPlanets.population}</p>
            <p>Rotation Period: {state.selectedPlanets.rotation_period}</p>
            <p>Surface Water: {state.selectedPlanets.surface_water}</p>
            <p>Terrain : {state.selectedPlanets.terrain}</p>
            <p className={style.subtext}>
              created the{' '}
              {new Date(state.selectedPlanets.created).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className={style.subtext}>
              edited the{' '}
              {new Date(state.selectedPlanets.edited).toLocaleDateString('en-GB', {
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
