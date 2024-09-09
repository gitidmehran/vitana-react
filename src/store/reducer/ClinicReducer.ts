import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ClinicType = {
  clinicId: any;
  clinicName: string;
  allowedProgram?: any | undefined;
};

const initialState: ClinicType = {
  clinicId: null,
  clinicName: "",
  allowedProgram : [],
};

export const ClinicServiceSlice = createSlice({
  name: "ClinicService",
  initialState,
  reducers: {
    setClinicData: (state, action: PayloadAction<ClinicType>) => {
      const { clinicId, clinicName } = action.payload;
      return { ...state, clinicId: clinicId, clinicName: clinicName };
    },

    setAllowedProgram: (state, action: PayloadAction<ClinicType>) => {
      return { ...state, allowedProgram: action.payload };
    },

    setResetClinicData: () => {
      return { ...initialState };
    }
  },
});

export const { setClinicData, setAllowedProgram, setResetClinicData } = ClinicServiceSlice.actions;

export default ClinicServiceSlice.reducer;
