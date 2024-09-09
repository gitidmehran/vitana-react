import { http } from "../../http";

const addBulkCareGaps = async (insuranceLabel: string, data: any) => {
  return await http.post(`${insuranceLabel}/add-bulkcaregaps`, data);
};

const addPreProcessors = async (insuranceLabel: string, data: any) => {
  return await http.post(`${insuranceLabel}/add-preprocessor`, data);
};
const generateCareGaps = async (data: any) => {
  return await http.post(`caregap/duplicateCareGapRecord`, data);
};
const getCareGaps = async () => {
  return await http.get("caregap/");
};
const roleFilter = async (clinic_id: any) => {
  return await http.get(`patient/insurance-pcp/${clinic_id}`);
};
//   const editPatient = async (id: any, data: any) => {
//     return await http.get(`patient/edit/${id}`, data);
//   };

export { addBulkCareGaps, getCareGaps, roleFilter, generateCareGaps, addPreProcessors };
