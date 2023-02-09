import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoggerState = {
  userName?: string;
  isLoggedIn: boolean;
}

const initialState = (): LoggerState => {
  return {
    isLoggedIn: false,
  };
};

export const loggerSlice = createSlice({
  name: 'logger',
  initialState: initialState(),
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => { state.userName = action.payload; },
    setLoggedIn: (state, action: PayloadAction<boolean>) => { state.isLoggedIn = action.payload; },
  }
});

export const {
  setUserName,
  setLoggedIn,
} = loggerSlice.actions;

export default loggerSlice.reducer;
