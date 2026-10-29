import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  status: "initializing" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "initializing",
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.status = "authenticated";
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "unauthenticated";
    },

    beginAuthInitialization: (state) => {
      state.status = "initializing";
    },
  },
});

export const { setCredentials, logout, beginAuthInitialization } =
  authSlice.actions;

export default authSlice.reducer;
