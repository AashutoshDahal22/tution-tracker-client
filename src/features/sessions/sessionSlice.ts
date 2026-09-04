import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createSession,
  deleteSession,
  getSessions,
  updateSession,
} from "@/features/sessions/api";
import type {
  CreateSessionInput,
  Session,
  UpdateSessionInput,
} from "@/features/sessions/api";

interface SessionState {
  sessions: Session[];
  loading: boolean;
  error: string | null;
}

const initialState: SessionState = {
  sessions: [],
  loading: false,
  error: null,
};

export const fetchSessions = createAsyncThunk(
  "sessions/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      return await getSessions();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch sessions";
      return rejectWithValue(message);
    }
  },
);

export const addSession = createAsyncThunk(
  "sessions/addSession",
  async (data: CreateSessionInput, { rejectWithValue }) => {
    try {
      return await createSession(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to create session";
      return rejectWithValue(message);
    }
  },
);

export const editSession = createAsyncThunk(
  "sessions/editSession",
  async (
    { id, data }: { id: string; data: UpdateSessionInput },
    { rejectWithValue },
  ) => {
    try {
      return await updateSession(id, data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to update session";
      return rejectWithValue(message);
    }
  },
);

export const removeSession = createAsyncThunk(
  "sessions/removeSession",
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteSession(id);
      return id;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to delete session";
      return rejectWithValue(message);
    }
  },
);

const sessionSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    clearSessionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch sessions";
      })
      .addCase(addSession.fulfilled, (state, action) => {
        state.sessions.unshift(action.payload);
      })
      .addCase(addSession.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to create session";
      })
      .addCase(editSession.fulfilled, (state, action) => {
        const index = state.sessions.findIndex(
          (s) => s.id === action.payload.id,
        );
        if (index !== -1) state.sessions[index] = action.payload;
      })
      .addCase(editSession.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to update session";
      })
      .addCase(removeSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(
          (s) => s.id !== action.payload,
        );
      })
      .addCase(removeSession.rejected, (state, action) => {
        state.error = (action.payload as string) || "Failed to delete session";
      });
  },
});

export const { clearSessionError } = sessionSlice.actions;

export default sessionSlice.reducer;
