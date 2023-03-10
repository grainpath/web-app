import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Boundary, LightPlace, Point } from "../utils/grainpath";

type ConstraintBase = {
  tag: string;
  relation?: string;
};

export type BooleanConstraint = ConstraintBase & {
  value?: boolean;
};

export type CollectConstraint = ConstraintBase & {
  value?: string;
};

export type MeasureConstraint = ConstraintBase & {
  value?: number;
};

export type TextualConstraint = ConstraintBase & {
  value?: string;
};

export type KeywordConstraint = BooleanConstraint | CollectConstraint | MeasureConstraint | TextualConstraint;

export type Keyword = {
  label: string;
  constrs: KeywordConstraint[];
};

export type SearchState = Boundary & {
  quantity: number;
  distance: number;
  keywords: Keyword[];
  sequence: LightPlace[];
};

const initialState = () => {
  return { quantity: 100, distance: 3.0, keywords: [], sequence: [] } as SearchState;
}

export const searchSlice = createSlice({
  name: "search",
  initialState: initialState(),
  reducers: {
    erase: () => initialState(),
    setSource: (state, action: PayloadAction<Point>) => { state.source = action.payload; },
    setTarget: (state, action: PayloadAction<Point>) => { state.target = action.payload; },
    setQuantity: (state, action: PayloadAction<number>) => { state.quantity = action.payload; },
    setDistance: (state, action: PayloadAction<number>) => { state.distance = action.payload; },
    appendPlace: (state, action: PayloadAction<LightPlace>) => { state.sequence.push(action.payload); },
    deletePlace: (state, action: PayloadAction<number>) => {
      state.sequence = [ ...state.sequence.slice(0, action.payload), ...state.sequence.slice(action.payload + 1) ];
    },
    updatePlace: (state, action: PayloadAction<{ point: Point, i: number}>) => {
      state.sequence[action.payload.i].location = action.payload.point;
    },
    setSequence: (state, action: PayloadAction<LightPlace[]>) => { state.sequence = action.payload; },
    insertKeyword: (state, action: PayloadAction<Keyword>) => {
      let i = state.keywords.findIndex((keyword) => keyword.label === action.payload.label);
      i = (i === -1) ? state.keywords.length : i;
      state.keywords = [ ...state.keywords.slice(0, i), action.payload, ...state.keywords.slice(i + 1) ];
    },
    deleteKeyword: (state, action: PayloadAction<string>) => {
      state.keywords = state.keywords.filter((keyword, _) => keyword.label !== action.payload);
    }
  }
});

export const {
  erase,
  setSource,
  setTarget,
  setQuantity,
  setDistance,
  appendPlace,
  deletePlace,
  updatePlace,
  insertKeyword,
  deleteKeyword
} = searchSlice.actions;

export default searchSlice.reducer;
