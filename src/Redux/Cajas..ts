import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

export interface Caja {
  id: number;
  idSucursal: number;
  idCajaEstacion: number;
  idUsuario: number;
  abierta: boolean;
  fechaApertura: string;
  fechaCierre: string;
  montoApertura: number;
  montoCierre: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalOtrosMedios: number;
  numeroTransacciones: number;
  estado: number;
  codigoSeguridad: string;
  totalVentas: number;
  totalDevoluciones: number;
}

interface SelectList {
  id: number;
  value: number;
  label: string;
}

interface CajaState {
  cajas: Caja[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  selectList: SelectList[];
  cajaActual: Caja | null;
}

const initialState: CajaState = {
  cajas: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
  selectList: [],
  cajaActual: null,
};

export const checkCajaAbierta = createAsyncThunk(
  "cajas/checkCajaAbierta",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/cajas/Actual");
      return response.data || null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error verificando caja"
      );
    }
  }
);

export const fetchCajas = createAsyncThunk<
  { cajas: Caja[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>("cajas/fetchCajas", async ({ page, pageSize }, { rejectWithValue }) => {
  try {
    const response = await api.get<{ result: Caja[]; totalRecords: number }>(
      `/Cajas/${page}/${pageSize}`
    );
    return {
      cajas: response.data.result || [],
      total: response.data.totalRecords,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener las cajas");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const fetchCajasSelectList = createAsyncThunk<
  SelectList[],
  void,
  { rejectValue: string }
>("cajas/fetchSelectList", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<SelectList[]>("/Cajas/SelectList");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener la lista de cajas");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const abrirCaja = createAsyncThunk<
  Caja,
  { idCajaEstacion: number; montoApertura: number },
  { rejectValue: { message: string } }
>("cajas/abrirCaja", async ({ idCajaEstacion, montoApertura }, { rejectWithValue }) => {
  try {
    const response = await api.post("/Cajas/open", { idCajaEstacion, montoApertura });
    return response.data;
  } catch (error: any) {
    return rejectWithValue({ message: error.response?.data?.message || "Error inesperado al abrir la caja" });
  }
});

export const cerrarCaja = createAsyncThunk<
  Caja,
  { idCajaEstacion: number; montoCierre: number },
  { rejectValue: { message: string } }
>("cajas/cerrarCaja", async ({ idCajaEstacion, montoCierre }, { rejectWithValue }) => {
  try {
    const response = await api.post("/Cajas/close", { idCajaEstacion, montoCierre });
    return response.data;
  } catch (error: any) {
    return rejectWithValue({ message: error.response?.data?.message || "Error inesperado al cerrar la caja" });
  }
});

const cajaSlice = createSlice({
  name: "cajas",
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
      .addCase(fetchCajas.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCajas.fulfilled, (state, action) => {
        state.cajas = action.payload.cajas;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchCajas.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchCajasSelectList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCajasSelectList.fulfilled, (state, action) => {
        state.loading = false;
        state.selectList = action.payload;
      })
      .addCase(fetchCajasSelectList.rejected, (state) => {
        state.loading = false;
      })
      .addCase(abrirCaja.fulfilled, (state, action) => {
        const updatedCaja = action.payload;
        const index = state.cajas.findIndex(c => c.idCajaEstacion === updatedCaja.idCajaEstacion);
        if (index !== -1) state.cajas[index] = updatedCaja;
        else state.cajas.push(updatedCaja);
      })
      .addCase(cerrarCaja.fulfilled, (state, action) => {
        const updatedCaja = action.payload;
        const index = state.cajas.findIndex(c => c.idCajaEstacion === updatedCaja.idCajaEstacion);
        if (index !== -1) state.cajas[index] = updatedCaja;
      })
      .addCase(checkCajaAbierta.fulfilled, (state, action) => {
        state.cajaActual = action.payload;
      });
  },
});

export const { setPage, setPageSize } = cajaSlice.actions;

export const selectCajas = (state: RootState) => state.cajas.cajas;
export const selectLoading = (state: RootState) => state.cajas.loading;
export const selectTotal = (state: RootState) => state.cajas.total;
export const selectPage = (state: RootState) => state.cajas.page;
export const selectPageSize = (state: RootState) => state.cajas.pageSize;
export const selectCajasSelectList = (state: RootState) => state.cajas.selectList;
export const selectCajaActual = (state: RootState) => state.cajas.cajaActual;

export default cajaSlice.reducer;
