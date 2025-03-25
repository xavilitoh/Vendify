import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

interface Cliente {
  id: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  noDocumento: string;
  sexo: boolean;
  fullName: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  descripcion: string;
  enable: boolean;
  idEntidad: number;
}

interface ClienteState {
  clientes: Cliente[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: ClienteState = {
  clientes: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
};

export const fetchClientes = createAsyncThunk<
  { clientes: Cliente[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>("clientes/fetchClientes", async ({ page, pageSize }, { rejectWithValue }) => {
  try {
    const response = await api.get<{ result: Cliente[]; totalRecords: number }>(
      `/Clientes/${page}/${pageSize}`
    );
    return { clientes: response.data.result || [], total: response.data.totalRecords };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener los clientes");
    }
    return rejectWithValue("Error inesperado");
  }
});

const clienteSlice = createSlice({
  name: "clientes",
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
      .addCase(fetchClientes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.clientes = action.payload.clientes;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchClientes.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, setPageSize } = clienteSlice.actions;
export const selectClientes = (state: RootState) => state.clientes.clientes;
export const selectLoading = (state: RootState) => state.clientes.loading;
export const selectTotal = (state: RootState) => state.clientes.total;
export const selectPage = (state: RootState) => state.clientes.page;
export const selectPageSize = (state: RootState) => state.clientes.pageSize;

export default clienteSlice.reducer;
