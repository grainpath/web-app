import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BoundItem, KeywordCondition, MaybePlace } from "../utils/grainpath";

type DiscoverState = {
  mod: boolean;
  source?: MaybePlace;
  target?: MaybePlace;
  center?: MaybePlace;
  radius: number;
  distance: number;
  bounds?: BoundItem;
  conditions: KeywordCondition[];
};

const initialState = (): DiscoverState => {
  return { mod: true, radius: 3.0, distance: 5.0, conditions: [] };
};

export const discoverSlice = createSlice({
  name: "discover",
  initialState: initialState(),
  reducers: {
    setRoutesMod: (state) => { state.mod = true; },
    setPlacesMod: (state) => { state.mod = false; },
    setBounds: (state, action: PayloadAction<BoundItem>) => { state.bounds = action.payload; },
    setSource: (state, action: PayloadAction<MaybePlace | undefined>) => { state.source = action.payload; },
    setTarget: (state, action: PayloadAction<MaybePlace | undefined>) => { state.target = action.payload; },
    setCenter: (state, action: PayloadAction<MaybePlace | undefined>) => { state.center = action.payload; },
    setRadius: (state, action: PayloadAction<number>) => { state.radius = action.payload; },
    setDistance: (state, action: PayloadAction<number>) => { state.distance = action.payload; },
    insertCondition: (state, action: PayloadAction<KeywordCondition>) => {
      let i = state.conditions.findIndex((filter) => filter.keyword === action.payload.keyword);
      i = (i === -1) ? state.conditions.length : i;
      state.conditions = [ ...state.conditions.slice(0, i), action.payload, ...state.conditions.slice(i + 1) ];
    },
    deleteCondition: (state, action: PayloadAction<string>) => {
      state.conditions = state.conditions.filter((filter, _) => filter.keyword !== action.payload);
    }
  }
});

export const {
  setRoutesMod,
  setPlacesMod,
  setBounds,
  setSource,
  setTarget,
  setCenter,
  setRadius,
  setDistance,
  deleteCondition,
  insertCondition
} = discoverSlice.actions;

export default discoverSlice.reducer;
