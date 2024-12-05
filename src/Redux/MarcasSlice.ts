import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import api from "../Api/VendifyApi";

import { AxiosHeaders, AxiosError } from "axios";

export interface Entidad {
  id: number;
  nombre: string;
  rnc: string;
  idArchivo: number;
  foto: string;
  direccion: string;
  telefono1: string;
  telefono2: string;
  email: string;
}

export interface Marca {
  id: number;
  descripcion: string;
  enable: boolean;
  idEntidad: number;
  entidad: Entidad | null;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

interface MarcaState {
  marcas: Marca[];
  loading: boolean;
}

const initialState: MarcaState = {
  marcas: [],
  loading: false,
};

// Thunks
export const fetchMarcas = createAsyncThunk(
  "marcas/fetchMarcas",
  async () => {


    const response = await api.get("/Marcas");
    return response.data;
  }
);

export const createMarca = createAsyncThunk(
  "marcas/createMarca",
  async (marca: { descripcion: string; idEntidad?: number }, { rejectWithValue }) => {
    try {
  

      const response = await api.post("/Marcas", marca);

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(
          "Something went wrong while creating the marca"
        );
      }
    }
  }
);

interface UpdateMarcaPayload {
  id: number;
  descripcion: string;
  enable: boolean;
  idEntidad?: number;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

export const updateMarca = createAsyncThunk(
  "marcas/updateMarca",
  async (payload: UpdateMarcaPayload, { rejectWithValue }) => {
    try {

      const response = await api.put(
        `/marcas?id=${payload.id}`,
        payload
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("Error updating marca");
    }
  }
);

// Slice
const marcaSlice = createSlice({
  name: "marca",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarcas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMarcas.fulfilled, (state, action) => {
        state.marcas = action.payload;
        state.loading = false;
      })
      .addCase(fetchMarcas.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createMarca.fulfilled, (state, action) => {
        state.marcas.push(action.payload);
      });
  },
});

// Selectors
export const selectMarcas = (state: RootState) => state.marcas.marcas;
export const selectLoading = (state: RootState) => state.marcas.loading;

export default marcaSlice.reducer;
