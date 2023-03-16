import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MaybePlace } from "../utils/grainpath";

type NavigateState = {
  sequence: MaybePlace[];
}

const initialState = () => { return { sequence: [] } as NavigateState; };

export const navigateSlice = createSlice({
  name: "navigate",
  initialState: initialState(),
  reducers: {
    setSequence: (state, action: PayloadAction<MaybePlace[]>) => { state.sequence = action.payload },
    appendPlace: (state, action: PayloadAction<MaybePlace>) => { state.sequence.push(action.payload); },
    deletePlace: (state, action: PayloadAction<number>) => {
      state.sequence = [ ...state.sequence.slice(0, action.payload), ...state.sequence.slice(action.payload + 1) ];
    },
    replacePlace: (state, action: PayloadAction<{ place: MaybePlace, i: number}>) => {
      state.sequence = [ ...state.sequence.slice(0, action.payload.i), action.payload.place, ...state.sequence.slice(action.payload.i + 1) ]
    }
  }
});

export const {
  setSequence,
  appendPlace,
  deletePlace,
  replacePlace,
} = navigateSlice.actions;

export default navigateSlice.reducer;
