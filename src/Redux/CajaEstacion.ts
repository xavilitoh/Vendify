import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

export interface CajaEstacion {
  id: number;
  descripcion: string;
  idSucursal: number;
  estado?: number; // Se agregó opcional para poder editar estado
}

interface CajaEstacionState {
  cajaEstaciones: CajaEstacion[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: CajaEstacionState = {
  cajaEstaciones: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
};

// FETCH
export const fetchCajaEstaciones = createAsyncThunk<
  { cajaEstaciones: CajaEstacion[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>("cajaEstaciones/fetchCajaEstaciones", async ({ page, pageSize }, { rejectWithValue }) => {
  try {
    const response = await api.get<{ result: CajaEstacion[]; totalRecords: number }>(
      `/CajaEstacion/${page}/${pageSize}`
    );
    const cajaEstaciones = response.data.result || [];
    const total = response.data.totalRecords;
    return { cajaEstaciones, total };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener las cajas estación");
    }
    return rejectWithValue("Error inesperado");
  }
});

// CREATE
export const createCajaEstacion = createAsyncThunk<
  CajaEstacion,
  Omit<CajaEstacion, "id">,
  { rejectValue: string }
>("cajaEstaciones/createCajaEstacion", async (cajaEstacionData, { rejectWithValue }) => {
  try {
    const response = await api.post<CajaEstacion, any>("/CajaEstacion", cajaEstacionData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al crear la caja estación");
    }
    return rejectWithValue("Error inesperado");
  }
});

// UPDATE
export const updateCajaEstacion = createAsyncThunk<
  CajaEstacion,
  { id: number; data: Partial<CajaEstacion> },
  { rejectValue: string }
>("cajaEstaciones/updateCajaEstacion", async ({ id, data }, { rejectWithValue }) => {
  try {
    console.log(data)
    const response = await api.put<CajaEstacion,any>(`/CajaEstacion/${id}`, data);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al actualizar la caja estación");
    }
    return rejectWithValue("Error inesperado");
  }
});

const cajaEstacionSlice = createSlice({
  name: "cajaEstaciones",
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
      .addCase(fetchCajaEstaciones.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCajaEstaciones.fulfilled, (state, action) => {
        state.cajaEstaciones = action.payload.cajaEstaciones;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchCajaEstaciones.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createCajaEstacion.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCajaEstacion.fulfilled, (state, action) => {
        state.cajaEstaciones.push(action.payload);
        state.loading = false;
      })
      .addCase(createCajaEstacion.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updateCajaEstacion.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCajaEstacion.fulfilled, (state, action) => {
        const index = state.cajaEstaciones.findIndex(caja => caja.id === action.payload.id);
        if (index !== -1) {
          state.cajaEstaciones[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateCajaEstacion.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, setPageSize } = cajaEstacionSlice.actions;

export const selectCajaEstaciones = (state: RootState) => state.cajasEstacion.cajaEstaciones;
export const selectLoading = (state: RootState) => state.cajasEstacion.loading;
export const selectTotal = (state: RootState) => state.cajasEstacion.total;
export const selectPage = (state: RootState) => state.cajasEstacion.page;
export const selectPageSize = (state: RootState) => state.cajasEstacion.pageSize;

export default cajaEstacionSlice.reducer;
