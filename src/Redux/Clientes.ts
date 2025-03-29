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
    return {
      clientes: response.data.result || [],
      total: response.data.totalRecords,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener los clientes");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const createCliente = createAsyncThunk<
  Cliente,
  Omit<
    Cliente,
    | "id"
    | "fullName"
    | "fechaCreacion"
    | "fechaModificacion"
    | "descripcion"
    | "enable"
    | "idEntidad"
  >,
  { rejectValue: string }
>("clientes/createCliente", async (clienteData, { rejectWithValue }) => {
  try {
    console.log(clienteData);
    const response = await api.post<Cliente, any>("/Clientes", clienteData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al crear el cliente");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const updateCliente = createAsyncThunk<
  Cliente,
  Cliente,
  { rejectValue: string }
>("clientes/updateCliente", async (cliente, { rejectWithValue }) => {
  try {
    console.log(cliente);
    const response = await api.put(`/Clientes/?id=${cliente.id}`, cliente);
    return response.data;
  } catch (error) {
    return rejectWithValue("Error al actualizar el cliente");
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
      })
      .addCase(createCliente.fulfilled, (state, action) => {
        state.clientes.push(action.payload);
      })
      .addCase(updateCliente.fulfilled, (state, action) => {
        state.clientes = state.clientes.map((cliente) =>
          cliente.id === action.payload.id ? action.payload : cliente
        );
      })
      .addCase(updateCliente.rejected, (state) => {
        console.log("Error updating client");
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
