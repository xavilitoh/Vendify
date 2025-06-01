import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

export interface InventarioItem {
  idProducto: number;
  idUnidadBase: number;
  unidad: string;
  abrebiaturaUnidad: string;
  nombreProducto: string;
  codigo: string;
  stock: number;
  stockMinimo: number;
}

interface InventarioState {
  items: InventarioItem[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: InventarioState = {
  items: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
};

// Fetch inventario paginated
export const fetchInventario = createAsyncThunk<
  { items: InventarioItem[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>(
  "inventario/fetchInventario",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await api.get<{
        result: InventarioItem[];
        totalRecords: number;
      }>(`/api/Inventario/${page}/${pageSize}`);

      console.log("Response:", response.data); // Log the response data

      const items = response.data.result || [];
      const total = response.data.totalRecords;

      return { items, total };
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue("Error al obtener el inventario");
      }
      return rejectWithValue("Error inesperado");
    }
  }
);

const inventarioSlice = createSlice({
  name: "inventario",
  initialState,
  reducers: {
    setInventarioPage: (state, action) => {
      state.page = action.payload;
    },
    setInventarioPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventario.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventario.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchInventario.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setInventarioPage, setInventarioPageSize } =
  inventarioSlice.actions;

// Selectors
export const selectInventario = (state: RootState) => state.inventario.items;
export const selectInventarioLoading = (state: RootState) =>
  state.inventario.loading;
export const selectInventarioTotal = (state: RootState) =>
  state.inventario.total;
export const selectInventarioPage = (state: RootState) => state.inventario.page;
export const selectInventarioPageSize = (state: RootState) =>
  state.inventario.pageSize;

export default inventarioSlice.reducer;
