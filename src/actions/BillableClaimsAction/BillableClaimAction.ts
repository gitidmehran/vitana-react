import { http } from "../../http";

const getBillableClaims = async (data:any) => {
  return await http.post("questionaire/billables",data);
};

export { getBillableClaims };
