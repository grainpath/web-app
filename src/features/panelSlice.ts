import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type PanelState = {
  show: boolean;
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
    setLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; }
  }
});

export const {
  showPanel,
  hidePanel,
  setLoading
} = panelSlice.actions;

export default panelSlice.reducer;
