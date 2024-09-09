import { http } from "../../http";

const getAwvCarePlan = async (id: any) =>
  await http.get(`careplan/awv-careplan/${id}`);

const getCCMGeneralCarePlan = async (id: any, data: any) =>
  await http.post(`careplan/ccm-careplan/${id}`, data);

const getQuestionnairList = async (id: string, payload?: any) =>
  await http.post(`careplan/filledquestionnaire/${id}`, payload);

const getSigned = async (id: string, doctor_id: any) =>
  await http.post(`careplan/savesignature/${id}`, doctor_id);

export {
  getAwvCarePlan,
  getCCMGeneralCarePlan,
  getQuestionnairList,
  getSigned,
};
