// Import Redux
import { configureStore } from '@reduxjs/toolkit';

// Import Slice
import vehiclesSlice from './vehiclesSlice';
import starshipSlice from './starshipSlice';
import filmsSlice from './filmsSlice';
import peopleSlice from './peopleSlice';
import planetsSlice from './planetsSlice';
import speciesSlice from './speciesSlice';

const store = configureStore({
  reducer: {
    vehicles: vehiclesSlice,
    starship: starshipSlice,
    films: filmsSlice,
    people: peopleSlice,
    planets: planetsSlice,
    species: speciesSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
