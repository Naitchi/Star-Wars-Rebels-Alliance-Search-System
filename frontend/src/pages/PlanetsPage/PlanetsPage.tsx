import { useCallback, useEffect, useRef, useState } from 'react';

// Components
import Card from '../../components/Card/Card';
import Header from '../../components/Header/Header';
import OtherInputField from '../../components/OtherInputField/OtherInputField';
import TextInputField from '../../components/TextInputField/TextInputField';

// Css
import style from './PlanetsPage.module.css';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getPlanets, setPlanets } from '../../store/planetsSlice';

// Service
import { getAll } from '../../services/data.service';

// Types
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
  preDebounceFilter: {
    name: string;
    diameter: { diameter?: number; operateur: string };
    gravity: { gravity?: number; operateur: string };
    population: { population?: number; operateur: string };
    climate: string;
    terrain: string;
  };
  filteredItems: Planet[];
};

// Composant affichant une catégorie en particulier
export default function PlanetsPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
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
    preDebounceFilter: {
      name: '',
      diameter: { diameter: undefined, operateur: '<' },
      gravity: { gravity: undefined, operateur: '<' },
      population: { population: undefined, operateur: '<' },
      climate: '',
      terrain: '',
    },
    filteredItems: [],
  });

  // Debounce pour les inputs text pour aléger l'application
  const debouncedSetTextValue = useCallback((field: string, value: string) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [field]: value } }));
    }, 300);
  }, []);
  // Récupération des filtres texte
  const handleTextChange = (field: string, value: string) => {
    setState((prevState) => ({
      ...prevState,
      preDebounceFilter: { ...prevState.preDebounceFilter, [field]: value },
    }));
    debouncedSetTextValue(field, value);
  };

  // Debounce pour les inputs Date/Number pour aléger l'application
  const debouncedSetOtherValue = useCallback(
    (
      field: 'population' | 'gravity' | 'diameter',
      key: 'population' | 'gravity' | 'diameter' | 'operateur',
      value: string,
    ) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          filter: {
            ...prevState.filter,
            [field]: {
              ...prevState.filter[field],
              [key]: value,
            },
          },
        }));
      }, 300);
    },
    [],
  );

  // Récupération des filtres Date/Number
  const handleOtherInputChange = (
    champ: 'population' | 'gravity' | 'diameter',
    key: 'population' | 'gravity' | 'diameter' | 'operateur',
    value: string,
  ) => {
    setState((prevState) => ({
      ...prevState,
      preDebounceFilter: {
        ...prevState.preDebounceFilter,
        [champ]: {
          ...prevState.preDebounceFilter[champ],
          [key]: value,
        },
      },
    }));
    debouncedSetOtherValue(champ, key, value);
  };
  // Récupération des filtres
  const handleOrderChange = (orderBy: OrderBy) => {
    setState((prevState) => ({
      ...prevState,
      orderBy: orderBy,
    }));
  };

  const planets: Planet[] = useSelector(getPlanets);

  // Récupération des planetes
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

  // Filtrages des élèments selon les filtres selectionnés
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
          value={state.preDebounceFilter.name}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'name')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'name', order: true });
          }}
          onChange={(e) => handleTextChange('name', e.target.value)}
          onClear={() => handleTextChange('name', '')}
          placeholder="Ex: Tato"
        />
        <OtherInputField
          label="Population"
          name="population"
          operateur={state.filter.population.operateur}
          value={state.preDebounceFilter.population.population}
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
          value={state.preDebounceFilter.climate}
          onChange={(e) => handleTextChange('climate', e.target.value)}
          onClear={() => handleTextChange('climate', '')}
          placeholder="Ex: temperate"
        />
        <TextInputField
          label="Terrain"
          name="terrain"
          value={state.preDebounceFilter.terrain}
          onChange={(e) => handleTextChange('terrain', e.target.value)}
          onClear={() => handleTextChange('terrain', '')}
          placeholder="Ex: verdant"
        />
        <OtherInputField
          label="Diameter"
          name="diameter"
          operateur={state.filter.diameter.operateur}
          value={state.preDebounceFilter.diameter.diameter}
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
          value={state.preDebounceFilter.gravity.gravity}
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
