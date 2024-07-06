// features/users/usersSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../Store";

interface CreateUser {
  id: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  noDocumento: string;
  address: string;
  pass: string;
  sexo: string;
}

interface EditUser {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  noDocumento: string;
  address: string;
  sexo: string;
}

interface User {
  id: number;
  fullName: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
}

interface UsersState {
  users: User[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  status: "idle",
  error: null,
};

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const GET_USERS_URL = `${API_URL}/users`;
const UPDATE_USER_URL = `${API_URL}/users`; // Adjust this to your actual update endpoint
const CREATE_USER_URL = `${API_URL}/users/create`; // Adjust this to your actual create endpoint

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(GET_USERS_URL);
  return response.data;
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (user: CreateUser) => {
    const response = await axios.post(CREATE_USER_URL, user);
    return response.data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (user: EditUser) => {
    const usuarioF = {
      id: user.id,
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      phoneNumber: user.telefono,
      noDocumento: user.noDocumento,
      address: user.address,
      fechaNaci: "2024-07-06",
      sexo: true,
    };
    const response = await axios.put(`${UPDATE_USER_URL}/${user.id}`, usuarioF);
    console.log(response);
    return response.data;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(createUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      })
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";

        const index = state.users.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message ?? null;
      });
  },
});

export default usersSlice.reducer;

export const selectAllUsers = (state: RootState) => state.users.users;
export const getUsersStatus = (state: RootState) => state.users.status;
export const getUsersError = (state: RootState) => state.users.error;
