import { createSlice } from "@reduxjs/toolkit";

type PanelState = {
  show: boolean;
  disabled: boolean;
};

const initialState = () => {
  return { show: true, disabled: false } as PanelState;
}

export const panelSlice = createSlice({
  name: "panel",
  initialState: initialState(),
  reducers: {
    showPanel: (state) => { state.show = true; },
    hidePanel: (state) => { state.show = false; },
    blockPanel: (state) => { state.show = false; state.disabled = true; },
    unblockPanel: (state) => { state.show = true; state.disabled = false; }
  }
});

export const {
  showPanel,
  hidePanel,
  blockPanel,
  unblockPanel
} = panelSlice.actions;

export default panelSlice.reducer;
