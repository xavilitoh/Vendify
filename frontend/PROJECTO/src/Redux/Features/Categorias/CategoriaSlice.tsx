// features/categorias/categoriasSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../Store";

interface Categoria {
  id: number;
  categoria: string;
  descripcion: string;
}

interface CategoriasState {
  categorias: Categoria[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoriasState = {
  categorias: [],
  status: "idle",
  error: null,
};

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const GET_CATEGORIAS_URL = `${API_URL}/categorias`;
const CREATE_CATEGORIA_URL = `${API_URL}/categorias`;
const UPDATE_CATEGORIA_URL = `${API_URL}/categorias`;

export const fetchCategorias = createAsyncThunk(
  "categorias/fetchCategorias",
  async () => {
    const response = await axios.get(GET_CATEGORIAS_URL);
    console.log("Fetch Categorias Response:", response.data);
    return response.data;
  }
);

export const createCategoria = createAsyncThunk(
  "categorias/createCategoria",
  async (categoria: Omit<Categoria, "id">) => {
    const response = await axios.post(CREATE_CATEGORIA_URL, categoria);
    console.log("Create Categoria Response:", response.data);
    return response.data;
  }
);

export const updateCategoria = createAsyncThunk(
  "categorias/updateCategoria",
  async (categoria: Categoria) => {
    console.log(categoria);
    const response = await axios.put(
      `${UPDATE_CATEGORIA_URL}/?id=${categoria.id}`,
      categoria
    );
    console.log("Update Categoria Response:", response.data);
    return response.data;
  }
);

const categoriasSlice = createSlice({
  name: "categorias",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategorias.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categorias = action.payload;
      })
      .addCase(fetchCategorias.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(createCategoria.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategoria.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categorias.push(action.payload);
      })
      .addCase(createCategoria.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(updateCategoria.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCategoria.fulfilled, (state, action) => {
        console.log("Update Categoria Payload:", action.payload);
        state.status = "succeeded";
        const index = state.categorias.findIndex(
          (categoria) => categoria.id === action.payload.id
        );
        if (index !== -1) {
          state.categorias[index] = action.payload;
        }
      })
      .addCase(updateCategoria.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export default categoriasSlice.reducer;

export const selectAllCategorias = (state: RootState) =>
  state.categorias.categorias;
export const getCategoriasStatus = (state: RootState) =>
  state.categorias.status;
export const getCategoriasError = (state: RootState) => state.categorias.error;
