import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type KeywordConstraint = {
  tag: string;
  operator?: string;
  value?: string;
}

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
