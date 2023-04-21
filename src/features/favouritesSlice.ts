import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  deleteItemImmutable,
  updateItemImmutable
} from "./immutable";
import {
  StoredDirec,
  StoredPlace,
  StoredRoute,
  UiPlace
} from "../domain/types";

type FavouritesState = {
  name: string;
  place?: UiPlace;
  places: StoredPlace[];
  placesLoaded: boolean;
  routes: StoredRoute[];
  routesLoaded: boolean;
  direcs: StoredDirec[];
  direcsLoaded: boolean;
};

const initialState = (): FavouritesState => {
  return {
    name: "",
    places: [], placesLoaded: false,
    routes: [], routesLoaded: false,
    direcs: [], direcsLoaded: false
  };
};

export const favouritesSlice = createSlice({
  name: "favourites",
  initialState: initialState(),
  reducers: {

    // custom place

    setFavouriteCustomName: (state, action: PayloadAction<string>) => { state.name = action.payload; },
    setFavouriteCustomLocation: (state, action: PayloadAction<UiPlace | undefined>) => { state.place = action.payload; },
    createFavouriteCustomPlace: (state, action: PayloadAction<StoredPlace>) => {
      state.name = ""; state.place = undefined;
      state.places = updateItemImmutable(state.places, action.payload, state.places.length);
    },

    // places

    setFavouritePlaces: (state, action: PayloadAction<StoredPlace[]>) => { state.places = action.payload; },
    createFavouritePlace: (state, action: PayloadAction<StoredPlace>) => { state.places.push(action.payload); },
    updateFavouritePlace: (state, action: PayloadAction<{ place: StoredPlace, index: number }>) => {
      const { place, index } = action.payload;
      state.places = updateItemImmutable(state.places, place, index);
    },
    deleteFavouritePlace: (state, action: PayloadAction<number>) => {
      state.places = deleteItemImmutable(state.places, action.payload);
    },
    setFavouritePlacesLoaded: (state) => { state.placesLoaded = true; },

    // routes

    setFavouriteRoutes: (state, action: PayloadAction<StoredRoute[]>) => { state.routes = action.payload; },
    createFavouriteRoute: (state, action: PayloadAction<StoredRoute>) => { state.routes.push(action.payload); },
    updateFavouriteRoute: (state, action: PayloadAction<{ route: StoredRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.routes = updateItemImmutable(state.routes, route, index);
    },
    deleteFavouriteRoute: (state, action: PayloadAction<number>) => {
      state.routes = deleteItemImmutable(state.routes, action.payload);
    },
    setFavouriteRoutesLoaded: (state) => { state.routesLoaded = true; },

    // direcs

    setFavouriteDirecs: (state, action: PayloadAction<StoredDirec[]>) => { state.direcs = action.payload; },
    createFavouriteDirec: (state, action: PayloadAction<StoredDirec>) => { state.direcs.push(action.payload); },
    updateFavouriteDirec: (state, action: PayloadAction<{ direc: StoredDirec, index: number }>) => {
      const { direc, index } = action.payload;
      state.direcs = updateItemImmutable(state.direcs, direc, index);
    },
    deleteFavouriteDirec: (state, action: PayloadAction<number>) => {
      state.direcs = deleteItemImmutable(state.direcs, action.payload);
    },
    setFavouriteDirecsLoaded: (state) => { state.direcsLoaded = true; }
  }
});

export const {

  // custom place

  setFavouriteCustomName,
  setFavouriteCustomLocation,
  createFavouriteCustomPlace,

  // places

  setFavouritePlaces,
  createFavouritePlace,
  updateFavouritePlace,
  deleteFavouritePlace,
  setFavouritePlacesLoaded,

  // routes

  setFavouriteRoutes,
  createFavouriteRoute,
  updateFavouriteRoute,
  deleteFavouriteRoute,
  setFavouriteRoutesLoaded,

  // direcs

  setFavouriteDirecs,
  createFavouriteDirec,
  updateFavouriteDirec,
  deleteFavouriteDirec,
  setFavouriteDirecsLoaded
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
