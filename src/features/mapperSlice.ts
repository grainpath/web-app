import { createSlice } from '@reduxjs/toolkit';
import { Map as LeafletMap, Marker } from 'leaflet';

export type MapperState = {
  cnt: number;
  map?: LeafletMap;
  markers: { [key: number]: Marker; };
};

const initialState: MapperState = {
  cnt: 0,
  markers: {},
};

export const mapperSlice = createSlice({
  name: 'mapper',
  initialState,
  reducers: {
    setMap: (state, action) => { state.map = action.payload; },
    appendMarker: (state, action) => {
      state.markers[state.cnt] = action.payload;
      state.cnt += 1;
    },
    deleteMarker: (state, action) => { delete state.markers[action.payload]; },
  },
});

export default mapperSlice.reducer;
export const { setMap, appendMarker, deleteMarker } = mapperSlice.actions;
