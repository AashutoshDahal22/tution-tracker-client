import { api } from "../../api/client";

export interface Student {
  id: string;
  studentCode: string;
  name: string;
  parentName: string;
  phone: string;
  address: string;
  subject: string;
  billingType: "HOURLY" | "MONTHLY";
  rate: number;
  status: "ACTIVE" | "INACTIVE";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentsResponse {
  success: boolean;
  data: Student[];
}

interface StudentResponse {
  success: boolean;
  data: Student;
}

export async function getStudents(): Promise<Student[]> {
  const response = await api.get<StudentsResponse>("/students");

  return response.data.data;
}

export async function getStudent(id: string): Promise<Student> {
  const response = await api.get<StudentResponse>(`/students/${id}`);

  return response.data.data;
}

export async function createStudent(
  data: Omit<
    Student,
    "id" | "studentCode" | "userId" | "createdAt" | "updatedAt"
  >,
): Promise<Student> {
  const response = await api.post<StudentResponse>("/students", data);

  return response.data.data;
}

export async function updateStudent(
  id: string,
  data: Partial<Student>,
): Promise<Student> {
  const response = await api.patch<StudentResponse>(`/students/${id}`, data);

  return response.data.data;
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete(`/students/${id}`);
}
