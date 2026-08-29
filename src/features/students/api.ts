import { api } from "@/api";

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  parentName: string | null;
  phone: string | null;
  address: string | null;
  subject: string;
  billingType: "HOURLY" | "MONTHLY";
  rate: number | null;
  status: "ACTIVE" | "INACTIVE";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentsResponse {
  success: boolean;
  data: Student[];
}

export interface CreateStudentInput {
  name: string;
  parentName?: string;
  phone?: string;
  address?: string;
  subject: string;
  billingType: "HOURLY" | "MONTHLY";
  rate: number;
}

export type UpdateStudentInput = Partial<CreateStudentInput> & {
  status?: "ACTIVE" | "INACTIVE";
};

interface StudentResponse {
  success: boolean;
  data: Student;
}

export async function getStudents(): Promise<Student[]> {
  const response = await api.get<StudentsResponse>("/students");
  console.log(response.data.data);
  return response.data.data;
}

export async function getStudent(id: string): Promise<Student> {
  const response = await api.get<StudentResponse>(`/students/${id}`);

  return response.data.data;
}

export async function createStudent(
  data: CreateStudentInput,
): Promise<Student> {
  const response = await api.post<StudentResponse>("/students", data);

  return response.data.data;
}

export async function updateStudent(
  id: string,
  data: UpdateStudentInput,
): Promise<Student> {
  const response = await api.patch<StudentResponse>(`/students/${id}`, data);

  return response.data.data;
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}
