import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiDirection } from "../domain/types";

type ResultDirectState = {
  result?: UiDirection;
};

function initialState(): ResultDirectState { return { }; };

export const resultDirectSlice = createSlice({
  name: "result/direct",
  initialState: initialState(),
  reducers: {
    setResult: (state, action: PayloadAction<UiDirection>) => { state.result = action.payload; }
  }
});

export const {
  setResult
} = resultDirectSlice.actions;

export default resultDirectSlice.reducer;
