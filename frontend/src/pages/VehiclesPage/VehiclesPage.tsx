import { useEffect, useState } from 'react';

// Components
import Header from '../../components/Header/Header';
import Card from '../../components/Card/Card';
import OtherInputField from '../../components/OtherInputField/OtherInputField';
import TextInputField from '../../components/TextInputField/TextInputField';

// Css
import style from './VehiclesPage.module.css';

import { useDispatch, useSelector } from 'react-redux';

import { getVehicles, setVehicles } from '../../store/vehiclesSlice';

import { getAll } from '../../services/data.service';
import { Vehicle } from '../../types/types';

type OrderBy = {
  field:
    | 'name'
    | 'vehicle_class'
    | 'cost_in_credits'
    | 'length'
    | 'crew'
    | 'passengers'
    | 'max_atmosphering_speed'
    | 'cargo_capacity'
    | null;
  order: boolean;
};

type StateType = {
  orderBy: OrderBy;
  filter: {
    name: string;
    model: string;
    vehicle_class: string;
    manufacturer: string;
    cost_in_credits: { cost_in_credits: string; operateur: string };
    length: { length: string; operateur: string };
    crew: string;
    passengers: { passengers: string; operateur: string };
    max_atmosphering_speed: { max_atmosphering_speed: string; operateur: string };
    cargo_capacity: { cargo_capacity: string; operateur: string };
    consumables: { consumables: string; operateur: string };
  };
  filteredItems: Vehicle[];
};

export default function VehiclePage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState<StateType>({
    orderBy: { field: null, order: true },
    filter: {
      name: '',
      model: '',
      vehicle_class: '',
      manufacturer: '',
      cost_in_credits: { cost_in_credits: '', operateur: '<' },
      length: { length: '', operateur: '<' },
      crew: '',
      passengers: { passengers: '', operateur: '<' },
      max_atmosphering_speed: { max_atmosphering_speed: '', operateur: '<' },
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
    | 'cargo_capacity';

  type field = 'name' | 'model' | 'vehicle_class' | 'manufacturer';

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

  const vehicles: Vehicle[] = useSelector(getVehicles);

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const response = await getAll('vehicles');
        dispatch(setVehicles(response as Vehicle[]));
      } catch (err) {
        console.log(err);
      }
      setIsLoading(false);
    };

    if (!vehicles.length) fetchItems();
    else setIsLoading(false);
  }, [dispatch, vehicles]);

  useEffect(() => {
    const filterTextField = (field: field, array: Vehicle[]): Vehicle[] => {
      if (state.filter[field]) {
        const regex = new RegExp(state.filter[field], 'i');
        return array.filter((item) => regex.test(item[field]));
      }
      return array;
    };
    const filterByNumberField = (
      field: keyof Vehicle,
      operateur: string,
      value: number | string | undefined,
      array: Vehicle[],
    ): Vehicle[] => {
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
      array: Vehicle[],
      order: boolean,
      field:
        | 'name'
        | 'vehicle_class'
        | 'cost_in_credits'
        | 'length'
        | 'crew'
        | 'passengers'
        | 'max_atmosphering_speed'
        | 'cargo_capacity',
    ): Vehicle[] => {
      const sortedArray = [...array];
      if (order)
        return sortedArray.sort((a, b) => String(a[field]).localeCompare(String(b[field])));
      return sortedArray.sort((a, b) => String(b[field]).localeCompare(String(a[field])));
    };
    const Filter = (array: Vehicle[]): void => {
      const filter = state.filter;
      const orderBy = state.orderBy;

      let filteredArray = filterTextField('name', array);
      filteredArray = filterTextField('model', filteredArray);
      filteredArray = filterTextField('vehicle_class', filteredArray);
      filteredArray = filterTextField('manufacturer', filteredArray);
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
        'cargo_capacity',
        filter.cargo_capacity.operateur,
        filter.cargo_capacity.cargo_capacity,
        filteredArray,
      );
      if (orderBy.field) filteredArray = sortArray(filteredArray, orderBy.order, orderBy.field);

      setState((prevState) => ({
        ...prevState,
        filteredItems: filteredArray,
      }));
    };

    if (vehicles.length) Filter(vehicles);
  }, [state.orderBy, state.filter, vehicles]);

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
          placeholder="Ex: Corporate Alliance tank droid"
        />
        <TextInputField
          label="Model"
          name="model"
          value={state.filter.model}
          onChange={(e) => handleTextChange('model', e.target.value)}
          onClear={() => handleTextChange('model', '')}
          placeholder="Ex: NR-N99 Persuader-class droid enforcer"
        />
        <TextInputField
          label="Vehicle Class"
          name="vehicle_class"
          value={state.filter.vehicle_class}
          orderBy={state.orderBy}
          onOrderChange={() => {
            if (state.orderBy.field === 'vehicle_class')
              handleOrderChange({ ...state.orderBy, order: !state.orderBy.order });
            else handleOrderChange({ field: 'vehicle_class', order: true });
          }}
          onChange={(e) => handleTextChange('vehicle_class', e.target.value)}
          onClear={() => handleTextChange('vehicle_class', '')}
          placeholder="Ex: droid tank"
        />
        <TextInputField
          label="Manufacturer"
          name="manufacturer"
          value={state.filter.manufacturer}
          onChange={(e) => handleTextChange('manufacturer', e.target.value)}
          onClear={() => handleTextChange('manufacturer', '')}
          placeholder="Ex: Techno Union"
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
            handleOtherInputChange(
              'max_atmosphering_speed',
              'max_atmosphering_speed',
              e.target.value,
            )
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
      </div>
      <div className={style.container}>
        <h1>The Vehicles:</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          state.filteredItems.map((item) => <Card key={item.name} item={item} />)
        )}
      </div>
    </div>
  );
}
