import { Map, Marker } from 'leaflet';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapperState {
  cnt: number;
  map?: Map;
  markers: { [key: number]: Marker; };
};

const initialState = (): MapperState => {
  return { cnt: 0, markers: {}, };
}

export const mapperSlice = createSlice({
  name: 'mapper',
  initialState: initialState(),
  reducers: {
    setMap: (state, action: PayloadAction<Map>) => { state.map = action.payload; },
    appendMarker: (state, action) => {
      state.markers[state.cnt] = action.payload;
      state.cnt += 1;
    },
    deleteMarker: (state, action: PayloadAction<number>) => { delete state.markers[action.payload]; },
  },
});

export const {
  setMap,
  appendMarker,
  deleteMarker
} = mapperSlice.actions;

export default mapperSlice.reducer;
