import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

export interface Compra {
  id: number;
  factura: string;
  fechaFactura: string;
  idProveedor: number;
  proveedor: any | null;
  detalleDeCompras: any[];
  total: number;
  fechaCreacion: string;
  fechaModificacion: string | null;
  descripcion: string;
  enable: boolean;
  idEntidad: number;
  entidad: any | null;
}

interface ComprasState {
  compras: Compra[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: ComprasState = {
  compras: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
};

export const fetchCompras = createAsyncThunk<
  { compras: Compra[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>("compras/fetchCompras", async ({ page, pageSize }, { rejectWithValue }) => {
  try {
    /*     const response = await api.get<{ result: Compra[]; totalRecords: number }>(
      `/Compras/${page}/${pageSize}`
    ); */

    const response = await api.get("Compras");

    return {
      compras: response.data || [],
      total: /* response.data.totalRecords */ 0,
    };
  } catch (error) {
    console.error("Error fetching compras:", error);
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener las compras");
    }
    return rejectWithValue("Error inesperado");
  }
});

const comprasSlice = createSlice({
  name: "compras",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompras.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompras.fulfilled, (state, action) => {
        state.compras = action.payload.compras;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchCompras.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, setPageSize } = comprasSlice.actions;
export const selectCompras = (state: RootState) => state.compras.compras;
export const selectLoading = (state: RootState) => state.compras.loading;
export const selectTotal = (state: RootState) => state.compras.total;
export const selectPage = (state: RootState) => state.compras.page;
export const selectPageSize = (state: RootState) => state.compras.pageSize;

export default comprasSlice.reducer;
