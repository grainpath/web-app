import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PlacesResult } from "../domain/types";

type ResultPlacesState = {
  result?: PlacesResult;
  selectedFilters: string[];
};

function initialState(): ResultPlacesState { return { selectedFilters: [] }; };

export const resultPlacesSlice = createSlice({
  name: "result/places",
  initialState: initialState(),
  reducers: {
    setResult: (state, action: PayloadAction<PlacesResult>) => { state.result = action.payload; },
    setSelectedFilters: (state, action: PayloadAction<string[]>) => { state.selectedFilters = action.payload; }
  }
});

export const {
  setResult,
  setSelectedFilters
} = resultPlacesSlice.actions;

export default resultPlacesSlice.reducer;
