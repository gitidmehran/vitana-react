export interface dashboardData {
  totalPopulation: number;
  activeUsers: number;
  activePercentage: number;
  group_b_percentage: number | 0;
  group_c_percentage: number | 0;
  group_a1: number;
  group_a2: number;
  group_b: number;
  group_c: number;
  uncategorized: number | 0;
  total_refused: number;
  total_scheduled: number;
  total_scheduled_A12: number;
  awv_completed_A12: number;
  awv_completed_A12_per: number;
  awv_completed_population_per: number;
  awv_completed_total: number;
  awv_pending_A12: number;
  awv_pending_A12_per: number;
  awv_pending_population: number;
  awv_pending_population_per: number;
  date: string;
  insurance_id: number;
}

export interface CareGapsTypes {
  Title: string;
  ClosedPatients: string;
  OpenPatients: string;
  Total: string;
  Required_Par: string;
  Acheived: string;
  Star: string;
  Members_remaining: string;
  ActiveNonComp: string;
  Refused: string;
  ClosedPatientsDifference: string;
}

export interface DashboardFitlerType {
  doctorId: number | undefined;
  insuranceId: number | undefined;
  assigned: boolean;
}
export interface DashboardGraphType {
  title: string;
}
