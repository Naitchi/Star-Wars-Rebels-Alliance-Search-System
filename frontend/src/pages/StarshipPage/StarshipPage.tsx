import { useEffect, useState } from 'react';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import OtherInputField from '../../components/OtherInputField/OtherInputField';
import TextInputField from '../../components/TextInputField/TextInputField';

// Css
import style from './StarshipPage.module.css';

import { useDispatch, useSelector } from 'react-redux';

import { getStarship, setStarship } from '../../store/starshipSlice';

import { getAll } from '../../services/data.service';
import { Starship } from '../../types/types';

type OrderBy = {
  field:
    | 'name'
    | 'starship_class'
    | 'cost_in_credits'
    | 'length'
    | 'crew'
    | 'passengers'
    | 'max_atmosphering_speed'
    | 'hyperdrive_rating'
    | 'MGLT'
    | 'cargo_capacity'
    | null;
  order: boolean;
};

type StateType = {
  orderBy: OrderBy;
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
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<StateType>({
    orderBy: { field: null, order: true },
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

  const handleTextChange = (champ: string, value: string) => {
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

  const handleOtherInputChange = (champ: objet, key: objet | 'operateur', value: string) => {
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
  const starships: Starship[] = useSelector(getStarship);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);

      try {
        const response = await getAll('starships');
        dispatch(setStarship(response as Starship[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };

    if (!starships.length) fetchItems();
    else setIsLoading(false);
  }, [dispatch, starships]);

  useEffect(() => {
    const filterTextField = (field: field, array: Starship[]): Starship[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };
    const filterByNumberField = (
      field: keyof Starship,
      operateur: string,
      value: number | string | undefined,
      array: Starship[],
    ): Starship[] => {
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
      array: Starship[],
      order: boolean,
      field:
        | 'name'
        | 'starship_class'
        | 'cost_in_credits'
        | 'length'
        | 'crew'
        | 'passengers'
        | 'max_atmosphering_speed'
        | 'hyperdrive_rating'
        | 'MGLT'
        | 'cargo_capacity',
    ): Starship[] => {
      const sortedArray = [...array];
      if (order)
        return sortedArray.sort((a, b) => String(a[field]).localeCompare(String(b[field])));
      return sortedArray.sort((a, b) => String(b[field]).localeCompare(String(a[field])));
    };
    const Filter = (array: Starship[]): void => {
      const filter = state.filter;
      const orderBy = state.orderBy;

      let filteredArray = filterTextField('name', array);
      filteredArray = filterTextField('model', filteredArray);
      filteredArray = filterTextField('starship_class', filteredArray);
      filteredArray = filterTextField('manufacturer', filteredArray);
      filteredArray = filterTextField('crew', filteredArray); // TODO refaire un filter pour le crew et on split les -
      filteredArray = filterByNumberField(
        'cost_in_credits',
        filter.cost_in_credits.operateur,
        filter.cost_in_credits.cost_in_credits,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'length',
        filter.length.operateur,
        filter.length.length,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'passengers',
        filter.passengers.operateur,
        filter.passengers.passengers,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'max_atmosphering_speed',
        filter.max_atmosphering_speed.operateur,
        filter.max_atmosphering_speed.max_atmosphering_speed,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'hyperdrive_rating',
        filter.hyperdrive_rating.operateur,
        filter.hyperdrive_rating.hyperdrive_rating,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'MGLT',
        filter.MGLT.operateur,
        filter.MGLT.MGLT,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'cargo_capacity',
        filter.cargo_capacity.operateur,
        filter.cargo_capacity.cargo_capacity,
        filteredArray,
      );
      filteredArray = filterByNumberField(
        'consumables',
        filter.consumables.operateur,
        filter.consumables.consumables,
        filteredArray,
      );

      if (orderBy.field) filteredArray = sortArray(filteredArray, orderBy.order, orderBy.field);

      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (starships.length) Filter(starships);
  }, [state.orderBy, state.filter, starships]);

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
          placeholder="Ex: Death star"
        />
        <TextInputField
          label="Model"
          name="model"
          value={state.filter.model}
          onChange={(e) => handleTextChange('model', e.target.value)}
          onClear={() => handleTextChange('model', '')}
          placeholder="Ex: " // TODO faire un truc mieux
        />
        <TextInputField
          label="Starship Class"
          name="starship_class"
          value={state.filter.starship_class}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'starship_class')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'starship_class', order: true });
          }}
          onChange={(e) => handleTextChange('starship_class', e.target.value)}
          onClear={() => handleTextChange('starship_class', '')}
          placeholder="Ex: " // TODO faire un truc mieux
        />
        <TextInputField
          label="Manufacturer"
          name="manufacturer"
          value={state.filter.manufacturer}
          onChange={(e) => handleTextChange('manufacturer', e.target.value)}
          onClear={() => handleTextChange('manufacturer', '')}
          placeholder="Ex: " // TODO faire un truc mieux
        />
        <TextInputField
          label="Crew"
          name="crew"
          value={state.filter.crew}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'crew')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'crew', order: true });
          }}
          onChange={(e) => handleTextChange('crew', e.target.value)}
          onClear={() => handleTextChange('crew', '')}
          placeholder="Ex: 60-200"
        />
        <OtherInputField
          label="Cost In Credits"
          name="cost_in_credits"
          operateur={state.filter.cost_in_credits.operateur}
          value={state.filter.cost_in_credits.cost_in_credits}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'cost_in_credits')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'cost_in_credits', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('cost_in_credits', 'operateur', e.target.value)
          }
          onDateChange={(e) =>
            handleOtherInputChange('cost_in_credits', 'cost_in_credits', e.target.value)
          }
          onClear={() => handleOtherInputChange('cost_in_credits', 'cost_in_credits', '')}
        />
        <OtherInputField
          label="Passengers"
          name="passengers"
          operateur={state.filter.passengers.operateur}
          value={state.filter.passengers.passengers}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'passengers')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'passengers', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('passengers', 'operateur', e.target.value)
          }
          onDateChange={(e) => handleOtherInputChange('passengers', 'passengers', e.target.value)}
          onClear={() => handleOtherInputChange('passengers', 'passengers', '')}
        />
        <OtherInputField
          label="Length"
          name="length"
          operateur={state.filter.length.operateur}
          value={state.filter.length.length}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'length')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'length', order: true });
          }}
          onOperateurChange={(e) => handleOtherInputChange('length', 'operateur', e.target.value)}
          onDateChange={(e) => handleOtherInputChange('length', 'length', e.target.value)}
          onClear={() => handleOtherInputChange('length', 'length', '')}
        />
        <OtherInputField
          label="Max Atmosphering Speed"
          name="max_atmosphering_speed"
          operateur={state.filter.max_atmosphering_speed.operateur}
          value={state.filter.max_atmosphering_speed.max_atmosphering_speed}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'max_atmosphering_speed')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'max_atmosphering_speed', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('max_atmosphering_speed', 'operateur', e.target.value)
          }
          onDateChange={(e) =>
            handleOtherInputChange(
              'max_atmosphering_speed',
              'max_atmosphering_speed',
              e.target.value,
            )
          }
          onClear={() =>
            handleOtherInputChange('max_atmosphering_speed', 'max_atmosphering_speed', '')
          }
        />
        <OtherInputField
          label="Hyperdrive Rating"
          name="hyperdrive_rating"
          operateur={state.filter.hyperdrive_rating.operateur}
          value={state.filter.hyperdrive_rating.hyperdrive_rating}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'hyperdrive_rating')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'hyperdrive_rating', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('hyperdrive_rating', 'operateur', e.target.value)
          }
          onDateChange={(e) =>
            handleOtherInputChange('hyperdrive_rating', 'hyperdrive_rating', e.target.value)
          }
          onClear={() => handleOtherInputChange('hyperdrive_rating', 'hyperdrive_rating', '')}
        />
        <OtherInputField
          label="Megalight per hour"
          name="MGLT"
          operateur={state.filter.MGLT.operateur}
          value={state.filter.MGLT.MGLT}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'MGLT')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'MGLT', order: true });
          }}
          onOperateurChange={(e) => handleOtherInputChange('MGLT', 'operateur', e.target.value)}
          onDateChange={(e) => handleOtherInputChange('MGLT', 'MGLT', e.target.value)}
          onClear={() => handleOtherInputChange('MGLT', 'MGLT', '')}
        />
        <OtherInputField
          label="Cargo Capacity"
          name="cargo_capacity"
          operateur={state.filter.cargo_capacity.operateur}
          value={state.filter.cargo_capacity.cargo_capacity}
          type="number"
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'cargo_capacity')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'cargo_capacity', order: true });
          }}
          onOperateurChange={(e) =>
            handleOtherInputChange('cargo_capacity', 'operateur', e.target.value)
          }
          onDateChange={(e) =>
            handleOtherInputChange('cargo_capacity', 'cargo_capacity', e.target.value)
          }
          onClear={() => handleOtherInputChange('cargo_capacity', 'cargo_capacity', '')}
        />
        <OtherInputField
          label="Consumables"
          name="consumables"
          operateur={state.filter.consumables.operateur}
          value={state.filter.consumables.consumables}
          type="number"
          onOperateurChange={(e) =>
            handleOtherInputChange('consumables', 'operateur', e.target.value)
          }
          onDateChange={(e) => handleOtherInputChange('consumables', 'consumables', e.target.value)}
          onClear={() => handleOtherInputChange('consumables', 'consumables', '')}
        />
      </div>
      <div className={style.container}>
        <h1>The Starships:</h1>
        {isLoading ? (
          <p>Chargement...</p>
        ) : (
          state.filteredItems.map((item) => <Card key={item.name} item={item} />)
        )}
      </div>
    </div>
  );
}
