import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiDirection } from "../domain/types";

type ResultDirectState = {
  back?: string;
  result?: UiDirection;
};

function initialState(): ResultDirectState { return { }; };

export const resultDirectSlice = createSlice({
  name: "result/direct",
  initialState: initialState(),
  reducers: {
    clearResultDirect: () => { return initialState(); },
    setResultDirect: (state, action: PayloadAction<UiDirection | undefined>) => { state.result = action.payload; },
    setResultDirectBack: (state, action: PayloadAction<string | undefined>) => { state.back = action.payload; }
  }
});

export const {
  clearResultDirect,
  setResultDirect,
  setResultDirectBack
} = resultDirectSlice.actions;

export default resultDirectSlice.reducer;
