import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Bounds } from "../domain/types";

type PanelState = {
  show: boolean;
  bounds?: Bounds;
  loading: boolean;
};

const initialState = (): PanelState => {
  return { show: false, loading: false };
}

export const panelSlice = createSlice({
  name: "panel",
  initialState: initialState(),
  reducers: {
    showPanel: (state) => { state.show = true;  },
    hidePanel: (state) => { state.show = false; },
    setBounds: (state, action: PayloadAction<Bounds>) => { state.bounds = action.payload; },
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; }
  }
});

export const {
  showPanel,
  hidePanel,
  setBounds,
  setLoading
} = panelSlice.actions;

export default panelSlice.reducer;
