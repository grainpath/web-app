import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  deleteItemImmutable,
  updateItemImmutable
} from "./immutable";
import {
  StoredDirection,
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
  directions: StoredDirection[];
  directionsLoaded: boolean;
};

const initialState = (): FavouritesState => {
  return {
    name: "",
    places: [], placesLoaded: false,
    routes: [], routesLoaded: false,
    directions: [], directionsLoaded: false
  };
};

export const favouritesSlice = createSlice({
  name: "favourites",
  initialState: initialState(),
  reducers: {

    // create place

    setCustomName: (state, action: PayloadAction<string>) => { state.name = action.payload; },
    setCustomLocation: (state, action: PayloadAction<UiPlace | undefined>) => { state.place = action.payload; },
    createCustomPlace: (state, action: PayloadAction<StoredPlace>) => {
      state.name = ""; state.place = undefined;
      state.places = updateItemImmutable(state.places, action.payload, state.places.length);
    },

    // places

    setPlaces: (state, action: PayloadAction<StoredPlace[]>) => { state.places = action.payload; },
    createPlace: (state, action: PayloadAction<StoredPlace>) => {
      state.places = updateItemImmutable(state.places, action.payload, state.places.length);
    },
    updatePlace: (state, action: PayloadAction<{ place: StoredPlace, index: number }>) => {
      const { place, index } = action.payload;
      state.places = updateItemImmutable(state.places, place, index);
    },
    deletePlace: (state, action: PayloadAction<number>) => {
      state.places = deleteItemImmutable(state.places, action.payload);
    },
    setPlacesLoaded: (state) => { state.placesLoaded = true; },

    // routes

    setRoutes: (state, action: PayloadAction<StoredRoute[]>) => { state.routes = action.payload; },
    updateRoute: (state, action: PayloadAction<{ route: StoredRoute, index: number }>) => {
      const { route, index } = action.payload;
      state.routes = updateItemImmutable(state.routes, route, index);
    },
    deleteRoute: (state, action: PayloadAction<number>) => {
      state.routes = deleteItemImmutable(state.routes, action.payload);
    },
    setRoutesLoaded: (state) => { state.routesLoaded = true; },

    // directions

    setDirections: (state, action: PayloadAction<StoredDirection[]>) => { state.directions = action.payload; },
    updateDirection: (state, action: PayloadAction<{ direction: StoredDirection, index: number }>) => {
      const { direction, index } = action.payload;
      state.directions = updateItemImmutable(state.directions, direction, index);
    },
    deleteDirection: (state, action: PayloadAction<number>) => {
      state.directions = deleteItemImmutable(state.directions, action.payload);
    },
    setDirectionsLoaded: (state) => { state.directionsLoaded = true; }
  }
});

export const {
  setCustomName,
  setCustomLocation,
  createCustomPlace,
  setPlaces,
  createPlace,
  updatePlace,
  deletePlace,
  setPlacesLoaded,
  setRoutes,
  updateRoute,
  deleteRoute,
  setRoutesLoaded,
  setDirections,
  updateDirection,
  deleteDirection,
  setDirectionsLoaded
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
