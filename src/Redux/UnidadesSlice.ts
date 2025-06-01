import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

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

export interface Unidad {
  id: number;
  descripcion: string;
  abreviatura: string;
  idEntidad: number;
  fechaCreacion: string;
  fechaModificacion: string | null;
  enable: boolean;
  Entidad: Entidad | null;
}

interface UnidadState {
  unidades: Unidad[];
  loading: boolean;
}

const initialState: UnidadState = {
  unidades: [],
  loading: false,
};

// Fetch Unidades
export const fetchUnidades = createAsyncThunk<
  Unidad[],
  void,
  { rejectValue: string }
>("unidades/fetchUnidades", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Unidad[]>("/api/Unidades");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue("Error al obtener las unidades");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Create Unidad
export const createUnidad = createAsyncThunk<
  Unidad,
  { descripcion: string; abreviatura: string; idEntidad: number },
  { rejectValue: string }
>("unidades/createUnidad", async (unidadData, { rejectWithValue }) => {
  try {
    const response = await api.post<Unidad,any>("/api/Unidades", unidadData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue("Error al crear la unidad");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Update Unidad (Edit)
export const updateUnidad = createAsyncThunk<
  Unidad,
  { id: number; descripcion: string; abreviatura: string; enable: boolean },
  { rejectValue: string }
>("unidades/updateUnidad", async (unidadData, { rejectWithValue }) => {
  try {
    const response = await api.put<Unidad,any>(
      `/api/Unidades?id=${unidadData.id}`,
      unidadData
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue("Error al actualizar la unidad");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Slice
const unidadSlice = createSlice({
  name: "unidad",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUnidades.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUnidades.fulfilled, (state, action) => {
        state.unidades = action.payload;
        state.loading = false;
      })
      .addCase(fetchUnidades.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createUnidad.fulfilled, (state, action) => {
        state.unidades.push(action.payload);
      })
      .addCase(updateUnidad.fulfilled, (state, action) => {
        const index = state.unidades.findIndex(
          (unidad) => unidad.id === action.payload.id
        );
        if (index !== -1) {
          state.unidades[index] = action.payload; // Update the specific Unidad
        }
      });
  },
});

// Selectors
export const selectUnidades = (state: RootState) => state.unidades.unidades;
export const selectLoading = (state: RootState) => state.unidades.loading;

export default unidadSlice.reducer;
