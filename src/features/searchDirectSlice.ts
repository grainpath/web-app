import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiPlace } from "../domain/types";

type SearchDirectState = {
  sequence: UiPlace[];
}

function initialState(): SearchDirectState {
  return { sequence: [] };
};

export const searchDirectSlice = createSlice({
  name: "search/direct",
  initialState: initialState(),
  reducers: {
    clearSequence: () => { return initialState(); },
    appendPlace: (state, action: PayloadAction<UiPlace>) => { state.sequence.push(action.payload); },
    deletePlace: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.sequence = [...state.sequence.slice(0, i), ...state.sequence.slice(i + 1)];
    },
    movePlace: (state, action: PayloadAction<{ fr: number, to: number }>) => {
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
  appendPlace,
  clearSequence,
  deletePlace,
  movePlace
} = searchDirectSlice.actions;

export default searchDirectSlice.reducer;
