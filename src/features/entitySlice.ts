import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Entity } from "../domain/types";

type EntityState = {
  back?: string;
  entity?: Entity;
};

const initialState = (): EntityState => {
  return {};
}

export const entitySlice = createSlice({
  name: "entity",
  initialState: initialState(),
  reducers: {
    setBack: (state, action: PayloadAction<string>) => { state.back = action.payload },
    setEntity: (state, action: PayloadAction<Entity>) => { state.entity = action.payload; }
  }
});

export const {
  setBack,
  setEntity
} = entitySlice.actions;

export default entitySlice.reducer;
