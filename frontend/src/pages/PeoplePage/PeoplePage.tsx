import { useEffect, useState } from 'react';

// Components
import Card from '../../components/Card/Card';
import Header from '../../components/Header/Header';
import OtherInputField from '../../components/OtherInputField/OtherInputField';
import SelectInputField from '../../components/SelectInputField/SelectInputField';
import TextInputField from '../../components/TextInputField/TextInputField';

// Css
import style from './PeoplePage.module.css';

import { useDispatch, useSelector } from 'react-redux';

import { getAll } from '../../services/data.service';
import { getPeople, setPeople } from '../../store/peopleSlice';
import { People } from '../../types/types';

type OrderBy = { field: 'name' | 'birth_year' | 'height' | 'mass' | null; order: boolean };

type StateType = {
  orderBy: OrderBy;
  filter: {
    name: string;
    birth_year: { birth_year: string; operateur: string };
    eye_color: string;
    gender: string;
    hair_color: string;
    height: { height?: number; operateur: string };
    mass: { mass?: number; operateur: string };
    skin_color: string;
    homeworld: string;
  };
  filteredItems: People[];
};

export default function PeoplePage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<StateType>({
    orderBy: { field: null, order: true },
    filter: {
      name: '',
      birth_year: { birth_year: '', operateur: '<' },
      eye_color: '',
      gender: '',
      hair_color: '',
      height: { height: undefined, operateur: '<' },
      mass: { mass: undefined, operateur: '<' },
      skin_color: '',
      homeworld: '',
    },
    filteredItems: [],
  });

  const handleTextChange = (champ: string, value: string) => {
    setState((prevState) => ({ ...prevState, filter: { ...prevState.filter, [champ]: value } }));
  };
  const handleOtherInputChange = (
    champ: 'birth_year' | 'height' | 'mass',
    key: 'birth_year' | 'height' | 'mass' | 'operateur',
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

  const people: People[] = useSelector(getPeople);

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
    const filterTextField = (
      field: 'name' | 'eye_color' | 'gender' | 'hair_color' | 'skin_color' | 'homeworld',
      array: People[],
    ): People[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };
    const filterByDateField = (
      field: 'birth_year',
      operateur: string,
      value: number | string | undefined,
      array: People[],
    ): People[] => {
      if (!value) {
        return array;
      }
      const numberValue = new Date(value).getTime();
      return array.filter((item) => {
        const itemValue = new Date(item[field]).getTime();
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
      field: 'mass' | 'height',
      operateur: string,
      value: number | string | undefined,
      array: People[],
    ): People[] => {
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
      array: People[],
      order: boolean,
      field: 'name' | 'birth_year' | 'height' | 'mass',
    ): People[] => {
      const sortedArray = [...array];
      if (order)
        return sortedArray.sort((a, b) => String(a[field]).localeCompare(String(b[field])));
      return sortedArray.sort((a, b) => String(b[field]).localeCompare(String(a[field])));
    };
    const Filter = (array: People[]): void => {
      const filter = state.filter;
      const orderBy = state.orderBy;

      let filteredArray = filterByDateField(
        'birth_year',
        filter.birth_year.operateur,
        filter.birth_year.birth_year,
        array,
      );
      filteredArray = filterByNumberField(
        'height',
        filter.height.operateur,
        filter.height.height,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'mass',
        filter.mass.operateur,
        filter.mass.mass,
        filteredArray,
      );

      filteredArray = filterTextField('name', filteredArray);
      filteredArray = filterTextField('eye_color', filteredArray);
      filteredArray = filterTextField('gender', filteredArray);
      filteredArray = filterTextField('hair_color', filteredArray);
      filteredArray = filterTextField('homeworld', filteredArray);
      filteredArray = filterTextField('skin_color', filteredArray);

      if (orderBy.field) filteredArray = sortArray(filteredArray, orderBy.order, orderBy.field);
      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (people.length) {
      Filter(people);
    }
  }, [state.orderBy, state.filter, people]);

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
          placeholder="Ex: Luke"
        />
        <TextInputField
          label="Eye Color"
          name="eye_color"
          value={state.filter.eye_color}
          onChange={(e) => handleTextChange('eye_color', e.target.value)}
          onClear={() => handleTextChange('eye_color', '')}
          placeholder="Ex: blue"
        />
        <TextInputField
          label="Hair Color"
          name="hair_color"
          value={state.filter.hair_color}
          onChange={(e) => handleTextChange('hair_color', e.target.value)}
          onClear={() => handleTextChange('hair_color', '')}
          placeholder="Ex: brown"
        />
        <SelectInputField
          label="Gender"
          name="gender"
          options={['n/a', 'female', 'male']}
          value={state.filter.gender}
          onChange={(e) => handleTextChange('gender', e.target.value)}
          onClear={() => handleTextChange('gender', '')}
        />
        <OtherInputField
          label="Mass"
          name="mass"
          operateur={state.filter.mass.operateur}
          value={state.filter.mass.mass}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'mass')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'mass', order: true });
          }}
          type="number"
          onOperateurChange={(e) => handleOtherInputChange('mass', 'operateur', e.target.value)}
          onDateChange={(e) => handleOtherInputChange('mass', 'mass', e.target.value)}
          onClear={() => handleOtherInputChange('mass', 'mass', '')}
        />
        <OtherInputField
          label="height"
          name="height"
          operateur={state.filter.height.operateur}
          value={state.filter.height.height}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'height')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'height', order: true });
          }}
          type="number"
          onOperateurChange={(e) => handleOtherInputChange('height', 'operateur', e.target.value)}
          onDateChange={(e) => handleOtherInputChange('height', 'height', e.target.value)}
          onClear={() => handleOtherInputChange('height', 'height', '')}
        />
        <TextInputField
          label="Skin Color"
          name="skin_color"
          value={state.filter.skin_color}
          onChange={(e) => handleTextChange('skin_color', e.target.value)}
          onClear={() => handleTextChange('skin_color', '')}
          placeholder="Ex: beige"
        />
      </div>
      <div className={style.container}>
        <h1>The Peoples:</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          state.filteredItems.map((item) => <Card key={item.name} item={item} />)
        )}
      </div>
    </div>
  );
}
