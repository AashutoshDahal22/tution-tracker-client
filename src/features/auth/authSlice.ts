import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { login, signup, logout, getCurrentUser } from "./api";

import type { LoginData, SignupData, AuthResponse } from "./api";

interface AuthState {
  user: AuthResponse["data"]["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

interface AuthState {
  user: AuthResponse["data"]["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const token = localStorage.getItem("token");

const initialState: AuthState = {
  user: null,
  token,
  isAuthenticated: !!token,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: LoginData, { rejectWithValue }) => {
    try {
      const data = await login(credentials);

      return data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  },
);

export const signupUser = createAsyncThunk(
  "auth/signup",

  async (data: SignupData, { rejectWithValue }) => {
    try {
      const response = await signup(data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  },
);

export const logoutUser = createAsyncThunk(
  "auth/logout",

  async (_, { rejectWithValue }) => {
    try {
      await logout();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",

  async (_, { rejectWithValue }) => {
    try {
      const user = await getCurrentUser();

      return user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get current user",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },

    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    // LOGIN
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.data.user;
        state.token = action.payload.data.token;

        state.isAuthenticated = true;

        console.log("This is the payload", action.payload.data.token);
        localStorage.setItem("token", action.payload.data.token);
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        state.error = (action.payload as string) || "Login failed";
      });

    // SIGNUP
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.data.user;
        state.token = action.payload.data.token;

        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.data.token);
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;

        state.error = (action.payload as string) || "Signup failed";
      });

    // LOGOUT
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;

        state.user = null;
        state.token = null;

        state.isAuthenticated = false;

        localStorage.removeItem("token");
      })

      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;

        state.user = null;
        state.token = null;

        state.isAuthenticated = false;

        localStorage.removeItem("token");
      });

    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload;
        state.isAuthenticated = true;
      })

      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;

        state.user = null;
        state.token = null;
        state.isAuthenticated = false;

        localStorage.removeItem("token");
      });
  },
});

export const { clearAuthError, clearAuth } = authSlice.actions;

export default authSlice.reducer;
