import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";

// Entity Interface
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

// Marca Interface
export interface Marca {
  id: number;
  descripcion: string;
  enable: boolean;
  idEntidad: number;
  entidad: Entidad | null;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

// State Interface
interface MarcaState {
  marcas: Marca[];
  loading: boolean;
}

// Initial State
const initialState: MarcaState = {
  marcas: [],
  loading: false,
};

// Fetch Marcas Thunk
export const fetchMarcas = createAsyncThunk<Marca[]>(
  "marcas/fetchMarcas",
  async () => {
    const response = await api.get<Marca[]>("/Marcas");
    return response.data;
  }
);

// Create Marca Thunk
export const createMarca = createAsyncThunk<
  Marca, // Return type
  { descripcion: string; idEntidad?: number }, // Argument type
  { rejectValue: string } // Reject value type
>(
  "marcas/createMarca",
  async (marca, { rejectWithValue }) => {
    try {
      const response = await api.post<Marca,any>("/Marcas", marca);
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

// Update Marca Thunk
interface UpdateMarcaPayload {
  id: number;
  descripcion: string;
  enable: boolean;
  idEntidad?: number;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

export const updateMarca = createAsyncThunk<
  Marca, // Return type
  UpdateMarcaPayload, // Argument type
  { rejectValue: string } // Reject value type
>(
  "marcas/updateMarca",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.put<Marca,any>(
        `/Marcas?id=${payload.id}`,
        payload
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Error updating marca");
      }
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
        state.marcas = action.payload; // Correctly typed as Marca[]
        state.loading = false;
      })
      .addCase(fetchMarcas.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createMarca.fulfilled, (state, action) => {
        state.marcas.push(action.payload); // Correctly typed as Marca
      })
      .addCase(updateMarca.fulfilled, (state, action) => {
        const index = state.marcas.findIndex(
          (marca) => marca.id === action.payload.id
        );
        if (index !== -1) {
          state.marcas[index] = action.payload; // Update the marca in the array
        }
      });
  },
});

// Selectors
export const selectMarcas = (state: RootState) => state.marcas.marcas;
export const selectLoading = (state: RootState) => state.marcas.loading;

// Export Reducer
export default marcaSlice.reducer;
