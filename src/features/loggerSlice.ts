import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = () => { return { value: false }; }

export const loggerSlice = createSlice({
  name: 'logger',
  initialState: initialState(),
  reducers: {
    setLogger: (state, action: PayloadAction<boolean>) => { state.value = action.payload; }
  }
});

export const {
  setLogger
} = loggerSlice.actions;

export default loggerSlice.reducer;
