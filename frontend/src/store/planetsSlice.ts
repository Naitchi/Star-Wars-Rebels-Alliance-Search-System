import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Planet } from '../types/types';

// Définir le type de l'état initial
interface PlanetsState {
  planets: Planet[];
}

const initialState: PlanetsState = {
  planets: [],
};

const planetsSlice = createSlice({
  name: 'planets',
  initialState,
  reducers: {
    setPlanets: (state, action: PayloadAction<Planet[]>) => {
      state.planets = action.payload;
    },
  },
});

export const { setPlanets } = planetsSlice.actions;

export default planetsSlice.reducer;

export const getPlanets = (state: { planets: PlanetsState }) => state.planets.planets;
