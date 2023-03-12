import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Result } from "../utils/grainpath";

export type ResultState = Result | null;

export const resultSlice = createSlice({
  name: "result",
  initialState: null as ResultState,
  reducers: {
    setResult: (_, action: PayloadAction<Result>) => action.payload
  }
});

export const {
  setResult
} = resultSlice.actions;

export default resultSlice.reducer;
