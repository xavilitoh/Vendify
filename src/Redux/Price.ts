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

export interface Price {
  id: number;
  descripcion: string;
  enable:boolean;
  idEntidad:Number;
  entidad:Entidad | null
}

interface PriceState {
  prices: Price[];
  loading: boolean;
}

const initialState: PriceState = {
  prices: [],
  loading: false,
};

// Thunks
export const fetchPrices = createAsyncThunk("precios", async () => {


  const response = await api.get("/precios");
  return response.data;
});

export const createPrice = createAsyncThunk(
  "prices/createPrice",
  async (price: { descripcion: string }, { rejectWithValue }) => {
    try {
     
      const response = await api.post(
        "/precios",
        { descripcion: price.descripcion }
      );

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Something went wrong while creating the price");
      }
    }
  }
);

export const updatePrice = createAsyncThunk(
  "prices/updatePrice",
  async (
    price: {
      id: number;
      descripcion: string;
      enable: boolean;
      idEntidad: number;
      entidad: {
        id: number;
        nombre: string;
        rnc: string;
        idArchivo: number;
        foto: string;
        direccion: string;
        telefono1: string;
        telefono2: string;
        email: string;
      } | null;
    },
    { rejectWithValue }
  ) => {
    try {

      const response = await api.put(
        `/precios?id=${price.id}`,
        price,
      );

      console.log(response)

      return response.data;
    } catch (error) {
      console.log(error)
      return rejectWithValue("Error updating price");
    }
  }
);



// Slice
const priceSlice = createSlice({
  name: "price",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrices.fulfilled, (state, action) => {
        state.prices = action.payload;
        state.loading = false;
      })
      .addCase(fetchPrices.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createPrice.fulfilled, (state, action) => {
        state.prices.push(action.payload);
      });
  },
});

// Selectors
export const selectPrices = (state: RootState) => state.prices.prices;
export const selectLoading = (state: RootState) => state.prices.loading;

export default priceSlice.reducer;
