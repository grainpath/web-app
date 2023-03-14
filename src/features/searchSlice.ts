import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TabsType
  = "discover"
  | "navigate";

type ModesType
  = "places"
  | "routes";

type SearchState = {
  tab: TabsType;
  mode: ModesType;
};

function initialState() { return { tab: "discover", mode: "routes" } as SearchState; };

export const searchSlice = createSlice({
  name: "search",
  initialState: initialState(),
  reducers: {
    setTab: (state, action: PayloadAction<TabsType>) => { state.tab = action.payload; },
    setMode: (state, action: PayloadAction<ModesType>) => { state.mode = action.payload; }
  }
});

export const {
  setTab,
  setMode
} = searchSlice.actions;

export default searchSlice.reducer;
