import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type KeywordConstraint = {
  label: string;
  operator?: string;
  value?: string;
}

export type SelectedKeyword = {
  keyword: string;
  constraints: KeywordConstraint[];
}

type KeywordState = SelectedKeyword[];

const initialState = (): KeywordState => [];

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState: initialState(),
  reducers: {
    erase: () => { return [] },
    appendKeyword: (state, action: PayloadAction<SelectedKeyword>) => {
      state.push(action.payload);
    },
    deleteKeyword: (state, action: PayloadAction<number>) => {
      return state.filter((_, idx) => idx !== action.payload);
    },
  }
});

export const {
  erase,
  appendKeyword,
  deleteKeyword,
} = keywordsSlice.actions;

export default keywordsSlice.reducer;
