import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

export interface Proveedor {
  id?: number;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  rnc: string;
  nombre: string;
  idEntidad?: number;
  fechaCreacion?: string;
  fechaModificacion?: string | null;
  enable?: boolean;
  entidad?: any;
}

export interface ProveedorRequest {
  id: number;
  descripcion: string;
  direccion: string;
  telefono: string;
  email: string;
  rnc: string;
  nombre: string;
}

interface SelectList {
  id: number;
  value: number;
  label: string;
}

interface ProveedorState {
  proveedores: Proveedor[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  selectList: SelectList[];
}

const initialState: ProveedorState = {
  proveedores: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
  selectList: [],
};

export const fetchProveedores = createAsyncThunk<
  { proveedores: Proveedor[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>(
  "proveedores/fetchProveedores",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      const response = await api.get<{
        result: Proveedor[];
        totalRecords: number;
      }>(`/api/Proveedores/${page}/${pageSize}`);
      const proveedores = response.data.result || [];
      const total = response.data.totalRecords;
      return { proveedores, total };
    } catch (error) {
      console.error("Error fetching proveedores:", error);
      if (error instanceof AxiosError) {
        return rejectWithValue("Error al obtener los proveedores");
      }
      return rejectWithValue("Error inesperado");
    }
  }
);

export const createProveedor = createAsyncThunk<
  Proveedor,
  ProveedorRequest,
  { rejectValue: string }
>("proveedores/createProveedor", async (proveedorData, { rejectWithValue }) => {
  try {
    const response = await api.post<Proveedor, any>(
      "/api/Proveedores",
      proveedorData
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al crear el proveedor");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Async thunk to update an existing proveedor
export const updateProveedor = createAsyncThunk<
  Proveedor,
  { id: number; proveedorData: Partial<Proveedor> },
  { rejectValue: string }
>(
  "proveedores/updateProveedor",
  async ({ id, proveedorData }, { rejectWithValue }) => {
    try {
      console.log(proveedorData);

      const response = await api.put<Proveedor, any>(
        `/api/Proveedores/?id=${id}`,
        proveedorData
      );
      console.log(response);
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue("Error al actualizar el proveedor");
      }
      return rejectWithValue("Error inesperado");
    }
  }
);

export const fetchProveedoresSelectList = createAsyncThunk<
  SelectList[], // Specify expected return type
  void,
  { rejectValue: string }
>("proveedores/fetchSelectList", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<SelectList[]>("/api/Proveedores/SelectList");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener la lista de proveedores");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Create the proveedores slice
const proveedorSlice = createSlice({
  name: "proveedores",
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
      .addCase(fetchProveedores.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProveedores.fulfilled, (state, action) => {
        state.proveedores = action.payload.proveedores;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchProveedores.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createProveedor.fulfilled, (state, action) => {
        // Add the newly created proveedor to the state
        state.proveedores.push(action.payload);
        state.total += 1;
      })
      .addCase(updateProveedor.fulfilled, (state, action) => {
        const index = state.proveedores.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.proveedores[index] = action.payload;
        }
      })
      .addCase(fetchProveedoresSelectList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProveedoresSelectList.fulfilled, (state, action) => {
        state.loading = false;
        state.selectList = action.payload;
      })
      .addCase(fetchProveedoresSelectList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, setPageSize } = proveedorSlice.actions;
export const selectProveedores = (state: RootState) =>
  state.proveedores.proveedores;
export const selectLoading = (state: RootState) => state.proveedores.loading;
export const selectTotal = (state: RootState) => state.proveedores.total;
export const selectPage = (state: RootState) => state.proveedores.page;
export const selectPageSize = (state: RootState) => state.proveedores.pageSize;
export const selectProveedoresSelectList = (state: RootState) =>
  state.proveedores.selectList;

export default proveedorSlice.reducer;
