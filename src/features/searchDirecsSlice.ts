import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiPlace } from "../domain/types";
import { deleteItemImmutable, updateItemImmutable } from "./immutable";

type SearchDirectState = {
  sequence: UiPlace[];
}

function initialState(): SearchDirectState {
  return { sequence: [] };
};

export const searchDirecsSlice = createSlice({
  name: "search/direcs",
  initialState: initialState(),
  reducers: {
    clearSearchDirecs: () => { return initialState(); },
    setSearchDirecsSequence: (state, action: PayloadAction<UiPlace[]>) => { state.sequence = action.payload; },
    appendSearchDirecsPlace: (state, action: PayloadAction<UiPlace>) => { state.sequence.push(action.payload); },
    updateSearchDirecsPlace: (state, action: PayloadAction<{ place: UiPlace, index: number }>) => {
      const { place, index } = action.payload;
      state.sequence = updateItemImmutable(state.sequence, place, index);
    },
    deleteSearchDirecsPlace: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      state.sequence = deleteItemImmutable(state.sequence, index);
    },
    moveSearchDirectPlace: (state, action: PayloadAction<{ fr: number, to: number }>) => {
      const sq = state.sequence;
      const { fr, to } = action.payload;
      state.sequence = [
        ...sq.slice(0, Math.min(fr, to)),
        ...((fr < to)
          ? [...sq.slice(fr + 1, to + 1), sq[fr]]
          : [sq[to], ...sq.slice(fr + 0, to + 0)]),
        ...sq.slice(Math.max(fr, to) + 1)
      ]
    }
  }
});

export const {
  clearSearchDirecs,
  setSearchDirecsSequence,
  appendSearchDirecsPlace,
  updateSearchDirecsPlace,
  deleteSearchDirecsPlace,
  moveSearchDirectPlace
} = searchDirecsSlice.actions;

export default searchDirecsSlice.reducer;
