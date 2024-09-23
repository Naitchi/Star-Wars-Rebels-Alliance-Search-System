import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Starship } from '../types/types';

// Définir le type de l'état initial
interface StarshipState {
  starship: Starship[];
}

const initialState: StarshipState = {
  starship: [],
};

const starshipSlice = createSlice({
  name: 'starship',
  initialState,
  reducers: {
    setStarship: (state, action: PayloadAction<Starship[]>) => {
      state.starship = action.payload;
    },
  },
});

export const { setStarship } = starshipSlice.actions;

export default starshipSlice.reducer;

export const getStarship = (state: { starship: StarshipState }) => state.starship.starship;
