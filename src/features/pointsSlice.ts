import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { HeavyGrain } from "../utils/grainpath";

type PointsState = {
  list: HeavyGrain[];
}

const initialState = (): PointsState => {
  return { list: [] };
};

export const pointsSlice = createSlice({
  name: "points",
  initialState: initialState(),
  reducers: {
    appendList: (state, action: PayloadAction<HeavyGrain>) => { state.list.push(action.payload); }
  }
});

export const {
  appendList
} = pointsSlice.actions;

export default pointsSlice.reducer;
