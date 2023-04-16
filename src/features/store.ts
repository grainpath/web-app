import { configureStore } from "@reduxjs/toolkit";
import panelReducer from "./panelSlice";
import entityReducer from "./entitySlice";
import loggerReducer from "./loggerSlice";
import favouritesReducer from "./favouritesSlice";
import searchDirectReducer from "./searchDirectSlice";
import searchPlacesReducer from "./searchPlacesSlice";
import searchRoutesReducer from "./searchRoutesSlice";
import resultDirectReducer from "./resultDirectSlice";
import resultPlacesReducer from "./resultPlacesSlice";
import resultRoutesReducer from "./resultRoutesSlice";

export const store = configureStore({
  reducer: {
    panel: panelReducer,
    entity: entityReducer,
    logger: loggerReducer,
    favourites: favouritesReducer,
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
