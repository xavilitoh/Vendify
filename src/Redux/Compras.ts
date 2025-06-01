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
>("compras/fetchCompras", async ({}, { rejectWithValue }) => {
  try {
    const response = await api.get<Compra[]>("/api/Compras");
    return {
      compras: response.data || [],
      total: 0,
    };
  } catch (error) {
    console.error("Error fetching compras:", error);
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener las compras");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const createCompra = createAsyncThunk<
  Compra,
  Compra,
  { rejectValue: string }
>("compras/createCompra", async (newCompra, { rejectWithValue }) => {
  try {
    const response = await api.post<Compra, any>("/api/Compras", newCompra);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error creating compra:", error);
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al crear la compra");
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
      })
      .addCase(createCompra.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCompra.fulfilled, (state, action) => {
        state.compras.push(action.payload);
        state.loading = false;
      })
      .addCase(createCompra.rejected, (state) => {
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
