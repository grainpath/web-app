import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiRoute } from "../domain/types";

type ResultRoutesState = {
  index: number;
  result: UiRoute[];
};

const initialState = (): ResultRoutesState => {
  return { index: 0, result: [] };
}

export const resultRoutesSlice = createSlice({
  name: "result/routes",
  initialState: initialState(),
  reducers: {
    setIndex: (state, action: PayloadAction<number>) => { state.index = action.payload; },
    setResult: (state, action: PayloadAction<UiRoute[]>) => { state.result = action.payload; }
  }
});

export const {
  setIndex,
  setResult
} = resultRoutesSlice.actions;

export default resultRoutesSlice.reducer;
