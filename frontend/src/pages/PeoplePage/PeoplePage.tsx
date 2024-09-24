import { useEffect, useState } from 'react';

// Components
import CardPeople from '../../components/CardPeople/CardPeople';
import Header from '../../components/Header/Header';

// Css
import './PeoplePage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getAll } from '../../services/data.service';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { People } from '../../types/types';

type StateType = {
  filter: {
    name: string;
    birth_year: { date: string; operateur: string };
    eye_color: string;
    gender: string;
    hair_color: string;
    height: string;
    mass: string;
    skin_color: string;
    homeworld: string;
  };
  filteredItems: People[];
};

export default function PeoplePage() {
  const dispatch = useDispatch();
  const [state, setState] = useState<StateType>({
    filter: {
      name: '',
      birth_year: { date: '', operateur: '' },
      eye_color: '',
      gender: '',
      hair_color: '',
      height: '', // TODO mettre operateur
      mass: '', // TODO mettre operateur
      skin_color: '',
      homeworld: '',
    },
    filteredItems: [],
  });

  const handleChange = (champ: string, value: string) => {
    setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [champ]: value } }));
  };
  const handleBirthChange = (champ: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        release_date: {
          ...prevState.filter.birth_year,
          [champ]: value,
        },
      },
    }));
  };

  const logState = () => {
    console.log(state);
  };

  const people: People[] = useSelector(getPeople);
  console.log('People from state:', people);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('people');
        dispatch(setPeople(response));
      } catch (err) {
        console.log(err);
      }
    };
    const filterField = (
      field:
        | 'name'
        | 'eye_color'
        | 'gender'
        | 'hair_color'
        | 'height'
        | 'mass'
        | 'skin_color'
        | 'homeworld',
      array: People[],
    ): People[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };
    const filterDate = (array: People[]): People[] => {
      const date = Number(state.filter.birth_year);
      const operateur = state.filter.birth_year.operateur;
      if (date && operateur) {
        return array.filter((item) => {
          const release_date = Number(item.birth_year);
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
    const Filter = (array: People[]): void => {
      let filteredArray = filterDate(array);
      filteredArray = filterField('name', filteredArray);
      filteredArray = filterField('eye_color', filteredArray);
      filteredArray = filterField('gender', filteredArray);
      filteredArray = filterField('hair_color', filteredArray);
      filteredArray = filterField('height', filteredArray);
      filteredArray = filterField('mass', filteredArray);
      filteredArray = filterField('homeworld', filteredArray);
      filteredArray = filterField('skin_color', filteredArray);
      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (!people.length) {
      fetchItems();
    }
    Filter(people);
  }, [dispatch, state.filter, people]);

  return (
    <div className="app">
      <Header />
      <button onClick={() => logState()}>Log State</button>
      <div className="filterContainer">
        <div>
          <button onClick={() => handleChange('name', '')}>X</button>
          <label htmlFor="name">Name:</label>
          <input
            value={state.filter.name}
            type="text"
            id="name"
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('eye_color', '')}>X</button>
          <label htmlFor="eye_color">Eye Color:</label>
          <input
            value={state.filter.eye_color}
            type="text"
            id="eye_color"
            onChange={(e) => handleChange('eye_color', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('hair_color', '')}>X</button>
          <label htmlFor="hair_color">Hair Color:</label>
          <input
            value={state.filter.hair_color}
            type="text"
            id="hair_color"
            onChange={(e) => handleChange('hair_color', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleBirthChange('date', '')}>X</button>
          <label htmlFor="birth_year">Birth Year:</label>
          <select
            value={state.filter.birth_year.operateur}
            onChange={(e) => handleBirthChange('operateur', e.target.value)}
            name="operateur"
            id="birth_year"
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
            id="birth_year"
            value={state.filter.birth_year.date}
            onChange={(e) => handleBirthChange('date', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('homeworld', '')}>X</button>
          <label htmlFor="homeworld">Homeworld:</label>
          <input
            value={state.filter.homeworld}
            type="text"
            id="homeworld"
            onChange={(e) => handleChange('homeworld', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('gender', '')}>X</button>
          <label htmlFor="gender">Gender:</label>
          <select
            value={state.filter.gender}
            id="gender"
            onChange={(e) => handleChange('gender', e.target.value)}
          >
            <option value="n/a">n/a</option>
            <option value="female">female</option>
            <option value="male">male</option>
          </select>
        </div>
        <div>
          <button onClick={() => handleChange('mass', '')}>X</button>
          <label htmlFor="mass">Mass:</label>
          <input
            type="number"
            min={0}
            value={state.filter.mass}
            id="mass"
            onChange={(e) => handleChange('mass', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('height', '')}>X</button>
          <label htmlFor="height">Height:</label>
          <input
            type="number"
            min={0}
            value={state.filter.height}
            id="height"
            onChange={(e) => handleChange('height', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('skin_color', '')}>X</button>
          <label htmlFor="skin_color">Skin Color:</label>
          <input
            value={state.filter.skin_color}
            id="skin_color"
            onChange={(e) => handleChange('skin_color', e.target.value)}
          />
        </div>
      </div>
      <div className="container">
        <h1>The Peoples:</h1>
        {state.filteredItems.map((item, index) => (
          <CardPeople key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
