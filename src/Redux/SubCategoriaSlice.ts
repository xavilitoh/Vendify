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

// State Interface
interface SubcategoriaState {
  subcategorias: Subcategoria[];
  loading: boolean;
}

// Initial State
const initialState: SubcategoriaState = {
  subcategorias: [],
  loading: false,
};

// Thunks
export const fetchSubcategorias = createAsyncThunk<Subcategoria[]>(
  "subcategorias/fetchSubcategorias",
  async () => {
    const response = await api.get<Subcategoria[]>("/Subcategorias");
    return response.data; // Ensure response is typed as Subcategoria[]
  }
);

export const createSubcategoria = createAsyncThunk<
  Subcategoria, // Return type
  { descripcion: string; iCategoria: number; idEntidad: number }, // Argument type
  { rejectValue: string } // Reject value type
>(
  "subcategorias/createSubcategoria",
  async (subcategoria, { rejectWithValue }) => {
    try {
      const response = await api.post<Subcategoria,any>(
        "/Subcategorias",
        subcategoria
      );
      return response.data; // Ensure response is typed as Subcategoria
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Error creating subcategoria");
      }
    }
  }
);

export const updateSubcategoria = createAsyncThunk<
  Subcategoria, // Return type
  Subcategoria, // Argument type
  { rejectValue: string } // Reject value type
>(
  "subcategorias/updateSubcategoria",
  async (subcategoria, { rejectWithValue }) => {
    try {
      const response = await api.put<Subcategoria,any>(
        `/Subcategorias?id=${subcategoria.id}`,
        subcategoria
      );
      return response.data; // Ensure response is typed as Subcategoria
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Error updating subcategoria");
      }
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
        state.subcategorias = action.payload; // Typed as Subcategoria[]
        state.loading = false;
      })
      .addCase(fetchSubcategorias.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createSubcategoria.fulfilled, (state, action) => {
        state.subcategorias.push(action.payload); // Typed as Subcategoria
      })
      .addCase(updateSubcategoria.fulfilled, (state, action) => {
        const index = state.subcategorias.findIndex(
          (subcategoria) => subcategoria.id === action.payload.id
        );
        if (index !== -1) {
          state.subcategorias[index] = action.payload; // Update the subcategoria in the array
        }
      });
  },
});

// Selectors
export const selectSubcategorias = (state: RootState) => state.subCategorias.subcategorias;
export const selectLoading = (state: RootState) => state.subCategorias.loading;

// Export Reducer
export default subcategoriaSlice.reducer;
