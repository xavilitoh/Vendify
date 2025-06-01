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

// Price Interface
export interface Price {
  id: number;
  descripcion: string;
  enable: boolean;
  idEntidad: number;
  entidad: Entidad | null;
}

// State Interface
interface PriceState {
  prices: Price[];
  loading: boolean;
}

// Initial State
const initialState: PriceState = {
  prices: [],
  loading: false,
};

// Fetch Prices Thunk
export const fetchPrices = createAsyncThunk<Price[]>(
  "prices/fetchPrices",
  async () => {
    const response = await api.get<Price[]>("/api/precios");
    return response.data; // Ensure response is typed as Price[]
  }
);

// Create Price Thunk
export const createPrice = createAsyncThunk<
  Price, // Return type
  { descripcion: string }, // Argument type
  { rejectValue: string } // Reject value type
>(
  "prices/createPrice",
  async (price, { rejectWithValue }) => {
    try {
      const response = await api.post<Price,any>(
        "/api/precios",
        { descripcion: price.descripcion }
      );
      return response.data; // Ensure response is typed as Price
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Something went wrong while creating the price");
      }
    }
  }
);

// Update Price Thunk
export const updatePrice = createAsyncThunk<
  Price, // Return type
  Price, // Argument type
  { rejectValue: string } // Reject value type
>(
  "prices/updatePrice",
  async (price, { rejectWithValue }) => {
    try {
      const response = await api.put<Price,any>(
        `/api/precios?id=${price.id}`,
        price
      );
      return response.data; // Ensure response is typed as Price
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Error updating price");
      }
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
        state.prices = action.payload; // Correctly typed as Price[]
        state.loading = false;
      })
      .addCase(fetchPrices.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createPrice.fulfilled, (state, action) => {
        state.prices.push(action.payload); // Correctly typed as Price
      })
      .addCase(updatePrice.fulfilled, (state, action) => {
        const index = state.prices.findIndex(
          (price) => price.id === action.payload.id
        );
        if (index !== -1) {
          state.prices[index] = action.payload; // Update the price in the array
        }
      });
  },
});

// Selectors
export const selectPrices = (state: RootState) => state.precios.prices;
export const selectLoading = (state: RootState) => state.precios.loading;

// Export Reducer
export default priceSlice.reducer;
