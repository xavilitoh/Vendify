import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import api from "../Api/VendifyApi";
import Cookies from "js-cookie";
import { AxiosError } from "axios";

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

export interface Subcategoria {
  id: number;
  descripcion: string;
  enable: boolean;
  iCategoria: number;
  categoria: {
    id: number;
    descripcion: string;
    enable: boolean;
    fechaCreacion: string;
    fechaModificacion: string | null;
    idEntidad: number;
    entidad: Entidad | null;
  };
  fechaCreacion: string;
  fechaModificacion: string | null;
  idEntidad: number;
  entidad: Entidad | null;
}

interface SubcategoriaState {
  subcategorias: Subcategoria[];
  loading: boolean;
}

const initialState: SubcategoriaState = {
  subcategorias: [],
  loading: false,
};

// Thunks
export const fetchSubcategorias = createAsyncThunk(
  "subcategorias/fetchSubcategorias",
  async () => {
    const response = await api.get("/Subcategorias");
    console.log(response)
    return response.data;
  }
);

export const createSubcategoria = createAsyncThunk(
  "subcategorias/createSubcategoria",
  async (
    subcategoria: { descripcion: string; iCategoria: number; idEntidad: number },
    { rejectWithValue }
  ) => {
    try {
      const token = Cookies.get("token");
      console.log(subcategoria,'RRRR')
      const response = await api.post(
        "/Subcategorias",
        subcategoria,
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Error creating subcategoria");
      }
    }
  }
);

export const updateSubcategoria = createAsyncThunk(
  "subcategorias/updateSubcategoria",
  async (
    subcategoria: {
      id: number;
      descripcion: string;
      enable: boolean;
      iCategoria: number;
      idEntidad: number;
      entidad: Entidad | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const token = Cookies.get("token");

      const response = await api.put(
        `/Subcategorias?id=${subcategoria.id}`,
        subcategoria,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue("Error updating subcategoria");
    }
  }
);

// Slice
const subcategoriaSlice = createSlice({
  name: "subcategoria",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubcategorias.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSubcategorias.fulfilled, (state, action) => {
        state.subcategorias = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubcategorias.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createSubcategoria.fulfilled, (state, action) => {
        state.subcategorias.push(action.payload);
      });
  },
});

// Selectors
export const selectSubcategorias = (state: RootState) =>
  state.subcategorias.subcategorias;
export const selectLoading = (state: RootState) => state.subcategorias.loading;

export default subcategoriaSlice.reducer;
