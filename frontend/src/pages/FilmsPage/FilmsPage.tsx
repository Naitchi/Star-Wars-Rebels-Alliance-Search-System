import { useEffect, useState } from 'react';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/CardFilms/CardFilms';

// Css
import './FilmsPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getFilms, setFilms } from '../../store/filmsSlice';

import { getAll } from '../../services/data.service';
import { Films } from '../../types/types';

type StateType = {
  filter: {
    title: string | undefined;
    episode_id: { number: number | undefined; operateur: string };
    director: string | undefined;
    producer: string | undefined;
    release_date: { date: string | undefined; operateur: string };
  };
  filteredItems: Films[];
};

export default function FilmsPage() {
  const dispatch = useDispatch();
  const [state, setState] = useState<StateType>({
    filter: {
      title: '',
      episode_id: { number: undefined, operateur: '<' },
      director: '',
      producer: '',
      release_date: { date: undefined, operateur: '<' },
    },
    filteredItems: [],
  });

  const handleChange = (champ: string, value: string) => {
    setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [champ]: value } }));
  };
  const handleEpisodeChange = (champ: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        episode_id: {
          ...prevState.filter.episode_id,
          [champ]: value,
        },
      },
    }));
  };
  const handleReleaseChange = (champ: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        release_date: {
          ...prevState.filter.release_date,
          [champ]: value,
        },
      },
    }));
  };

  // const logState = () => {
  //   console.log(state);
  // };

  const films: Films[] = useSelector(getFilms);
  console.log('Films from state:', films);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('films');
        dispatch(setFilms(response));
      } catch (err) {
        console.log(err);
      }
    };
    const filterTitle = (array: Films[]): Films[] => {
      if (state.filter.title) {
        const regex = new RegExp(state.filter.title, 'i');
        return array.filter((item) => regex.test(item.title));
      }
      return array;
    };
    const filterDirector = (array: Films[]): Films[] => {
      if (state.filter.director) {
        const regex = new RegExp(state.filter.director, 'i');
        return array.filter((item) => regex.test(item.director));
      }
      return array;
    };
    const filterProducer = (array: Films[]): Films[] => {
      if (state.filter.producer) {
        const regex = new RegExp(state.filter.producer, 'i');
        return array.filter((item) => regex.test(item.producer));
      }
      return array;
    };
    const filterEpisode = (array: Films[]): Films[] => {
      const { operateur, number } = state.filter.episode_id;
      if (number && operateur) {
        return array.filter((item) => {
          switch (operateur) {
            case '<':
              return item.episode_id < number;
            case '>':
              return item.episode_id > number;
            case '<=':
              return item.episode_id <= number;
            case '>=':
              return item.episode_id >= number;
            case '=':
              return item.episode_id === number;
            default:
              return false;
          }
        });
      }
      return array;
    };
    const filterDate = (array: Films[]): Films[] => {
      const date = Number(state.filter.release_date);
      const operateur = state.filter.release_date.operateur;
      if (date && operateur) {
        return array.filter((item) => {
          const release_date = Number(item.release_date);
          switch (operateur) {
            case '<':
              return release_date < date;
            case '>':
              return release_date > date;
            case '<=':
              return release_date <= date;
            case '>=':
              return release_date >= date;
            case '=':
              return release_date === date;
            default:
              return false;
          }
        });
      }
      return array;
    };
    const Filter = (array: Films[]): void => {
      let filteredArray = filterDate(array);
      filteredArray = filterDirector(filteredArray);
      filteredArray = filterEpisode(filteredArray);
      filteredArray = filterProducer(filteredArray);
      filteredArray = filterTitle(filteredArray);
      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (!films.length) {
      fetchItems();
    }
    Filter(films);
  }, [dispatch, state.filter, films]);

  return (
    <div className="app">
      <Header />
      {/* <button onClick={() => logState()}>Log State</button> */}
      <div className="filterContainer">
        <div>
          <button onClick={() => handleChange('title', '')}>X</button>
          <label htmlFor="title">Title:</label>
          <input
            value={state.filter.title}
            type="text"
            id="title"
            onChange={(e) => handleChange('title', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleEpisodeChange('number', '')}>X</button>
          <label htmlFor="episode">Episode:</label>
          <select
            value={state.filter.episode_id.operateur}
            onChange={(e) => handleEpisodeChange('operateur', e.target.value)}
            name="operateur"
            id="episode"
          >
            <option selected value="<">
              &lt;
            </option>
            <option value=">">&gt;</option>
            <option value="=">=</option>
            <option value="<=">&lt;=</option>
            <option value=">=">&gt;=</option>
          </select>
          <input
            type="number"
            id="episode"
            max={6}
            min={1}
            value={state.filter.episode_id.number}
            onChange={(e) => handleEpisodeChange('number', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('director', '')}>X</button>
          <label htmlFor="director">Director:</label>
          <input
            value={state.filter.director}
            type="text"
            id="director"
            onChange={(e) => handleChange('director', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('producer', '')}>X</button>
          <label htmlFor="producer">Producer:</label>
          <input
            value={state.filter.producer}
            type="text"
            id="producer"
            onChange={(e) => handleChange('producer', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleReleaseChange('date', '')}>X</button>
          <label htmlFor="release_date">Release Date:</label>
          <select
            value={state.filter.release_date.operateur}
            onChange={(e) => handleReleaseChange('operateur', e.target.value)}
            name="operateur"
            id="release_date"
          >
            <option selected value="<">
              &lt;
            </option>
            <option value=">">&gt;</option>
            <option value="=">=</option>
            <option value="<=">&lt;=</option>
            <option value=">=">&gt;=</option>
          </select>
          <input
            type="date"
            id="release_date"
            value={state.filter.release_date.date}
            onChange={(e) => handleReleaseChange('date', e.target.value)}
          />
        </div>
      </div>
      <div className="container">
        <h1>The Movies:</h1>
        {state.filteredItems.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
