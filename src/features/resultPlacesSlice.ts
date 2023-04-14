import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { PlacesResult } from "../domain/types";

type ResultPlacesState = {
  result?: PlacesResult;
};

function initialState(): ResultPlacesState { return { }; };

export const resultPlacesSlice = createSlice({
  name: "result/places",
  initialState: initialState(),
  reducers: {
    setResult: (state, action: PayloadAction<PlacesResult | undefined>) => { state.result = action.payload; }
  }
});

export const {
  setResult
} = resultPlacesSlice.actions;

export default resultPlacesSlice.reducer;
