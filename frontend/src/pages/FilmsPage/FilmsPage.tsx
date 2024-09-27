import { useCallback, useEffect, useRef, useState } from 'react';

// Components
import Card from '../../components/Card/Card';
import Header from '../../components/Header/Header';
import OtherInputField from '../../components/OtherInputField/OtherInputField';
import TextInputField from '../../components/TextInputField/TextInputField';

// Css
import style from './FilmsPage.module.css';

// Store
import { useDispatch, useSelector } from 'react-redux';
import { getFilms, setFilms } from '../../store/filmsSlice';

// Service
import { getAll } from '../../services/data.service';

// Types
import { Films } from '../../types/types';
type OrderBy = { field: 'title' | 'episode_id' | 'release_date' | null; order: boolean };
type StateType = {
  orderBy: OrderBy;
  filter: {
    title: string;
    episode_id: { episode_id?: number; operateur: string };
    director: string;
    producer: string;
    release_date: { release_date?: string; operateur: string };
  };
  preDebounceFilter: {
    title: string;
    episode_id: { episode_id?: number; operateur: string };
    director: string;
    producer: string;
    release_date: { release_date?: string; operateur: string };
  };
  filteredItems: Films[];
};

// Composant affichant une catégorie en particulier
export default function FilmsPage() {
  const dispatch = useDispatch();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<StateType>({
    orderBy: { field: null, order: true },
    filter: {
      title: '',
      episode_id: { episode_id: undefined, operateur: '<' },
      director: '',
      producer: '',
      release_date: { release_date: undefined, operateur: '<' },
    },
    preDebounceFilter: {
      title: '',
      episode_id: { episode_id: undefined, operateur: '<' },
      director: '',
      producer: '',
      release_date: { release_date: undefined, operateur: '<' },
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
      field: 'release_date' | 'episode_id',
      key: 'release_date' | 'episode_id' | 'operateur',
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
    champ: 'release_date' | 'episode_id',
    key: 'release_date' | 'episode_id' | 'operateur',
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

  const films: Films[] = useSelector(getFilms);

  // Récupération des films
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
  // Filtrages des élèments selon les filtres selectionnés
  useEffect(() => {
    const filterTextField = (field: 'title' | 'director' | 'producer', array: Films[]): Films[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };
    const filterByDateField = (
      field: 'release_date',
      operateur: string,
      value: number | string | undefined,
      array: Films[],
    ): Films[] => {
      if (!value) {
        return array;
      }
      const numberValue: number = new Date(value).getTime();
      return array.filter((item) => {
        const itemValue: number = new Date(item[field]).getTime();
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
    const filterByNumberField = (
      field: keyof Films,
      operateur: string,
      value: number | string | undefined,
      array: Films[],
    ): Films[] => {
      if (!value) {
        return array;
      }
      const numberValue: number = Number(value);
      return array.filter((item) => {
        const itemValue: number = Number(item[field]);
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
      array: Films[],
      order: boolean,
      field: 'title' | 'episode_id' | 'release_date',
    ): Films[] => {
      const sortedArray = [...array];
      if (order)
        return sortedArray.sort((a, b) => String(a[field]).localeCompare(String(b[field])));
      return sortedArray.sort((a, b) => String(b[field]).localeCompare(String(a[field])));
    };
    const Filter = (array: Films[]): void => {
      const filter = state.filter;
      const orderBy = state.orderBy;

      let filteredArray = filterByDateField(
        'release_date',
        filter.release_date.operateur,
        filter.release_date.release_date,
        array,
      );
      filteredArray = filterByNumberField(
        'episode_id',
        filter.episode_id.operateur,
        filter.episode_id.episode_id,
        filteredArray,
      );
      filteredArray = filterTextField('director', filteredArray);
      filteredArray = filterTextField('title', filteredArray);
      filteredArray = filterTextField('producer', filteredArray);

      if (orderBy.field) filteredArray = sortArray(filteredArray, orderBy.order, orderBy.field);
      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (films.length) Filter(films);
  }, [state.filter, state.orderBy, films]);

  return (
    <div className={style.app}>
      <Header />
      <div className={style.filterContainer}>
        <TextInputField
          label="Title"
          name="title"
          value={state.preDebounceFilter.title}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'title')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'title', order: true });
          }}
          onChange={(e) => handleTextChange('title', e.target.value)}
          onClear={() => handleTextChange('title', '')}
          placeholder="Ex: A New Hope"
        />
        <OtherInputField
          label="Episode"
          name="episode_id"
          operateur={state.filter.episode_id.operateur}
          value={state.preDebounceFilter.episode_id.episode_id}
          type="number"
          max={6}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'episode_id')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'episode_id', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('episode_id', 'operateur', e.target.value)
          }
          onDateChange={(e) => handleOtherInputChange('episode_id', 'episode_id', e.target.value)}
          onClear={() => handleOtherInputChange('episode_id', 'episode_id', '')}
        />
        <OtherInputField
          label="Release Date"
          name="release_date"
          operateur={state.filter.release_date.operateur}
          value={state.preDebounceFilter.release_date.release_date}
          type="date"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'release_date')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'release_date', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('release_date', 'operateur', e.target.value)
          }
          onDateChange={(e) =>
            handleOtherInputChange('release_date', 'release_date', e.target.value)
          }
          onClear={() => handleOtherInputChange('release_date', 'release_date', '')}
        />
        <TextInputField
          label="Director"
          name="director"
          value={state.preDebounceFilter.director}
          onChange={(e) => handleTextChange('director', e.target.value)}
          onClear={() => handleTextChange('director', '')}
          placeholder="Ex: George"
        />
        <TextInputField
          label="Producer"
          name="producer"
          value={state.preDebounceFilter.producer}
          onChange={(e) => handleTextChange('producer', e.target.value)}
          onClear={() => handleTextChange('producer', '')}
          placeholder="Ex: Lucas"
        />
      </div>
      <div className={style.container}>
        <h1 className={style.title}>The Movies:</h1> {/* Ajout de la classe ici */}
        {isLoading ? (
          <p className={style.loadingText}>Loading...</p>
        ) : (
          state.filteredItems.map((item) => <Card key={item.title} item={item} />)
        )}
      </div>
    </div>
  );
}
