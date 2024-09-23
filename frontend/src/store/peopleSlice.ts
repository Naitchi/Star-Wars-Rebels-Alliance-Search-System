import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { People } from '../types/types';

// Définir le type de l'état initial
interface PeopleState {
  people: People[];
}

const initialState: PeopleState = {
  people: [],
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    setPeople: (state, action: PayloadAction<People[]>) => {
      state.people = action.payload;
    },
  },
});

export const { setPeople } = peopleSlice.actions;

export default peopleSlice.reducer;

export const getPeople = (state: { people: PeopleState }) => state.people.people;
