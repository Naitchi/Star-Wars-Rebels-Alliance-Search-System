import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getFilms, setFilms } from '../../store/filmsSlice';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { getStarship } from '../../store/starshipSlice';

// Components
import Displayer from '../../components/Displayer/Displayer';
import Header from '../../components/Header/Header';

// Css
import style from './StarshipDetailsPage.module.css';

// Services
import { getAll, getOneElement } from '../../services/data.service';

// Types
import { Films, People, Starship } from '../../types/types';
type isLoadingType = {
  films: boolean;
  people: boolean;
  starships: boolean;
};
type StateType = {
  selectedFilms: Films[];
  selectedPeople: People[];
  selectedStarships?: Starship;
};

// Composant affichant un élèment de la catégorie films en particulier
export default function StarshipDetailsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<isLoadingType>({
    films: true,
    people: true,
    starships: true,
  });
  const [state, setState] = useState<StateType>({
    selectedFilms: [],
    selectedPeople: [],
    selectedStarships: undefined,
  });
  const { id } = useParams();
  const people: People[] = useSelector(getPeople);
  const films: Films[] = useSelector(getFilms);
  const starships: Starship[] = useSelector(getStarship);

  // Récupération de l'élèment
  useEffect(() => {
    const fetchItem = async () => {
      setIsLoading((prevState) => ({ ...prevState, starships: true }));
      if (!id) return;
      try {
        const response = (await getOneElement('starships', id)) as Starship;
        if (!response) {
          navigate('/NotFound');
        }
        console.log(response);
        setState((prevState) => ({ ...prevState, selectedStarships: response }));
      } catch (err) {
        console.log(err);
      }
      setIsLoading((prevState) => ({ ...prevState, starships: false }));
    };
    if (!starships.length) fetchItem();
    else {
      const item: Starship = starships.filter(
        (item) => item.url == `https://swapi.dev/api/starships/${id}/`,
      )[0];
      if (!item) {
        navigate('/NotFound');
      }
      setState((prevState) => ({ ...prevState, selectedStarships: item }));
      setIsLoading((prevState) => ({ ...prevState, starships: false }));
    }
  }, [dispatch, navigate, starships, id]);
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

  // Logique de tri
  useEffect(() => {
    const selectPeople = () => {
      const selectedElements: People[] = [];
      state.selectedStarships?.pilots.forEach((url) => {
        const matchedElements = people.filter((item) => item.url === url);
        selectedElements.push(...matchedElements);
      });
      setState((prevState) => ({ ...prevState, selectedPeople: selectedElements }));
      setIsLoading((prevState) => ({ ...prevState, people: false }));
    };
    const selectFilms = () => {
      const selectedElements: Films[] = [];
      state.selectedStarships?.films.forEach((url) => {
        const matchedElements = films.filter((item) => item.url === url);
        selectedElements.push(...matchedElements);
      });
      setState((prevState) => ({ ...prevState, selectedFilms: selectedElements }));
      setIsLoading((prevState) => ({ ...prevState, films: false }));
    };

    selectPeople();
    selectFilms();
  }, [starships, people, state.selectedStarships, films]);

  return (
    <div className={style.app}>
      <Header />
      {isLoading.starships ? (
        <p>Loading...</p>
      ) : (
        state.selectedStarships && (
          <div className={style.container}>
            <h1>{state.selectedStarships.name}</h1>
            <p>Megalight per hour: {state.selectedStarships.MGLT}</p>
            <Displayer
              label="Pilots"
              isLoading={isLoading.people}
              selected={state.selectedPeople}
            />
            <Displayer label="Films" isLoading={isLoading.films} selected={state.selectedFilms} />
            <p>Cargo Capacity: {state.selectedStarships.cargo_capacity}</p>
            <p>Consumables: {state.selectedStarships.consumables}</p>
            <p>Cost In Credits: {state.selectedStarships.cost_in_credits}</p>
            <p>Crew: {state.selectedStarships.crew}</p>
            <p>Hyperdrive Rating: {state.selectedStarships.hyperdrive_rating}</p>
            <p>Length: {state.selectedStarships.length}</p>
            <p>Manufacturer : {state.selectedStarships.manufacturer}</p>
            <p>Max Atmosphering Speed : {state.selectedStarships.max_atmosphering_speed}</p>
            <p>Model : {state.selectedStarships.model}</p>
            <p>Passengers : {state.selectedStarships.passengers}</p>
            <p>Starship Class : {state.selectedStarships.starship_class}</p>
            <p className={style.subtext}>
              created the{' '}
              {new Date(state.selectedStarships.created).toLocaleDateString('en-GB', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
            <p className={style.subtext}>
              edited the{' '}
              {new Date(state.selectedStarships.edited).toLocaleDateString('en-GB', {
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
