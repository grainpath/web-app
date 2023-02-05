import { Map } from 'leaflet';
import { createSlice } from '@reduxjs/toolkit';

export type MapperState = Map | null;

export const mapperSlice = createSlice({
  name: 'mapper',
  initialState: null as MapperState,
  reducers: {
    addMapper: (state, action) => { state = action.payload; },
  }
});

export default mapperSlice.reducer;
export const { addMapper } = mapperSlice.actions;
