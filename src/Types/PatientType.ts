export interface dignosisprops {
  display?: string;
  condition: string;
  description: string;
  status: string;
}
export interface surgicalprops {
  procedure: string;
  reason: string;
  date: string;
  surgeon: string;
}
export interface medicalprops {
  name: string;
  dose: string;
  condition: string;
}
export interface familyprops {
  cancer_father: string;
  cancer_mother: string;
  cancer_children: string;
  cancer_siblings: string;
  cancer_grandparents: string;
  diabetes_father: string;
  diabetes_mother: string;
  diabetes_children: string;
  diabetes_siblings: string;
  diabetes_grandparents: string;
  heart_disease_father: string;
  heart_disease_mother: string;
  heart_disease_children: string;
  heart_disease_siblings: string;
  heart_disease_grandparents: string;
  hypertension_father: string;
  hypertension_mother: string;
  hypertension_children: string;
  hypertension_siblings: string;
  hypertension_grandparents: string;
}

export type Doctors = { id: number; name: string };
export type Coordinator = { id: number; name: string };

export interface PatientType {
  map: (
    arg0: (items: any, index: any) => JSX.Element
  ) => import("react").ReactNode;
  id: string;
  last_name: string;
  first_name: string;
  mid_name: string;
  name: string;
  identity: string;
  contact_no: string;
  cell: string;
  dob: string;
  email: string;
  age: number;
  doctor_id: string;
  gender: string;
  disease: string;
  address: string;
  address_2: string;
  clinic_id: string;
  insurance_id: string;
  description: string;
  condition: string;
  status: number | "";
  city: string;
  state: string;
  zipCode: string;
  diagnosis?: dignosisprops;
  medication?: medicalprops;
  surgical_history?: surgicalprops;
  family_history?: familyprops;
  insurance_name: string;
  insurance_provider?: string;
  group?: number | undefined;
  coordinator_id?: string;
  member_id?: string;
  awvGap?: string;
  care_gap_status?: string;
  preferred_contact?: string;
  gaps_as_per:string;
}

export type PatientCareGap = {
  title: string;
  details: any[];
  file: string;
  status: string;
  comments: any[];
  gap_status: any;
  options: any[];
  care_gap_name: string;
  db_column: string;
  filename: string;
  gap_details: any;
  created_at: string;
  address: string;
  caregap_id: number;
  care_gaps_array: any[];
  id: number;
  name: string;
  
};
export type PatientCaGapsArray = {
  id: any;
  care_gaps: any;
  insurance_id: number;
  doctor_id: number;
  clinic_id: number;
  insurance_name: string;
};
