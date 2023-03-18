import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SearchState = {
  tab: number;
  mod: boolean;
  loadRoutes: boolean;
  loadPlaces: boolean;
  loadNavigate: boolean;
  disabled: boolean;
};

function initialState(): SearchState {
  return {
    tab: 0,
    mod: true,
    disabled: false,
    loadRoutes: false,
    loadPlaces: false,
    loadNavigate: false
  };
};

export const searchSlice = createSlice({
  name: "search",
  initialState: initialState(),
  reducers: {
    setTab: (state, action: PayloadAction<number>) => { state.tab = action.payload; },
    setMod: (state, action: PayloadAction<boolean>) => { state.mod = action.payload; },
    setDisabled: (state, action: PayloadAction<boolean>) => { state.disabled = action.payload; },
    setLoadRoutes: (state, action: PayloadAction<boolean>) => { state.loadRoutes = action.payload; },
    setLoadPlaces: (state, action: PayloadAction<boolean>) => { state.loadPlaces = action.payload; },
    setLoadNavigate: (state, action: PayloadAction<boolean>) => { state.loadNavigate = action.payload; }
  }
});

export const {
  setTab,
  setMod,
  setDisabled,
  setLoadRoutes,
  setLoadPlaces,
  setLoadNavigate,
} = searchSlice.actions;

export default searchSlice.reducer;
