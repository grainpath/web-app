import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  EXISTING_KEYWORDS_MOCK,
  SELECTED_KEYWORDS_MOCK
} from "../utils/mocks";

export type KeywordConstraint = {
  label: string;
  operator?: string;
  value?: string;
}

export type SelectedKeyword = {
  keyword: string;
  constraints: KeywordConstraint[];
}

type KeywordState = {
  existing: string[];
  selected: SelectedKeyword[];
};

const initialState = (): KeywordState => {
  return {
    existing: EXISTING_KEYWORDS_MOCK, // TODO: replace with actual keywords!
    selected: SELECTED_KEYWORDS_MOCK, // TODO: replace with actual keywords!
  };
};

export const keywordsSlice = createSlice({
  name: 'keywords',
  initialState: initialState(),
  reducers: {
    erase: (state) => { state.selected = [] },
    setExisting: (state, action: PayloadAction<string[]>) => {
      state.existing = action.payload;
    },
    appendKeyword: (state, action: PayloadAction<SelectedKeyword>) => {
      state.selected.push(action.payload);
    },
    deleteKeyword: (state, action: PayloadAction<number>) => {
      state.selected = state.selected.filter((_, idx) => idx !== action.payload);
    },
  }
});

export const {
  erase,
  setExisting,
  appendKeyword,
  deleteKeyword,
} = keywordsSlice.actions;

export default keywordsSlice.reducer;
