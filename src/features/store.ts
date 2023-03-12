import { configureStore } from "@reduxjs/toolkit";

import lockerReducer from "./lockerSlice";
import loggerReducer from "./loggerSlice";
import pointsReducer from "./placesSlice";
import resultReducer from "./resultSlice";
import searchReducer from "./searchSlice";

export const store = configureStore({
  reducer: {
    locker: lockerReducer,
    logger: loggerReducer,
    points: pointsReducer,
    result: resultReducer,
    search: searchReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
