import { createSlice } from "@reduxjs/toolkit";

import { Boundary } from "../utils/types";

export type ResultState = Boundary & {
  count?: number;
  distance?: number;
}

export const resultSlice = createSlice({
  name: 'result',
  initialState: { } as ResultState,
  reducers: {
    setSource: (state, action) => { state.source = action.payload; },
    setTarget: (state, action) => { state.target = action.payload; },
    setCount: (state, action) => { state.count = action.payload; },
    setDistance: (state, action) => { state.distance = action.payload; }
  }
});

export default resultSlice.reducer;
export const {
  setSource,
  setTarget,
  setCount,
  setDistance
} = resultSlice.actions;
