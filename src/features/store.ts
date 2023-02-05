import mapperReducer from './mapperSlice';
import searchReducer from './searchSlice';
import resultReducer from './resultSlice';
import { configureStore } from '@reduxjs/toolkit';

/**
 * https://redux-toolkit.js.org/usage/usage-guide#working-with-non-serializable-data
 *   Redux raise an exception when working with classes, functions, etc.
 *   However, such data arise in practice very often, e.g. an instance of
 *   a leaflet map.
 */

export default configureStore({
  reducer: {
    mapper: mapperReducer,
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
