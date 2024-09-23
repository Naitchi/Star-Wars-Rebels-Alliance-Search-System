import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Films } from '../types/types';

// Définir le type de l'état initial
interface FilmsState {
  films: Films[];
}

const initialState: FilmsState = {
  films: [],
};

const filmsSlice = createSlice({
  name: 'films',
  initialState,
  reducers: {
    setFilms: (state, action: PayloadAction<Films[]>) => {
      state.films = action.payload;
    },
  },
});

export const { setFilms } = filmsSlice.actions;

export default filmsSlice.reducer;

export const getFilms = (state: { films: FilmsState }) => {
  return state.films.films;
};
