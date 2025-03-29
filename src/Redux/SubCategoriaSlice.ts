import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";

// Entidad Interface
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

// Subcategoria Interface
export interface Subcategoria {
  id: number;
  descripcion: string;
  enable: boolean;
  idCategoria: number;
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

// State Interface
interface SubcategoriaState {
  subcategorias: Subcategoria[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: SubcategoriaState = {
  subcategorias: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchSubcategorias = createAsyncThunk<
  Subcategoria[],
  void,
  { rejectValue: string }
>("subcategorias/fetchSubcategorias", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Subcategoria[]>("/Subcategorias");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data);
    }
    return rejectWithValue("Error fetching subcategorias");
  }
});

export const createSubcategoria = createAsyncThunk<
  Subcategoria,
  { descripcion: string; idCategoria: number; idEntidad: number },
  { rejectValue: string }
>(
  "subcategorias/createSubcategoria",
  async (subcategoria, { rejectWithValue }) => {
    try {
      console.log(subcategoria);
      const response = await api.post<Subcategoria, any>(
        "/Subcategorias",
        subcategoria
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("Error creating subcategoria");
    }
  }
);

export const updateSubcategoria = createAsyncThunk<
  Subcategoria,
  Subcategoria,
  { rejectValue: string }
>(
  "subcategorias/updateSubcategoria",
  async (subcategoria, { rejectWithValue }) => {
    try {
      const response = await api.put<Subcategoria, any>(
        `/Subcategorias?id=${subcategoria.id}`,
        subcategoria
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      }
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
        state.error = null;
      })
      .addCase(fetchSubcategorias.fulfilled, (state, action) => {
        state.subcategorias = action.payload;
        state.loading = false;
      })
      .addCase(fetchSubcategorias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch subcategorias";
      })
      .addCase(createSubcategoria.fulfilled, (state, action) => {
        state.subcategorias.push(action.payload);
      })
      .addCase(createSubcategoria.rejected, (state, action) => {
        state.error = action.payload || "Failed to create subcategoria";
      })
      .addCase(updateSubcategoria.fulfilled, (state, action) => {
        const index = state.subcategorias.findIndex(
          (subcategoria) => subcategoria.id === action.payload.id
        );
        if (index !== -1) {
          state.subcategorias[index] = action.payload;
        }
      })
      .addCase(updateSubcategoria.rejected, (state, action) => {
        state.error = action.payload || "Failed to update subcategoria";
      });
  },
});

// Selectors
export const selectSubcategorias = (state: RootState) =>
  state.subCategorias.subcategorias;
export const selectLoading = (state: RootState) => state.subCategorias.loading;
export const selectError = (state: RootState) => state.subCategorias.error;

// Export Reducer
export default subcategoriaSlice.reducer;
