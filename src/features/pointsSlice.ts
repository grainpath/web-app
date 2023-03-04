import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HeavyGrain } from "../domain/types";

type PointsState = {
  curr: HeavyGrain | undefined,
  list: HeavyGrain[];
}

const initialState = (): PointsState => {
  return { curr: undefined, list: [] };
};

export const pointsSlice = createSlice({
  name: "points",
  initialState: initialState(),
  reducers: {
    setCurr: (state, action: PayloadAction<HeavyGrain | undefined>) => { state.curr = action.payload; },
    appendList: (state, action: PayloadAction<HeavyGrain>) => { state.list.push(action.payload); }
  }
});

export const {
  setCurr,
  appendList
} = pointsSlice.actions;

export default pointsSlice.reducer;
