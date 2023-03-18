import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KeywordFilter, MaybePlace } from "../utils/grainpath";

type DiscoverState = {
  source?: MaybePlace;
  target?: MaybePlace;
  center?: MaybePlace;
  radius: number;
  distance: number;
  filters: KeywordFilter[];
};

const initialState = () => {
  return { radius: 3.0, distance: 5.0, filters: [] } as DiscoverState;
};

export const discoverSlice = createSlice({
  name: "discover",
  initialState: initialState(),
  reducers: {
    setSource: (state, action: PayloadAction<MaybePlace | undefined>) => { state.source = action.payload; },
    setTarget: (state, action: PayloadAction<MaybePlace | undefined>) => { state.target = action.payload; },
    setCenter: (state, action: PayloadAction<MaybePlace | undefined>) => { state.center = action.payload; },
    setRadius: (state, action: PayloadAction<number>) => { state.radius = action.payload; },
    setDistance: (state, action: PayloadAction<number>) => { state.distance = action.payload; },
    insertKeyword: (state, action: PayloadAction<KeywordFilter>) => {
      let i = state.filters.findIndex((filter) => filter.keyword === action.payload.keyword);
      i = (i === -1) ? state.filters.length : i;
      state.filters = [ ...state.filters.slice(0, i), action.payload, ...state.filters.slice(i + 1) ];
    },
    deleteKeyword: (state, action: PayloadAction<string>) => {
      state.filters = state.filters.filter((filter, _) => filter.keyword !== action.payload);
    }
  }
});

export const {
  setSource,
  setTarget,
  setCenter,
  setRadius,
  setDistance,
  insertKeyword,
  deleteKeyword
} = discoverSlice.actions;

export default discoverSlice.reducer;
