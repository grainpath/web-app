import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { deleteItemImmutable, updateItemImmutable } from "./immutable";
import {
  StoredDirection,
  StoredPlace,
  StoredRoute,
  UiPlace
} from "../domain/types";

type FavouritesState = {
  name: string;
  note: string;
  place?: UiPlace;
  loaded: boolean;
  places: StoredPlace[];
  routes: StoredRoute[];
  directions: StoredDirection[];
};

const initialState = (): FavouritesState => {
  return { name: "", note: "", loaded: false, places: [], routes: [], directions: [] };
};

export const favouritesSlice = createSlice({
  name: "favourites",
  initialState: initialState(),
  reducers: {

    // create place

    setName: (state, action: PayloadAction<string>) => { state.name = action.payload; },
    setNote: (state, action: PayloadAction<string>) => { state.note = action.payload; },
    setLocation: (state, action: PayloadAction<UiPlace | undefined>) => { state.place = action.payload; },
    createPlace: (state, action: PayloadAction<StoredPlace>) => {
      state.name = ""; state.note = ""; state.place = undefined;
      state.places = updateItemImmutable(state.places, action.payload, state.places.length);
    },

    // storage

    setLoaded: (state) => { state.loaded = true; },

    // places

    setPlaces: (state, action: PayloadAction<StoredPlace[]>) => { state.places = action.payload; },
    updatePlace: (state, action: PayloadAction<{ place: StoredPlace, i: number }>) => {
      const { place, i } = action.payload;
      state.places = updateItemImmutable(state.places, place, i);
    },
    deletePlace: (state, action: PayloadAction<number>) => {
      state.places = deleteItemImmutable(state.places, action.payload);
    },

    // routes

    setRoutes: (state, action: PayloadAction<StoredRoute[]>) => { state.routes = action.payload; },
    updateRoute: (state, action: PayloadAction<{ route: StoredRoute, i: number }>) => {
      const { route, i } = action.payload;
      state.routes = updateItemImmutable(state.routes, route, i);
    },
    deleteRoute: (state, action: PayloadAction<number>) => {
      state.routes = deleteItemImmutable(state.routes, action.payload);
    },

    // directions

    setDirections: (state, action: PayloadAction<StoredDirection[]>) => { state.directions = action.payload; },
    updateDirection: (state, action: PayloadAction<{ direction: StoredDirection, i: number }>) => {
      const { direction, i } = action.payload;
      state.directions = updateItemImmutable(state.directions, direction, i);
    },
    deleteDirection: (state, action: PayloadAction<number>) => {
      state.directions = deleteItemImmutable(state.directions, action.payload);
    }
  }
});

export const {
  setName,
  setNote,
  setLocation,
  createPlace,
  setLoaded,
  setPlaces,
  updatePlace,
  deletePlace,
  setRoutes,
  updateRoute,
  deleteRoute,
  setDirections,
  updateDirection,
  deleteDirection
} = favouritesSlice.actions;

export default favouritesSlice.reducer;
