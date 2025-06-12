// src/store/slices/ventasSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

// Interfaces
interface ProductoVenta {
  id: number;
  nombre: string;
  descripcion: string;
  barCode: string;
  conImpuesto: boolean;
  idMarca: number;
  idUnidad: number;
  idCategoria: number;
  idSubcategoria: number;
  stockMinimo: number;
  precios: any[];
}

interface DetalleVenta {
  id: number;
  idVenta: number;
  idProducto: number;
  cantidad: number;
  precio: number;
  impuestos: number;
  total: number;
  subTotal: number;
  descripcion: string;
  producto: ProductoVenta;
}

export interface Venta {
  id: number;
  idCliente: number;
  cliente: any;
  detalles: DetalleVenta[];
  total: number;
  subTotal: number;
  impuestos: number;
  fechaCreacion: string;
  descripcion: string;
}

interface VentasState {
  ventas: Venta[];
  total: number;
  page: number;
  pageSize: number;
  loading: boolean;
}

const initialState: VentasState = {
  ventas: [],
  total: 0,
  page: 1,
  pageSize: 8,
  loading: false,
};

// Thunks
export const fetchVentas = createAsyncThunk<
  { ventas: Venta[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>("ventas/fetchVentas", async ({ page, pageSize }, { rejectWithValue }) => {
  try {
    const res = await api.get<{ result: Venta[]; totalRecords: number }>(
      `/api/Ventas/${page}/${pageSize}`
    );
    console.log("Ventas obtenidas:", res.data.result);
    return {
      ventas: res.data.result,
      total: res.data.totalRecords,
    };
  } catch (error) {
    console.error("Error al obtener las ventas:", error);
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener las ventas");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const createVenta = createAsyncThunk<
  void,
  { idCliente: number; detalles: DetalleVenta[] },
  { rejectValue: string }
>("ventas/createVenta", async (venta, { rejectWithValue }) => {
  try {
    await api.post("/api/Ventas", venta);
  } catch (error) {
  if (error instanceof AxiosError) {
    console.log(error.response?.data?.message)
  return rejectWithValue(error.response?.data?.message || "Error al crear la venta");
}
    return rejectWithValue("Error inesperado");
  }
});

// Slice
const ventasSlice = createSlice({
  name: "ventas",
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
      .addCase(fetchVentas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVentas.fulfilled, (state, action) => {
        state.ventas = action.payload.ventas;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchVentas.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createVenta.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVenta.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createVenta.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, setPageSize } = ventasSlice.actions;

// Selectors
export const selectVentas = (state: RootState) => state.ventas.ventas;
export const selectVentasLoading = (state: RootState) => state.ventas.loading;
export const selectTotal = (state: RootState) => state.ventas.total;
export const selectPage = (state: RootState) => state.ventas.page;
export const selectPageSize = (state: RootState) => state.ventas.pageSize;

export default ventasSlice.reducer;
