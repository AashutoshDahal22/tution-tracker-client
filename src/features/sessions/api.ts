import { api } from "@/api";
import type { Student } from "@/features/students/api";

export type SessionStatus = "ONGOING" | "COMPLETED" | "CANCELLED";

export interface Session {
  id: string;
  studentId: string;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  amount: number | null;
  notes: string | null;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
  student?: Pick<
    Student,
    "id" | "name" | "subject" | "rate" | "billingType"
  > | null;
}

interface SessionsResponse {
  success: boolean;
  data: Session[];
}

interface SessionResponse {
  success: boolean;
  data: Session;
}

export interface CreateSessionInput {
  studentId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  notes?: string;
  status?: SessionStatus;
}

export type UpdateSessionInput = Partial<
  Pick<Session, "startTime" | "endTime" | "duration" | "notes" | "status">
>;

// Canonical backend path is /sessions (/session kept as legacy alias).
export async function getSessions(): Promise<Session[]> {
  const response = await api.get<SessionsResponse>("/sessions");
  return response.data.data;
}

export async function createSession(data: CreateSessionInput): Promise<Session> {
  const response = await api.post<SessionResponse>("/sessions", data);
  return response.data.data;
}

export async function updateSession(
  id: string,
  data: UpdateSessionInput,
): Promise<Session> {
  const response = await api.patch<SessionResponse>(`/sessions/${id}`, data);
  return response.data.data;
}

export async function deleteSession(id: string): Promise<void> {
  await api.delete(`/sessions/${id}`);
}
