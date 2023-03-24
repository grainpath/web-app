import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export type ResultState = Result | null;

export const resultSlice = createSlice({
  name: "result",
  initialState: null,
  reducers: {
    // setResult: (_, action: PayloadAction<Result>) => action.payload
  }
});

export const {
  // setResult
} = resultSlice.actions;

export default resultSlice.reducer;
