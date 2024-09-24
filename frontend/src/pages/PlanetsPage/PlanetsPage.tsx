import { useEffect, useState } from 'react';

// Components
import Header from '../../components/Header/Header';
import CardPlanets from '../../components/CardPlanets/CardPlanets';

// Css
import './PlanetsPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getPlanets, setPlanets } from '../../store/planetsSlice';

import { getAll } from '../../services/data.service';
import { Planet } from '../../types/types';

type StateType = {
  filter: {
    name: string;
    diameter: { diameter: string; operateur: string };
    gravity: { gravity: string; operateur: string };
    population: { population: string; operateur: string };
    climate: string;
    terrain: string;
  };
  filteredItems: Planet[];
};

export default function PlanetsPage() {
  const dispatch = useDispatch();
  const [state, setState] = useState<StateType>({
    filter: {
      name: '',
      diameter: { diameter: '', operateur: '<' },
      gravity: { gravity: '', operateur: '<' },
      population: { population: '', operateur: '<' },
      climate: '',
      terrain: '',
    },
    filteredItems: [],
  });

  const handleChange = (champ: string, value: string) => {
    setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [champ]: value } }));
  };
  const handleFilterChange = (
    champ: 'population' | 'gravity' | 'diameter',
    key: 'population' | 'gravity' | 'diameter' | 'operateur',
    value: string,
  ) => {
    setState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        [champ]: {
          ...prevState.filter[champ],
          [key]: value, // Mettre à jour la clé spécifiée sous le champ principal
        },
      },
    }));
  };
  // const logState = () => {
  //   console.log(state);
  // };

  const planets: Planet[] = useSelector(getPlanets);
  console.log('Planetfrom state:', planets);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('planets');
        dispatch(setPlanets(response));
      } catch (err) {
        console.log(err);
      }
    };

    const filterField = (field: 'terrain' | 'climate' | 'name', array: Planet[]): Planet[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };
    const filterByField = (
      array: Planet[],
      field: keyof Planet,
      operateur: string,
      value: number | string,
    ): Planet[] => {
      const numberValue = Number(value);
      if (!numberValue) {
        return array;
      }
      return array.filter((item) => {
        const itemValue = Number(item[field]);
        switch (operateur) {
          case '<':
            return itemValue < numberValue;
          case '>':
            return itemValue > numberValue;
          case '<=':
            return itemValue <= numberValue;
          case '>=':
            return itemValue >= numberValue;
          case '=':
            return itemValue == numberValue;
          default:
            return false;
        }
      });
    };
    const Filter = (array: Planet[]): void => {
      let filteredArray = filterByField(
        array,
        'diameter',
        state.filter.diameter.operateur,
        state.filter.diameter.diameter,
      );
      filteredArray = filterByField(
        filteredArray,
        'gravity',
        state.filter.gravity.operateur,
        state.filter.gravity.gravity,
      );
      filteredArray = filterByField(
        filteredArray,
        'population',
        state.filter.population.operateur,
        state.filter.population.population,
      );
      filteredArray = filterField('terrain', filteredArray);
      filteredArray = filterField('climate', filteredArray);
      filteredArray = filterField('name', filteredArray);
      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (!planets.length) {
      fetchItems();
    }
    Filter(planets);
  }, [dispatch, state.filter, planets]);

  return (
    <div className="app">
      <Header />
      {/* <button onClick={() => logState()}>Log State</button> */}
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
          <button onClick={() => handleFilterChange('population', 'population', '')}>X</button>
          <label htmlFor="population">Population:</label>
          <select
            value={state.filter.population.operateur}
            onChange={(e) => handleFilterChange('population', 'operateur', e.target.value)}
            name="operateur"
            id="population"
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
            id="population"
            min={0}
            value={state.filter.population.population}
            onChange={(e) => handleFilterChange('population', 'population', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('climate', '')}>X</button>
          <label htmlFor="climate">Climate:</label>
          <input
            value={state.filter.climate}
            type="text"
            id="climate"
            onChange={(e) => handleChange('climate', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('terrain', '')}>X</button>
          <label htmlFor="terrain">Terrain:</label>
          <input
            value={state.filter.terrain}
            type="text"
            id="terrain"
            onChange={(e) => handleChange('terrain', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('diameter', 'diameter', '')}>X</button>
          <label htmlFor="diameter">Diameter:</label>
          <select
            value={state.filter.diameter.operateur}
            onChange={(e) => handleFilterChange('diameter', 'operateur', e.target.value)}
            name="operateur"
            id="diameter"
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
            id="diameter"
            min={0}
            value={state.filter.diameter.diameter}
            onChange={(e) => handleFilterChange('diameter', 'diameter', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('gravity', 'gravity', '')}>X</button>
          <label htmlFor="gravity">Gravity:</label>
          <select
            value={state.filter.gravity.operateur}
            onChange={(e) => handleFilterChange('gravity', 'operateur', e.target.value)}
            name="operateur"
            id="gravity"
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
            id="gravity"
            min={0}
            value={state.filter.gravity.gravity}
            onChange={(e) => handleFilterChange('gravity', 'gravity', e.target.value)}
          />
        </div>
      </div>
      <div className="container">
        <h1>The Planets:</h1>
        {state.filteredItems.map((item, index) => (
          <CardPlanets key={index} item={item} />
        ))}
        {/* TODO Faire un affichage si aucun résultat */}
      </div>
    </div>
  );
}
