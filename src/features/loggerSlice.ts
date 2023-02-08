import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = () => {
  return {
    isLoggedIn: false,
  };
};

export const loggerSlice = createSlice({
  name: 'logger',
  initialState: initialState(),
  reducers: {
    setLoggedIn: (state, action: PayloadAction<boolean>) => { state.isLoggedIn = action.payload; },
  }
});

export const {
  setLoggedIn,
} = loggerSlice.actions;

export default loggerSlice.reducer;
