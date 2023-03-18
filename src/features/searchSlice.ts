import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SearchState = {
  tab: number;
  mod: boolean;
};

function initialState() { return { tab: 0, mod: true } as SearchState; };

export const searchSlice = createSlice({
  name: "search",
  initialState: initialState(),
  reducers: {
    setTab: (state, action: PayloadAction<number>) => { state.tab = action.payload; },
    setMod: (state, action: PayloadAction<boolean>) => { state.mod = action.payload; }
  }
});

export const {
  setTab,
  setMod
} = searchSlice.actions;

export default searchSlice.reducer;
