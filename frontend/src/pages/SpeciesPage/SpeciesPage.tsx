import { useEffect, useState } from 'react';

// Components
import Header from '../../components/Header/Header';
import CardSpecies from '../../components/CardSpecies/CardSpecies';

// Css
import './SpeciesPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getSpecies, setSpecies } from '../../store/speciesSlice';

import { getAll } from '../../services/data.service';
import { Species } from '../../types/types';

type StateType = {
  filter: {
    name: string;
    classification: string;
    designation: string;
    average_height: { average_height: string; operateur: string };
    average_lifespan: { average_lifespan: string; operateur: string };
    eye_colors: string;
    hair_colors: string;
    skin_colors: string;
    language: string;
    homeworld: string;
  };
  filteredItems: Species[];
};

export default function SpeciesPage() {
  const dispatch = useDispatch();
  const [state, setState] = useState<StateType>({
    filter: {
      name: '',
      classification: '',
      designation: '',
      average_height: { average_height: '', operateur: '<' },
      average_lifespan: { average_lifespan: '', operateur: '<' },
      eye_colors: '',
      hair_colors: '',
      skin_colors: '',
      language: '',
      homeworld: '',
    },
    filteredItems: [],
  });

  const handleChange = (champ: string, value: string) => {
    setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [champ]: value } }));
  };
  const handleFilterChange = (
    champ: 'average_height' | 'average_lifespan',
    key: 'average_height' | 'average_lifespan' | 'operateur',
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

  const logState = () => {
    console.log(state);
  };

  const species: Species[] = useSelector(getSpecies);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('species');
        dispatch(setSpecies(response));
      } catch (err) {
        console.log(err);
      }
    };

    const filterField = (
      field:
        | 'name'
        | 'classification'
        | 'designation'
        | 'eye_colors'
        | 'hair_colors'
        | 'skin_colors'
        | 'language'
        | 'homeworld',
      array: Species[],
    ): Species[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };
    const filterByNumberField = (
      array: Species[],
      field: keyof Species,
      operateur: string,
      value: number | string,
    ): Species[] => {
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
    const Filter = (array: Species[]): void => {
      console.log('1', array);

      let filteredArray = filterField('name', array);
      console.log('2', filteredArray);

      filteredArray = filterField('classification', filteredArray);
      console.log('3', filteredArray);

      filteredArray = filterField('designation', filteredArray);
      console.log('4', filteredArray);

      filteredArray = filterField('eye_colors', filteredArray);
      console.log('5', filteredArray);

      filteredArray = filterField('hair_colors', filteredArray);
      console.log('6', filteredArray);

      filteredArray = filterField('skin_colors', filteredArray);
      console.log('7', filteredArray);

      filteredArray = filterField('language', filteredArray);
      console.log('8', filteredArray);

      filteredArray = filterField('homeworld', filteredArray);
      console.log('9', filteredArray);

      filteredArray = filterByNumberField(
        filteredArray,
        'average_height',
        state.filter.average_height.operateur,
        state.filter.average_height.average_height,
      );
      console.log('10', filteredArray);

      filteredArray = filterByNumberField(
        filteredArray,
        'average_lifespan',
        state.filter.average_lifespan.operateur,
        state.filter.average_lifespan.average_lifespan,
      );
      console.log('11', filteredArray);

      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (!species.length) {
      fetchItems();
    }
    Filter(species);
  }, [dispatch, state.filter, species]);

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
          <button onClick={() => handleChange('classification', '')}>X</button>
          <label htmlFor="classification">Classification:</label>
          <input
            value={state.filter.classification}
            type="text"
            id="classification"
            onChange={(e) => handleChange('classification', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('designation', '')}>X</button>
          <label htmlFor="designation">Designation:</label>
          <input
            value={state.filter.designation}
            type="text"
            id="designation"
            onChange={(e) => handleChange('designation', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('eye_colors', '')}>X</button>
          <label htmlFor="eye_colors">Eye Colors:</label>
          <input
            value={state.filter.eye_colors}
            type="text"
            id="eye_colors"
            onChange={(e) => handleChange('eye_colors', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('hair_colors', '')}>X</button>
          <label htmlFor="hair_colors">Hair Colors:</label>
          <input
            value={state.filter.hair_colors}
            type="text"
            id="hair_colors"
            onChange={(e) => handleChange('hair_colors', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('skin_colors', '')}>X</button>
          <label htmlFor="skin_colors">Skin Colors:</label>
          <input
            value={state.filter.skin_colors}
            type="text"
            id="skin_colors"
            onChange={(e) => handleChange('skin_colors', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('language', '')}>X</button>
          <label htmlFor="language">Language:</label>
          <input
            value={state.filter.language}
            type="text"
            id="language"
            onChange={(e) => handleChange('language', e.target.value)}
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
          <button onClick={() => handleFilterChange('average_lifespan', 'average_lifespan', '')}>
            X
          </button>
          <label htmlFor="average_lifespan">Average Lifespan:</label>
          <select
            value={state.filter.average_lifespan.operateur}
            onChange={(e) => handleFilterChange('average_lifespan', 'operateur', e.target.value)}
            name="operateur"
            id="average_lifespan"
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
            id="average_lifespan"
            min={0}
            value={state.filter.average_lifespan.average_lifespan}
            onChange={(e) =>
              handleFilterChange('average_lifespan', 'average_lifespan', e.target.value)
            }
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('average_height', 'average_height', '')}>
            X
          </button>
          <label htmlFor="average_height">Average Height:</label>
          <select
            value={state.filter.average_height.operateur}
            onChange={(e) => handleFilterChange('average_height', 'operateur', e.target.value)}
            name="operateur"
            id="average_height"
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
            id="average_height"
            min={0}
            value={state.filter.average_height.average_height}
            onChange={(e) => handleFilterChange('average_height', 'average_height', e.target.value)}
          />
        </div>
      </div>
      <div className="container">
        <h1>The Species:</h1>
        {state.filteredItems.map((item, index) => (
          <CardSpecies key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
