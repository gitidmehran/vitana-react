import { http } from "../../http";

const getUnsignedEncounters = async (data?: string, page?: number) => {
  return await http.post(`questionaire/unsigned-encounters?page=${page}`, data);
};

export { getUnsignedEncounters };
