import { useEffect, useState } from 'react';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import OtherInputField from '../../components/OtherInputField/OtherInputField';
import TextInputField from '../../components/TextInputField/TextInputField';

// Css
import style from './PlanetsPage.module.css';

import { useDispatch, useSelector } from 'react-redux';

import { getPlanets, setPlanets } from '../../store/planetsSlice';

import { getAll } from '../../services/data.service';
import { Planet } from '../../types/types';

type OrderBy = { field: 'name' | 'diameter' | 'gravity' | 'population' | null; order: boolean };

type StateType = {
  orderBy: OrderBy;
  filter: {
    name: string;
    diameter: { diameter?: number; operateur: string };
    gravity: { gravity?: number; operateur: string };
    population: { population?: number; operateur: string };
    climate: string;
    terrain: string;
  };
  filteredItems: Planet[];
};

export default function PlanetsPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<StateType>({
    orderBy: { field: null, order: true },
    filter: {
      name: '',
      diameter: { diameter: undefined, operateur: '<' },
      gravity: { gravity: undefined, operateur: '<' },
      population: { population: undefined, operateur: '<' },
      climate: '',
      terrain: '',
    },
    filteredItems: [],
  });

  const handleTextChange = (champ: string, value: string) => {
    setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [champ]: value } }));
  };
  const handleOtherInputChange = (
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
          [key]: value,
        },
      },
    }));
  };
  const handleOrderChange = (orderBy: OrderBy) => {
    setState((prevState) => ({
      ...prevState,
      orderBy: orderBy,
    }));
  };

  const planets: Planet[] = useSelector(getPlanets);

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
    const filterTextField = (field: 'terrain' | 'climate' | 'name', array: Planet[]): Planet[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };

    const filterByNumberField = (
      field: keyof Planet,
      operateur: string,
      value: number | string | undefined,
      array: Planet[],
    ): Planet[] => {
      if (!value) {
        return array;
      }
      const numberValue = Number(value);
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
    const sortArray = (
      array: Planet[],
      order: boolean,
      field: 'name' | 'diameter' | 'gravity' | 'population',
    ): Planet[] => {
      const sortedArray = [...array];
      if (order)
        return sortedArray.sort((a, b) => String(a[field]).localeCompare(String(b[field])));
      return sortedArray.sort((a, b) => String(b[field]).localeCompare(String(a[field])));
    };
    const Filter = (array: Planet[]): void => {
      const filter = state.filter;
      const orderBy = state.orderBy;

      let filteredArray = filterByNumberField(
        'diameter',
        filter.diameter.operateur,
        filter.diameter.diameter,
        array,
      );
      filteredArray = filterByNumberField(
        'gravity',
        filter.gravity.operateur,
        filter.gravity.gravity,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'population',
        filter.population.operateur,
        filter.population.population,
        filteredArray,
      );
      filteredArray = filterTextField('terrain', filteredArray);
      filteredArray = filterTextField('climate', filteredArray);
      filteredArray = filterTextField('name', filteredArray);

      if (orderBy.field) filteredArray = sortArray(filteredArray, orderBy.order, orderBy.field);

      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };
    if (planets.length) Filter(planets);
  }, [state.orderBy, state.filter, planets]);

  return (
    <div className={style.app}>
      <Header />
      <div className={style.filterContainer}>
        <TextInputField
          label="Name"
          name="name"
          value={state.filter.name}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'name')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'name', order: true });
          }}
          onChange={(e) => handleTextChange('name', e.target.value)}
          onClear={() => handleTextChange('name', '')}
          placeholder="Ex: Tatouine"
        />
        <OtherInputField
          label="Population"
          name="population"
          operateur={state.filter.population.operateur}
          value={state.filter.population.population}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'population')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'population', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('population', 'operateur', e.target.value)
          }
          onDateChange={(e) => handleOtherInputChange('population', 'population', e.target.value)}
          onClear={() => handleOtherInputChange('population', 'population', '')}
        />
        <TextInputField
          label="Climate"
          name="climate"
          value={state.filter.climate}
          onChange={(e) => handleTextChange('climate', e.target.value)}
          onClear={() => handleTextChange('climate', '')}
          placeholder="Ex: rainy"
        />
        <TextInputField
          label="Terrain"
          name="terrain"
          value={state.filter.terrain}
          onChange={(e) => handleTextChange('terrain', e.target.value)}
          onClear={() => handleTextChange('terrain', '')}
          placeholder="Ex: mud"
        />
        <OtherInputField
          label="Diameter"
          name="diameter"
          operateur={state.filter.diameter.operateur}
          value={state.filter.diameter.diameter}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'diameter')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'diameter', order: true });
          }}
          onOperateurChange={(e) => handleOtherInputChange('diameter', 'operateur', e.target.value)}
          onDateChange={(e) => handleOtherInputChange('diameter', 'diameter', e.target.value)}
          onClear={() => handleOtherInputChange('diameter', 'diameter', '')}
        />
        <OtherInputField
          label="Gravity"
          name="gravity"
          operateur={state.filter.gravity.operateur}
          value={state.filter.gravity.gravity}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'gravity')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'gravity', order: true });
          }}
          onOperateurChange={(e) => handleOtherInputChange('gravity', 'operateur', e.target.value)}
          onDateChange={(e) => handleOtherInputChange('gravity', 'gravity', e.target.value)}
          onClear={() => handleOtherInputChange('gravity', 'gravity', '')}
        />
      </div>
      <div className={style.container}>
        <h1>The Planets:</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          state.filteredItems.map((item) => <Card key={item.name} item={item} />)
        )}
      </div>
    </div>
  );
}
