// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import CategoriasReducer from "./CategorySlice";
import MarcasSlice from './MarcasSlice'
import PriceSlide from './Price'
import SubCategorias from './SubCategoriaSlice'
import UnidadesSlice from './UnidadesSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    categorias: CategoriasReducer,
    marcas:MarcasSlice,
    precios:PriceSlide,
    subCategorias:SubCategorias,
    unidades:UnidadesSlice
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
