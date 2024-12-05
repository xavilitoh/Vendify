import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../Api/VendifyApi";
import { AxiosError, AxiosHeaders } from "axios";
import Cookies from "js-cookie";

interface UserState {
  loading: boolean;
  error: string | null;
  users: CreateUserFormValues[] | null;
}

interface CreateUserFormValues {
  email: string;
  pass: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  address: string;
  fecaNac: string;
  noDocumento: string;
  sexo: boolean;
}

const initialState: UserState = {
  loading: false,
  error: null,
  users: null,
};

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: CreateUserFormValues, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/Users/Create", {
        email: userData.email,
        pass: userData.pass,
        nombres: userData.nombres,
        apellidos: userData.apellidos,
        telefono: userData.telefono,
        address: userData.address,
        fecaNac: userData.fecaNac,
        noDocumento: userData.noDocumento,
        sexo: userData.sexo,
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("token");

      const headers = new AxiosHeaders();
      headers.set("Authorization", `Bearer ${token}`); // Use the set method for AxiosHeaders

      const response = await apiClient.get("/Users", {
        headers, // Pass the AxiosHeaders instance
      });

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue("Something went wrong");
      }
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload ;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userSlice.reducer;
