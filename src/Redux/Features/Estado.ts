// features/refresh/refreshSlice.ts
import { createSlice } from "@reduxjs/toolkit";

interface RefreshState {
  refresh: boolean;
}

const initialState: RefreshState = {
  refresh: false,
};

const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    toggleRefresh: (state) => {
      state.refresh = !state.refresh;
    },
  },
});

export const { toggleRefresh } = refreshSlice.actions;

export default refreshSlice.reducer;
