// store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./UserSlice";
import CategoriasReducer from "./CategorySlice";
import MarcasSlice from "./MarcasSlice";
import PriceSlide from "./Price";
import SubCategorias from "./SubCategoriaSlice";
import UnidadesSlice from "./UnidadesSlice";
import ProductosLice from "./Productos";
import Sucursal from "./Sucursales";
import Almacenes from "./Almacenes";
import Proveedor from "./Proveedores";
import Compras from "./Compras";

export const store = configureStore({
  reducer: {
    user: userReducer,
    categorias: CategoriasReducer,
    marcas: MarcasSlice,
    precios: PriceSlide,
    subCategorias: SubCategorias,
    unidades: UnidadesSlice,
    productos: ProductosLice,
    sucursales: Sucursal,
    almacenes: Almacenes,
    proveedores: Proveedor,
    compras: Compras,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
