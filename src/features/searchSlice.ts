import { createSlice } from "@reduxjs/toolkit";

import { Boundary } from "../utils/types";

export type SearchState = Boundary & {
  count: number;
  distance: number;
};

const initialState = {
  count: 100,
  distance: 3.0,
} as SearchState;

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSource: (state, action) => { state.source = action.payload; },
    setTarget: (state, action) => { state.target = action.payload; },
    setCount: (state, action) => { state.count = action.payload; },
    setDistance: (state, action) => { state.distance = action.payload; }
  }
});

export default searchSlice.reducer;
export const {
  setSource,
  setTarget,
  setCount,
  setDistance,
} = searchSlice.actions;
