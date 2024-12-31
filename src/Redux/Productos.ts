import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../Api/VendifyApi";
import { AxiosError } from "axios";
import { RootState } from "./Store";

export interface Precio {
  id?: number; 
  descripcion: string;
  valor: number;
  idProducto?: number; 
}

export interface Product {
  id: number;
  idMarca: number;
  idCategoria: number;
  idSubcategoria: number;
  idUnidad: number;
  descripcion: string;
  stockMinimo: number;
  barCode: string;
  conImpuesto: boolean;
  idEntidad: number;
  precios: Precio[]; 
}

interface ProductState {
  products: Product[];
  loading: boolean;
}

const initialState: ProductState = {
  products: [],
  loading: false,
};

// Fetch Products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Product[]>("/Productos");
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue("Error al obtener los productos");
      }
      return rejectWithValue("Error inesperado");
    }
  }
);

// Create Product
export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "id">,
  { rejectValue: string }
>("products/createProduct", async (productData, { rejectWithValue }) => {
  try {
    const response = await api.post<Product, any>("/Productos", productData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al crear el producto");
    }
    return rejectWithValue("Error inesperado");
  }
});

// Update Product
export const updateProduct = createAsyncThunk<
  Product,
  { id: number; productData: Partial<Product> },
  { rejectValue: string }
>("products/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    const response = await api.put<Product,any>(`/Productos/${id}`, productData);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al actualizar el producto");
    }
    return rejectWithValue("Error inesperado");
  }
});

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      });
  },
});

export const selectProducts = (state: RootState) => state.productos.products;
export const selectLoading = (state: RootState) => state.productos.loading;

export default productSlice.reducer;