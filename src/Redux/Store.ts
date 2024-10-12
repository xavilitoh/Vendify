// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import CategoriasReducer from "./CategorySlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    categorias: CategoriasReducer,
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
