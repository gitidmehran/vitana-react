/* eslint-disable @typescript-eslint/no-empty-interface */
export interface QuestionaireStepProps {
  handleNextStep: () => void;
  saveQuestionairsData: (
    key: string,
    data: any,
    moreThanOneRecord?: object
  ) => any;
  handlePreviousStep?: () => void;
  handleShowSection?: (isShow: boolean) => void;
  age?: any;
  gender?:any;
  programmId?:any
  disableAfterSeven?: any;
  disableFirstSeven?: any;
  patientdata?: any;
}

export type QuestionaireListType = {
  id: string;
  serial_no: string;
  patient_id: string;
  patient_name: string;
  program_id: string;
  program_name: string;
  dob: string;
  contact_no: string;
};

export interface QuestionaireResponse {
  success: boolean;
  message: string;
  errors?: object;
}
export interface FallingScreenType {
  fall_in_one_year: string;
  number_of_falls: string;
  injury: string;
  physical_therapy: string;
  unsteady_todo_things: string;
  blackingout_from_bed: string;
  assistance_device: string;
  date_of_service: string;
  completed?:any
}

export interface DepressionType {
  feltdown_depressed_hopeless: string;
  little_interest_pleasure: string;
  trouble_sleep: string;
  tired_little_energy: string;
  poor_over_appetite: string;
  feeling_bad_failure: string;
  trouble_concentrating: string;
  slow_fidgety: string;
  suicidal_thoughts: string;
  problem_difficulty: string;
  enroll_in_bhi: string;
  referred_to_mh_professional: string;
  comments: string;
  completed?:any

  // GOAL 1
  understand_about_disease_start_date: string;
  understand_about_disease_end_date: string;
  monitor_phq9_start_date: string;
  monitor_phq9_end_date: string;
  advantages_of_phq9_start_date: string;
  advantages_of_phq9_end_date: string;

  // GOAL 2
  effect_with_other_problems_start_date: string;
  effect_with_other_problems_end_date: string;
  
  //Goal 3 
  relieve_depression_start_date: string;
  relieve_depression_end_date: string;
  understand_cbt_start_date: string;
  understand_cbt_end_date: string;
  physical_activity_importance_start_date: string;
  physical_activity_importance_end_date: string;
  waves_treatment_start_date: string;
  waves_treatment_end_date: string;

  // GOAL4
  exercise_start_date: string;
  exercise_end_date: string;

  // GOAL5
  regular_follow_ups_start_date: string;
  regular_follow_ups_end_date: string;
  
  // GOAL6
  helping_guides_start_date: string;
  helping_guides_end_date: string;
  
  // GOAL7
  improve_relations_start_date: string;
  improve_relations_end_date: string;
  psychotherapy_start_date: string;
  psychotherapy_end_date: string;
}

export interface GeneralHealthType {
  pain_felt: string;
  get_social_emotional_support: string;
  stress_problem: string;
  health_level: string;
  mouth_and_teeth: string;
  feeling_caused_distress: string;
  completed?:any
}
export interface PhysicalActivityType {
  days_of_exercise: string;
  mins_of_exercise: string;
  exercise_intensity: string;
  does_not_apply: string;
  completed?:any
}

export interface LdctType {
  cancer_symptoms: string;
  no_of_packs_year: string;
  current_quit_smoker: string;
  completed?:any
  length:any
}

export interface CognitiveAssessmentType {
  year_recalled: string;
  month_recalled: string;
  hour_recalled: string;
  reverse_count: string;
  reverse_month: string;
  address_recalled: string;
  completed?:any
}

export interface GeneralAssessmentType {
  imp_handwash_start_date: Date;
  imp_handwash_end_date: Date;
  und_handwash_start_date: Date;
  und_handwash_end_date: Date;
  washwithsoap_start_date: Date;
  washwithsoap_end_date: Date;
  und_washhands_start_date: Date;
  und_washhands_end_date: Date;
  turnoff_faucet_start_date: Date;
  turnoff_faucet_end_date: Date;
  understand_faucet_start_date: Date;
  understand_faucet_end_date: Date;
  plain_soap_usage_start_date: Date;
  plain_soap_usage_end_date: Date;
  bar_or_liquid_start_date: Date;
  bar_or_liquid_end_date: Date;
  uips_start_date: Date;
  uips_end_date: Date;
  no_soap_condition_start_date: Date;
  no_soap_condition_end_date: Date;
  understand_hand_sanitizer_start_date: Date;
  understand_hand_sanitizer_end_date: Date;
  is_taking_medication: string;
  reason_for_not_taking_medication: string;
  is_consuming_tobacco: string;
  quitting_tobacco: string;
  physical_exercises: string;
  physical_exercise_level: string;
  prescribed_medications: [];
  completed?:any
  comments?: string;
}

export interface MonthlyAssessmentType {
  respiratory_symptoms: string;
  urinary_system: string;
  gastrointestinal_system: string;
  cardiovascular_symptoms: string;
  appointment_schedule_with_pcp: string;
  refused_appoinment_with_pcp: string;
  last_pcp_visit: Date;
  in_er_since_last_pcp_visit: string;
  hospitalized_since_last_pcp_visit: string;
  any_question_about_medications: string;
  need_medication_refills: string;
  monthly_statment_comment: string;
  completed?:any
}

export interface ImmunizationType {
  flu_vaccine_recieved: string;
  flu_vaccine_refused: string;
  flu_vaccine_script_given: string;
  flu_vaccine_recieved_at: string;
  flu_vaccine_recieved_on: string;
  pneumococcal_vaccine_recieved: string;
  pneumococcal_prevnar_recieved_on: string;
  pneumococcal_prevnar_recieved_at: string;
  pneumococcal_ppsv23_recieved_on: string;
  pneumococcal_ppsv23_recieved_at: string;
  pneumococcal_vaccine_refused: string;
  pneumococcal_vaccine_script_given: string;
  comments: string;
  completed?:any
}
export interface ScreeningType {
  mammogram_done: string;
  mammogram_refused: string;
  mammogram_script: string;
  mammogram_done_on: string;
  mammogram_done_at: string;
  next_mommogram: string;
  mommogram_report_reviewed: string;
  colonoscopy_done: string;
  colonoscopy_script: string;
  colonoscopy_refused: string;
  colon_test_type: string;
  fit_test_refused: string;
  fit_test_script: string;
  refused_colonoscopy: string;
  refused_fit_test: string;
  refused_cologuard: string;
  colonoscopy_done_on: string;
  colonoscopy_done_at: string;
  next_colonoscopy: string;
  fit_done_on: Date;
  fit_done_at: string;
  next_fit: string;
  cologuard_done_on: Date;
  cologuard_done_at: string;
  next_cologuard: string;
  colonoscopy_report_reviewed: string;
  colonoscopy_test: string;
  fit_test: string;
  cologuard_test: string;
  fit_report_reviewed: string;
  cologuard_report_reviewed: string;
  script_given_for: string;
  comments: string;
  completed?:any
}
export interface CholesterolType {
  ldl_in_last_12months?: string;
  patient_has_ascvd?: string;
  active_diabetes?: string;
  ldlvalue_190ormore?: string;
  pure_hypercholesterolemia?: string;
  statin_prescribed?: string;
  statintype_dosage?: string;
  medical_reason_for_nostatin0?: string;
  medical_reason_for_nostatin1?: string;
  medical_reason_for_nostatin2?: string;
  medical_reason_for_nostatin3?: string;
  medical_reason_for_nostatin4?: string;
  medical_reason_for_nostatin5?: string;
  diabetes_patient_age?: string;
  ldl_range_in_past_two_years?: string;
  ldl_value?: string;
  ldl_date?: string;
  completed?:any
}

export interface DiabetesType {
  diabetec_patient: string;
  fbs_in_year: string;
  fbs_value: any;
  fbs_date: string;
  hba1c_value: string;
  hba1c_date: string;
  diabetec_eye_exam: string;
  diabetec_eye_exam_report: string;
  eye_exam_doctor: string;
  eye_exam_facility: string;
  eye_exam_date: string;
  eye_exam_report_reviewed: string;
  diabetec_ratinopathy: string;
  ratinavue_ordered: string;
  urine_microalbumin: string;
  urine_microalbumin_date: string;
  urine_microalbumin_report: string;
  urine_microalbumin_ordered: string;
  urine_microalbumin_inhibitor: string;
  urine_microalbumin_value: string;
  ckd_stage_4: string;
  completed?:any
}

export interface BpAssessmentType {
  bp_value: string;
  bp_date: string;
  completed:any
}

export interface WeightAssessmentType {
  bmi_value: string;
  completed:any
  followup_withnutritionist: string;
}
export interface NutritionType {
  fruits_vegs: number;
  whole_grain_food: number;
  high_fat_food: number;
  sugar_beverages: number;
  completed?:any
}
export interface SeatBeltType {
  wear_seat_belt: string;
  completed:any
}

export interface AlcoholUseType {
  days_of_alcoholuse: string;
  drinks_per_day: any;
  drinks_per_occasion: any;
  average_usage: string;
  completed:any
  drink_drive_yes: string;
}
export default interface BpAssesmentType {
  bp_value: string;
  bp_date: Date;
}

export interface TobaccoUseType {
  smoked_in_thirty_days: string;
  smoked_in_fifteen_years: string;
  smokeless_product_use: string;
  average_smoking_years: any;
  average_packs_per_day: any;
  average_packs_per_year: any;
  quit_tobacco: string;
  perform_ldct: string;
  patient_age: number;
  completed?:any
}

export interface OtherProviderType {
  key?: any;
  other_provider_beside_pcp?: string;
  full_name?: string;
  speciality?: string;
  full_name_2?: string;
  speciality_2?: string;
  completed?:any
  provider?:any
}
export interface MiscellaneousType {
  height: number;
  weight: number;
  time_spent: any;
  asprin_use: string;
  high_blood_pressure: string;
  behavioral_counselling: string;
  patient_on_asprin:string;
  comments:string;
  Pharmacy:any
  Suppliers:any
  completed?:any
}
export interface PhysicalExamType {
  general: string;
  eyes: string;
  neck: string;
  lungs: string;
  heart: string;
  neuro: string;
  extremeties: string;
  gi: string;
  ears: string;
  nose: string;
  throat: string;
  skin: string;
  oral_cavity: string;
  ms: string;
  completed?:any
}
export interface COPDType {
  lung_doctor: string;
  lung_doctor_name: string;
  spirometry_test_date: string;
  currently_smoking: string;
  never_smoked: string;
  smoking_duration: string;
  cigarettes_amount: string;
  smoking_quit_duration: string;
  never_ct_scan: string;
  last_ct_scan: string;
  supplimental_o2_therapy: string;

  completed?:any
  Cough: any;
  phlegum_in_chest: any;
  tight_chest: any;
  breathless: any;
  limited_activities: any;
  lung_condition: any;
  sound_sleep: any;
  energy_level: any;
  total_assessment_score: string;

  educate_on_disease_start_date: string;
  educate_on_disease_end_date: string;
  
  smoking_cessation_start_date: string;
  smoking_cessation_end_date: string;
  
  lowering_infection_risk_start_date: string;
  lowering_infection_risk_end_date: string;
  
  educate_on_lifestyle_start_date: string;
  educate_on_lifestyle_end_date: string;
  
  educate_on_emergency_start_date: string;
  educate_on_emergency_end_date: string;
  
  having_copd_flare_start_date: string;
  having_copd_flare_end_date: string;
  
  prevention_copd_flare_start_date: string;
  prevention_copd_flare_end_date: string;
  
  followup_imp_start_date: any;
  followup_imp_end_date: any;
  
}
export interface ObesityType {
  height: string;
  weight: string;
  gained_weight: any;
  lost_weight: any;
  bmi: any;
  completed?:any

  // GOAL 1
  bmi_awareness_start_date: string | undefined;
  bmi_awareness_end_date: string | undefined;
  weight_effect_start_date: string | undefined;
  weight_effect_end_date: string | undefined;
  maintain_healthy_weight_start_date: string | undefined;
  maintain_healthy_weight_end_date: string | undefined;
  advertised_diets_start_date: string | undefined;
  advertised_diets_end_date: string | undefined;
  healthy_habits_start_date: string | undefined;
  healthy_habits_end_date: string | undefined;

  // GOAL 2
  weight_loss_program_start_date: string | undefined;
  weight_loss_program_end_date: string | undefined;
  bmi_importance_start_date: string | undefined;
  bmi_importance_end_date: string | undefined;
  waist_circumference_start_date: string | undefined;
  waist_circumference_end_date: string | undefined;
  treatment_type_start_date: string | undefined;
  treatment_type_end_date: string | undefined;
  weight_loss_start_date: string | undefined;
  weight_loss_end_date: string | undefined;
  eating_triggers_start_date: string | undefined;
  eating_triggers_end_date: string | undefined;
  healthy_unhealthy_start_date: string | undefined;
  healthy_unhealthy_end_date: string | undefined;
  weightloss_factors_start_date: string | undefined;
  weightloss_factors_end_date: string | undefined;
  calories_needed_start_date: string | undefined;
  calories_needed_end_date: string | undefined;
  calories_count_start_date: string | undefined;
  calories_count_end_date: string | undefined;
  reduce_fat_start_date: string | undefined;
  reduce_fat_end_date: string | undefined;
  reduce_carbs_start_date: string | undefined;
  reduce_carbs_end_date: string | undefined;
  mediterranean_diet_start_date: string | undefined;
  mediterranean_diet_end_date: string | undefined;

  // GOAL 3
  weightloss_medication_start_date: string | undefined;
  weightloss_medication_end_date: string | undefined;
  dietary_supplements_start_date: string | undefined;
  dietary_supplements_end_date: string | undefined;
  weightloss_method_start_date: string | undefined;
  weightloss_method_end_date: string | undefined;
  seeing_dietitian_start_date: string | undefined;
  seeing_dietitian_end_date: string | undefined;
}
export interface CongestiveHeartFailureType {
  importance_medication_start_date: string | undefined;
  importance_medication_end_date: string | undefined;
  followup_pcp_start_date: string | undefined;
  followup_pcp_end_date: string | undefined;
  promote_adequate_nutrition_start_date: string;
  promote_adequate_nutrition_end_date: string;
  assess_rhythm_start_date: string;
  assess_rhythm_end_date: string;
  quiet_environment_start_date: string;
  quiet_environment_end_date: string;
  head_of_the_bed_start_date: string;
  head_of_the_bed_end_date: string;
  myocardial_infarction_start_date: string;
  myocardial_infarction_end_date: string;
  cardiac_workload_start_date: string;
  cardiac_workload_end_date: string;
  relaxation_techniques_start_date: string;
  relaxation_techniques_end_date: string;
  deep_breathing_start_date: string;
  deep_breathing_end_date: string;
  pulmonary_edemas_start_date: string;
  pulmonary_edemas_end_date: string;
  conditions_of_Arrhythmias_start_date: string;
  conditions_of_Arrhythmias_end_date: string;
  cardiologist_visit_start_date: string;
  cardiologist_visit_end_date: string;
  fluid_status_start_date: string;
  fluid_status_end_date: string;
  antiarrhythmias_start_date: string;
  antiarrhythmias_end_date: string;
  electrolyte_losses_start_date: string;
  electrolyte_losses_end_date: string;
  understanding_regarding_disease_start_date: string;
  understanding_regarding_disease_end_date: string;
  monitor_blood_pressure_start_date: string;
  monitor_blood_pressure_end_date: string;
  monitor_ECG_levels_start_date: string;
  monitor_ECG_levels_end_date: string;
  adequate_cardiac_start_date: string;
  adequate_cardiac_end_date: string;
  cerebral_hypoperfusion_start_date: string;
  cerebral_hypoperfusion_end_date: string;
  pulmonary_hygiene_start_date: string;
  pulmonary_hygiene_end_date: string;
  respiratory_distress_start_date: string;
  respiratory_distress_end_date: string;
  monitor_ABG_levels_start_date: string;
  monitor_ABG_levels_end_date: string;
  follow_up_cardio: string;
  freq_recom_cardio: string;
  not_following_cardio: string;
  echocardiogram: string;
  no_echocardiogram: string;
  ge_chf_start_date: string;
  ge_chf_end_date: string;
  ui_smoke_cessation_start_date: string;
  ui_smoke_cessation_end_date: string;
  ui_sodium_diet_start_date: string;
  ui_sodium_diet_end_date: string;
  ui_fluid_restriction_start_date: string;
  ui_fluid_restriction_end_date: string;
  uid_weight_monitoring_start_date: string;
  uid_weight_monitoring_end_date: string;
  rs_excerbation_start_date: string;
  rs_excerbation_end_date: string;
  ri_adherence_start_date: string;
  ri_adherence_end_date: string;
  seek_help_start_date: string;
  seek_help_end_date: string;
  completed?:any
}

export interface CKDType {
  key?: any;
  bp_day: any;
  systolic_day: any;
  diastolic_day: any;
  hba1c?: any;
  nephrologist_question?: string;
  nephrologist_name?: string;
  egfr_date?: any;
  egfr_result_one_report?: any;
  egfr_result_two_start_date?: any;
  egfr_result_two_report?: any;
  completed?:any

  //GOAL1
  educate_on_ckd_start_date?: string;
  educate_on_ckd_end_date?: string;
  worsening_symptoms_start_date?: string;
  worsening_symptoms_end_date?: string;
  followup_importance_start_date?: string;
  followup_importance_end_date?: string;
  prevent_worsening_start_date?: string;
  prevent_worsening_end_date?: string;
  aviod_medications_start_date?: string;
  aviod_medications_end_date?: string;
  ckd_treatment_start_date?: string;
  ckd_treatment_end_date?: string;
  
  // GOAL 2
  educate_on_risk_factors_start_date?: string;
  educate_on_risk_factors_end_date?: string;
  educate_on_lowering_risk_start_date?: string;
  educate_on_lowering_risk_end_date?: string;
  hypertension_effects_risk_start_date?: string;
  hypertension_effects_risk_end_date?: string;
  healthy_diet_start_date?: string;
  healthy_diet_end_date?: string;
  protein_effects_start_date?: string;
  protein_effects_end_date?: string;
  elevated_cholesterol_start_date?: string;
  elevated_cholesterol_end_date?: string;
  
  // GOAL 3
  educate_on_dkd_start_date?: string;
  educate_on_dkd_end_date?: string;
  dkd_symptoms_start_date?: string;
  dkd_symptoms_end_date?: string;
  dkd_risk_factors_start_date?: string;
  dkd_risk_factors_end_date?: string;
  dkd_progression_start_date?: string;
  dkd_progression_end_date?: string;
  healthy_lifestyle_effect_start_date?: string;
  healthy_lifestyle_effect_end_date?: string;
  blood_sugar_control_start_date?: string;
  blood_sugar_control_end_date?: string;
  hba1c_importance_start_date?: string;
  hba1c_importance_end_date?: string;
  control_blood_sugar_start_date?: string;
  control_blood_sugar_end_date?: string;
  bp_effect_on_dkd_start_date?: string;
  bp_effect_on_dkd_end_date?: string;
  hypertension_treatment_start_date?: string;
  hypertension_treatment_end_date?: string;
  
  // GOAL 4
  ckd_heart_start_date?: string;
  ckd_heart_end_date?: string;
}

export interface HyperCholestrolemiaType {
  ldl_in_last_12months: string;
  patient_has_ascvd: string;
  ldlvalue_190ormore: string;
  active_diabetes: string;
  diabetes_patient_age: string;
  ldl_range_in_past_two_years: string;
  statin_prescribed: string;
  ldl_date: any;
  ldl_value: string | number | readonly string[] | undefined;
  statintype_dosage: any;
  pure_hypercholesterolemia: string;
  medical_reason_for_nostatin0: string;
  medical_reason_for_nostatin1: string;
  medical_reason_for_nostatin2: string;
  medical_reason_for_nostatin3: string;
  medical_reason_for_nostatin4: string;
  medical_reason_for_nostatin5: string;
  statin_intensity: string;
  assesment_done: string;
  ldl_goal: string;
  causes_of_hyperlipidemia_start_date: any;
  causes_of_hyperlipidemia_end_date: any;
  saturated_trans_fat_start_date: string;
  saturated_trans_fat_end_date: string;
  lab_mandatory_start_date: any;
  lab_mandatory_end_date: any;
  monitor_comorbid_start_date: any;
  monitor_comorbid_end_date: any;
  understand_etiology_start_date: any;
  understand_etiology_end_date: any;
  calculate_ASCVD_start_date: any;
  calculate_ASCVD_end_date: any;
  dietary_factors_start_date: any;
  dietary_factors_end_date: any;
  visiting_nutritionist_start_date: any;
  visiting_nutritionist_end_date: any;
  amount_of_exercise_start_date: string;
  amount_of_exercise_end_date: string;
  effect_of_exercise_start_date: string;
  effect_of_exercise_end_date: string;
}
export interface CaregiverAssesmentType {
  every_day_activities: string;
  medications: string;
  adls: string;
  completed?:any
}
export interface bpRows {
  key?: any;
  bp_day: any;
  systolic_day: any;
  diastolic_day: any;
}
export interface Hypertension {
  [index:string]:any;
  daily_bp_reading?:string;
  key?: any;
  bp?: any;
  bp_day?: any;
  systolic_day?: any;
  diastolic_day?: any;
  reason_for_no_bp?: any;
  hypertensive_urgency0?: string;
  hypertensive_urgency1?: string;
  hypertensive_urgency2?: string;
  hypertensive_urgency3?: string;
  hypertensive_urgency4?: string;
  hypertensive_urgency5?: string;
  hypertensive_urgency6?: string;
  hypertensive_urgency7?: string;
  understanding_regarding_disease_start_date?: string | undefined;
  understanding_regarding_disease_end_date?: string | undefined;
  educate_about_dash_diet_start_date?:string | undefined;
  educate_about_dash_diet_end_date?:string | undefined;
  educate_about_sodium_diet_start_date?:string | undefined;
  educate_about_sodium_diet_end_date?:string | undefined;
  educate_about_excercise_start_date?:string | undefined;
  educate_about_excercise_end_date?:string | undefined;
  educate_about_alcoholeffects_start_date?:string | undefined;
  educate_about_alcoholeffects_end_date?:string | undefined;
  educate_about_smokingeffects_start_date?:string | undefined;
  educate_about_smokingeffects_end_date?:string | undefined;
  regular_bp_monitoring_start_date?:string | undefined;
  regular_bp_monitoring_end_date?:string | undefined;
  regular_pcp_folloup_start_date?: string | undefined;
  regular_pcp_folloup_end_date?: string | undefined;
}
export interface DiabetesMellitusType {
  hb_result: string;
  result_month: string;
  hba1c_script: string;
  intensive_diabetic_control: string;
  diabetic_clinic_appoinment: string;
  name_of_doctor: string;
  name_of_facility: string;
  checkup_date: string;
  eye_examination: string;
  diabetic_nephropathy: string;
  report_available: string;
  report_requested: string;
  diabetic_nephropathy_result: string;
  diabetic_nephropathy_date: string;
  retinavue_ordered: string;
  eye_examination_script: string;
  diabetic_nephropathy_not_conducted: string;
  diabetic_inhibitors: string;
  nephropathy_patient_has?: string;
  ldl_in_last_12months?: string;
  ldl_value: string;
  ldl_date?: string;
  completed?:any
  // GOAL 1
  monitor_blood_glucose_start_date: string;
  monitor_blood_glucose_end_date: string;
  importance_of_weight_start_date: string;
  importance_of_weight_end_date: string;
  assess_the_pattern_start_date: string;
  assess_the_pattern_end_date: string;
  monitoring_blood_sugar_start_date: string;
  monitoring_blood_sugar_end_date: string;

  // GOAL 2
  abc_of_diabetes_start_date: string;
  abc_of_diabetes_end_date: string;
  undercontrol_weight_start_date :string;
  undercontrol_weight_end_date :string;
  seeing_dietician_start_date :string;
  seeing_dietician_end_date :string;

  // GOAL 3
  signs_of_hyperglycemia_start_date: string;
  signs_of_hyperglycemia_end_date: string;
  prevention_of_hyperglycemia_start_date: string;
  prevention_of_hyperglycemia_end_date: string;
  lower_blood_sugar_start_date: string;
  lower_blood_sugar_end_date: string;
  
  // GOAL 4
  sugar_effect_on_eye_start_date :string;
  sugar_effect_on_eye_end_date :string;
  sugar_ways_to_effect_on_eye_start_date :string;
  sugar_ways_to_effect_on_eye_end_date :string;
  
  // GOAL 5
  foot_nerves_damage_start_date :string;
  foot_nerves_damage_end_date :string;
  protect_feet_start_date :string;
  protect_feet_end_date :string;
  foot_examination_start_date :string;
  foot_examination_end_date :string;
  
  // GOAL 6
  death_cause_in_diabetes_start_date :string;
  death_cause_in_diabetes_end_date :string;
  risk_of_cardio_disease_start_date :string;
  risk_of_cardio_disease_end_date :string;
  cholesterol_healthy_range_start_date :string;
  cholesterol_healthy_range_end_date :string;
  low_dose_aspirin_start_date :string;
  low_dose_aspirin_end_date :string;
  
  // GOAL 7
  diabetes_effect_on_kidneys_start_date :string;
  diabetes_effect_on_kidneys_end_date :string;
  know_how_kidneys_effected_start_date :string;
  know_how_kidneys_effected_end_date :string;
  protect_kidneys_start_date :string;
  protect_kidneys_end_date :string;
  
  // GOAL 8
  bp_recommendation_start_date :string;
  bp_recommendation_end_date :string;
  how_to_lower_bp_start_date :string;
  how_to_lower_bp_end_date :string;

  // GOAL 9 STARTS
  monitor_hunger_and_fatigue_start_date: string;
  monitor_hunger_and_fatigue_end_date: string;
  assess_frequent_urination_start_date: string;
  assess_frequent_urination_end_date: string;
  assess_slow_healing_start_date: string;
  assess_slow_healing_end_date: string;
}
