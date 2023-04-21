import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UiDirec } from "../domain/types";

type ResultDirecsState = {
  back?: string;
  result?: UiDirec;
};

function initialState(): ResultDirecsState { return { }; };

export const resultDirecsSlice = createSlice({
  name: "result/direcs",
  initialState: initialState(),
  reducers: {
    clearResultDirecs: () => { return initialState(); },
    setResultDirecs: (state, action: PayloadAction<UiDirec | undefined>) => { state.result = action.payload; },
    setResultDirecsBack: (state, action: PayloadAction<string | undefined>) => { state.back = action.payload; }
  }
});

export const {
  setResultDirecs: setResultDirecs,
  clearResultDirecs: clearResultDirecs,
  setResultDirecsBack: setResultDirecsBack
} = resultDirecsSlice.actions;

export default resultDirecsSlice.reducer;
