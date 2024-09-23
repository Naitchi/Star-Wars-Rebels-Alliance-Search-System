import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Vehicle } from '../types/types';

// Définir le type de l'état initial
interface VehiclesState {
  vehicles: Vehicle[];
}

const initialState: VehiclesState = {
  vehicles: [],
};

const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    setVehicles: (state, action: PayloadAction<Vehicle[]>) => {
      state.vehicles = action.payload;
    },
  },
});

export const { setVehicles } = vehiclesSlice.actions;

export default vehiclesSlice.reducer;

// Sélecteur pour récupérer directement le tableau des véhicules
export const getVehicles = (state: { vehicles: VehiclesState }) => state.vehicles.vehicles;
