import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { KeywordCondition, UiPlace } from "../domain/types";

type SearchRoutesState = {
  source?: UiPlace;
  target?: UiPlace;
  distance: number;
  conditions: KeywordCondition[];
};

function initialState(): SearchRoutesState {
  return { distance: 5.0, conditions: [] };
}

export const searchRoutesSlice = createSlice({
  name: "search/routes",
  initialState: initialState(),
  reducers: {
    clear: () => { return initialState(); },
    setSource: (state, action: PayloadAction<UiPlace | undefined>) => { state.source = action.payload; },
    setTarget: (state, action: PayloadAction<UiPlace | undefined>) => { state.target = action.payload; },
    setDistance: (state, action: PayloadAction<number>) => { state.distance = action.payload; },
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
  setSource,
  setTarget,
  setDistance,
  deleteCondition,
  insertCondition
} = searchRoutesSlice.actions;

export default searchRoutesSlice.reducer;
