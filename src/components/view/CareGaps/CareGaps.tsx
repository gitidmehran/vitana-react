/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/questions_answers.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Pagination, Spin } from "antd";
import { addBulkCareGaps, generateCareGaps, getCareGaps, roleFilter } from "../../../actions/CareGaps/CareGapsActions";
import { OpenNotification } from "../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { message } from "antd";
import AddCareGaps from "./AddCareGaps";
// import moment from "moment";
import GenerateCareGaps from "./GenerateCareGaps";
import moment from 'moment-timezone';

function CareGaps() {
    const [isBulkOpen, setIsBulkOpen] = useState<boolean>(false);
    const [isGenerateGapOpen, setIsGenerateGapOpen] = useState<boolean>(false);
    const [title, setTitle] = useState<string>("");
    const [loading, settLoading] = useState<boolean>(false);
    const [insuranceIds, setInsurances] = React.useState<any>();
    const [insuranceLabel, setInsuranceLabel] = React.useState<string>("");
    const [insuranceProvider, setInsuranceProvider] = React.useState<string>("");
    const [insuranceTypeId, setInsuranceTypeId] = React.useState<number>(0);
    const [insurancesCLinic, setInsurancesClinic] = React.useState<any>([]);
    // eslint-disable-next-line
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [clinics, setClinics] = useState<any>([]);
    const [bulkData, setBulkData] = useState<any>([]);
    const [clinicIds, setClinicIds] = useState<any>(null);
    const [errors, setError] = useState<boolean>(false);
    const [isDisabledUpload, setIsDisabledUpload] = useState<boolean>(true);
    const [filterYear, setFilterYear] = useState<string>(moment().year().toString());
    const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
    const roleId = localStorage.getItem("role_id");
    useEffect(() => {
        settLoading(true);
        getCareGapsData();
    }, []);

    const getCareGapsData = () => {
        getCareGaps()
            .then(({ data: response }) => {
                settLoading(false);
                if (response.success) {
                    setClinics(response.clinic_list);
                } else {
                    OpenNotification("error", response.message);
                }
            })
            .catch(() => {
                settLoading(false);
            });
    };

    const handleClinicIdChange = (value: number) => {
        settLoading(true);
        setClinicIds(value);
        roleFilter(value).then(({ data: response }) => {
            settLoading(false);
            setInsurancesClinic(response.insurances);
        });
    };

    const handleInsuranceIdChange = (value: number) => {
        const filtered = insurancesCLinic.filter((ins: { id: number; }) => ins?.id === value);
        setInsuranceProvider(filtered[0].provider);
        setInsuranceTypeId(filtered[0].type_id);
        if (filtered[0].type_id === 1 && filtered[0].provider === "hcpw-001") {
            setIsDisabledUpload(false);
            setInsuranceLabel("hcpw-001");
            setInsurances(value);
            setBulkData([]);
        }
        else if (filtered[0].type_id === 1 && filtered[0].provider === "hum-001") {
            setIsDisabledUpload(false);
            setInsuranceLabel("hum-001");
            setInsurances(value);
            setBulkData([]);
        }
        else if (filtered[0].type_id === 1 && filtered[0].provider === "med-arz-001") {
            setIsDisabledUpload(false);
            setInsuranceLabel("med-arz-001");
            setInsurances(value);
            setBulkData([]);
        }
        else if (filtered[0].type_id === 1 && filtered[0].provider === "aet-001") {
            setIsDisabledUpload(false);
            setInsuranceLabel("aet-001");
            setInsurances(value);
            setBulkData([]);
        }
        else if (filtered[0].type_id === 1 && filtered[0].provider === "allwell-001") {
            setIsDisabledUpload(false);
            setInsuranceLabel("allwell-001");
            setInsurances(value);
            setBulkData([]);
        }
        else if (filtered[0].type_id === 3 && filtered[0].provider === "hcarz-001") {
            setIsDisabledUpload(false);
            setInsuranceLabel("hcarz-001");
            setInsurances(value);
            setBulkData([]);
        }
        else if (filtered[0].type_id === 1 && filtered[0].provider === "uhc-001") {
            setIsDisabledUpload(false);
            setInsuranceLabel("uhc-001");
            setInsurances(value);
            setBulkData([]);
        }
        else {
            setIsDisabledUpload(true);
            setBulkData([]);
        }
    };
    const handleBulkOpen = () => {
        setTitle("Add Bulk Care Gaps");
        setBulkData([]);
        setClinicIds(null);
        setIsBulkOpen(true);
        setError(false);
    };
    const handleGenerateGapOpen = () => {
        setTitle("Generate New Year Care Gaps");
        setIsGenerateGapOpen(true);
        setError(false);
    };
    const setBulkOpen = () => {
        setTitle("Add Bulk Care Gaps");
        setIsBulkOpen(false);
    };
    const setGenerateOpen = () => {
        setTitle("Generate New Year Care Gaps");
        setIsGenerateGapOpen(false);
    };
    const filterOption = (input: string, option?: { label: string; value: string }) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

    const handleFileChange = (info: any) => {
        const fileReader = new FileReader();
        fileReader.onload = (e) => {
            try {
                const { result } = e.target as any;
                const data = new Uint8Array(result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, skipHidden: true });
                const headers = jsonData[0] as string[];
                const rows = jsonData.slice(1);

                let headerMappings: { [key: string]: string } = {};

                if (insuranceLabel === "hcpw-001") {
                    headerMappings = {
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        gender: "gender",
                        status: "status",
                        groups: "groups",
                        address_line_1: "address",
                        city: "city",
                        state: "state",
                        zip_code: "zipCode",
                        phone: "contact_no",
                        cell: "cell",
                        email: "email",
                        clinic: "clinic",
                        primary_care_physician: "doctor_id",
                        insurance: "insurance",
                        // Care Gaps
                        awv_gaps_status: "awv_gap",
                        awv_scheduled_date: "awv_scheduled_date",
                        breast_cancer_screening_bcs: "breast_cancer_gap",
                        breast_cancer_screening_bcs_current: "breast_cancer_gap_current",
                        colorectal_cancer_screening_col: "colorectal_cancer_gap",
                        colorectal_cancer_screening_col_current: "colorectal_cancer_gap_current",
                        controlling_blood_pressure_cbp: "high_bp_gap",
                        controlling_blood_pressure_cbp_current: "high_bp_gap_current",
                        diabetes_care_eye_exam: "eye_exam_gap",
                        diabetes_care_eye_exam_current: "eye_exam_gap_current",
                        diabetes_care_blood_sugar_control_9: "hba1c_poor_gap",
                        diabetes_care_blood_sugar_control_9_current: "hba1c_poor_gap_current",
                        osteoporosis_mgmt_in_women_who_had_fracture_omw: "osteoporosis_mgmt_gap",
                        osteoporosis_mgmt_in_women_who_had_fracture_omw_current: "osteoporosis_mgmt_gap_current",
                        statin_therapy_for_patients_with_cardiovascular_disease_spc: "statin_therapy_gap",
                        statin_therapy_for_patients_with_cardiovascular_disease_spc_current: "statin_therapy_gap_current",
                        care_for_older_adults_medication_review_coa2: "adults_medic_gap",
                        care_for_older_adults_medication_review_coa2_current: "adults_medic_gap_current",
                        care_for_older_adults_functional_stat_assessment_coa3: "adults_func_gap",
                        care_for_older_adults_functional_stat_assessment_coa3_current: "adults_func_gap_current",
                        care_for_older_adults_pain_assessment_coa4: "pain_screening_gap",
                        care_for_older_adults_pain_assessment_coa4_current: "pain_screening_gap_current",
                        transitions_of_care_medication_reconciliation_post_discharge_trcm: "post_disc_gap",
                        transitions_of_care_medication_reconciliation_post_discharge_trcm_current: "post_disc_gap_current",
                        transitions_of_care_patient_engagement_after_inpatient_discharge_trce: "after_inp_disc_gap",
                        transitions_of_care_patient_engagement_after_inpatient_discharge_trce_current: "after_inp_disc_gap_current",
                        total_gaps: "total_gaps",
                    };
                    const jsonDataWithHeaders = rows.map((row: any) => {

                        const obj: { [key: string]: any } = {};
                        headers.forEach((header, index) => {
                            let customHeader = header.replace(/\s/g, "_").replace("_-_", "_").replace("(", "").replace(".", "_").replace("%", "").replace(")", "").replace(">", "").replace("<", "").replace("/", "_").replaceAll("-", "_").toLowerCase();

                            // eslint-disable-next-line no-prototype-builtins
                            if (headerMappings.hasOwnProperty(customHeader)) {
                                customHeader = headerMappings[customHeader];
                            }

                            if (customHeader === "dob" || customHeader === "awv_scheduled_date") {
                                const serialDate = row[index];
                                if (serialDate !== undefined) {
                                    const dateValue = XLSX.SSF.parse_date_code(serialDate);

                                    const dob = new Date(
                                        Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                    );

                                    const adjustedDate = moment(dob).add(1, 'day').toDate();
                                    const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                    obj[customHeader] = arizonaDate;
                                }
                            } else {
                                obj[customHeader] = row[index] !== undefined ? row[index] : "";
                            }
                        });
                        return obj;
                    });

                    setBulkData(jsonDataWithHeaders);
                }
                else if (insuranceLabel === "hum-001") {
                    headerMappings = {
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        status: "status",
                        gender: "gender",
                        address_line_1: "address",
                        city: "city",
                        state: "state",
                        zip_code: "zipCode",
                        phone: "contact_no",
                        cell: "cell",
                        email: "email",
                        clinic: "clinic",
                        primary_care_physician: "doctor_id",
                        insurance: "insurance",
                        // Care Gaps
                        awv_gaps_status: "awv_gap",
                        awv_scheduled_date: "awv_scheduled_date",
                        medication_adherence_for_hypertension_ace_or_arb_ace_adh_ace: "ma_hypertension_gap",
                        medication_adherence_for_hypertension_ace_or_arb_ace_adh_ace_current: "ma_hypertension_gap_current",
                        medication_adherence_for_diabetes_medications_diabetes_medications_adh_diab: "mad_medications_gap",
                        medication_adherence_for_diabetes_medications_diabetes_medications_adh_diab_current: "mad_medications_gap_current",
                        medication_adherence_for_cholesterol_statins_statins_adh_statin: "ma_cholesterol_gap",
                        medication_adherence_for_cholesterol_statins_statins_adh_statin_current: "ma_cholesterol_gap_current",
                        breast_cancer_screening_bcs: "breast_cancer_gap",
                        breast_cancer_screening_bcs_current: "breast_cancer_gap_current",
                        controlling_high_blood_pressure_cbp: "high_bp_gap",
                        controlling_high_blood_pressure_cbp_current: "high_bp_gap_current",
                        colorectal_cancer_screening_col: "colorectal_cancer_gap",
                        colorectal_cancer_screening_col_current: "colorectal_cancer_gap_current",
                        eye_exam_for_patients_with_diabetes_eed: "eye_exam_gap",
                        eye_exam_for_patients_with_diabetes_eed_current: "eye_exam_gap_current",
                        follow_up_after_emergency_department_visit_for_mcc_fmc: "faed_visit_gap",
                        follow_up_after_emergency_department_visit_for_mcc_fmc_current: "faed_visit_gap_current",
                        hemoglobin_a1c_control_for_patients_with_diabetes_hba1c_control_hbd_hbapoor: "hba1c_poor_gap",
                        hemoglobin_a1c_control_for_patients_with_diabetes_hba1c_control_hbd_hbapoor_current: "hba1c_poor_gap_current",
                        osteoporosis_management_in_women_who_had_a_fracture_omw: "omw_fracture_gap",
                        osteoporosis_management_in_women_who_had_a_fracture_omw_current: "omw_fracture_gap_current",
                        plan_all_cause_readmissions_pcr: "pc_readmissions_gap",
                        plan_all_cause_readmissions_pcr_current: "pc_readmissions_gap_current",
                        statin_therapy_for_patients_with_cardiovascular_disease_received_statin_therapy_spc_statin: "spc_disease_gap",
                        statin_therapy_for_patients_with_cardiovascular_disease_received_statin_therapy_spc_statin_current: "spc_disease_gap_current",
                        statin_use_in_persons_with_diabetes_supd: "sup_diabetes_gap",
                        statin_use_in_persons_with_diabetes_supd_current: "sup_diabetes_gap_current",
                        transitions_of_care_medication_reconciliation_post_discharge_trc_mrp: "post_disc_gap",
                        transitions_of_care_medication_reconciliation_post_discharge_trc_mrp_current: "post_disc_gap_current",
                        transitions_of_care_patient_engagement_after_inpatient_discharge_trc_ped: "after_inp_disc_gap",
                        transitions_of_care_patient_engagement_after_inpatient_discharge_trc_ped_current: "after_inp_disc_gap_current",
                    };
                    const jsonDataWithHeaders = rows.map((row: any) => {

                        const obj: { [key: string]: any } = {};
                        headers.forEach((header, index) => {
                            let customHeader = header.replaceAll(/\s/g, "_").replaceAll("_-_", "_").replaceAll("(", "").replaceAll(".", "_").replaceAll("%", "").replaceAll(")", "").replaceAll(">", "").replaceAll("<", "").replaceAll("/", "_").replaceAll("-", "_").replaceAll(":", "").toLowerCase();
                            // eslint-disable-next-line no-prototype-builtins
                            if (headerMappings.hasOwnProperty(customHeader)) {
                                customHeader = headerMappings[customHeader];
                            }
                            if (customHeader === "dob" || customHeader === "awv_scheduled_date") {
                                const serialDate = row[index];
                                if (serialDate !== undefined) {
                                    const dateValue = XLSX.SSF.parse_date_code(serialDate);

                                    const dob = new Date(
                                        Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                    );

                                    const adjustedDate = moment(dob).add(1, 'day').toDate();
                                    const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                    obj[customHeader] = arizonaDate;
                                }
                            } else {
                                obj[customHeader] = row[index] !== undefined ? row[index] : "";
                            }
                        });
                        return obj;

                    });

                    setBulkData(jsonDataWithHeaders);
                }
                else if (insuranceLabel === "med-arz-001") {
                    headerMappings = {
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        gender: "gender",
                        status: "status",
                        groups: "groups",
                        address_line_1: "address",
                        city: "city",
                        state: "state",
                        zip_code: "zipCode",
                        phone: "contact_no",
                        cell: "cell",
                        email: "email",
                        clinic: "clinic",
                        primary_care_physician: "doctor_id",
                        insurance: "insurance",
                        // Care Gaps
                        awv_gaps_status: "awv_gap",
                        awv_scheduled_date: "awv_scheduled_date",
                        breast_cancer_screening: "breast_cancer_gap",
                        breast_cancer_screening_current: "breast_cancer_gap_current",
                        colorectal_cancer_screening: "colorectal_cancer_gap",
                        colorectal_cancer_screening_current: "colorectal_cancer_gap_current",
                        controlling_high_blood_pressure: "high_bp_gap",
                        controlling_high_blood_pressure_current: "high_bp_gap_current",
                        diabetes_care_blood_sugar_control: "hba1c_gap",
                        diabetes_care_blood_sugar_control_current: "hba1c_gap_current",

                    };
                    const jsonDataWithHeaders = rows.map((row: any) => {

                        const obj: { [key: string]: any } = {};
                        headers.forEach((header, index) => {
                            let customHeader = header.replaceAll(/\s/g, "_").replaceAll("_-_", "_").replaceAll("(", "").replaceAll(".", "_").replaceAll("%", "").replaceAll(")", "").replaceAll(">", "").replaceAll("<", "").replaceAll("/", "_").replaceAll("-", "_").replaceAll(" - ", "_").replaceAll(":", "").toLowerCase();
                            // eslint-disable-next-line no-prototype-builtins
                            if (headerMappings.hasOwnProperty(customHeader)) {
                                customHeader = headerMappings[customHeader];
                            }
                            if (customHeader === "dob" || customHeader === "awv_scheduled_date") {
                                const serialDate = row[index];
                                if (serialDate !== undefined) {
                                    const dateValue = XLSX.SSF.parse_date_code(serialDate);

                                    const dob = new Date(
                                        Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                    );

                                    const adjustedDate = moment(dob).add(1, 'day').toDate();
                                    const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                    obj[customHeader] = arizonaDate;
                                }
                            } else {
                                obj[customHeader] = row[index] !== undefined ? row[index] : "";
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                }
                else if (insuranceLabel === "aet-001") {
                    headerMappings = {
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        awv_gaps_status: "awv_gap",
                        awv_scheduled_date: "awv_scheduled_date",
                        status: "status",
                        gender: "gender",
                        address_line_1: "address",
                        city: "city",
                        state: "state",
                        zip_code: "zipCode",
                        phone: "contact_no",
                        cell: "cell",
                        email: "email",
                        clinic: "clinic",
                        primary_care_physician: "doctor_id",
                        insurance: "insurance",
                        // Care Gaps
                        breast_cancer_screening: "breast_cancer_gap",
                        breast_cancer_screening_current: "breast_cancer_gap_current",
                        colorectal_cancer_screening: "colorectal_cancer_gap",
                        colorectal_cancer_screening_current: "colorectal_cancer_gap_current",
                        diabetes_care_eye_exam: "eye_exam_gap",
                        diabetes_care_eye_exam_current: "eye_exam_gap_current",
                        diabetes_care_blood_sugar_control_cdc_9: "hba1c_gap",
                        diabetes_care_blood_sugar_control_cdc_9_current: "hba1c_gap_current",
                        statin_therapy_for_patients_with_cardiovascular_disease: "spc_disease_gap",
                        statin_therapy_for_patients_with_cardiovascular_disease_current: "spc_disease_gap_current",
                        follow_up_after_ed_visit_fmc: "faed_visit_gap",
                        follow_up_after_ed_visit_fmc_current: "faed_visit_gap_current",
                        medication_adherence_for_diabetes_medications: "mad_medications_gap",
                        medication_adherence_for_diabetes_medications_current: "mad_medications_gap_current",
                        medication_adherence_for_hypertension_ras_antagonists: "ma_hypertension_gap",
                        medication_adherence_for_hypertension_ras_antagonists_current: "ma_hypertension_gap_current",
                        statin_use_in_persons_with_diabetes___supd: "sup_diabetes_gap",
                        statin_use_in_persons_with_diabetes___supd_current: "sup_diabetes_gap_current",
                        medication_adherence_for_cholesterol_statins: "ma_cholesterol_gap",
                        medication_adherence_for_cholesterol_statins_current: "ma_cholesterol_gap_current",
                        osteoporosis_management_in_women_who_had_a_fracture: "omw_fracture_gap",
                        osteoporosis_management_in_women_who_had_a_fracture_current: "omw_fracture_gap_current",
                        plan_all_cause_readmissions: "pc_readmissions_gap",
                        plan_all_cause_readmissions_current: "pc_readmissions_gap_current",

                    };
                    const jsonDataWithHeaders = rows.map((row: any) => {

                        const obj: { [key: string]: any } = {};
                        headers.forEach((header, index) => {
                            let customHeader = header.replaceAll(/\s/g, "_").replaceAll("_-_", "_").replaceAll("(", "").replaceAll(".", "_").replaceAll("%", "").replaceAll(")", "").replaceAll(">", "").replaceAll("<", "").replaceAll("/", "_").replaceAll("-", "_").replaceAll(" - ", "_").replaceAll(":", "").toLowerCase();
                            // eslint-disable-next-line no-prototype-builtins
                            if (headerMappings.hasOwnProperty(customHeader)) {
                                customHeader = headerMappings[customHeader];
                            }
                            if (customHeader === "dob" || customHeader === "awv_scheduled_date") {
                                const serialDate = row[index];
                                if (serialDate !== undefined) {
                                    const dateValue = XLSX.SSF.parse_date_code(serialDate);

                                    const dob = new Date(
                                        Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                    );

                                    const adjustedDate = moment(dob).add(1, 'day').toDate();
                                    const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                    obj[customHeader] = arizonaDate;
                                }
                            } else {
                                obj[customHeader] = row[index] !== undefined ? row[index] : "";
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                }
                else if (insuranceLabel === "allwell-001") {
                    headerMappings = {
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        awv_gaps_status: "awv_gap",
                        awv_scheduled_date: "awv_scheduled_date",
                        status: "status",
                        gender: "gender",
                        address_line_1: "address",
                        city: "city",
                        state: "state",
                        zip_code: "zipCode",
                        phone: "contact_no",
                        cell: "cell",
                        email: "email",
                        clinic: "clinic",
                        primary_care_physician: "doctor_id",
                        insurance: "insurance",
                        // Care Gaps
                        cbp_controlling_high_blood_pressure: "high_bp_gap",
                        cbp_controlling_high_blood_pressure_current: "high_bp_gap_current",
                        bcs_breast_cancer_screening: "breast_cancer_gap",
                        bcs_breast_cancer_screening_current: "breast_cancer_gap_current",
                        col_colorectal_cancer_screen_50_75_yrs: "colorectal_cancer_gap",
                        col_colorectal_cancer_screen_50_75_yrs_current: "colorectal_cancer_gap_current",
                        med_adherence_ras: "med_adherence_ras_gap",
                        med_adherence_ras_current: "med_adherence_ras_gap_current",
                        med_adherence_statins: "med_adherence_statins_gap",
                        med_adherence_statins_current: "med_adherence_statins_gap_current",
                        cdc_diabetes_dilated_eye_exam: "eye_exam_gap",
                        cdc_diabetes_dilated_eye_exam_current: "eye_exam_gap_current",
                        cdc_diabetes_hba1c__9: "hba1c_gap",
                        cdc_diabetes_hba1c__9_current: "hba1c_gap_current",
                        supd_statin_use_in_persons_with_diabetes: "sup_diabetes_gap",
                        supd_statin_use_in_persons_with_diabetes_current: "sup_diabetes_gap_current",
                        coa_care_for_older_adults_pain_assessment: "pain_screening_gap",
                        coa_care_for_older_adults_pain_assessment_current: "pain_screening_gap_current",
                        coa_care_for_older_adults_review: "adults_medic_gap",
                        coa_care_for_older_adults_review_current: "adults_medic_gap_current",
                        fmc_f_u_ed_multiple_high_risk_chronic_conditions: "m_high_risk_cc_gap",
                        fmc_f_u_ed_multiple_high_risk_chronic_conditions_current: "m_high_risk_cc_gap_current",
                        trc_engagement_after_discharge: "trc_eng_after_disc_gap",
                        trc_engagement_after_discharge_current: "trc_eng_after_disc_gap_current",
                        trc_med_reconciliation_post_discharge: "trc_mr_post_disc_gap",
                        trc_med_reconciliation_post_discharge_current: "trc_mr_post_disc_gap_current",
                        med_adherence_diabetic: "med_adherence_diabetic_gap",
                        med_adherence_diabetic_current: "med_adherence_diabetic_gap_current",
                        ked_kidney_health_for_patients_with_diabetes: "kidney_health_diabetes_gap",
                        ked_kidney_health_for_patients_with_diabetes_current: "kidney_health_diabetes_gap_current",
                        spc_statin_therapy_for_patients_with_cvd: "spc_statin_therapy_cvd_gap",
                        spc_statin_therapy_for_patients_with_cvd_current: "spc_statin_therapy_cvd_gap_current",

                    };
                    const jsonDataWithHeaders = rows.map((row: any) => {

                        const obj: { [key: string]: any } = {};
                        headers.forEach((header, index) => {
                            let customHeader = header.replaceAll(/\s/g, "_").replaceAll("=", "").replaceAll("_-_", "_").replaceAll("(", "").replaceAll(".", "_").replaceAll("%", "").replaceAll(")", "").replaceAll(">", "").replaceAll("<", "").replaceAll("/", "_").replaceAll("-", "_").replaceAll(" - ", "_").replaceAll(":", "").toLowerCase();
                            // eslint-disable-next-line no-prototype-builtins
                            if (headerMappings.hasOwnProperty(customHeader)) {
                                customHeader = headerMappings[customHeader];
                            }
                            if (customHeader === "dob" || customHeader === "awv_scheduled_date") {
                                const serialDate = row[index];
                                if (serialDate !== undefined) {
                                    const dateValue = XLSX.SSF.parse_date_code(serialDate);

                                    const dob = new Date(
                                        Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                    );

                                    const adjustedDate = moment(dob).add(1, 'day').toDate();
                                    const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                    obj[customHeader] = arizonaDate;
                                }
                            } else {
                                obj[customHeader] = row[index] !== undefined ? row[index] : "";
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                }
                else if (insuranceLabel === "hcarz-001") {
                    headerMappings = {
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        awv_gaps_status: "awv_gap",
                        awv_scheduled_date: "awv_scheduled_date",
                        status: "status",
                        gender: "gender",
                        address_line_1: "address",
                        city: "city",
                        state: "state",
                        zip_code: "zipCode",
                        phone: "contact_no",
                        cell: "cell",
                        email: "email",
                        clinic: "clinic",
                        primary_care_physician: "doctor_id",
                        insurance: "insurance",
                        // Care Gaps
                        bcs_breast_cancer_screening: "breast_cancer_gap",
                        bcs_breast_cancer_screening_current: "breast_cancer_gap_current",
                        ccs_cervical_cancer_screening: "cervical_cancer_gap",
                        ccs_cervical_cancer_screening_current: "cervical_cancer_gap_current",
                        hdo_use_of_opioids_at_high_dosage: "opioids_high_dosage_gap",
                        hdo_use_of_opioids_at_high_dosage_current: "opioids_high_dosage_gap_current",
                        hbd_hemoglobin_a1c_hba1c_poor_control_9: "hba1c_poor_gap",
                        hbd_hemoglobin_a1c_hba1c_poor_control_9_current: "hba1c_poor_gap_current",
                        ppc1_timeliness_of_prenatal_care: "ppc1_gap",
                        ppc1_timeliness_of_prenatal_care_current: "ppc1_gap_current",
                        ppc2_timeliness_of_postnatal_care: "ppc2_gap",
                        ppc2_timeliness_of_postnatal_care_current: "ppc2_gap_current",
                        wcv_well_child_visits_for_age_3_21: "well_child_visits_gap",
                        wcv_well_child_visits_for_age_3_21_current: "well_child_visits_gap_current",
                        chlamydia_screening: "chlamydia_gap",
                        chlamydia_screening_current: "chlamydia_gap_current",
                        controlling_blood_pressure: "high_bp_gap",
                        controlling_blood_pressure_current: "high_bp_gap_current",
                        follow_up_after_hospitalization_for_mental_illness_fuh_30_day: "fuh_30Day_gap",
                        follow_up_after_hospitalization_for_mental_illness_fuh_30_day_current: "fuh_30Day_gap_current",
                        follow_up_after_hospitalization_for_mental_illness_fuh_7_day: "fuh_7Day_gap",
                        follow_up_after_hospitalization_for_mental_illness_fuh_7_day_current: "fuh_7Day_gap_current",
                    };
                    const jsonDataWithHeaders = rows.map((row: any) => {

                        const obj: { [key: string]: any } = {};
                        headers.forEach((header, index) => {
                            let customHeader = header.replaceAll(/\s/g, "_").replaceAll("=", "").replaceAll("_-_", "_").replaceAll("(", "").replaceAll(".", "_").replaceAll("%", "").replaceAll(")", "").replaceAll(">", "").replaceAll("<", "").replaceAll("/", "_").replaceAll("-", "_").replaceAll(" - ", "_").replaceAll(":", "").toLowerCase();
                            // eslint-disable-next-line no-prototype-builtins
                            if (headerMappings.hasOwnProperty(customHeader)) {
                                customHeader = headerMappings[customHeader];
                            }
                            if (customHeader === "dob" || customHeader === "awv_scheduled_date") {
                                const serialDate = row[index];
                                if (serialDate !== undefined) {
                                    const dateValue = XLSX.SSF.parse_date_code(serialDate);

                                    const dob = new Date(
                                        Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                    );

                                    const adjustedDate = moment(dob).add(1, 'day').toDate();
                                    const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                    obj[customHeader] = arizonaDate;
                                }
                            } else {
                                obj[customHeader] = row[index] !== undefined ? row[index] : "";
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                }
                else if (insuranceLabel === "uhc-001") {
                    headerMappings = {
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        awv_gaps_status: "awv_gap",
                        awv_scheduled_date: "awv_scheduled_date",
                        status: "status",
                        gender: "gender",
                        address_line_1: "address",
                        city: "city",
                        state: "state",
                        zip_code: "zipCode",
                        phone: "contact_no",
                        cell: "cell",
                        email: "email",
                        clinic: "clinic",
                        primary_care_physician: "doctor_id",
                        insurance: "insurance",
                        // Care Gaps
                        c01_breast_cancer_screening__: "breast_cancer_gap",
                        c01_breast_cancer_screening_current_status: "breast_cancer_gap_current",
                        c02_colorectal_cancer_screening__: "colorectal_cancer_gap",
                        c02_colorectal_cancer_screening_current_status: "colorectal_cancer_gap_current",
                        c06_care_for_older_adults_medication_review__: "adults_medic_gap",
                        c06_care_for_older_adults_medication_review_current_status: "adults_medic_gap_current",
                        dmc10_care_for_older_adults_functional_status_assessment__: "adults_fun_status_gap",
                        dmc10_care_for_older_adults_functional_status_assessment_current_status: "adults_fun_status_gap_current",
                        c07_care_for_older_adults_pain_assessment__: "pain_screening_gap",
                        c07_care_for_older_adults_pain_assessment_current_status: "pain_screening_gap_current",
                        c09_eye_exam_for_patients_with_diabetes__: "eye_exam_gap",
                        c09_eye_exam_for_patients_with_diabetes_current_status: "eye_exam_gap_current",
                        c10_kidney_health_evaluation_for_patients_with_diabetes__: "kidney_health_diabetes_gap",
                        c10_kidney_health_evaluation_for_patients_with_diabetes_current_status: "kidney_health_diabetes_gap_current",
                        c11_hemoglobin_a1c_control_for_patients_with_diabetes__: "hba1c_gap",
                        c11_hemoglobin_a1c_control_for_patients_with_diabetes_current_status: "hba1c_gap_current",
                        c12_controlling_blood_pressure__: "high_bp_gap",
                        c12_controlling_blood_pressure_current_status: "high_bp_gap_current",
                        c16_statin_therapy_for_patients_with_cardiovascular_disease___: "statin_therapy_gap",
                        c16_statin_therapy_for_patients_with_cardiovascular_disease_current_status: "statin_therapy_gap_current",
                        d08_med_ad__for_diabetes_meds_current_year_status____: "med_adherence_diabetes_gap",
                        d08_med_ad__for_diabetes_meds_current_year_status_current_status: "med_adherence_diabetes_gap_current",
                        d09_med_ad__ras_antagonists_current_year_status____: "med_adherence_ras_gap",
                        d09_med_ad__ras_antagonists_current_year_status_current_status: "med_adherence_ras_gap_current",
                        d10_med_ad__statins_current_year_status____: "med_adherence_statins_gap",
                        d10_med_ad__statins_current_year_status_current_status: "med_adherence_statins_gap_current",
                        d11_mtm_cmr_current_year_status____: "mtm_cmr_gap",
                        d11_mtm_cmr_current_year_status_current_status: "mtm_cmr_gap_current",
                        d12_statin_use_in_persons_with_diabetes_current_year_status____: "sup_diabetes_gap",
                        d12_statin_use_in_persons_with_diabetes_current_year_status_current_status: "sup_diabetes_gap_current",
                    };
                    const jsonDataWithHeaders = rows.map((row: any) => {

                        const obj: { [key: string]: any } = {};
                        headers.forEach((header, index) => {
                            let customHeader = header.replaceAll(/\s/g, "_").replaceAll("=", "").replaceAll("_-_", "_").replaceAll("(", "").replaceAll(" .", "").replaceAll("**", "").replaceAll(" . .", "_").replaceAll(".", "_").replaceAll("%", "").replaceAll(")", "").replaceAll(">", "").replaceAll("<", "").replaceAll("/", "_").replaceAll("-", "_").replaceAll(" - ", "_").replaceAll(":", "").toLowerCase();
                            // eslint-disable-next-line no-prototype-builtins
                            if (headerMappings.hasOwnProperty(customHeader)) {
                                customHeader = headerMappings[customHeader];
                            }
                            if (customHeader === "dob" || customHeader === "awv_scheduled_date") {
                                const serialDate = row[index];
                                if (serialDate !== undefined) {

                                    const dateValue = XLSX.SSF.parse_date_code(serialDate);


                                    const dob = new Date(
                                        Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                    );

                                    const adjustedDate = moment(dob).add(1, 'day').toDate();
                                    const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                    obj[customHeader] = arizonaDate;
                                }
                            } else {
                                obj[customHeader] = row[index] !== undefined ? row[index] : "";
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                }
                else {
                    setBulkData([]);
                }
            } catch (error) {
                message.error("Please upload a valid excel file");
            }
        };

        const fileList = info.fileList.slice(-1);
        if (fileList.length > 0) {
            fileReader.readAsArrayBuffer(fileList[0].originFileObj);
        } else {
            setBulkData([]);
        }
    };
    const handleBulkSubmit = () => {
        const gap_year = filterYear;
        if (!clinicIds) {
            setError(true);
            return false;
        }
        if (!insuranceIds) {
            setError(true);
            return false;
        }
        if (clinicIds) {
            setError(false);
            const payload = {
                clinicIds,
                insuranceIds,
                gap_year,
                data: bulkData,
            };
            settLoading(true);
            let insurance = "healthchoice";
            // if (insuranceLabel === "hcpw-001") {
            //     insurance = "healthchoice";
            // } else if (insuranceLabel === "hum-001") {
            //     insurance = "humana";
            // } else if (insuranceLabel === "med-arz-001") {
            //     insurance = "medicarearizona";
            // } else if (insuranceLabel === "aet-001") {
            //     insurance = "aetnamedicare";
            // } else if (insuranceLabel === "allwell-001") {
            //     insurance = "allwellmedicare";
            // } else if (insuranceLabel === "hcarz-001") {
            //     insurance = "healthchoicearizona";
            // } else if (insuranceLabel === "uhc-001") {
            //     insurance = "unitedhealthcare";
            // } else {
            //     insurance = insuranceLabel;
            // }

            addBulkCareGaps(insurance, payload).then(({ data: response }) => {
                if (response.success) {
                    setIsBulkOpen(false);
                    settLoading(false);
                    OpenNotification("success", response.message);
                } else {
                    settLoading(false);
                    OpenNotification("error", response.error);
                }
            });
        }
    };

    const handleGenerateSubmit = () => {
        const year = filterYear;
        const provider = insuranceProvider;
        const type_id = insuranceTypeId;
        const clinic_id = clinicIds;
        const insurance_id = insuranceIds;
        if (!clinicIds) {
            setError(true);
            return false;
        }
        if (!insuranceIds) {
            setError(true);
            return false;
        }
        if (clinicIds) {
            setError(false);
            const payload = {
                clinic_id,
                insurance_id,
                provider,
                type_id,
                year,
            };
            settLoading(true);

            generateCareGaps(payload).then(({ data: response }) => {
                if (response.success) {
                    setIsBulkOpen(false);
                    settLoading(false);
                    OpenNotification("success", response.message);
                } else {
                    settLoading(false);
                    OpenNotification("error", response.message);
                }
            });
        }
    };
    function handleFilterYear(val: string) {
        setFilterYear(val);
    }


    return (
        <>
            <div
                className="container "
                style={{
                    margin: "",
                    background: "white",
                    padding: "10px",
                    borderRadius: "7px",
                }}
            >
                <div style={{ width: "100%" }}>
                    <div className="row">
                        <div className="col-6 sm-12 ">
                            <h2>Care Gaps</h2>
                        </div>
                        <div className="col-4 sm-12 ">
                            {roleId === "1" || roleId === "13" || roleId === "21" ? (
                                <button
                                    className="btn btn-success float-right text-light"
                                    style={{ fontSize: "12px" }}
                                    onClick={() => handleGenerateGapOpen()}
                                >
                                    Generate New Year Gaps
                                </button>
                            ) : null}
                        </div>
                        <div className="col-2 sm-12 ">
                            {roleId === "1" || roleId === "13" || roleId === "21" ? (
                                <button
                                    className="btn btn-success float-right text-light mr-2"
                                    style={{ fontSize: "12px" }}
                                    onClick={() => handleBulkOpen()}
                                >
                                    Add Bulk Care Gaps
                                </button>
                            ) : null}
                        </div>
                    </div>
                    <Table
                        bordered
                        pagination={false}
                        loading={{ spinning: loading, indicator: antIcon }}
                    />
                    <br />
                    <Pagination
                        pageSize={10}
                        showSizeChanger={false}
                        onChange={(page: number) => setCurrentPage(page)}
                    />
                    <br />
                </div>
            </div>
            <AddCareGaps
                title={title}
                bulkData={bulkData}
                clinics={clinics}
                IsOpenBulk={isBulkOpen}
                isDisabledUpload={isDisabledUpload}
                insuranceLabel={insuranceLabel}
                handleFileChange={handleFileChange}
                setBulkOpen={setBulkOpen}
                handleBulkSubmit={handleBulkSubmit}
                insurancesCLinic={insurancesCLinic}
                handleClinicIdChange={handleClinicIdChange}
                handleInsuranceIdChange={handleInsuranceIdChange}
                filterOption={filterOption}
                errors={undefined}
                loading={loading}
                filterYear={filterYear}
                handleFilterYear={handleFilterYear}
            />
            <GenerateCareGaps
                title={title}
                bulkData={bulkData}
                clinics={clinics}
                isGenerateGapOpen={isGenerateGapOpen}
                isDisabledUpload={isDisabledUpload}
                insuranceLabel={insuranceLabel}
                handleFileChange={handleFileChange}
                setGenerateOpen={setGenerateOpen}
                handleGenerateSubmit={handleGenerateSubmit}
                insurancesCLinic={insurancesCLinic}
                handleClinicIdChange={handleClinicIdChange}
                handleInsuranceIdChange={handleInsuranceIdChange}
                filterOption={filterOption}
                errors={undefined}
                loading={loading}
                filterYear={filterYear}
                handleFilterYear={handleFilterYear}

            />

        </>
    );
}

export default CareGaps;
