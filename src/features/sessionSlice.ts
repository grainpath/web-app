import { createSlice } from "@reduxjs/toolkit";

type SessionState = {
  login: boolean;
  solid: boolean;
}

const initialState = (): SessionState => {
  return { login: false, solid: false };
};

export const sessionSlice = createSlice({
  name: "session",
  initialState: initialState(),
  reducers: {
    logout: () => { return initialState(); },
    setLogin: (state) => { state.login = true; },
    setSolid: (state) => { state.solid = true; }
  }
});

export const {
  logout,
  setLogin,
  setSolid
} = sessionSlice.actions;

export default sessionSlice.reducer;
