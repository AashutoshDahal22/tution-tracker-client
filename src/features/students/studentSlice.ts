import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} from "@/features/students/api";

import type {
  CreateStudentInput,
  Student,
  UpdateStudentInput,
} from "@/features/students/api";

interface StudentState {
  students: Student[];
  selectedStudent: Student | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  students: [],
  selectedStudent: null,
  loading: false,
  error: null,
};

// GET /students
export const fetchStudents = createAsyncThunk(
  "students/fetchStudents",

  async (_, { rejectWithValue }) => {
    try {
      const students = await getStudents();

      return students;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch students",
      );
    }
  },
);

// GET /students/:id
export const fetchStudent = createAsyncThunk(
  "students/fetchStudent",

  async (id: string, { rejectWithValue }) => {
    try {
      const student = await getStudent(id);

      return student;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch student",
      );
    }
  },
);

// POST /students
export const addStudent = createAsyncThunk(
  "students/addStudent",

  async (data: CreateStudentInput, { rejectWithValue }) => {
    try {
      const student = await createStudent(data);

      return student;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create student",
      );
    }
  },
);

// PATCH /students/:id
export const editStudent = createAsyncThunk(
  "students/editStudent",

  async (
    { id, data }: { id: string; data: UpdateStudentInput },
    { rejectWithValue },
  ) => {
    try {
      const student = await updateStudent(id, data);

      return student;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update student",
      );
    }
  },
);

// DELETE /students/:id
export const removeStudent = createAsyncThunk(
  "students/removeStudent",

  async (id: string, { rejectWithValue }) => {
    try {
      await deleteStudent(id);

      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete student",
      );
    }
  },
);

const studentSlice = createSlice({
  name: "students",

  initialState,

  reducers: {
    clearStudentError: (state) => {
      state.error = null;
    },

    clearSelectedStudent: (state) => {
      state.selectedStudent = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })

      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch students";
      });

    builder
      .addCase(fetchStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
      })

      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to fetch student";
      });

    builder
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;

        state.students.push(action.payload);
      })

      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to create student";
      });

    builder
      .addCase(editStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(editStudent.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.students.findIndex(
          (student) => student.id === action.payload.id,
        );

        if (index !== -1) {
          state.students[index] = action.payload;
        }

        if (state.selectedStudent?.id === action.payload.id) {
          state.selectedStudent = action.payload;
        }
      })

      .addCase(editStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to update student";
      });

    builder
      .addCase(removeStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(removeStudent.fulfilled, (state, action) => {
        state.loading = false;

        state.students = state.students.filter(
          (student) => student.id !== action.payload,
        );

        if (state.selectedStudent?.id === action.payload) {
          state.selectedStudent = null;
        }
      })

      .addCase(removeStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Failed to delete student";
      });
  },
});

export const { clearStudentError, clearSelectedStudent } = studentSlice.actions;

export default studentSlice.reducer;
