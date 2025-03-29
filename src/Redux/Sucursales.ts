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

export interface Sucursal {
  direccion: string;
  telefono: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  id: number;
  descripcion: string;
  enable: boolean;
  idEntidad: string | null;
  entidad: Entidad | null;
}

interface SucursalesState {
  sucursales: Sucursal[];
  loading: boolean;
}

const initialState: SucursalesState = {
  sucursales: [],
  loading: false,
};

// Fetch Sucursales
export const fetchSucursales = createAsyncThunk<
  Sucursal[],
  void,
  { rejectValue: string }
>("sucursales/fetchSucursales", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Sucursal[]>("/Sucursales");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener las sucursales");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Create Sucursal
export const createSucursal = createAsyncThunk<
  Sucursal,
  Omit<Sucursal, "id">,
  { rejectValue: string }
>("sucursales/createSucursal", async (sucursalData, { rejectWithValue }) => {
  try {
    const response = await api.post<Sucursal, any>("/Sucursales", sucursalData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al crear la sucursal");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Update Sucursal
export const updateSucursal = createAsyncThunk<
  any, // Can return success or error
  { id: number; sucursalData: Partial<Sucursal> },
  { rejectValue: string }
>(
  "sucursales/updateSucursal",
  async ({ id, sucursalData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/Sucursales?id=${id}`, sucursalData); // FIXED
      return response.data;
    } catch (error: any) {
      console.error("Error updating sucursal:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || "Error al actualizar la sucursal"
      );
    }
  }
);

const sucursalesSlice = createSlice({
  name: "sucursales",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSucursales.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSucursales.fulfilled, (state, action) => {
        state.sucursales = action.payload;
        state.loading = false;
      })
      .addCase(fetchSucursales.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createSucursal.fulfilled, (state, action) => {
        state.sucursales.push(action.payload);
      })
      .addCase(updateSucursal.fulfilled, (state, action) => {
        const index = state.sucursales.findIndex(
          (sucursal) => sucursal.id === action.payload.id
        );
        if (index !== -1) {
          state.sucursales[index] = action.payload;
        }
      })
      .addCase(updateSucursal.rejected, (action) => {
        console.error("Error updating sucursal:", action);
      }); // NEW: Handle errors properly
  },
});

export const selectSucursales = (state: RootState) =>
  state.sucursales.sucursales;
export const selectLoading = (state: RootState) => state.sucursales.loading;

export default sucursalesSlice.reducer;
