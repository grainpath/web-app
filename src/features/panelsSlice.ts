import { createSlice } from '@reduxjs/toolkit';
import { PanelView } from '../utils/types';

interface PanelsState {
  value: number
}

const initialState = (): PanelsState => {
  return { value: PanelView.Search };
}

export const panelsSlice = createSlice({
  name: 'panels',
  initialState: initialState(),
  reducers: {
    setSearch: state => { state.value = PanelView.Search; },
    setResult: state => { state.value = PanelView.Result; },
    setRemote: state => { state.value = PanelView.Remote; },
  }
});

export const {
  setSearch,
  setResult,
  setRemote,
} = panelsSlice.actions;

export default panelsSlice.reducer;
