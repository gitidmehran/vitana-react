import { http } from "../../http";

// const getCcmBillables = async (data?: string, page?: number) => {
//   return await http.post(`questionaire/unsigned-encounters?page=${page}`, data);
// };

const storeTask = async (data: any) => {
  return await http.post("ccmtasks/store", data);
};

const getCoordinators = async (payload: any) => {
  return await http.post("ccmtasks/get-coordinators", payload);
};
const getLogs = async (payload:any) => {
  return await http.post("ccmtasks/get-logs", payload);
};

const updateTask = async (task_id: number, payload: any) => {
  return await http.post(`ccmtasks/updatetask/${task_id}`, payload);
}

const deletetask = async (task_id: number) => {
  return await http.post(`ccmtasks/deletetask/${task_id}`);
}

export { storeTask, getCoordinators, getLogs, updateTask, deletetask };
