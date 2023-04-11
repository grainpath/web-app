import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "./panelSlice";
import loggerReducer from "./loggerSlice";
import searchDirectReducer from "./searchDirectSlice";
import searchPlacesReducer from "./searchPlacesSlice";
import searchRoutesReducer from "./searchRoutesSlice";
import resultDirectReducer from "./resultDirectSlice";
import resultPlacesReducer from "./resultPlacesSlice";
import resultRoutesReducer from "./resultRoutesSlice";

export const store = configureStore({
  reducer: {
    panel: panelReducer,
    logger: loggerReducer,
    searchDirect: searchDirectReducer,
    searchPlaces: searchPlacesReducer,
    searchRoutes: searchRoutesReducer,
    resultDirect: resultDirectReducer,
    resultPlaces: resultPlacesReducer,
    resultRoutes: resultRoutesReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
