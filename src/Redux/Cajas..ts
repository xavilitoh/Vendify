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
}

const initialState: CajaState = {
  cajas: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
  selectList: [],
};

// Fetch cajas
export const fetchCajas = createAsyncThunk<
  { cajas: Caja[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>("cajas/fetchCajas", async ({ page, pageSize }, { rejectWithValue }) => {
  try {
    const response = await api.get<{ result: Caja[]; totalRecords: number }>(
      `/Cajas/${page}/${pageSize}`
    );
    console.log(response.data.result, "Cajas");

    const cajas = response.data.result || [];
    const total = response.data.totalRecords;

    return { cajas, total };
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener las cajas");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Fetch cajas select list
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

// Create caja
export const createCaja = createAsyncThunk<
  Caja,
  Omit<Caja, "id">,
  { rejectValue: string }
>("cajas/createCaja", async (cajaData, { rejectWithValue }) => {
  try {
    const response = await api.post<Caja, any>("/Cajas", cajaData);
    console.log(response.data, "Caja creada");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al crear la caja");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Update caja
export const updateCaja = createAsyncThunk<
  Caja,
  { id: number; cajaData: Partial<Caja> },
  { rejectValue: string }
>("cajas/updateCaja", async ({ id, cajaData }, { rejectWithValue }) => {
  try {
    const response = await api.put<Caja, any>(`/Cajas/${id}`, cajaData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al actualizar la caja");
    }
    return rejectWithValue("Error inesperado");
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
      });
  },
});

export const { setPage, setPageSize } = cajaSlice.actions;

// Selectors
export const selectCajas = (state: RootState) => state.cajas.cajas;
export const selectLoading = (state: RootState) => state.cajas.loading;
export const selectTotal = (state: RootState) => state.cajas.total;
export const selectPage = (state: RootState) => state.cajas.page;
export const selectPageSize = (state: RootState) => state.cajas.pageSize;
export const selectCajasSelectList = (state: RootState) =>
  state.cajas.selectList;

export default cajaSlice.reducer;
