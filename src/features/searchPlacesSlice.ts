import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KeywordCondition, UiPlace } from "../domain/types";

type SearchPlacesState = {
  center?: UiPlace;
  radius: number;
  conditions: KeywordCondition[];
};

const initialState = (): SearchPlacesState => {
  return { radius: 3.0, conditions: [] };
};

export const placesSlice = createSlice({
  name: "search/places",
  initialState: initialState(),
  reducers: {
    clear: () => { return initialState(); },
    setCenter: (state, action: PayloadAction<UiPlace | undefined>) => { state.center = action.payload; },
    setRadius: (state, action: PayloadAction<number>) => { state.radius = action.payload; },
    deleteCondition: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.conditions = [...state.conditions.slice(0, i), ...state.conditions.slice(i + 1)];
    },
    insertCondition: (state, action: PayloadAction<{ condition: KeywordCondition; i: number; }>) => {
      const { i, condition } = action.payload;
      state.conditions = [...state.conditions.slice(0, i), condition, ...state.conditions.slice(i + 1)];
    }
  }
});

export const {
  clear,
  setCenter,
  setRadius,
  deleteCondition,
  insertCondition
} = placesSlice.actions;

export default placesSlice.reducer;
