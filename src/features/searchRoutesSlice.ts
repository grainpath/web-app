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
    deleteCondition: (state, action: PayloadAction<string>) => {
      state.conditions = state.conditions.filter((c) => c.keyword !== action.payload);
    },
    insertCondition: (state, action: PayloadAction<{ index: number; condition: KeywordCondition }>) => {
      const { index, condition } = action.payload;
      state.conditions = [...state.conditions.slice(0, index), condition, ...state.conditions.slice(index + 1)];
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
