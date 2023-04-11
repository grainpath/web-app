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
    clear: () => { return initialState(); },
    setSequence: (state, action: PayloadAction<UiPlace[]>) => { state.sequence = action.payload },
    appendPlace: (state, action: PayloadAction<UiPlace>) => { state.sequence.push(action.payload); },
    deletePlace: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      state.sequence = [...state.sequence.slice(0, i), ...state.sequence.slice(i + 1)];
    },
    swapPlaces: (state, action: PayloadAction<{ l: number, r: number }>) => {
      const { l, r } = action.payload;
      state.sequence = [
        ...state.sequence.slice(0, l),
        state.sequence[r],
        ...state.sequence.slice(l + 1, r),
        state.sequence[l],
        ...state.sequence.slice(r + 1)];
    }
  }
});

export const {
  clear,
  setSequence,
  appendPlace,
  deletePlace,
  swapPlaces,
} = searchDirectSlice.actions;

export default searchDirectSlice.reducer;
