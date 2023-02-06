import { configureStore } from '@reduxjs/toolkit';
import mapperReducer from './mapperSlice';
import panelsReducer from './panelsSlice';
import searchReducer from './searchSlice';
import resultReducer from './resultSlice';

export const store = configureStore({
  reducer: {
    mapper: mapperReducer,
    panels: panelsReducer,
    search: searchReducer,
    result: resultReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: {
      ignoredPaths: [
        'mapper.map',
        'mapper.markers',
      ],
      ignoredActions: [
        'mapper/setMap',
        'mapper/appendMarker',
        'mapper/deleteMarker',
      ],
    }
  })
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
