import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Boundary, Point } from "../utils/grainpath";

export type RoutesState = Boundary & {
  sequence: Point[];
  quantity?: number;
  distance?: number;
}

export const routesSlice = createSlice({
  name: "routes",
  initialState: { sequence: [] } as RoutesState,
  reducers: {
    setSource: (state, action: PayloadAction<Point>) => { state.source = action.payload; },
    setTarget: (state, action: PayloadAction<Point>) => { state.target = action.payload; },
    setQuantity: (state, action: PayloadAction<number>) => { state.quantity = action.payload; },
    setDistance: (state, action: PayloadAction<number>) => { state.distance = action.payload; }
  }
});

export const {
  setSource,
  setTarget,
  setQuantity,
  setDistance
} = routesSlice.actions;

export default routesSlice.reducer;
