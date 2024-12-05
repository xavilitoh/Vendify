// Redux/CategorySlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import api from "../Api/VendifyApi";
import Cookies from "js-cookie";
import { AxiosHeaders, AxiosError } from "axios";

export interface categorias {
  id: number;
  descripcion: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  enable: boolean;
}

interface CategoryState {
  categorias: categorias[];
  loading: boolean;
}

const initialState: CategoryState = {
  categorias: [],
  loading: false,
};

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async () => {
    const token = Cookies.get("token");
    const headers = new AxiosHeaders();

    headers.set("Authorization", `Bearer ${token}`);

    const response = await api.get("/Categorias", {
      headers,
    });
    return response.data;
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (category: { descripcion: string }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        throw new Error("Token not found");
      }

      const response = await api.post("/Categorias", {
        descripcion: category.descripcion,
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(
          "Something went wrong while creating the category"
        );
      }
    }
  }
);

interface UpdateCategoryPayload {
  id: number;
  descripcion: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  enable: boolean;
}

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async (
    {
      id,
      descripcion,
      enable,
      fechaCreacion,
      fechaModificacion,
    }: UpdateCategoryPayload,
    { rejectWithValue }
  ) => {
    try {

      const response = await api.put(
        `/categorias?id=${id}`,
        {
          id,
          descripcion,
          enable: enable,
          fechaCreacion: fechaCreacion,
          fechaModificacion: fechaModificacion,
        }, // Request body
      );

      console.log(response);

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue("Error updating category");
    }
  }
);

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categorias = action.payload;
        state.loading = false;
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.categorias.push(action.payload);
      });
  },
});

export const selectCategories = (state: RootState) =>
  state.categorias.categorias;
export const selectLoading = (state: RootState) => state.categorias.loading;

export default categorySlice.reducer;
