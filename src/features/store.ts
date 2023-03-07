import { configureStore } from "@reduxjs/toolkit";

import lockerReducer from "./lockerSlice";
import loggerReducer from "./loggerSlice";
import pointsReducer from "./pointsSlice";
import searchReducer from "./searchSlice";
import shapesReducer from "./shapesSlice";

export const store = configureStore({
  reducer: {
    locker: lockerReducer,
    logger: loggerReducer,
    points: pointsReducer,
    search: searchReducer,
    shapes: shapesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
