import { z } from "zod";

export const sessionFormSchema = z.object({
  studentId: z.string().min(1, "Pick a student."),
  startTime: z.string().min(1, "Start time is required."),
  notes: z.string().max(2000).optional().default(""),
});

export type SessionFormValues = z.infer<typeof sessionFormSchema>;
