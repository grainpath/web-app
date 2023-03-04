import { UrlString } from "@inrupt/solid-client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LockerState = {
  podCurr?: UrlString;
  podList: UrlString[];
}

const initialState = (): LockerState => { return { podList: [] }; };

export const lockerSlice = createSlice({
  name: "locker",
  initialState: initialState(),
  reducers: {
    erase: () => initialState(),
    setPodCurr: (state, action: PayloadAction<string>) => { state.podCurr = action.payload; },
    setPodList: (state, action: PayloadAction<string[]>) => { state.podList = action.payload; }
  }
});

export const {
  erase,
  setPodCurr,
  setPodList
} = lockerSlice.actions;

export default lockerSlice.reducer;
