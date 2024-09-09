import { createSlice } from "@reduxjs/toolkit";

interface dashboardFilters {
  doctor_id: string;
  program_id: string;
  clinic_id: string;
  insurance_id: string;
  assigned: boolean;
}


const initialState: dashboardFilters = {
  doctor_id: "",
  program_id: "",
  clinic_id: "",
  insurance_id: "",
  assigned: true,
};

export const DashboardService = createSlice({
  name: "DashboardService",
  initialState,
  reducers: {
    setFilterData: (state, action) => {
      const { key, value } = action.payload;
      /* let filters = {...state }
     Object.assign(filters,{[key]:value}) */
      return { ...state, [key]: value };
    },
    setResetFilterData: () => {
      return { ...initialState };
    }
  },
});

export const { setFilterData,setResetFilterData } = DashboardService.actions;
export default DashboardService.reducer;
