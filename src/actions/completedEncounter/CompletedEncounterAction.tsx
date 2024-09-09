import { http } from "../../http";

const getCompletedEncounters = async (data?: string, page?: number) => {
    return await http.post(`questionaire/completed-encounters?page=${page}`, data);
};

export { getCompletedEncounters };