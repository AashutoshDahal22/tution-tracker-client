import { api } from "@/api";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  name: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthData {
  token: string;
  user: User;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: AuthData;
}

interface MeResponse {
  success: boolean;
  data: User;
}

export async function login(credentials: LoginData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/login", credentials);

  return response.data;
}

export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>("/auth/register", data);

  return response.data;
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get<MeResponse>("/auth/me");

  return response.data.data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}
