import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Boundary, UidPoint } from '../utils/types';

export interface SearchState extends Boundary {
  count: number;
  distance: number;
};

const initialState = () => {
  return { count: 100, distance: 3.0, } as SearchState;
}

export const searchSlice = createSlice({
  name: 'search',
  initialState: initialState(),
  reducers: {
    erase: state => { state = initialState(); },
    setSource: (state, action: PayloadAction<UidPoint>) => { state.source = action.payload; },
    setTarget: (state, action: PayloadAction<UidPoint>) => { state.target = action.payload; },
    setCount: (state, action: PayloadAction<number>) => { state.count = action.payload; },
    setDistance: (state, action: PayloadAction<number>) => { state.distance = action.payload; }
  }
});

export const {
  erase,
  setSource,
  setTarget,
  setCount,
  setDistance,
} = searchSlice.actions;

export default searchSlice.reducer;
