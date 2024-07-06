// store.ts
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Features/Users/userSlice";
import refreshReducer from "./Features/Estado";
import categoriasReducer from "../Redux/Features/Categorias/CategoriaSlice";

const store = configureStore({
  reducer: {
    users: usersReducer,
    categorias: categoriasReducer,
    refresh: refreshReducer, // Add the refresh slice
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
