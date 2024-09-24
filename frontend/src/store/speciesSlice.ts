import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Species } from '../types/types';

// Définir le type de l'état initial
interface SpeciesState {
  species: Species[];
}

const initialState: SpeciesState = {
  species: [],
};

const speciesSlice = createSlice({
  name: 'species',
  initialState,
  reducers: {
    setSpecies: (state, action: PayloadAction<Species[]>) => {
      state.species = action.payload;
    },
  },
});

export const { setSpecies } = speciesSlice.actions;

export default speciesSlice.reducer;

export const getSpecies = (state: { species: SpeciesState }) => state.species.species;
