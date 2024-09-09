import { http } from "../../http"

const handleCclfData =async (payload:any) => {
    return await http.post('patient/add-cclfdata', payload);
}

export {
    handleCclfData,
};