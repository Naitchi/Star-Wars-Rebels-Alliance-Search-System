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
      state.selectedStarships?.pilots.forEach((url) => {
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
  }, [dispatch, people, state.selectedStarships]);
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
      state.selectedStarships?.films.forEach((url) => {
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
  }, [dispatch, films, state.selectedStarships]);

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
