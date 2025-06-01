import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../Api/VendifyApi";
import { AxiosError, AxiosHeaders } from "axios";
import Cookies from "js-cookie";

// Define CreateUserFormValues Interface
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

// Define UserState Interface
interface UserState {
  loading: boolean;
  error: string | null;
  users: CreateUserFormValues[] | null;
}

// Initial State
const initialState: UserState = {
  loading: false,
  error: null,
  users: null,
};

// Create User Thunk
export const createUser = createAsyncThunk<
  CreateUserFormValues, // Return type
  CreateUserFormValues, // Argument type
  { rejectValue: string } // Reject value type
>("user/createUser", async (userData, { rejectWithValue }) => {
  console.log(userData);
  try {
    console.log(userData);
    const response = await apiClient.post<CreateUserFormValues, any>(
      "/api/Users/Create",
      userData
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data as string);
    } else {
      return rejectWithValue("Something went wrong");
    }
  }
});

// Fetch Users Thunk
export const fetchUsers = createAsyncThunk<
  CreateUserFormValues[], // Return type
  void, // Argument type
  { rejectValue: string } // Reject value type
>("user/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const token = Cookies.get("token");

    const headers = new AxiosHeaders();
    headers.set("Authorization", `Bearer ${token}`); // Use the set method for AxiosHeaders

    const response = await apiClient.get<CreateUserFormValues[]>("/api/Users", {
      headers, // Pass the AxiosHeaders instance
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return rejectWithValue(error.response.data as string);
    } else {
      return rejectWithValue("Something went wrong");
    }
  }
});

// User Slice
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
        state.users = action.payload; // Correctly typed as CreateUserFormValues[]
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export Reducer
export default userSlice.reducer;
