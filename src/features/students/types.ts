import type { Student } from "./api";

export type { Student };
export type StudentStatus = Student["status"];
export type BillingType = Student["billingType"];

export interface StudentFormValues {
  name: string;
  parentName: string;
  phone: string;
  address: string;
  subject: string;
  billingType: BillingType;
  rate: string;
  status: StudentStatus;
}
