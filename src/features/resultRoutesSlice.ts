import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiRoute } from "../domain/types";
import { updateItemImmutable } from "./immutable";

type ResultRoutesState = {
  index: number;
  result: UiRoute[];
  filters: string[];
};

const initialState = (): ResultRoutesState => {
  return { index: 0, result: [], filters: [] };
}

export const resultRoutesSlice = createSlice({
  name: "result/routes",
  initialState: initialState(),
  reducers: {
    setResultRoutes: (state, action: PayloadAction<UiRoute[]>) => { state.result = action.payload; },
    clearResultRoutes: (state) => { state.index = 0; state.result = []; state.filters = []; },
    replaceResultRoute: (state, action: PayloadAction<{ route: UiRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.result = updateItemImmutable(state.result, route, index);
    },
    setResultRoutesIndex: (state, action: PayloadAction<number>) => { state.index = action.payload; },
    setResultRoutesFilters: (state, action: PayloadAction<string[]>) => { state.filters = action.payload; }
  }
});

export const {
  setResultRoutes,
  clearResultRoutes,
  replaceResultRoute,
  setResultRoutesIndex,
  setResultRoutesFilters
} = resultRoutesSlice.actions;

export default resultRoutesSlice.reducer;
