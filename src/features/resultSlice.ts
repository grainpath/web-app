import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Boundary, UidPoint } from '../utils/types';

export interface ResultState extends Boundary {
  count?: number;
  distance?: number;
}

export const resultSlice = createSlice({
  name: 'result',
  initialState: { } as ResultState,
  reducers: {
    setSource: (state, action: PayloadAction<UidPoint>) => { state.source = action.payload; },
    setTarget: (state, action: PayloadAction<UidPoint>) => { state.target = action.payload; },
    setCount: (state, action: PayloadAction<number>) => { state.count = action.payload; },
    setDistance: (state, action: PayloadAction<number>) => { state.distance = action.payload; }
  }
});

export const {
  setSource,
  setTarget,
  setCount,
  setDistance
} = resultSlice.actions;

export default resultSlice.reducer;
