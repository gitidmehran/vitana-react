import { http } from "../../http";

const DashboardData = async () => {
  return await http.get("/dashboard");
};
const firstTimePass = async (id: any, data: any) => {
  return await http.post(`clinicAdmin/update-password/${id}`, data);
};
const findAllCompliantPatients = async (data: any) => {
  return await http.post(`dashboard/findAllPatients`, data);
};
const findFilterCompliantPatients = async (data: any) => {
  return await http.post(`dashboard/findPatients`, data);
};

const findPatientsByStatus = async (data: any) => {
  return await http.post(`dashboard/patientByStatus`, data);
}

const FilterData = async (
  doctor_id: any,
  program_id: any,
  clinic_id: any,
  insurance_id: any,
  careGapId:any,
  assigned?:boolean,
  filterYear?:string | null,
) => {
  return await http.get(
    `/dashboard?doctor_id=${doctor_id}&program_id=${program_id}&clinic_id=${clinic_id}&insurance_id=${insurance_id}&careGap=${careGapId}&assignedstatus=${assigned}&filteryear=${filterYear}`
  );
};

export { DashboardData, FilterData, firstTimePass, findAllCompliantPatients, findFilterCompliantPatients, findPatientsByStatus };
