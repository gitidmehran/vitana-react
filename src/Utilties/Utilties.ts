import store from "../store/store";
import { notification } from "antd";
export const OpenNotification = (type: string, message: string) => {
  notification.config({ placement: "topRight" });

  if (type === "success") {
    notification.success({
      key: "Notification",
      message,
      style: { marginTop: 100 },
    });
  } else {
    notification.error({
      key: "Notification",
      message,
      style: { marginTop: 100 },
    });
  }

  setTimeout(() => undefined, 10000);
};

/* Created function to call in Action if clinic is switced from Navbar
 ** return empty string if no clinic is selected, will show data from all clinics*/
export const getClinicId = () => {
  return store.getState().clinicReducer.clinicId ?? "";
};
