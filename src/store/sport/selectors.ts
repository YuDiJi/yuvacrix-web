// src/store/sport/selectors.ts

import { RootState } from "../index";

export const selectActiveSport = (state: RootState) => state.sport.activeSport;
