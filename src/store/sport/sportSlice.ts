// src/store/sport/sportSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SportType } from "@/types/sport";

interface SportState {
  activeSport: SportType | null;
}

const initialState: SportState = {
  activeSport: null,
};

const sportSlice = createSlice({
  name: "sport",
  initialState,
  reducers: {
    setActiveSport: (state, action: PayloadAction<SportType>) => {
      state.activeSport = action.payload;
    },

    clearActiveSport: (state) => {
      state.activeSport = null;
    },
  },
});

export const { setActiveSport, clearActiveSport } = sportSlice.actions;

export default sportSlice.reducer;
