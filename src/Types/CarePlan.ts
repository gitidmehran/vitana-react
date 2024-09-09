export interface PatientType {
  doctor: any;
  date_of_service: any;
  id: string;
  last_name: string;
  first_name: string;
  mid_name: string;
  name: string;
  identity: string;
  contact_no: string;
  cell: string;
  dob: string;
  age: string;
  doctor_id: string;
  gender: string;
  disease: string;
  address: string;
  address_2: string;
  insurance_id: string;
  description: string;
  condition: string;
  status: string;
  city: string;
  state: string;
  zipCode: string;
  insurance_name: string;
  pcp_name?: string;
  coordinator_name?: string;
}
export interface PatientHeightWeightNextDueType {
  height: string;
  weight: string;
  next_year_due: string;
}
export interface ProgramType {
  name: string;
  short_name: string;
}

export interface PatientRowDetailsType {
  id: string;
  serial_no: string;
  patient_id: string;
  program_id: string;
  created_user: string;
  doctor_id: string;
  signed_date: string;
  date_of_service: string;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  primary_care_physician: string;
  monthly_assessment : any;
}
export interface FallScreeningType {
  outcome: string;
}
export interface DepressionOutComesType {
  prognosis: string;
  assessment: string;
  severity: string;
  referrals: string;
  referrals1: string;
  flag: boolean;

  
  // GOAL 1
  goal1_status: string;
  understand_about_disease_start_date: string;
  understand_about_disease_end_date: string;
  understand_about_disease_status: string;
  monitor_phq9_start_date: string;
  monitor_phq9_end_date: string;
  monitor_phq9_status: string;
  advantages_of_phq9_start_date: string;
  advantages_of_phq9_end_date: string;
  advantages_of_phq9_status: string;

  // GOAL 2
  goal2_status: string;
  effect_with_other_problems_start_date: string;
  effect_with_other_problems_end_date: string;
  effect_with_other_problems_status: string
  
  //Goal 3 
  goal3_status: string;
  relieve_depression_start_date: string;
  relieve_depression_end_date: string;
  relieve_depression_status: string;
  understand_cbt_start_date: string;
  understand_cbt_end_date: string;
  understand_cbt_status: string;
  physical_activity_importance_start_date: string;
  physical_activity_importance_end_date: string;
  physical_activity_importance_status: string;
  waves_treatment_start_date: string;
  waves_treatment_end_date: string;
  waves_treatment_status: string;

  // GOAL4
  goal4_status: string;
  exercise_start_date: string;
  exercise_end_date: string;
  exercise_status: string;

  // GOAL5
  goal5_status: string;
  regular_follow_ups_start_date: string;
  regular_follow_ups_end_date: string;
  regular_follow_ups_status: string;
  
  // GOAL6
  goal6_status: string;
  helping_guides_start_date: string;
  helping_guides_end_date: string;
  helping_guides_status: string;
  
  // GOAL7
  goal7_status: string;
  improve_relations_start_date: string;
  improve_relations_end_date: string;
  improve_relations_status: string;
  psychotherapy_start_date: string;
  psychotherapy_end_date: string;
  psychotherapy_status: string;
}
export interface HighStressType {
  outcome: string;
}
export interface GeneralHealthType {
  health_level: string;
  mouth_and_teeth: string;
  feelings_cause_distress: string;
  flag: boolean;
}
export interface SocialEmotionalSupportType {
  outcome: string;
}
export interface PainType {
  pain_felt: string;
  outcome: string;
}
export interface CognitiveAssessmentType {
  outcome: string;
}
export interface PhysicalActivityType {
  outcome: string;
  flag: boolean;
}
export interface AlcohalUseType {
  outcome: string;
  flag: boolean;
}
export interface TobaccoUseType {
  ldct_counseling: string;
  quit_tobacoo: string;
  flag: boolean;
}
export interface SeatBeltUseType {
  outcome: string;
  flag: boolean;
}
export interface ImmunizationType {
  flu_vaccine: string;
  flu_vaccine_script: string;
  pneumococcal_vaccine: string;
  pneumococcal_vaccine_script: string;
  nextFluVaccine: Date;
  flag: boolean;
}
export interface ScreeningType {
  mammogram: string;
  comments: string;
  next_mammogram: string;
  next_mammogram_date: string;
  mammogram_script: string;
  mammogaram_flag: boolean;
  next_colonoscopy: string;
  test_type: string;
  next_col_fit_guard: string;
  colonoscopy_script: string;
  colonoscopy: string;
  colo_flag: boolean;
}
export interface DiabetesType {
  diabetes: string;
  is_diabetic: string;
  next_hba1c_date: string;
  next_fbs_date: string;
  diabetec_eye_exam: string;
  nepropathy: string;
  nephropathy_flag: boolean;
  eye_exam_flag: boolean;
  flag: boolean;
}
export interface CholestrolType {
  outcome: string;
  ldl_result: string;
  ldl_next_due: string;
}
export interface BpAssessmentType {
  flag: boolean;
  bp_result: string;
  outcome: string;
}
export interface WeightAssessmentType {
  bmi_result: string;
  outcome: string;
}

export interface CaregiverAssesmentType {
  every_day_activities: string;
  medications: string;
}

export interface OtherProviderType {
  other_provider_beside_pcp: string;
}

export interface GeneralAssessmentType {
  bar_or_liquid_end_date: string;
  bar_or_liquid_start_date: string;
  imp_handwash_end_date: string;
  imp_handwash_start_date: string;
  is_consuming_tobacco: string;
  is_taking_medication: string;
  no_soap_condition_end_date: string;
  no_soap_condition_start_date: string;
  physical_exercise_level: string;
  physical_exercises: string;
  plain_soap_usage_end_date: string;
  plain_soap_usage_start_date: string;
  turnoff_faucet_end_date: string;
  turnoff_faucet_start_date: string;
  uips_end_date: string;
  uips_start_date: string;
  und_handwash_end_date: string;
  und_handwash_start_date: string;
  und_washhands_end_date: string;
  und_washhands_start_date: string;
  understand_faucet_end_date: string;
  understand_faucet_start_date: string;
  understand_hand_sanitizer_end_date: string;
  understand_hand_sanitizer_start_date: string;
  washwithsoap_end_date: string;
  washwithsoap_start_date: string;
  imp_handwash_status: string;
  und_handwash_status: string;
  washwithsoap_status: string;
  und_washhands_status: string;
  turnoff_faucet_status: string;
  understand_faucet_status: string;
  plain_soap_usage_status: string;
  bar_or_liquid_status: string;
  uips_status: string;
  no_soap_condition_status: string;
  understand_hand_sanitizer_status: string;
  prescribed_medications: string;
}

export interface HypercholesterolemiaType {
  prognosis: string;
  assessment:string;
  goal1_status: string;
  causes_of_hyperlipidemia_start_date: any;
  causes_of_hyperlipidemia_end_date: any;
  causes_of_hyperlipidemia_status:string;
  saturated_trans_fat_start_date: string;
  saturated_trans_fat_end_date: string;
  saturated_trans_fat_status:string;
  lab_mandatory_start_date: any;
  lab_mandatory_end_date: any;
  lab_mandatory_status:string;
  monitor_comorbid_start_date: any;
  monitor_comorbid_end_date: any;
  monitor_comorbid_status:string;

  goal2_status: string;
  understand_etiology_start_date: any;
  understand_etiology_end_date: any;
  understand_etiology_status:string;
  calculate_ASCVD_start_date: any;
  calculate_ASCVD_end_date: any;
  calculate_ASCVD_status:string;

  goal3_status: string;
  dietary_factors_start_date: any;
  dietary_factors_end_date: any;
  dietary_factors_status:string;
  visiting_nutritionist_start_date: any;
  visiting_nutritionist_end_date: any;
  visiting_nutritionist_status:string;

  goal4_status: string;
  amount_of_exercise_start_date: string;
  amount_of_exercise_end_date: string;
  amount_of_exercise_status:string;
  effect_of_exercise_start_date: string;
  effect_of_exercise_end_date: string;
  effect_of_exercise_status:string;
}

export interface HypertensionType {
  result: any;
  prognosis: string;
  assessment: string;

  goal1_status: string;
  understanding_regarding_disease_start_date: string;
  understanding_regarding_disease_end_date: string;
  understanding_regarding_disease_status: string;

  goal2_status: string;
  educate_about_dash_diet_start_date: string;
  educate_about_dash_diet_end_date: string;
  educate_about_dash_diet_status: string;
  educate_about_sodium_diet_start_date: string;
  educate_about_sodium_diet_end_date: string;
  educate_about_sodium_diet_status: string;
  educate_about_excercise_start_date: string;
  educate_about_excercise_end_date: string;
  educate_about_excercise_status: string;
  educate_about_alcoholeffects_start_date: string;
  educate_about_alcoholeffects_end_date: string;
  educate_about_alcoholeffects_status: string;
  educate_about_smokingeffects_start_date: string;
  educate_about_smokingeffects_end_date: string;
  educate_about_smokingeffects_status: string;

  goal3_status: string;
  regular_bp_monitoring_start_date: string;
  regular_bp_monitoring_end_date: string;
  regular_bp_monitoring_status: string;

  goal4_status: string;
  regular_pcp_folloup_start_date: string;
  regular_pcp_folloup_end_date: string;
  regular_pcp_folloup_status: string;
}

export interface ObesityType {
  prognosis: string;
  assessment: string;

  //GOAL 1
  goal1_status: string;
  bmi_awareness_start_date:string;
  bmi_awareness_end_date:string;
  bmi_awareness_status:string;
  weight_effect_start_date:string;
  weight_effect_end_date:string;
  weight_effect_status:string;
  maintain_healthy_weight_start_date:string;
  maintain_healthy_weight_end_date:string;
  maintain_healthy_weight_status:string;
  advertised_diets_start_date:string;
  advertised_diets_end_date:string;
  advertised_diets_status:string;
  healthy_habits_start_date:string;
  healthy_habits_end_date:string;
  healthy_habits_status:string;

  // GOAL 2
  goal2_status: string;
  weight_loss_program_start_date: string;
  weight_loss_program_end_date: string;
  weight_loss_program_status: string;
  bmi_importance_start_date: string;
  bmi_importance_end_date: string;
  bmi_importance_status: string;
  waist_circumference_start_date: string;
  waist_circumference_end_date: string;
  waist_circumference_status: string;
  treatment_type_start_date: string;
  treatment_type_end_date: string;
  treatment_type_status: string;
  weight_loss_start_date: string;
  weight_loss_end_date: string;
  weight_loss_status: string;
  eating_triggers_start_date: string;
  eating_triggers_end_date: string;
  eating_triggers_status: string;
  healthy_unhealthy_start_date: string;
  healthy_unhealthy_end_date: string;
  healthy_unhealthy_status: string;
  weightloss_factors_start_date: string;
  weightloss_factors_end_date: string;
  weightloss_factors_status: string;
  calories_needed_start_date: string;
  calories_needed_end_date: string;
  calories_needed_status: string;
  calories_count_start_date: string;
  calories_count_end_date: string;
  calories_count_status: string;
  reduce_fat_start_date: string;
  reduce_fat_end_date: string;
  reduce_fat_status: string;
  reduce_carbs_start_date: string;
  reduce_carbs_end_date: string;
  reduce_carbs_status: string;
  mediterranean_diet_start_date: string;
  mediterranean_diet_end_date: string;
  mediterranean_diet_status: string;

  // GOAL 3
  goal3_status: string;
  weightloss_medication_start_date: string;
  weightloss_medication_end_date: string;
  weightloss_medication_status: string;
  dietary_supplements_start_date: string;
  dietary_supplements_end_date: string;
  dietary_supplements_status: string;
  weightloss_method_start_date: string;
  weightloss_method_end_date: string;
  weightloss_method_status: string;
  seeing_dietitian_start_date: string;
  seeing_dietitian_end_date: string;
  seeing_dietitian_status: string;
}

export interface DiabetesMellitusType {
  prognosis: string;
  assessment: string;
  goal1_status: string;
  monitoring_blood_sugar_start_date: string;
  monitoring_blood_sugar_end_date: string;
  monitoring_blood_sugar_status: string;
  importance_of_weight_start_date: string;
  importance_of_weight_end_date: string;
  importance_of_weight_status: string;
  assess_the_pattern_start_date: string;
  assess_the_pattern_end_date: string;
  assess_the_pattern_status: string;
  monitor_blood_glucose_start_date: string;
  monitor_blood_glucose_end_date: string;
  monitor_blood_glucose_status: string;

  goal2_status: string;
  abc_of_diabetes_start_date: string;
  abc_of_diabetes_end_date: string;
  abc_of_diabetes_status: string;
  undercontrol_weight_start_date: string;
  undercontrol_weight_end_date: string;
  undercontrol_weight_status: string;
  seeing_dietician_start_date: string;
  seeing_dietician_end_date: string;
  seeing_dietician_status: string;

  goal3_status: string;
  signs_of_hyperglycemia_start_date: string;
  signs_of_hyperglycemia_end_date: string;
  signs_of_hyperglycemia_status: string;
  prevention_of_hyperglycemia_start_date: string;
  prevention_of_hyperglycemia_end_date: string;
  prevention_of_hyperglycemia_status: string;
  lower_blood_sugar_start_date: string;
  lower_blood_sugar_end_date: string;
  lower_blood_sugar_status: string;

  goal4_status: string;
  sugar_effect_on_eye_start_date: string;
  sugar_effect_on_eye_end_date: string;
  sugar_effect_on_eye_status: string;
  sugar_ways_to_effect_on_eye_start_date: string;
  sugar_ways_to_effect_on_eye_end_date: string;
  sugar_ways_to_effect_on_eye_status: string;

  goal5_status: string;
  foot_nerves_damage_start_date: string;
  foot_nerves_damage_end_date: string;
  foot_nerves_damage_status: string;
  protect_feet_start_date: string;
  protect_feet_end_date: string;
  protect_feet_status: string;
  foot_examination_start_date: string;
  foot_examination_end_date: string;
  foot_examination_status: string;

  goal6_status: string;
  death_cause_in_diabetes_start_date: string;
  death_cause_in_diabetes_end_date: string;
  death_cause_in_diabetes_status: string;
  risk_of_cardio_disease_start_date: string;
  risk_of_cardio_disease_end_date: string;
  risk_of_cardio_disease_status: string;
  cholesterol_healthy_range_start_date: string;
  cholesterol_healthy_range_end_date: string;
  cholesterol_healthy_range_status: string;
  low_dose_aspirin_start_date: string;
  low_dose_aspirin_end_date: string;
  low_dose_aspirin_status: string;

  goal7_status: string;
  diabetes_effect_on_kidneys_start_date: string;
  diabetes_effect_on_kidneys_end_date: string;
  diabetes_effect_on_kidneys_status: string;
  know_how_kidneys_effected_start_date: string;
  know_how_kidneys_effected_end_date: string;
  know_how_kidneys_effected_status: string;
  protect_kidneys_start_date: string;
  protect_kidneys_end_date: string;
  protect_kidneys_status: string;

  goal8_status: string;
  bp_recommendation_start_date: string;
  bp_recommendation_end_date: string;
  bp_recommendation_status: string;
  how_to_lower_bp_start_date: string;
  how_to_lower_bp_end_date: string;
  how_to_lower_bp_status: string;
  
  goal9_status: string;
  monitor_hunger_and_fatigue_start_date: string;
  monitor_hunger_and_fatigue_end_date: string;
  monitor_hunger_and_fatigue_status: string;
  assess_frequent_urination_start_date: string;
  assess_frequent_urination_end_date: string;
  assess_frequent_urination_status: string;
  assess_slow_healing_start_date: string;
  assess_slow_healing_end_date: string;
  assess_slow_healing_status: string;
}

export interface CopdAssessmentType {
  assessment: string;
  prognosis: string;
  lung_doctor: string;
  lung_doctor_name: string;
  spirometry_test_date: string;
  currently_smoking: string;
  smoking_duration: string;
  cigarettes_amount: string;
  smoking_quit_duration: string;
  last_ct_scan: string;
  supplimental_o2_therapy: string;

  Cough: any;
  phlegum_in_chest: any;
  tight_chest: any;
  breathless: any;
  limited_activities: any;
  lung_condition: any;
  sound_sleep: any;
  energy_level: any;
  total_assessment_score: string;

  goal1_status: string;
  educate_on_disease_start_date: string;
  educate_on_disease_end_date: string;
  educate_on_disease_status: string;

  goal2_status: string;
  smoking_cessation_start_date: string;
  smoking_cessation_end_date: string;
  smoking_cessation_status: string;

  goal3_status: string;
  lowering_infection_risk_start_date: string;
  lowering_infection_risk_end_date: string;
  lowering_infection_risk_status: string;

  goal4_status: string;
  educate_on_lifestyle_start_date: string;
  educate_on_lifestyle_end_date: string;
  educate_on_lifestyle_status: string;

  goal5_status: string;
  educate_on_emergency_start_date: string;
  educate_on_emergency_end_date: string;
  educate_on_emergency_status: string;

  goal6_status: string;
  having_copd_flare_start_date: string;
  having_copd_flare_end_date: string;
  having_copd_flare_status: string;

  goal7_status: string;
  prevention_copd_flare_start_date: string;
  prevention_copd_flare_end_date: string;
  prevention_copd_flare_status: string;
  
  goal8_status: string;
  followup_imp_start_date: string;
  followup_imp_end_date: string;
  followup_imp_status: string;
  
}

export interface ChfAssessmentType {
  followup_pcp_start_date: string;
  followup_pcp_end_date: string;
  followup_pcp_status: string;
  importance_medication_start_date: string;
  importance_medication_end_date: string;
  importance_medication_status: string;
  goal6_status: string;
  goal1_status: string;
  goal2_status: string;
  goal3_status: string;
  goal4_status: string;
  goal5_status: string;
  chances_or_relapse_goal_status: string;
  respiratory_distress_goal_status: string;
  altered_cardiac_output_goal_status: string;
  stabilized_fluid_volume_goal_status: string;
  reduction_of_recurrent_goal_status: string;
  chf_knowledge_goal_status: string;
  antiarrhythmias_start_date: string;
  antiarrhythmias_end_date: string;
  antiarrhythmias_status: string;
  fluid_status_start_date: string;
  fluid_status_end_date: string;
  fluid_status_status: string;
  pulmonary_edemas_start_date: string;
  pulmonary_edemas_end_date: string;
  pulmonary_edemas_status: string;
  conditions_of_Arrhythmias_start_date: string;
  conditions_of_Arrhythmias_end_date: string;
  conditions_of_Arrhythmias_status: string;
  cardiologist_visit_start_date: string;
  cardiologist_visit_end_date: string;
  cardiologist_visit_status: string;
  pulmonary_hygiene_start_date: string;
  pulmonary_hygiene_end_date: string;
  pulmonary_hygiene_status: string;
  respiratory_distress_start_date: string;
  respiratory_distress_end_date: string;
  respiratory_distress_status: string;
  monitor_ABG_levels_start_date: string;
  monitor_ABG_levels_end_date: string;
  monitor_ABG_levels_status: string;
  adequate_cardiac_start_date: string;
  adequate_cardiac_end_date: string;
  adequate_cardiac_status: string;
  cerebral_hypoperfusion_start_date: string;
  cerebral_hypoperfusion_end_date: string;
  cerebral_hypoperfusion_status: string;
  understanding_regarding_disease_start_date: string;
  understanding_regarding_disease_end_date: string;
  understanding_regarding_disease_status: string;
  monitor_blood_pressure_start_date: string;
  monitor_blood_pressure_end_date: string;
  monitor_blood_pressure_status: string;
  monitor_ECG_levels_start_date: string;
  monitor_ECG_levels_end_date: string;
  monitor_ECG_levels_status: string;
  no_echodiogram: string;
  careplan: string;
  prognosis: string;
  ge_chf_start_date: string;
  ge_chf_end_date: string;
  ge_chf_status: string;
  ui_smoke_cessation_start_date: string;
  ui_smoke_cessation_end_date: string;
  ui_smoke_cessation_status: string;
  ui_sodium_diet_start_date: string;
  ui_sodium_diet_end_date: string;
  ui_sodium_diet_status: string;
  ui_fluid_restriction_start_date: string;
  ui_fluid_restriction_end_date: string;
  ui_fluid_restriction_status: string;
  uid_weight_monitoring_start_date: string;
  uid_weight_monitoring_end_date: string;
  uid_weight_monitoring_status: string;
  rs_excerbation_start_date: string;
  rs_excerbation_end_date: string;
  rs_excerbation_status: string;
  ri_adherence_start_date: string;
  ri_adherence_end_date: string;
  ri_adherence_status: string;
  seek_help_start_date: string;
  seek_help_end_date: string;
  seek_help_status: string;
}

export interface CkdAssessmentType {
  key?: string;
  bp_day: string;
  systolic_day: string;
  diastolic_day: string;
  prognosis: string;
  assessment: string;
  result: any;
  length: number;
  hba1c?: string;

  //GOAL1
  goal1_status: string;
  educate_on_ckd_start_date?: string;
  educate_on_ckd_end_date?: string;
  educate_on_ckd_status: string;
  worsening_symptoms_start_date?: string;
  worsening_symptoms_end_date?: string;
  worsening_symptoms_status: string;
  followup_importance_start_date?: string;
  followup_importance_end_date?: string;
  followup_importance_status: string;
  prevent_worsening_start_date?: string;
  prevent_worsening_end_date?: string;
  prevent_worsening_status: string;
  aviod_medications_start_date?: string;
  aviod_medications_end_date?: string;
  aviod_medications_status: string;
  ckd_treatment_start_date?: string;
  ckd_treatment_end_date?: string;
  ckd_treatment_status: string;
  
  // GOAL 2
  goal2_status: string;
  educate_on_risk_factors_start_date?: string;
  educate_on_risk_factors_end_date?: string;
  educate_on_risk_factors_status: string;

  educate_on_lowering_risk_start_date?: string;
  educate_on_lowering_risk_end_date?: string;
  educate_on_lowering_risk_status: string;

  hypertension_effects_risk_start_date?: string;
  hypertension_effects_risk_end_date?: string;
  hypertension_effects_risk_status: string;

  healthy_diet_start_date?: string;
  healthy_diet_end_date?: string;
  healthy_diet_status: string;

  protein_effects_start_date?: string;
  protein_effects_end_date?: string;
  protein_effects_status: string;

  elevated_cholesterol_start_date?: string;
  elevated_cholesterol_end_date?: string;
  elevated_cholesterol_status: string;
  
  // GOAL 3
  goal3_status: string;
  educate_on_dkd_start_date?: string;
  educate_on_dkd_end_date?: string;
  educate_on_dkd_status: string;

  dkd_symptoms_start_date?: string;
  dkd_symptoms_end_date?: string;
  dkd_symptoms_status: string;

  dkd_risk_factors_start_date?: string;
  dkd_risk_factors_end_date?: string;
  dkd_risk_factors_status: string;

  dkd_progression_start_date?: string;
  dkd_progression_end_date?: string;
  dkd_progression_status: string;

  healthy_lifestyle_effect_start_date?: string;
  healthy_lifestyle_effect_end_date?: string;
  healthy_lifestyle_effect_status: string;

  blood_sugar_control_start_date?: string;
  blood_sugar_control_end_date?: string;
  blood_sugar_control_status: string;

  hba1c_importance_start_date?: string;
  hba1c_importance_end_date?: string;
  hba1c_importance_status: string;

  control_blood_sugar_start_date?: string;
  control_blood_sugar_end_date?: string;
  control_blood_sugar_status: string;

  bp_effect_on_dkd_start_date?: string;
  bp_effect_on_dkd_end_date?: string;
  bp_effect_on_dkd_status: string;

  hypertension_treatment_start_date?: string;
  hypertension_treatment_end_date?: string;
  hypertension_treatment_status: string;

  // GOAL 4
  goal4_status: string;
  ckd_heart_start_date?: string;
  ckd_heart_end_date?: string;
  ckd_heart_status:string;
}

export interface chronicDiseasesType {
  CKD: boolean;
  ChronicObstructivePulmonaryDisease: boolean;
  CongestiveHeartFailure: boolean;
  Depression: boolean;
  DiabetesMellitus: boolean;
  Hypercholesterolemia: boolean;
  Hypertensions: boolean;
  Obesity: boolean;
  anemia: boolean;
  asthma: boolean;
  hyperthyrodism: boolean;
}
