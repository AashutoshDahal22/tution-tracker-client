import { api } from "@/api";
import type { Session } from "@/features/sessions/api";

export interface DashboardStats {
  totals: {
    students: number;
    activeStudents: number;
    sessions: number;
    completedSessions: number;
    earned: number;
  };
  month: {
    label: string;
    range: string;
    sessions: number;
    held: number;
    upcoming: number;
    earned: number;
  };
  topStudents: {
    id: string;
    name: string;
    subject: string;
    sessions: number;
    earned: number;
  }[];
  recent: Session[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const response = await api.get<{ success: boolean; data: DashboardStats }>(
    "/dashboard",
  );
  return response.data.data;
}
