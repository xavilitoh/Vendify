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

interface Product {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  subcategoria: string;
  unidad: string;
  idMarca: number;
  idCategoria: number;
  idSubcategoria: number;
  idUnidad: number;
  descripcion: string;
  stockMinimo: number;
  barCode: string;
  conImpuesto: boolean;
  precios: Precio[];
}

interface SelectList {
  id: number;
  value: number;
  label: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  total: number;
  page: number;
  pageSize: number;
  selectList: SelectList[];
}

const initialState: ProductState = {
  products: [],
  loading: false,
  total: 0,
  page: 1,
  pageSize: 8,
  selectList: [],
};

export const fetchProducts = createAsyncThunk<
  { products: Product[]; total: number },
  { page: number; pageSize: number },
  { rejectValue: string }
>("products/fetchProducts", async ({ page, pageSize }, { rejectWithValue }) => {
  try {
    const response = await api.get<{ result: Product[]; totalRecords: number }>(
      `/Productos/${page}/${pageSize}`
    );

    const products = response.data.result || [];
    const total = response.data.totalRecords;

    return { products, total };
  } catch (error) {
    console.error("Error fetching products:", error);
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener los productos");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const fetchProductsSelectList = createAsyncThunk<
  SelectList[],
  void,
  { rejectValue: string }
>("products/fetchSelectList", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<SelectList[]>("/Productos/SelectList");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al obtener la lista de productos");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const createProduct = createAsyncThunk<
  Product,
  Omit<Product, "id">,
  { rejectValue: string }
>("products/createProduct", async (productData, { rejectWithValue }) => {
  try {

    console.log(productData);

    const response = await api.post<Product, any>("/Productos", productData);
    console.log(response);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return rejectWithValue("Error al crear el producto");
    }
    return rejectWithValue("Error inesperado");
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: number; productData: Partial<Product> },
  { rejectValue: string }
>(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put<Product, any>(
        `/Productos/${id}`,
        productData
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue("Error al actualizar el producto");
      }
      return rejectWithValue("Error inesperado");
    }
  }
);

const productSlice = createSlice({
  name: "products",
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.total = action.payload.total;
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      })
      .addCase(fetchProductsSelectList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductsSelectList.fulfilled, (state, action) => {
        state.loading = false;
        state.selectList = action.payload;
      })
      .addCase(fetchProductsSelectList.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setPage, setPageSize } = productSlice.actions;
export const selectProducts = (state: RootState) => state.productos.products;
export const selectLoading = (state: RootState) => state.productos.loading;
export const selectTotal = (state: RootState) => state.productos.total;
export const selectPage = (state: RootState) => state.productos.page;
export const selectPageSize = (state: RootState) => state.productos.pageSize;
export const selectProductsSelectList = (state: RootState) =>
  state.productos.selectList;

export default productSlice.reducer;
