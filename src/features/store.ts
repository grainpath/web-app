import { configureStore } from '@reduxjs/toolkit';
import panelsReducer from './panelsSlice';
import searchReducer from './searchSlice';
import resultReducer from './resultSlice';

export const store = configureStore({
  reducer: {
    panels: panelsReducer,
    search: searchReducer,
    result: resultReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
