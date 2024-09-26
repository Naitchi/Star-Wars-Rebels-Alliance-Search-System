import { useEffect, useState } from 'react';

// Components
import Card from '../../components/Card/Card';
import Header from '../../components/Header/Header';

// Css
import style from './AllCategories.module.css';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getFilms, setFilms } from '../../store/filmsSlice';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { getPlanets, setPlanets } from '../../store/planetsSlice';
import { getSpecies, setSpecies } from '../../store/speciesSlice';
import { getStarship, setStarship } from '../../store/starshipSlice';
import { getVehicles, setVehicles } from '../../store/vehiclesSlice';

// Service
import { getAll } from '../../services/data.service';

//Types
import { All, Films, People, Planet, Species, Starship, Vehicle } from '../../types/types';

type StateType = { items: All[]; filteredItems: All[]; search: string; orderBy: 1 | 2 | 3 };

export default function AllCategories() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<StateType>({
    items: [],
    filteredItems: [],
    search: '',
    orderBy: 1,
  });

  const planets: Planet[] = useSelector(getPlanets);
  const vehicle: Vehicle[] = useSelector(getVehicles);
  const starship: Starship[] = useSelector(getStarship);
  const films: Films[] = useSelector(getFilms);
  const people: People[] = useSelector(getPeople);
  const species: Species[] = useSelector(getSpecies);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      items: [...planets, ...vehicle, ...starship, ...films, ...people, ...species],
    }));
  }, [dispatch, vehicle, starship, planets, films, people, species]);
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await getAll('films');
        dispatch(setFilms(response as Films[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    if (!films.length) fetchItems();
    else setIsLoading(false);
  }, [dispatch, films]);
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await getAll('planets');
        dispatch(setPlanets(response as Planet[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    if (!planets.length) fetchItems();
    else setIsLoading(false);
  }, [dispatch, planets]);
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await getAll('vehicles');
        dispatch(setVehicles(response as Vehicle[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    if (!vehicle.length) fetchItems();
    else setIsLoading(false);
  }, [dispatch, vehicle]);
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await getAll('starships');
        dispatch(setStarship(response as Starship[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    if (!starship.length) fetchItems();
    else setIsLoading(false);
  }, [dispatch, starship]);
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await getAll('people');
        dispatch(setPeople(response as People[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };

    if (!people.length) fetchItems();
    else setIsLoading(false);
  }, [dispatch, people]);
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await getAll('species');
        dispatch(setSpecies(response as Species[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };
    if (!species.length) fetchItems();
    else setIsLoading(false);
  }, [dispatch, species]);
  useEffect(() => {
    const filterTextField = (array: All[]): All[] => {
      const search = state.search;
      if (search) {
        const regex = new RegExp(search, 'i');
        return array.filter((item) => {
          if (item.name) return regex.test(item.name);
          if (item.title) return regex.test(item.title);
        });
      }
      return array;
    };
    const sortArray = (array: All[]): All[] => {
      const orderBy: 1 | 2 | 3 = state.orderBy;
      const sortedArray = [...array];
      if (orderBy === 2)
        return sortedArray.sort((a, b) => {
          const aValue = a.name ?? a.title;
          const bValue = b.name ?? b.title;
          if (aValue && bValue) return aValue.localeCompare(bValue);
          return aValue ? -1 : 1;
        });
      if (orderBy === 3)
        return sortedArray.sort((a, b) => {
          const aValue = a.name ?? a.title;
          const bValue = b.name ?? b.title;
          if (aValue && bValue) return bValue.localeCompare(aValue);
          return aValue ? -1 : 1;
        });
      return array;
    };
    const Filter = (array: All[]): void => {
      const filteredArray = filterTextField(array);
      setState((prevState) => ({
        ...prevState,
        filteredItems: sortArray(filteredArray),
      }));
    };
    if (state.items.length) Filter(state.items);
  }, [state.orderBy, state.search, state.items]);

  const handleSearchChange = (value: string) => {
    setState((prevState) => ({
      ...prevState,
      search: value,
    }));
  };
  const toggleOrder = () => {
    setState((prevState) => ({
      ...prevState,
      orderBy: prevState.orderBy === 2 ? 3 : 2,
    }));
  };

  return (
    <div className={style.app}>
      <Header />
      <div className={style.container}>
        <div className={style.headerContainer}>
          <h1 className={style.title}>All the accessible data :</h1>
          <div className={style.controls}>
            <button className={style.orderButton} onClick={toggleOrder}>
              {state.orderBy === 2 ? 'A-Z' : 'Z-A'}
            </button>
            <div className={style.searchContainer}>
              <input
                type="text"
                name="Search"
                id="Search"
                className={style.searchInput}
                placeholder="Look for something in particular"
                value={state.search}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <button className={style.clearButton} onClick={() => handleSearchChange('')}>
                X
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <p className={style.loadingText}>Chargement...</p>
        ) : (
          state.filteredItems.map((item) => <Card key={item.name ?? item.title} item={item} />)
        )}
      </div>
    </div>
  );
}