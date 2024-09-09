import { http } from "../../http";
import { getClinicId } from "../../Utilties/Utilties";
const ques_URL = "/questionaire";

const getquesList = async (name: string, page: number, patient?:any) => {
  return await http.get(
    `${ques_URL}?search=${name}&page=${page}&clinic_id=${getClinicId()}&my_patients=${patient}`
  );
};
const searchquestions = async (name: string) => {
  return await http.get(
    `${ques_URL}?search=${name}&clinic_id=${getClinicId()}`
  );
};

const saveques = async (data: any) => {
  return await http.post("/save-questionaires", data);
};

const deleteQues = (id: string, data:any) => {
  return http.post(`questionaire/delete/${id}`, data);
};
const quesedit = (id: string, childId:string|undefined) => {
  const reqeust = {};
  if (childId !== undefined) {
    Object.assign(reqeust, {['monthly_assessment_id']: childId})
  }
  return http.post(`questionaire/edit/${id}`, reqeust);
};
const downloadcareplan = (id: string) => {
  return http.get(`careplan/careplanpdf/${id}`, { responseType: "blob" });
};
const downloadCcmCareplan = (id: string) => {
  return http.get(`careplan/CCMCarePlanpdf/${id}`, { responseType: "blob" });
};

const downloadMonthlycareplan = (id: string, data:any) => {
  const monthlyid = data?.monthly_assessment_id;
  const date_of_service = data?.date_of_service;
  const monthly_careplan = 1;
  return http.get(`careplan/monthlyassessmentpdf/${id}?monthly_assessment_id=${monthlyid}&date_of_service=${date_of_service}&monthly_careplan=${monthly_careplan}`,{ responseType: "blob" });
};

const downloadsuperBill = (id: string) => {
  return http.get(`superbill/super-bill/${id}`, { responseType: "blob" });
};
const statusChange = (id: string, data: any) => {
  return http.post(`questionaire/update-questionnaire-status/${id}`, data);
};

export {
  getquesList,
  saveques,
  quesedit,
  deleteQues,
  statusChange,
  searchquestions,
  downloadcareplan,
  downloadMonthlycareplan,
  downloadsuperBill,
  downloadCcmCareplan,
};
