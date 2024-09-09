import { http } from "../../http";
import { getClinicId } from "../../Utilties/Utilties";
const USERS_URL = "/insurance";

const getInsuranceList = async (page: number) => {
  return await http.get(`${USERS_URL}?page=${page}&clinic_id=${getClinicId()}`);
};
const searchinsurance = async (name: string) => {
  return await http.get(
    `${USERS_URL}?search=${name}&clinic_id=${getClinicId()}`
  );
};

const addNewInsurance = async (data: any) => {
  return await http.post("insurance/create", data);
};

const updateInsurance = async (id: string, data: any) => {
  return await http.post(`/insurance/update/${id}`, data);
};

const deleteInsurance = async (id: string) => {
  return await http.post(`/insurance/delete/${id}`);
};

export {
  getInsuranceList,
  addNewInsurance,
  updateInsurance,
  deleteInsurance,
  searchinsurance,
};
