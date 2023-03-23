import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "./panelSlice";
import lockerReducer from "./lockerSlice";
import loggerReducer from "./loggerSlice";
import pointsReducer from "./placesSlice";
import resultReducer from "./resultSlice";
import discoverReducer from "./discoverSlice";
import navigateReducer from "./navigateSlice";

export const store = configureStore({
  reducer: {
    panel: panelReducer,
    locker: lockerReducer,
    logger: loggerReducer,
    points: pointsReducer,
    result: resultReducer,
    discover: discoverReducer,
    navigate: navigateReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
