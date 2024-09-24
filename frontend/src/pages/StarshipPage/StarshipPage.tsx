import { useEffect, useState } from 'react';

// Components
import Header from '../../components/Header/Header';
import CardStarship from '../../components/CardStarship/CardStarship';

// Css
import './StarshipPage.css';

import { useDispatch, useSelector } from 'react-redux';

import { getStarship, setStarship } from '../../store/starshipSlice';

import { getAll } from '../../services/data.service';
import { Starship } from '../../types/types';

type StateType = {
  filter: {
    name: string;
    model: string;
    starship_class: string;
    manufacturer: string;
    cost_in_credits: { cost_in_credits: string; operateur: string };
    length: { length: string; operateur: string };
    crew: string;
    passengers: { passengers: string; operateur: string };
    max_atmosphering_speed: { max_atmosphering_speed: string; operateur: string };
    hyperdrive_rating: { hyperdrive_rating: string; operateur: string };
    MGLT: { MGLT: string; operateur: string };
    cargo_capacity: { cargo_capacity: string; operateur: string };
    consumables: { consumables: string; operateur: string };
  };
  filteredItems: Starship[];
};

export default function StarshipPage() {
  const dispatch = useDispatch();
  const [state, setState] = useState<StateType>({
    filter: {
      name: '',
      model: '',
      starship_class: '',
      manufacturer: '',
      cost_in_credits: { cost_in_credits: '', operateur: '<' },
      length: { length: '', operateur: '<' },
      crew: '',
      passengers: { passengers: '', operateur: '<' },
      max_atmosphering_speed: { max_atmosphering_speed: '', operateur: '<' },
      hyperdrive_rating: { hyperdrive_rating: '', operateur: '<' },
      MGLT: { MGLT: '', operateur: '<' },
      cargo_capacity: { cargo_capacity: '', operateur: '<' },
      consumables: { consumables: '', operateur: '<' },
    },
    filteredItems: [],
  });

  const handleChange = (champ: string, value: string) => {
    setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [champ]: value } }));
  };
  type objet =
    | 'cost_in_credits'
    | 'length'
    | 'passengers'
    | 'max_atmosphering_speed'
    | 'hyperdrive_rating'
    | 'MGLT'
    | 'cargo_capacity'
    | 'consumables'; // TODO refaire ça marche pas

  type field = 'name' | 'model' | 'starship_class' | 'manufacturer' | 'crew';

  const handleFilterChange = (champ: objet, key: objet | 'operateur', value: string) => {
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

  const starships: Starship[] = useSelector(getStarship);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getAll('starship');
        dispatch(setStarship(response));
      } catch (err) {
        console.log(err);
      }
    };

    const filterField = (field: field, array: Starship[]): Starship[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };
    const filterByNumberField = (
      array: Starship[],
      field: keyof Starship,
      operateur: string,
      value: number | string,
    ): Starship[] => {
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
    const Filter = (array: Starship[]): void => {
      let filteredArray = filterField('name', array);
      filteredArray = filterField('model', filteredArray);
      filteredArray = filterField('starship_class', filteredArray);
      filteredArray = filterField('manufacturer', filteredArray);
      filteredArray = filterField('crew', filteredArray); // TODO refaire un filter pour le crew et on split les -
      filteredArray = filterByNumberField(
        filteredArray,
        'cost_in_credits',
        state.filter.cost_in_credits.operateur,
        state.filter.cost_in_credits.cost_in_credits,
      );
      filteredArray = filterByNumberField(
        filteredArray,
        'length',
        state.filter.length.operateur,
        state.filter.length.length,
      );
      filteredArray = filterByNumberField(
        filteredArray,
        'passengers',
        state.filter.passengers.operateur,
        state.filter.passengers.passengers,
      );
      filteredArray = filterByNumberField(
        filteredArray,
        'max_atmosphering_speed',
        state.filter.max_atmosphering_speed.operateur,
        state.filter.max_atmosphering_speed.max_atmosphering_speed,
      );
      filteredArray = filterByNumberField(
        filteredArray,
        'hyperdrive_rating',
        state.filter.hyperdrive_rating.operateur,
        state.filter.hyperdrive_rating.hyperdrive_rating,
      );
      filteredArray = filterByNumberField(
        filteredArray,
        'MGLT',
        state.filter.MGLT.operateur,
        state.filter.MGLT.MGLT,
      );
      filteredArray = filterByNumberField(
        filteredArray,
        'cargo_capacity',
        state.filter.cargo_capacity.operateur,
        state.filter.cargo_capacity.cargo_capacity,
      );
      filteredArray = filterByNumberField(
        filteredArray,
        'consumables',
        state.filter.consumables.operateur,
        state.filter.consumables.consumables,
      );
      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (!starships.length) {
      fetchItems();
    }
    Filter(starships);
  }, [dispatch, state.filter, starships]);

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
          <button onClick={() => handleChange('model', '')}>X</button>
          <label htmlFor="model">Model:</label>
          <input
            value={state.filter.model}
            type="text"
            id="model"
            onChange={(e) => handleChange('model', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('starship_class', '')}>X</button>
          <label htmlFor="starship_class">Starship Class:</label>
          <input
            value={state.filter.starship_class}
            type="text"
            id="starship_class"
            onChange={(e) => handleChange('starship_class', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('manufacturer', '')}>X</button>
          <label htmlFor="manufacturer">Manufacturer:</label>
          <input
            value={state.filter.manufacturer}
            type="text"
            id="manufacturer"
            onChange={(e) => handleChange('manufacturer', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleChange('crew', '')}>X</button>
          <label htmlFor="crew">Crew:</label>
          <input
            value={state.filter.crew}
            type="text"
            id="crew"
            onChange={(e) => handleChange('crew', e.target.value)}
          />
        </div>

        <div>
          <button onClick={() => handleFilterChange('cost_in_credits', 'cost_in_credits', '')}>
            X
          </button>
          <label htmlFor="cost_in_credits">Cost in credits:</label>
          <select
            value={state.filter.cost_in_credits.operateur}
            onChange={(e) => handleFilterChange('cost_in_credits', 'operateur', e.target.value)}
            name="operateur"
            id="cost_in_credits"
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
            id="cost_in_credits"
            min={0}
            value={state.filter.cost_in_credits.cost_in_credits}
            onChange={(e) =>
              handleFilterChange('cost_in_credits', 'cost_in_credits', e.target.value)
            }
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('passengers', 'passengers', '')}>X</button>
          <label htmlFor="passengers">Passengers</label>
          <select
            value={state.filter.passengers.operateur}
            onChange={(e) => handleFilterChange('passengers', 'operateur', e.target.value)}
            name="operateur"
            id="passengers"
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
            id="passengers"
            min={0}
            value={state.filter.passengers.passengers}
            onChange={(e) => handleFilterChange('passengers', 'passengers', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('length', 'length', '')}>X</button>
          <label htmlFor="length">Length:</label>
          <select
            value={state.filter.length.operateur}
            onChange={(e) => handleFilterChange('length', 'operateur', e.target.value)}
            name="operateur"
            id="length"
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
            id="length"
            min={0}
            value={state.filter.length.length}
            onChange={(e) => handleFilterChange('length', 'length', e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={() =>
              handleFilterChange('max_atmosphering_speed', 'max_atmosphering_speed', '')
            }
          >
            X
          </button>
          <label htmlFor="max_atmosphering_speed">Max Atmosphering Speed:</label>
          <select
            value={state.filter.max_atmosphering_speed.operateur}
            onChange={(e) =>
              handleFilterChange('max_atmosphering_speed', 'operateur', e.target.value)
            }
            name="operateur"
            id="max_atmosphering_speed"
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
            id="max_atmosphering_speed"
            min={0}
            value={state.filter.max_atmosphering_speed.max_atmosphering_speed}
            onChange={(e) =>
              handleFilterChange('max_atmosphering_speed', 'max_atmosphering_speed', e.target.value)
            }
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('hyperdrive_rating', 'hyperdrive_rating', '')}>
            X
          </button>
          <label htmlFor="hyperdrive_rating">Hyperdrive rating:</label>
          <select
            value={state.filter.hyperdrive_rating.operateur}
            onChange={(e) => handleFilterChange('hyperdrive_rating', 'operateur', e.target.value)}
            name="operateur"
            id="hyperdrive_rating"
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
            id="hyperdrive_rating"
            min={0}
            value={state.filter.hyperdrive_rating.hyperdrive_rating}
            onChange={(e) =>
              handleFilterChange('hyperdrive_rating', 'hyperdrive_rating', e.target.value)
            }
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('MGLT', 'MGLT', '')}>X</button>
          <label htmlFor="MGLT">Megalight per hour:</label>
          <select
            value={state.filter.MGLT.operateur}
            onChange={(e) => handleFilterChange('MGLT', 'operateur', e.target.value)}
            name="operateur"
            id="MGLT"
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
            id="MGLT"
            min={0}
            value={state.filter.MGLT.MGLT}
            onChange={(e) => handleFilterChange('MGLT', 'MGLT', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('cargo_capacity', 'cargo_capacity', '')}>
            X
          </button>
          <label htmlFor="cargo_capacity">Cargo capacity:</label>
          <select
            value={state.filter.cargo_capacity.operateur}
            onChange={(e) => handleFilterChange('cargo_capacity', 'operateur', e.target.value)}
            name="operateur"
            id="cargo_capacity"
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
            id="cargo_capacity"
            min={0}
            value={state.filter.cargo_capacity.cargo_capacity}
            onChange={(e) => handleFilterChange('cargo_capacity', 'cargo_capacity', e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => handleFilterChange('consumables', 'consumables', '')}>X</button>
          <label htmlFor="consumables">Consumables:</label>
          <select
            value={state.filter.consumables.operateur}
            onChange={(e) => handleFilterChange('consumables', 'operateur', e.target.value)}
            name="operateur"
            id="consumables"
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
            id="consumables"
            min={0}
            value={state.filter.consumables.consumables}
            onChange={(e) => handleFilterChange('consumables', 'consumables', e.target.value)}
          />
        </div>
      </div>
      <div className="container">
        <h1>The Starships:</h1>
        {state.filteredItems.map((item, index) => (
          <CardStarship key={index} item={item} />
        ))}
      </div>
    </div>
  );
}
