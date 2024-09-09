import { http } from "../../http";
import { getClinicId } from "../../Utilties/Utilties";

const Patient_URL = "/patients";

const getPatientList = async (
  name?: string,
  page?: number,
  patient?: any,
  bulkAssign?: any,
  getAssigned?: boolean,
  patient_id?: any,
  caregap_name?: string,
  careGapId?: number,
  filterYear?: string,
) => {
  return await http.get(
    `${Patient_URL}?search=${name}&page=${page}&clinic_id=${getClinicId()}&my_patients=${patient}&bulk_assign=${bulkAssign}&get_assigned=${getAssigned}&patient_id=${patient_id}&caregap_name=${caregap_name}&gaps_as_per=${careGapId}&filter_year=${filterYear}`
  );
};

const searchPatient = async (
  name: number,
  bulkAssign?: any,
  getAssigned?: boolean
) => {
  return await http.get(
    `${Patient_URL}?search=${name}&clinic_id=${getClinicId()}&bulk_assign=${bulkAssign}&get_assigned=${getAssigned}`
  );
};

const addNewPatient = async (data: any) => {
  return await http.post("patient/create", data);
};

const editPatient = async (id: any, data: any) => {
  return await http.get(`patient/edit/${id}`, data);
};

const updatePatient = async (id: any, data: any) => {
  return await http.post(`patient/update/${id}`, data);
};

const deletePatient = async (id: any) => {
  return await http.post(`patient/delete/${id}`);
};
const getprogram = async (data: any) => {
  return await http.post(`questionaire/get-programm-data`, data);
};
const addDiagnosis = async (data: any) => {
  return await http.post(`patient/add-disease`, data);
};

const addMedication = async (data: any) => {
  return await http.post(`patient/add-medication`, data);
};

const addSurgical_history = async (data: any) => {
  return await http.post(`patient/add-surgery`, data);
};
const updateDiagnosis = async (patient_id: any, data: any) => {
  return await http.post(`patient/update-disease/${patient_id}`, data);
};
const updateMedication = async (patient_id: any, data: any) => {
  return await http.post(`patient/update-medication/${patient_id}`, data);
};
const updateSurgicalHistory = async (patient_id: any, data: any) => {
  return await http.post(`patient/update-surgery/${patient_id}`, data);
};
const updateFamilyHistory = async (patient_id: any, data: any) => {
  return await http.post(`patient/update-family-history/${patient_id}`, data);
};
const addSocialHistory = async (patient_id: any, data: any) => {
  return await http.post(`patient/add-social-history/${patient_id}`, data);
};
const updateSocialHistory = async (patient_id: any, data: any) => {
  return await http.post(`patient/update-social-history/${patient_id}`, data);
};

const encounters = async (patient_id: any) => {
  return await http.get(`patient/encounters/${patient_id}`);
};

const roleFilter = async (clinic_id: any) => {
  return await http.get(`patient/insurance-pcp/${clinic_id}`);
};

const patientConsentSubmit = async (patient_id: any, data: any) => {
  return await http.post(`patient/update-consent/${patient_id}`, data);
};

const patientBulkAdd = async (data: any) => {
  return await http.post(`patient/add-bulkpatients`, data);
};

const patientBulkAssign = async (data: any) => {
  return await http.post(`patient/bulk-assign`, data);
};

const updatePatientGroup = async (payload: any) => {
  return await http.post(`patient/update_patient_group`, payload);
};

const updatePatientCareGap = async (
  insurance: string,
  gap_id: any,
  data: any
) => {
  return await http.post(`${insurance}/update/${gap_id}`, data);
};

const addCareGapComments = async (data: any) => {
  return await http.post(`caregap/addComment`, data);
};

const updateSingleComment = async (id: string, payload: any) => {
  return await http.post(`caregap/update-comment/${id}`, payload);
};

const downloadFile = async (payload: any) => {
  return await http.post(`downloadFile`, payload, { responseType: "blob" });
};

const fetchCurrentYearGaps = async (data: any) => {
  return await http.post(`patient/currentyeargaps`, data);
};


export {
  updateDiagnosis,
  patientBulkAdd,
  updateMedication,
  updateSurgicalHistory,
  roleFilter,
  getPatientList,
  addNewPatient,
  editPatient,
  updatePatient,
  deletePatient,
  getprogram,
  searchPatient,
  addDiagnosis,
  addMedication,
  addSurgical_history,
  encounters,
  updateFamilyHistory,
  addSocialHistory,
  updateSocialHistory,
  patientConsentSubmit,
  patientBulkAssign,
  updatePatientCareGap,
  addCareGapComments,
  updateSingleComment,
  downloadFile,
  updatePatientGroup,
  fetchCurrentYearGaps,
};
