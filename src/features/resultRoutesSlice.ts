import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiRoute } from "../domain/types";

type ResultRoutesState = {
  result: UiRoute[];
};

const initialState = (): ResultRoutesState => {
  return { result: [] };
}

export const resultRoutesSlice = createSlice({
  name: "result/routes",
  initialState: initialState(),
  reducers: {
    setResult: (state, action: PayloadAction<UiRoute[]>) => { state.result = action.payload; },
    deleteRoute: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.result = [...state.result.slice(0, i), ...state.result.slice(i + 1)];
    }
  }
});

export const {
  setResult,
  deleteRoute
} = resultRoutesSlice.actions;

export default resultRoutesSlice.reducer;
