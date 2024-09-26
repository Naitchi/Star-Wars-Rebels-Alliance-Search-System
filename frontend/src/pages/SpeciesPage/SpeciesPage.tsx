import { useEffect, useState } from 'react';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import OtherInputField from '../../components/OtherInputField/OtherInputField';
import TextInputField from '../../components/TextInputField/TextInputField';

// Css
import style from './SpeciesPage.module.css';

import { useDispatch, useSelector } from 'react-redux';

import { getSpecies, setSpecies } from '../../store/speciesSlice';

import { getAll } from '../../services/data.service';
import { Species } from '../../types/types';

type OrderBy = { field: 'name' | 'average_lifespan' | 'average_height' | null; order: boolean };

type StateType = {
  orderBy: OrderBy;
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
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<StateType>({
    orderBy: { field: null, order: true },
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

  const handleTextChange = (champ: string, value: string) => {
    setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [champ]: value } }));
  };
  const handleOtherInputChange = (
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

  const species: Species[] = useSelector(getSpecies);

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
    const filterTextField = (
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
      field: keyof Species,
      operateur: string,
      value: number | string | undefined,
      array: Species[],
    ): Species[] => {
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
      array: Species[],
      order: boolean,
      field: 'name' | 'average_lifespan' | 'average_height',
    ): Species[] => {
      const sortedArray = [...array];
      if (order)
        return sortedArray.sort((a, b) => String(a[field]).localeCompare(String(b[field])));
      return sortedArray.sort((a, b) => String(b[field]).localeCompare(String(a[field])));
    };
    const Filter = (array: Species[]): void => {
      const filter = state.filter;
      const orderBy = state.orderBy;

      let filteredArray = filterTextField('name', array);
      filteredArray = filterTextField('classification', filteredArray);
      filteredArray = filterTextField('designation', filteredArray);

      filteredArray = filterTextField('eye_colors', filteredArray);
      filteredArray = filterTextField('hair_colors', filteredArray);
      filteredArray = filterTextField('skin_colors', filteredArray);
      filteredArray = filterTextField('language', filteredArray);
      filteredArray = filterTextField('homeworld', filteredArray);
      filteredArray = filterByNumberField(
        'average_height',
        filter.average_height.operateur,
        filter.average_height.average_height,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'average_lifespan',
        filter.average_lifespan.operateur,
        filter.average_lifespan.average_lifespan,
        filteredArray,
      );
      if (orderBy.field) filteredArray = sortArray(filteredArray, orderBy.order, orderBy.field);

      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (species.length) Filter(species);
  }, [state.orderBy, state.filter, species]);

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
          placeholder="Ex: Human"
        />
        <TextInputField
          label="Classification"
          name="classification"
          value={state.filter.classification}
          onChange={(e) => handleTextChange('classification', e.target.value)}
          onClear={() => handleTextChange('classification', '')}
          placeholder="Ex: mammal"
        />
        <TextInputField
          label="Designation"
          name="designation"
          value={state.filter.designation}
          onChange={(e) => handleTextChange('designation', e.target.value)}
          onClear={() => handleTextChange('designation', '')}
          placeholder="Ex: sentient"
        />
        <TextInputField
          label="Eye Colors"
          name="eye_colors"
          value={state.filter.eye_colors}
          onChange={(e) => handleTextChange('eye_colors', e.target.value)}
          onClear={() => handleTextChange('eye_colors', '')}
          placeholder="Ex: blue"
        />
        <TextInputField
          label="Hair Colors"
          name="hair_colors"
          value={state.filter.hair_colors}
          onChange={(e) => handleTextChange('hair_colors', e.target.value)}
          onClear={() => handleTextChange('hair_colors', '')}
          placeholder="Ex: brown"
        />
        <TextInputField
          label="Skin Colors"
          name="skin_colors"
          value={state.filter.skin_colors}
          onChange={(e) => handleTextChange('skin_colors', e.target.value)}
          onClear={() => handleTextChange('skin_colors', '')}
          placeholder="Ex: white"
        />
        <TextInputField
          label="Language"
          name="language"
          value={state.filter.language}
          onChange={(e) => handleTextChange('language', e.target.value)}
          onClear={() => handleTextChange('language', '')}
          placeholder="Ex: Galactic Basic"
        />
        <OtherInputField
          label="Average Lifespan"
          name="average_lifespan"
          operateur={state.filter.average_lifespan.operateur}
          value={state.filter.average_lifespan.average_lifespan}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'average_lifespan')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'average_lifespan', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('average_lifespan', 'operateur', e.target.value)
          }
          onDateChange={(e) =>
            handleOtherInputChange('average_lifespan', 'average_lifespan', e.target.value)
          }
          onClear={() => handleOtherInputChange('average_lifespan', 'average_lifespan', '')}
        />
        <OtherInputField
          label="Average Height"
          name="average_height"
          operateur={state.filter.average_height.operateur}
          value={state.filter.average_height.average_height}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'average_height')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'average_height', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('average_height', 'operateur', e.target.value)
          }
          onDateChange={(e) =>
            handleOtherInputChange('average_height', 'average_height', e.target.value)
          }
          onClear={() => handleOtherInputChange('average_height', 'average_height', '')}
        />
      </div>
      <div className={style.container}>
        <h1>The Species:</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          state.filteredItems.map((item) => <Card key={item.name} item={item} />)
        )}
      </div>
    </div>
  );
}
