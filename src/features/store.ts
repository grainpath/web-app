import { configureStore } from "@reduxjs/toolkit";

import lockerReducer from "./lockerSlice";
import loggerReducer from "./loggerSlice";
import pointsReducer from "./placesSlice";
import routesReducer from "./routesSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
  reducer: {
    locker: lockerReducer,
    logger: loggerReducer,
    points: pointsReducer,
    routes: routesReducer,
    search: searchReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
