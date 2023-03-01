import { UrlString } from '@inrupt/solid-client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type LoggerState = {
  userName?: string;
  podUrls?: UrlString[];
  currentPod?: UrlString;
  isLoggedIn: boolean;
}

const initialState = (): LoggerState => {
  return {
    isLoggedIn: false
  };
};

export const loggerSlice = createSlice({
  name: 'logger',
  initialState: initialState(),
  reducers: {
    setUserName: (state, action: PayloadAction<string>) => { state.userName = action.payload; },
    setPodUrls: (state, action: PayloadAction<UrlString[]>) => { state.podUrls = action.payload; },
    setCurrentPod: (state, action: PayloadAction<UrlString>) => { state.currentPod = action.payload; },
    setLoggedIn: (state, action: PayloadAction<boolean>) => { state.isLoggedIn = action.payload; }
  }
});

export const {
  setUserName,
  setLoggedIn,
  setCurrentPod,
  setPodUrls,
} = loggerSlice.actions;

export default loggerSlice.reducer;
