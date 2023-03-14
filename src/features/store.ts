import { configureStore } from "@reduxjs/toolkit";
import lockerReducer from "./lockerSlice";
import loggerReducer from "./loggerSlice";
import pointsReducer from "./placesSlice";
import resultReducer from "./resultSlice";
import searchReducer from "./searchSlice";
import discoverReducer from "./discoverSlice";
import navigateReducer from "./navigateSlice";

export const store = configureStore({
  reducer: {
    locker: lockerReducer,
    logger: loggerReducer,
    points: pointsReducer,
    result: resultReducer,
    search: searchReducer,
    discover: discoverReducer,
    navigate: navigateReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
