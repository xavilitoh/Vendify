// Redux/CategorySlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./Store";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";

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
  total: number;
  page: number;
  pageSize: number;
}

const initialState: CategoryState = {
  categorias: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
};

export const fetchCategories = createAsyncThunk<
  {
    categorias: categorias[];
    total: number;
  },
  { page: number; pageSize: number },
  { rejectValue: string }
>("categories/fetchCategories", async ({ page, pageSize }) => {
  const response = await api.get<{
    result: categorias[];
    totalRecords: number;
  }>(`/Categorias/${page}/${pageSize}`);
  return {
    categorias: response.data.result,
    total: response.data.totalRecords,
  };
});

export const createCategory = createAsyncThunk<
  categorias, 
  { descripcion: string }, 
  { rejectValue: string } 
>("categories/createCategory", async (category, { rejectWithValue }) => {
  try {
    const response = await api.post<categorias, any>("/Categorias", {
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
});

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
        } // Request body
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
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        console.log(action);
        state.categorias = action.payload.categorias;
        state.total = action.payload.total;
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

export const { setPage, setPageSize } = categorySlice.actions;
export const selectCategories = (state: RootState) =>
  state.categorias.categorias;
export const selectLoading = (state: RootState) => state.categorias.loading;
export const selectCategoriesPage = (state: RootState) => state.categorias.page;
export const selectCategoriesPageSize = (state: RootState) =>
  state.categorias.pageSize;
export default categorySlice.reducer;
