import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { HeavyPlace } from "../utils/grainpath";

type PointsState = {
  list: HeavyPlace[];
}

const initialState = (): PointsState => {
  return { list: [] };
};

export const placesSlice = createSlice({
  name: "places",
  initialState: initialState(),
  reducers: {
    appendList: (state, action: PayloadAction<HeavyPlace>) => { state.list.push(action.payload); }
  }
});

export const {
  appendList
} = placesSlice.actions;

export default placesSlice.reducer;
