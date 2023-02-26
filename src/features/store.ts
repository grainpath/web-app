import { configureStore } from "@reduxjs/toolkit";
import loggerReducer from "./loggerSlice";
import searchReducer from "./searchSlice";
import resultReducer from "./resultSlice";
import keywordsReducer from "./keywordsSlice";

export const store = configureStore({
  reducer: {
    logger: loggerReducer,
    search: searchReducer,
    result: resultReducer,
    keywords: keywordsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
