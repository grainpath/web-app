import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ConstraintBase = {
  tag: string;
  operator?: string;
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

export type KeywordConstraint
  = BooleanConstraint
  | CollectConstraint
  | MeasureConstraint
  | TextualConstraint;

export type Keyword = {
  label: string;
  constrs: KeywordConstraint[];
}

type KeywordsState = Keyword[];

const initialState = (): KeywordsState => [];

export const keywordsSlice = createSlice({
  name: "keywords",
  initialState: initialState(),
  reducers: {
    erase: () => { return [] },
    insertKeyword: (state, action: PayloadAction<Keyword>) => {
      let i = state.findIndex((keyword) => keyword.label === action.payload.label);
      i = (i === -1) ? state.length : i;
      return [ ...state.slice(0, i), action.payload, ...state.slice(i + 1) ];
    },
    deleteKeyword: (state, action: PayloadAction<string>) => {
      return state.filter((keyword, _) => keyword.label !== action.payload);
    }
  }
});

export const {
  erase,
  deleteKeyword,
  insertKeyword,
} = keywordsSlice.actions;

export default keywordsSlice.reducer;
