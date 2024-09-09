import { http } from "../../http";

const addPreProcessorData = async (insurance: string, data: any) => {
  return await http.post(`${insurance}/analyse`, data);
};
const editParser = async (id: any) => {
  return await http.post(`caregap/parserEdit/${id}`,);
};
// const getCareGaps = async () => {
//   return await http.get("caregap/");
// };
// const roleFilter = async (clinic_id: any) => {
//   return await http.get(`patient/insurance-pcp/${clinic_id}`);
// };
//   const editPatient = async (id: any, data: any) => {
//     return await http.get(`patient/edit/${id}`, data);
//   };

export { addPreProcessorData, editParser };
