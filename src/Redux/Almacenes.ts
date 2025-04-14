import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

export interface Entidad {
  id: number;
  nombre: string;
  rnc: string;
  idArchivo: number | null;
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
  idEntidad: number;
  entidad: Entidad | null;
}

export interface Almacen {
  id: number;
  idSucursal: number;
  descripcion: string;
  direccion: string;
  sucursal?: Sucursal;
  fechaCreacion?: string;
  fechaModificacion?: string | null;
  enable?: boolean;
  idEntidad?: number;
  entidad?: Entidad | null;
}




// Fetch Almacenes
interface AlmacenesState {
  almacenes: Almacen[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

const initialState: AlmacenesState = {
  almacenes: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  pageSize: 8,
};

// Fetch with pagination
export const fetchAlmacenes = createAsyncThunk<
  { almacenes: Almacen[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>("almacenes/fetchAlmacenes", async ({ page, pageSize }, { rejectWithValue }) => {
  console.log( "Almacenes");
  try {
    const response = await api.get<{ result: Almacen[]; totalRecords: number }>(
      `/Almacenes/${page}/${pageSize}`
    );
    console.log(response.data.result, "Almacenes");
    return {
      almacenes: response.data.result,
      total: response.data.totalRecords,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener los almacenes");
    }
    return rejectWithValue("Error inesperado");
  }
});


// Create Almacen
export const createAlmacen = createAsyncThunk<
  Almacen,
  Omit<Almacen, "id">,
  { rejectValue: string }
>("almacenes/createAlmacen", async (almacenData, { rejectWithValue }) => {
  console.log(almacenData);

  try {
    const response = await api.post<Almacen, any>("/Almacenes", almacenData);

    console.log(response,"Create");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Error al crear el almacén"
      );
    }
    return rejectWithValue("Error inesperado");
  }
});

// Update Almacen
export const updateAlmacen = createAsyncThunk<
  Almacen,
  { id: number; almacenData: Partial<Almacen> },
  { rejectValue: string }
>(
  "almacenes/updateAlmacen",
  async ({ id, almacenData }, { rejectWithValue }) => {
    console.log(id, almacenData);
    try {
      const response = await api.put<Almacen, any>(
        `/Almacenes?id=${id}`,
        almacenData
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error al actualizar el almacén"
      );
    }
  }
);

const almacenesSlice = createSlice({
  name: "almacenes",
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
    builder
    .addCase(fetchAlmacenes.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAlmacenes.fulfilled, (state, action) => {
      state.almacenes = action.payload.almacenes;
      state.total = action.payload.total;
      state.loading = false;
    })
    .addCase(fetchAlmacenes.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload || "Error inesperado al obtener los almacenes";
    })
      .addCase(createAlmacen.fulfilled, (state, action) => {
        state.almacenes.push(action.payload);
      })
      .addCase(createAlmacen.rejected, (state, action) => {
        state.error = action.payload || "Error inesperado al crear el almacén";
      }) 
      .addCase(updateAlmacen.fulfilled, (state, action) => {
        const index = state.almacenes.findIndex(
          (almacen) => almacen.id === action.payload.id
        );
        if (index !== -1) {
          state.almacenes[index] = action.payload;
        }
      })
      .addCase(updateAlmacen.rejected, (state, action) => {
        state.error =
          action.payload || "Error inesperado al actualizar el almacén";
      });
  },
});

export const { setPage, setPageSize } = almacenesSlice.actions;

export const selectAlmacenes = (state: RootState) => state.almacenes.almacenes;
export const selectLoading = (state: RootState) => state.almacenes.loading;
export const selectError = (state: RootState) => state.almacenes.error;
export const selectTotal = (state: RootState) => state.almacenes.total;
export const selectPage = (state: RootState) => state.almacenes.page;
export const selectPageSize = (state: RootState) => state.almacenes.pageSize;

export default almacenesSlice.reducer;