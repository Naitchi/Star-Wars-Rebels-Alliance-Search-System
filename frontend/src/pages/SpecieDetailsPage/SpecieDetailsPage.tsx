import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getFilms, setFilms } from '../../store/filmsSlice';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { getPlanets, setPlanets } from '../../store/planetsSlice';
import { getSpecies } from '../../store/speciesSlice';

// Components
import Displayer from '../../components/Displayer/Displayer';
import Header from '../../components/Header/Header';

// Css
import style from './SpecieDetailsPage.module.css';

// Services
import { getAll, getOneElement } from '../../services/data.service';

// Types
import { Films, People, Planet, Species } from '../../types/types';
type isLoadingType = {
  films: boolean;
  people: boolean;
  planets: boolean;
  species: boolean;
};
type StateType = {
  selectedFilms: Films[];
  selectedPeople: People[];
  selectedPlanets: Planet[];
  selectedSpecies?: Species;
};

export default function SpeciesDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    films: true,
    people: true,
    planets: true,
    species: true,
  });
  const [state, setState] = useState<StateType>({
    selectedFilms: [],
    selectedPeople: [],
    selectedPlanets: [],
    selectedSpecies: undefined,
  });
  const { id } = useParams();
  const people: People[] = useSelector(getPeople);
  const films: Films[] = useSelector(getFilms);
  const planets: Planet[] = useSelector(getPlanets);
  const species: Species[] = useSelector(getSpecies);

  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading((prevState) => ({ ...prevState, people: true }));
      if (!id) return;
      try {
        const response = (await getOneElement('species', id)) as Species;
        if (!response) {
          navigate('/NotFound');
        }
        setState((prevState) => ({ ...prevState, selectedSpecies: response }));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, species: false }));
    };
    if (!species.length) fetchItem();
    else {
      const item: Species = species.filter(
        (item) => item.url == `https://swapi.dev/api/species/${id}/`,
      )[0];
      console.log(item);
      if (!item) {
        navigate('/NotFound');
      }
      setState((prevState) => ({ ...prevState, selectedSpecies: item }));
      setIsLoading((prevState) => ({ ...prevState, species: false }));
    }
  }, [dispatch, navigate, species, id]);
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
      const matchedElements = planets.filter(
        (item) => item.url == state.selectedSpecies?.homeworld,
      );
      selectedElements.push(...matchedElements);
      setState((prevState) => ({ ...prevState, selectedPlanets: selectedElements }));
    };
    if (!planets.length) fetchItems();
    else {
      selector();
      setIsLoading((prevState) => ({ ...prevState, planets: false }));
    }
  }, [dispatch, planets, state.selectedSpecies]);
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
      state.selectedSpecies?.films.forEach((url) => {
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
  }, [dispatch, films, state.selectedSpecies]);
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
      state.selectedSpecies?.people.forEach((url) => {
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
  }, [dispatch, people, state.selectedSpecies]);

  return (
    <div className={style.app}>
      <Header />
      {isLoading.species ? (
        <p>Loading...</p>
      ) : (
        state.selectedSpecies && (
          <div className={style.container}>
            <h1>{state.selectedSpecies.name}</h1>
            <p>Average height: {state.selectedSpecies.average_height} cm</p>
            <p>Average Lifespan: {state.selectedSpecies.average_lifespan} years</p>
            <Displayer
              label="This specie come from"
              isLoading={isLoading.planets}
              selected={state.selectedPlanets}
            />
            <Displayer
              label="People"
              isLoading={isLoading.people}
              selected={state.selectedPeople}
            />
            <Displayer label="Movies" isLoading={isLoading.films} selected={state.selectedFilms} />
            <p>Classification: {state.selectedSpecies.classification}</p>
            <p>Designation: {state.selectedSpecies.designation}</p>
            <p>Eye Colors: {state.selectedSpecies.eye_colors}</p>
            <p>Hair Colors: {state.selectedSpecies.hair_colors}</p>
            <p>Language: {state.selectedSpecies.language}</p>
            <p>Skin Colors : {state.selectedSpecies.skin_colors}</p>
            <p className={style.subtext}>
              created the{' '}
              {new Date(state.selectedSpecies.created).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className={style.subtext}>
              edited the{' '}
              {new Date(state.selectedSpecies.edited).toLocaleDateString('en-GB', {
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
