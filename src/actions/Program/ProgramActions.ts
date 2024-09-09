import { http } from "../../http";
import { getClinicId } from "../../Utilties/Utilties";
const USERS_URL = "/programs";

const getProgramList = async (page?: number) => {
  return await http.get(`${USERS_URL}?page=${page}&clinic_id=${getClinicId()}`);
};
const searchprograms = async (name: string) => {
  return await http.get(
    `${USERS_URL}?search=${name}&clinic_id=${getClinicId()}`
  );
};
const addProgram = async (data: any) => {
  return await http.post("program/create", data);
};

const updateprogram = async (id: string, data: any) => {
  return await http.post(`program/update/${id}`, data);
};

const deleteprogram = async (id: string) => {
  return await http.post(`program/delete/${id}`);
};
const Programedit = async (id: string) => {
  return await http.get(`program/edit/${id}`);
};

export {
  getProgramList,
  addProgram,
  updateprogram,
  deleteprogram,
  Programedit,
  searchprograms,
};
