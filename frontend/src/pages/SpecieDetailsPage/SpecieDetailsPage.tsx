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

// Composant affichant un élèment de la catégorie Species en particulier
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

  // Récupération de l'élèment
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
      if (!item) {
        navigate('/NotFound');
      }
      setState((prevState) => ({ ...prevState, selectedSpecies: item }));
      setIsLoading((prevState) => ({ ...prevState, species: false }));
    }
  }, [dispatch, navigate, species, id]);

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
    };
    if (!planets.length) fetchItems();
  }, [dispatch, planets]);
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
    };
    if (!films.length) fetchItems();
  }, [dispatch, films]);
  // Récupération des personnages
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading((prevState) => ({ ...prevState, people: true }));
      try {
        const response = await getAll('people');
        dispatch(setPeople(response as People[]));
      } catch (err) {
        console.log(err);
      }
    };
    if (!people.length) fetchItems();
  }, [dispatch, people]);

  // Logique de tri
  useEffect(() => {
    const selectPlanets = () => {
      const selectedElements: Planet[] = [];
      const matchedElements = planets.filter(
        (item) => item.url == state.selectedSpecies?.homeworld,
      );
      selectedElements.push(...matchedElements);
      setState((prevState) => ({ ...prevState, selectedPlanets: selectedElements }));
      setIsLoading((prevState) => ({ ...prevState, planets: false }));
    };
    const selectFilms = () => {
      const selectedElements: Films[] = [];
      state.selectedSpecies?.films.forEach((url) => {
        const matchedElements = films.filter((item) => item.url === url);
        selectedElements.push(...matchedElements);
      });
      setState((prevState) => ({ ...prevState, selectedFilms: selectedElements }));
      setIsLoading((prevState) => ({ ...prevState, films: false }));
    };
    const selectPeople = () => {
      const selectedElements: People[] = [];
      state.selectedSpecies?.people.forEach((url) => {
        const matchedElements = people.filter((item) => item.url === url);
        selectedElements.push(...matchedElements);
      });
      setState((prevState) => ({ ...prevState, selectedPeople: selectedElements }));
      setIsLoading((prevState) => ({ ...prevState, people: false }));
    };

    selectPlanets();
    selectFilms();
    selectPeople();
  }, [planets, people, species, state.selectedSpecies, films]);

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
