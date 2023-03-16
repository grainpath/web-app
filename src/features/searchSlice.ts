import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SearchState = {
  tab: string;
  mod: boolean;
};

function initialState() { return { tab: "discover", mod: true } as SearchState; };

export const searchSlice = createSlice({
  name: "search",
  initialState: initialState(),
  reducers: {
    setTab: (state, action: PayloadAction<string>) => { state.tab = action.payload; },
    setMod: (state, action: PayloadAction<boolean>) => { state.mod = action.payload; }
  }
});

export const {
  setTab,
  setMod
} = searchSlice.actions;

export default searchSlice.reducer;
