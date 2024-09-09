/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import React, { useState, useEffect, useMemo } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/questions_answers.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Pagination, Spin, Row, Col, Typography, Space, DatePicker, Select, Button, Tabs, TableColumnsType, Menu, Dropdown as AntDropdown, Modal, Input, Badge } from "antd";
import { addPreProcessors, getCareGaps, roleFilter } from "../../../actions/CareGaps/CareGapsActions";
import { OpenNotification } from "../../../Utilties/Utilties";
import { CaretLeftOutlined, CaretRightOutlined, LeftOutlined, LoadingOutlined, RightOutlined, UploadOutlined } from "@ant-design/icons";
import { addPreProcessorData, editParser } from "../../../actions/PreProcessor/PreProcessorActions";
import * as XLSX from "xlsx";
import { message } from "antd";
// import moment from "moment";
import moment from 'moment-timezone';
import Dragger from "antd/lib/upload/Dragger";
import "./PreProcessor.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Doctors } from "@/Types/PatientType";
import { patientGroups } from "../../../Constant/constant";
import InsType from "@/Types/PreProcessor";
const { Title, Text } = Typography;
function PreProcessor() {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isInsModalOpen, setIsInsModalOpen] = useState<boolean>(false);
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
    const [allInsurances, setAllInsurances] = useState<any>([]);
    const [bulkData, setBulkData] = useState<any>([]);
    const [clinicIds, setClinicIds] = useState<any>(null);
    const [errors, setError] = useState<boolean>(false);
    const [isListing, setIsListing] = useState<boolean>(true);
    const [isDisabledUpload, setIsDisabledUpload] = useState<boolean>(true);
    const [filterYear, setFilterYear] = useState<string>(moment().year().toString());
    const [fileUploaded, setFileUploaded] = useState<boolean>(false);
    const [existingPatients, setExistingPatients] = useState<any[]>([]);
    const [newPatients, setNewPatients] = useState<any[]>([]);
    const [missingMemberId, setMissingMemberId] = useState<any>([]);
    const [filterMissingMemberId, setFilterMissingMemberId] = useState<any>([]);
    const [firstNameIssue, setFirstNameIssue] = useState<any>([]);
    const [filterFirstNameIssue, setFilterFirstNameIssue] = useState<any>([]);
    const [lastNameIssue, setLastNameIssue] = useState<any>([]);
    const [filterLastNameIssue, setFilterLastNameIssue] = useState<any>([]);
    const [ldobIssue, setDobIssue] = useState<any>([]);
    const [filterdobIssue, setFilterDobIssue] = useState<any>([]);
    const [insuranceIssue, setInsuranceIssue] = useState<any>([]);
    const [filterInsuranceIssue, setFilterInsuranceIssue] = useState<any>([]);
    const [multipleIssues, setMultipleIssues] = useState<any>([]);
    const [filterMultipleIssues, setFilterMultipleIssues] = useState<any>([]);
    const [moveSingleData, setMoveSingleData] = useState<any>([]);
    const [doctorsClinic, setDoctorsClinic] = React.useState<Doctors[]>([]);
    const [moveRecord, setMoveRecord] = React.useState<string>("");
    const [editRecordId, setEditRecordId] = React.useState<number>(0);
    const [activeTabKey, setActiveTabKey] = useState<string>('existingPatient');
    const [file_name, setFileName] = useState<string>('');
    const [fileListingLog, setFileListingLog] = useState<any>([]);
    const [inputValues, setInputValues] = useState<InsType>({} as InsType);
    const [inputValuesArray, setInputValuesArray] = useState<any[]>([]);
    const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
    const roleId = localStorage.getItem("role_id");
    const selectedYear = filterYear !== "" ? moment(filterYear, 'YYYY') : undefined;
    const dates = { dob: moveSingleData?.dob ? moment(moveSingleData?.dob) : undefined };
    const years = moment().diff(dates.dob, "years");
    const [existingCurrentPage, setExistingCurrentPage] = useState(1);
    const [newCurrentPage, setNewCurrentPage] = useState(1);
    const [memberCurrentPage, setMemberCurrentPage] = useState(1);
    const [firstCurrentPage, setFirstCurrentPage] = useState(1);
    const [lastCurrentPage, setLastCurrentPage] = useState(1);
    const [dobCurrentPage, setDobCurrentPage] = useState(1);
    const [insCurrentPage, setInsCurrentPage] = useState(1);
    const [mulCurrentPage, setMulCurrentPage] = useState(1);
    const pageSize = 10;
    useEffect(() => {
        settLoading(true);
        getCareGapsData();
        handleViewData();
    }, []);

    interface DataType {
        id: number;
        key: React.Key;
        name: string;
        age: number;
        member_id: string;
        first_name: string;
        last_name: string;
        mid_name: string;
        dob: string;
        group: string;
        awv_gap: string;
        status: string;
        gender: string;
        address: string;
        city: string;
        state: string;
        zip_code: string;

    }
    const handleTabChange = (key: string) => {
        setActiveTabKey(key);
    };

    const getCareGapsData = () => {
        getCareGaps()
            .then(({ data: response }) => {
                settLoading(false);
                if (response.success) {
                    setClinics(response.clinic_list);
                    setFileListingLog(response?.patientsFileLog);
                    setAllInsurances(response?.insurances_list);
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
            setInsurancesClinic(response?.insurances);
            setDoctorsClinic(response?.doctors)
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
                        sr: "sr",
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
                        care_for_older_adults_medication_review_coa2__current: "adults_medic_gap__current",
                        care_for_older_adults_functional_stat_assessment_coa3: "adults_func_gap",
                        care_for_older_adults_functional_stat_assessment_coa3__current: "adults_func_gap__current",
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
                                const dateValue = XLSX.SSF.parse_date_code(serialDate);
                                const dob = new Date(
                                    Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                );

                                const adjustedDate = moment(dob).add(1, 'day').toDate();
                                const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                obj[customHeader] = arizonaDate;
                            } else {
                                obj[customHeader] = row[index];
                            }
                        });
                        return obj;
                    });
                    setBulkData(jsonDataWithHeaders);
                    setFileUploaded(true);
                }
                else if (insuranceLabel === "hum-001") {
                    headerMappings = {
                        sr: "sr",
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
                                const dateValue = XLSX.SSF.parse_date_code(serialDate);
                                const dob = new Date(
                                    Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                );

                                const adjustedDate = moment(dob).add(1, 'day').toDate();
                                const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                obj[customHeader] = arizonaDate;
                            } else {
                                obj[customHeader] = row[index];
                            }
                        });
                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                    setFileUploaded(true);
                }
                else if (insuranceLabel === "med-arz-001") {
                    headerMappings = {
                        sr: "sr",
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
                                const dateValue = XLSX.SSF.parse_date_code(serialDate);
                                const dob = new Date(
                                    Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                );

                                const adjustedDate = moment(dob).add(1, 'day').toDate();
                                const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                obj[customHeader] = arizonaDate;
                            } else {
                                obj[customHeader] = row[index];
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                    setFileUploaded(true);
                }
                else if (insuranceLabel === "aet-001") {
                    headerMappings = {
                        sr: "sr",
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        awv_gaps_status: "awv_gap",
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
                                const dateValue = XLSX.SSF.parse_date_code(serialDate);
                                const dob = new Date(
                                    Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                );

                                const adjustedDate = moment(dob).add(1, 'day').toDate();
                                const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                obj[customHeader] = arizonaDate;
                            } else {
                                obj[customHeader] = row[index];
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                    setFileUploaded(true);
                }
                else if (insuranceLabel === "allwell-001") {
                    headerMappings = {
                        sr: "sr",
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        awv_gaps_status: "awv_gap",
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
                                const dateValue = XLSX.SSF.parse_date_code(serialDate);
                                const dob = new Date(
                                    Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                );

                                const adjustedDate = moment(dob).add(1, 'day').toDate();
                                const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                obj[customHeader] = arizonaDate;
                            } else {
                                obj[customHeader] = row[index];
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                    setFileUploaded(true);
                }
                else if (insuranceLabel === "hcarz-001") {
                    headerMappings = {
                        sr: "sr",
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        awv_gaps_status: "awv_gap",
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
                                const dateValue = XLSX.SSF.parse_date_code(serialDate);
                                const dob = new Date(
                                    Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                );

                                const adjustedDate = moment(dob).add(1, 'day').toDate();
                                const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                obj[customHeader] = arizonaDate;
                            } else {
                                obj[customHeader] = row[index];
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                    setFileUploaded(true);
                }
                else if (insuranceLabel === "uhc-001") {
                    headerMappings = {
                        sr: "sr",
                        member_id: "member_id",
                        patient_full_name: "patient_full_name",
                        first_name: "first_name",
                        last_name: "last_name",
                        middle_name: "mid_name",
                        dob: "dob",
                        age: "age",
                        groups: "groups",
                        awv_gaps_status: "awv_gap",
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
                                const dateValue = XLSX.SSF.parse_date_code(serialDate);
                                const dob = new Date(
                                    Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
                                );

                                const adjustedDate = moment(dob).add(1, 'day').toDate();
                                const arizonaDate = moment(adjustedDate).tz('America/Phoenix').format('MM/DD/YYYY');

                                obj[customHeader] = arizonaDate;
                            } else {
                                obj[customHeader] = row[index];
                            }
                        });

                        return obj;

                    });
                    setBulkData(jsonDataWithHeaders);
                    setFileUploaded(true);
                }
                else {
                    setBulkData([]);
                    setFileUploaded(false);
                }
            } catch (error) {
                setFileUploaded(false);
                message.error("Please upload a valid excel file");
            }
        };

        const fileList = info.fileList.slice(-1);
        if (fileList.length > 0) {
            fileReader.readAsArrayBuffer(fileList[0].originFileObj);
        } else {
            setBulkData([]);
            setFileUploaded(false);
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
                file_name,
                data: bulkData,
            };
            settLoading(true);
            // let insurance = "";
            // if (insuranceLabel === "hcpw-001") {
            let insurance = "healthchoice";
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
            // }
            // else {
            //     insurance = insuranceLabel;
            // }
            addPreProcessorData(insurance, payload).then(({ data: response }) => {
                setExistingPatients(response?.existingPatient);
                setNewPatients(response?.newPatient);
                setMissingMemberId(response?.missingMemberID);
                setFirstNameIssue(response?.firstNameIssue);
                setLastNameIssue(response?.lastNameIssue);
                setDobIssue(response?.dobIssue);
                setInsuranceIssue(response?.insuranceIssue);
                setMultipleIssues(response?.multipleIssue);
                if (response?.dobIssue) {
                    const dobissue = response?.dobIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterDobIssue(dobissue);
                }
                if (response?.missingMemberID) {
                    const memberismissing = response?.missingMemberID.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterMissingMemberId(memberismissing);
                }
                if (response?.firstNameIssue) {
                    const fnameissue = response?.firstNameIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterFirstNameIssue(fnameissue);
                }
                if (response?.lastNameIssue) {
                    const lnameissue = response?.lastNameIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterLastNameIssue(lnameissue);
                }
                if (response?.insuranceIssue) {
                    const insissue = response?.insuranceIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterInsuranceIssue(insissue);
                }
                if (response?.multipleIssue) {
                    const mulissue = response?.multipleIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterMultipleIssues(mulissue);
                }
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

    function handleFilterYear(val: string) {
        setFilterYear(val);
    }

    const handleMoveNew = (record: any, entry: string, index: number) => {
        // setMoveSingleData(record);
        // setMoveRecord(entry);
        // setIsModalOpen(true);
        if (entry === "Keep") {
            // handleSubmitRecord();
            console.log(record, entry);

        }
    }
    const handleKeeptRecord = (record: any) => {
        const updatedMoveSingleData = {
            ...record,
            tabKey: activeTabKey
        };
        setMoveSingleData(updatedMoveSingleData);
        if (moveRecord === "Keep") {
            if (activeTabKey === "dobIssue") {
                const dobissue = filterdobIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredissuesArray = filterdobIssue.filter((_: any, index: any) => index !== dobissue && index !== dobissue + 1)
                setFilterDobIssue(filteredissuesArray);

                const issuecheck = ldobIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = ldobIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setDobIssue(filteredArray);
            }
            if (activeTabKey === "firstNameIssue") {
                const fnameissue = filterFirstNameIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredfissuesArray = filterFirstNameIssue.filter((_: any, index: any) => index !== fnameissue && index !== fnameissue + 1)
                setFilterFirstNameIssue(filteredfissuesArray);

                const issuecheck = firstNameIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = firstNameIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setFirstNameIssue(filteredArray);
            }
            if (activeTabKey === "lastNameIssue") {
                const lnameissue = filterLastNameIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredlissuesArray = filterLastNameIssue.filter((_: any, index: any) => index !== lnameissue && index !== lnameissue + 1)
                setFilterLastNameIssue(filteredlissuesArray);

                const issuecheck = lastNameIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = lastNameIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setLastNameIssue(filteredArray);
            }
            if (activeTabKey === "missingMemberID") {
                const memberidissue = filterMissingMemberId.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredmissuesArray = filterMissingMemberId.filter((_: any, index: any) => index !== memberidissue && index !== memberidissue + 1)
                setFilterMissingMemberId(filteredmissuesArray);

                const issuecheck = missingMemberId.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = missingMemberId.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setMissingMemberId(filteredArray);
            }
            if (activeTabKey === "insuranceIssue") {
                const insissue = filterInsuranceIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filterediissuesArray = filterInsuranceIssue.filter((_: any, index: any) => index !== insissue && index !== insissue + 1)
                setFilterInsuranceIssue(filterediissuesArray);

                const issuecheck = insuranceIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = insuranceIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setInsuranceIssue(filteredArray);
            }
            if (activeTabKey === "multipleIssue") {
                const mulissue = filterMultipleIssues.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredMulissuesArray = filterMultipleIssues.filter((_: any, index: any) => index !== mulissue && index !== mulissue + 1)
                setFilterMultipleIssues(filteredMulissuesArray);

                const issuecheck = multipleIssues.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = multipleIssues.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setMultipleIssues(filteredArray);
            }
            setExistingPatients(prevPatients => {
                prevPatients = prevPatients || [];
                return [...prevPatients, updatedMoveSingleData];
            });
        }
        setIsModalOpen(false);

    };
    const handleSubmitRecord = () => {
        setInputValuesArray(prevState => [...prevState, inputValues]);
        const updatedMoveSingleData = {
            ...moveSingleData,
            tabKey: activeTabKey
        };
        setMoveSingleData(updatedMoveSingleData);
        if (moveRecord === "Existing") {
            if (activeTabKey === "dobIssue") {
                const dobissue = filterdobIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredissuesArray = filterdobIssue.filter((_: any, index: any) => index !== dobissue && index !== dobissue + 1)
                setFilterDobIssue(filteredissuesArray);

                const issuecheck = ldobIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = ldobIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setDobIssue(filteredArray);
            }
            if (activeTabKey === "firstNameIssue") {
                const fnameissue = filterFirstNameIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredfissuesArray = filterFirstNameIssue.filter((_: any, index: any) => index !== fnameissue && index !== fnameissue + 1)
                setFilterFirstNameIssue(filteredfissuesArray);

                const issuecheck = firstNameIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = firstNameIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setFirstNameIssue(filteredArray);
            }
            if (activeTabKey === "lastNameIssue") {
                const lnameissue = filterLastNameIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredlissuesArray = filterLastNameIssue.filter((_: any, index: any) => index !== lnameissue && index !== lnameissue + 1)
                setFilterLastNameIssue(filteredlissuesArray);

                const issuecheck = lastNameIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = lastNameIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setLastNameIssue(filteredArray);
            }
            if (activeTabKey === "missingMemberID") {
                const memberidissue = filterMissingMemberId.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredmissuesArray = filterMissingMemberId.filter((_: any, index: any) => index !== memberidissue && index !== memberidissue + 1)
                setFilterMissingMemberId(filteredmissuesArray);

                const issuecheck = missingMemberId.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = missingMemberId.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setMissingMemberId(filteredArray);
            }
            if (activeTabKey === "insuranceIssue") {
                const insissue = filterInsuranceIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filterediissuesArray = filterInsuranceIssue.filter((_: any, index: any) => index !== insissue && index !== insissue + 1)
                setFilterInsuranceIssue(filterediissuesArray);

                const issuecheck = insuranceIssue.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = insuranceIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setInsuranceIssue(filteredArray);
            }
            if (activeTabKey === "multipleIssue") {
                const mulissue = filterMultipleIssues.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredMulissuesArray = filterMultipleIssues.filter((_: any, index: any) => index !== mulissue && index !== mulissue + 1)
                setFilterMultipleIssues(filteredMulissuesArray);

                const issuecheck = multipleIssues.findIndex((item: { id: number; }) => { return item.id === updatedMoveSingleData?.id; });
                const filteredArray = multipleIssues.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck + 1)
                setMultipleIssues(filteredArray);
            }
            setExistingPatients(prevPatients => {
                prevPatients = prevPatients || [];
                return [...prevPatients, updatedMoveSingleData];
            });
        }
        if (moveRecord === "New") {
            if (activeTabKey === "dobIssue") {
                const dobissue = filterdobIssue.filter((item: { sr: number; }) => { return item.sr !== updatedMoveSingleData?.sr; });
                setFilterDobIssue(dobissue);
                const issuecheck = ldobIssue.findIndex((item: { sr: number; }) => { return item.sr === updatedMoveSingleData?.sr; });
                const filteredArray = ldobIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck - 1);
                setDobIssue(filteredArray);
            }
            if (activeTabKey === "firstNameIssue") {
                const fnameissue = filterFirstNameIssue.filter((item: { sr: number; }) => { return item.sr !== updatedMoveSingleData?.sr; });
                setFilterFirstNameIssue(fnameissue);
                const issuecheck = firstNameIssue.findIndex((item: { sr: number; }) => { return item.sr === updatedMoveSingleData?.sr; });
                const filteredArray = firstNameIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck - 1)
                setFirstNameIssue(filteredArray);
            }
            if (activeTabKey === "lastNameIssue") {
                const lnameissue = filterLastNameIssue.filter((item: { sr: number; }) => { return item.sr !== updatedMoveSingleData?.sr; });
                setFilterLastNameIssue(lnameissue);
                const issuecheck = lastNameIssue.findIndex((item: { sr: number; }) => { return item.sr === updatedMoveSingleData?.sr; });
                const filteredArray = lastNameIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck - 1)
                setLastNameIssue(filteredArray);
            }
            if (activeTabKey === "missingMemberID") {
                const memberidissue = filterMissingMemberId.filter((item: { sr: number; }) => { return item.sr !== updatedMoveSingleData?.sr; });
                setFilterMissingMemberId(memberidissue);
                const issuecheck = missingMemberId.findIndex((item: { sr: number; }) => { return item.sr === updatedMoveSingleData?.sr; });
                const filteredArray = missingMemberId.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck - 1)
                setMissingMemberId(filteredArray);
            }
            if (activeTabKey === "insuranceIssue") {
                const insissue = filterInsuranceIssue.filter((item: { sr: number; }) => { return item.sr !== updatedMoveSingleData?.sr; });
                setFilterInsuranceIssue(insissue);
                const issuecheck = insuranceIssue.findIndex((item: { sr: number; }) => { return item.sr === updatedMoveSingleData?.sr; });
                const filteredArray = insuranceIssue.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck - 1)
                setInsuranceIssue(filteredArray);
            }
            if (activeTabKey === "multipleIssue") {
                const mulissue = filterMultipleIssues.filter((item: { sr: number; }) => { return item.sr !== updatedMoveSingleData?.sr; });
                setFilterMultipleIssues(mulissue);
                const issuecheck = multipleIssues.findIndex((item: { sr: number; }) => { return item.sr === updatedMoveSingleData?.sr; });
                const filteredArray = multipleIssues.filter((_: any, index: any) => index !== issuecheck && index !== issuecheck - 1)
                setMultipleIssues(filteredArray);
            }
            setNewPatients((prevPatients) => {
                prevPatients = prevPatients || [];
                return [...prevPatients, updatedMoveSingleData];
            });
        }
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleClinicChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;

        setClinicIds(value);
        roleFilter(value).then(({ data: response }) => {
            settLoading(false);
            setInsurancesClinic(response?.insurances);
            setDoctorsClinic(response?.doctors)


            setMoveSingleData({
                ...moveSingleData,
                [name]: value,
            });
        });
    };

    const handleChange = (e: any) => {
        const name = e.target.name;
        const value = e.target.value;
        if (name === "insurance_id" && moveRecord === "Existing") {
            setInputValues({} as InsType);
            setIsInsModalOpen(true);
            setInputValues((prevState: any) => ({
                ...prevState,
                [name]: value
            }));
        }
        setMoveSingleData({
            ...moveSingleData,
            [name]: value,
        });
    };

    const getRowClassName = (record: any, index: any) => {
        return index % 4 < 2 ? 'highlight-row' : 'other-row';
    };
    const handleChangeRecord = (e: any) => {
        const value = e.target.value.toUpperCase();

        setMoveSingleData({
            ...moveSingleData,
            [e.target.name]: value,
        });
    }
    const handledateChanges = (name: any, value: any) => {
        const years = moment().diff(value, "years");
        setMoveSingleData({
            ...moveSingleData,
            [name]: value,
            age: years,
        });
    };
    const handlezipChange = (e: any) => {
        const value = e.target.value;
        const re = /^[0-9 ]+$/;
        if (value === "" || re.test(value)) {
            setMoveSingleData({
                ...moveSingleData,
                [e.target.name]: value,
            });
        }
    };
    const handlecellChange = (e: any) => {
        const x = e.target.value
            .replace(/\D/g, "")
            .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
        e.target.value = !x[2]
            ? x[1]
            : +x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
        const value = e.target.value;
        setMoveSingleData({
            ...moveSingleData,
            [e.target.name]: value,
        });
    };
    const handleSubmitNewData = (_: any) => {
        const gap_year = filterYear;
        const fileLogId = editRecordId;
        setError(false);
        const payload = {
            clinicIds,
            fileLogId,
            file_name,
            insuranceIds,
            gap_year,
            insurance_history: inputValuesArray,
            newPatients: newPatients,
            existingPatients: existingPatients,
            dobIssue: filterdobIssue,
            firstNameIssue: filterFirstNameIssue,
            lastNameIssue: filterLastNameIssue,
            memberMissingId: filterMissingMemberId,
            insuranceIssue: filterInsuranceIssue,
            multipleIssue: filterMultipleIssues
        };
        settLoading(true);
        // let insurance = "";
        // if (insuranceLabel === "hcpw-001") {
        let insurance = "healthchoice";
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
        // }
        // else {
        //     insurance = insuranceLabel;
        // }
        addPreProcessors(insurance, payload).then(({ data: response }) => {
            if (response.success) {
                setIsBulkOpen(false);
                settLoading(false);
                OpenNotification("success", response.message);
            } else {
                settLoading(false);
                OpenNotification("error", response.error);
            }
        });
        // }

    }
    const handleAddData = () => {
        setIsListing(false);
        setFileName('');
    }
    const handleViewData = () => {
        getCareGapsData();
        setIsListing(true);
        setExistingPatients([]);
        setNewPatients([]);
        setMissingMemberId([]);
        setFirstNameIssue([]);
        setLastNameIssue([]);
        setDobIssue([]);
        setInsuranceIssue([]);
    }
    const handleEditRecord = (record: any) => {
        const id = record?.id;
        const clinicid = record?.clinic_id;
        const insuranceid = record?.insurance_id;
        setInsuranceLabel(record?.insurance_data?.provider);
        setInsurances(insuranceid);
        setClinicIds(clinicid);
        setEditRecordId(id);
        editParser(id).then(({ data: response }) => {
            if (response.success) {
                setDoctorsClinic(response?.doctors);
                setInsurancesClinic(response?.insuranceData);
                setExistingPatients(response?.data?.existingPatient);
                setNewPatients(response?.data?.newPatient);
                setMissingMemberId(response?.data?.missingMemberID);
                setFirstNameIssue(response?.data?.firstNameIssue);
                setLastNameIssue(response?.data?.lastNameIssue);
                setDobIssue(response?.data?.dobIssue);
                setInsuranceIssue(response?.data?.insuranceIssue);
                setMultipleIssues(response?.data?.multipleIssue);
                if (response?.data?.dobIssue) {
                    const dobissue = response?.data?.dobIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterDobIssue(dobissue);
                }
                if (response?.data?.missingMemberID) {
                    const memberismissing = response?.data?.missingMemberID.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterMissingMemberId(memberismissing);
                }
                if (response?.data?.firstNameIssue) {
                    const fnameissue = response?.data?.firstNameIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterFirstNameIssue(fnameissue);
                }
                if (response?.data?.lastNameIssue) {
                    const lnameissue = response?.data?.lastNameIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterLastNameIssue(lnameissue);
                }
                if (response?.data?.insuranceIssue) {
                    const insissue = response?.data?.insuranceIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterInsuranceIssue(insissue);
                }
                if (response?.data?.multipleIssue) {
                    const mulissue = response?.data?.multipleIssue.filter((item: { sr: number; }) => { return item.sr !== undefined; });
                    setFilterMultipleIssues(mulissue);
                }
                setIsListing(false);
                settLoading(false);
                OpenNotification("success", response.message);
            } else {
                settLoading(false);
                OpenNotification("error", response.error);
            }
        });
    }
    const handleChangeName = (e: any) => {
        setFileName(e.target.value);
    }
    const handleInsOk = () => {
        if (inputValues?.insurance_status === undefined || inputValues?.insurance_status === "") {
            setIsInsModalOpen(true);
            OpenNotification("error", "Please Select Insurance Status!");
        } else {
            const currentDate = moment().format("MM/DD/YYYY");
            if (inputValues?.insurance_start_date === undefined) {
                setInputValues((prevState: any) => ({
                    ...prevState,
                    ['insurance_start_date']: currentDate,
                }));
            }
            if (inputValues?.insurance_end_date === undefined) {
                setInputValues((prevState: any) => ({
                    ...prevState,
                    ['insurance_end_date']: currentDate,
                }));
            }
            setInputValues((prevState: any) => ({
                ...prevState,
                ['patient_id']: moveSingleData?.id,
            }));
            setIsInsModalOpen(false);
        }

    }

    const handleInsCancel = () => {
        setIsInsModalOpen(false);
    }
    const handleinsChanges = (name: string, value: any) => {
        setInputValues((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    }
    const handleInsChangeStatus = (e: any) => {
        const { name, value } = e.target;
        setInputValues((prevState: any) => ({
            ...prevState,
            [name]: value
        }));
    }

    const columns: TableColumnsType<DataType> = [
        {
            title: 'Entry',
            dataIndex: 'record',
            fixed: "left",
            width: 100,
            render: (_: any, record: any) => {
                const id = record?.id;
                return id !== undefined ? <Text style={{ backgroundColor: "lightgray" }}>Existing</Text> : <Text style={{ backgroundColor: "lightgreen" }}>New</Text>
            }
        },
        {
            title: 'Member Id',
            dataIndex: 'member_id',
            key: 'member_id',
        },
        {
            title: 'Patient Full Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Middle Name',
            dataIndex: 'mid_name',
            key: 'mid_name',
        },
        {
            title: 'DOB',
            dataIndex: 'dob',
            key: 'dob',
            render: (_: any, record: any) => {
                const dob = moment(record?.dob).format("MM/DD/YYYY")
                return (
                    dob
                );
            }
        },

        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Groups',
            dataIndex: 'group',
            key: 'group',
            render: (_: any, record: any) => {
                const findGroup = patientGroups.find((item: any) => record?.group === item?.id || record?.groups === item?.label);
                return (
                    findGroup?.label
                );
            }
        },
        {
            title: 'AWV Gaps Status',
            dataIndex: 'awv_gap',
            key: 'awv_gap',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Address Line 1',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Zip Code',
            dataIndex: 'zip_code',
            key: 'zip_code',
        },
        {
            title: 'Phone',
            dataIndex: 'contact_no',
            key: 'contact_no',
        },
        {
            title: 'Cell',
            dataIndex: 'cell',
            key: 'cell',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Clinic',
            dataIndex: 'clinic_name',
            key: 'clinic_name',
        },
        {
            title: 'Primary Care Physician',
            dataIndex: 'doctor_name',
            key: 'doctor_name',
        },
        {
            title: 'Insurance',
            dataIndex: 'insurance_name',
            key: 'insurance_name',
        },
        {
            title: 'Action',
            dataIndex: 'btn',
            fixed: 'right',
            render: (_: any, record: any, index: number) => {
                const id = record?.id;
                return (
                    activeTabKey === "existingPatient" || activeTabKey === "newPatient" ?
                        <Button type="primary" disabled>Action</Button>
                        :
                        <DropdownButton id="dropdown-basic-button" size="sm" drop="end" title="Action">
                            {id === undefined ? <Dropdown.Item onClick={() => handleMoveNew(record, "New", index)}>Add as a new patient</Dropdown.Item>
                                :
                                <> <Dropdown.Item onClick={() => handleMoveNew(record, "Existing", index)}>Update existing patient</Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleKeeptRecord(record)}>Keep this Data</Dropdown.Item></>
                            }
                        </DropdownButton>

                );
            }
        },
    ];

    const ListingColumns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'File Name',
            dataIndex: 'file_name',
            key: 'file_name',
        },
        {
            title: 'Clinic',
            dataIndex: 'clinic_id',
            key: 'clinic_id',
            render: (_: any, record: any) => {
                const filter = clinics.find((items: any) => items?.id === record?.clinic_id);
                return (
                    filter?.name
                );
            }
        },
        {
            title: 'Insurance',
            dataIndex: 'insurance_id',
            key: 'insurance_id',
            render: (_: any, record: any) => {
                const filter = allInsurances.find((items: any) => items?.id === record?.insurance_id);
                return (
                    filter?.name
                );
            }
        },
        {
            title: 'Gap Year',
            dataIndex: 'gap_year',
            key: 'gap_year',
        },
        {
            title: 'Actions',
            dataIndex: 'btn',
            render: (_: any, record: any) => {
                return (
                    <Button type="primary" onClick={() => handleEditRecord(record)}>Edit</Button>
                );
            }
        }
    ];
    const existingPatientsCount = existingPatients?.length;
    const newPatientsCount = newPatients?.length;
    const missingMemberIdCount = missingMemberId?.length / 2;
    const firstNameIssueCount = firstNameIssue?.length / 2;
    const lastNameIssueCount = lastNameIssue?.length / 2;
    const ldobIssueCount = ldobIssue?.length / 2;
    const insuranceIssueCount = insuranceIssue?.length / 2;
    const multipleIssueCount = multipleIssues?.length / 2;
    const existingCustomTab = useMemo(() => {
        return (
            <span>
                Existing Patients {existingPatients && existingPatients.length > 0 ? <Badge size="small" count={existingPatientsCount} /> : <Badge status="default" />}
            </span>
        );
    }, [existingPatients]);

    const newCustomTab = useMemo(() => {
        return (
            <span>
                New Patients {newPatients && newPatients.length > 0 ? <Badge size="small" count={newPatientsCount} /> : <Badge status="default" />}
            </span>
        );
    }, [newPatients]);
    const missingidCustomTab = useMemo(() => {
        return (
            <span>
                Member Id Missing {missingMemberId && missingMemberId.length > 0 ? <Badge size="small" count={missingMemberIdCount} /> : <Badge status="default" />}
            </span>
        );
    }, [missingMemberId]);
    const firstNameCustomTab = useMemo(() => {
        return (
            <span>
                First Name Issue {firstNameIssue && firstNameIssue.length > 0 ? <Badge size="small" count={firstNameIssueCount} /> : <Badge status="default" />}
            </span>
        );
    }, [firstNameIssue]);
    const lastNameCustomTab = useMemo(() => {
        return (
            <span>
                Last Name Issue {lastNameIssue && lastNameIssue.length > 0 ? <Badge size="small" count={lastNameIssueCount} /> : <Badge status="default" />}
            </span>
        );
    }, [lastNameIssue]);
    const dobCustomTab = useMemo(() => {
        return (
            <span>
                DOB Issue {ldobIssue && ldobIssue.length > 0 ? <Badge size="small" count={ldobIssueCount} /> : <Badge status="default" />}
            </span>
        );
    }, [ldobIssue]);
    const insuranceCustomTab = useMemo(() => {
        return (
            <span>
                Insurance Issue {insuranceIssue && insuranceIssue.length > 0 ? <Badge size="small" count={insuranceIssueCount} /> : <Badge status="default" />}
            </span>
        );
    }, [insuranceIssue]);
    const multipleCustomTab = useMemo(() => {
        return (
            <span>
                Multiple Issue {multipleIssues && multipleIssues.length > 0 ? <Badge size="small" count={multipleIssueCount} /> : <Badge status="default" />}
            </span>
        );
    }, [multipleIssues]);

    const handleExistingPageChange = (page: number) => {
        setExistingCurrentPage(page);
    };
    const handleNewPageChange = (page: number) => {
        setNewCurrentPage(page);
    };
    const handleMemberPageChange = (page: number) => {
        setMemberCurrentPage(page);
    };
    const handleFirstPageChange = (page: number) => {
        setFirstCurrentPage(page);
    };
    const handleLastPageChange = (page: number) => {
        setLastCurrentPage(page);
    };
    const handleDobPageChange = (page: number) => {
        setDobCurrentPage(page);
    };
    const handleInsPageChange = (page: number) => {
        setInsCurrentPage(page);
    };
    const handleMulPageChange = (page: number) => {
        setMulCurrentPage(page);
    };
    const existingStartIndex = (existingCurrentPage - 1) * pageSize;
    const existingEndIndex = existingStartIndex + pageSize;
    const currentExistingPatients = existingPatients?.slice(existingStartIndex, existingEndIndex);

    const newStartIndex = (newCurrentPage - 1) * pageSize;
    const newEndIndex = newStartIndex + pageSize;
    const currentNewPatients = newPatients?.slice(newStartIndex, newEndIndex);

    const memberStartIndex = (memberCurrentPage - 1) * pageSize;
    const memberEndIndex = memberStartIndex + pageSize;
    const currentMemberPatients = missingMemberId?.slice(memberStartIndex, memberEndIndex);

    const firstStartIndex = (firstCurrentPage - 1) * pageSize;
    const firstEndIndex = firstStartIndex + pageSize;
    const currentFirstPatients = firstNameIssue?.slice(firstStartIndex, firstEndIndex);

    const lastStartIndex = (lastCurrentPage - 1) * pageSize;
    const lastEndIndex = lastStartIndex + pageSize;
    const currentLastPatients = lastNameIssue?.slice(lastStartIndex, lastEndIndex);

    const dobStartIndex = (dobCurrentPage - 1) * pageSize;
    const dobEndIndex = dobStartIndex + pageSize;
    const currentDobPatients = ldobIssue?.slice(dobStartIndex, dobEndIndex);

    const insStartIndex = (insCurrentPage - 1) * pageSize;
    const insEndIndex = insStartIndex + pageSize;
    const currentInsPatients = insuranceIssue?.slice(insStartIndex, insEndIndex);

    const mulStartIndex = (mulCurrentPage - 1) * pageSize;
    const mulEndIndex = mulStartIndex + pageSize;
    const currentMulPatients = multipleIssues?.slice(mulStartIndex, mulEndIndex);

    return (
        <>
            <div
                className="container fluid"
                style={{
                    margin: "",
                    // background: "white",
                    padding: "10px",
                    borderRadius: "7px",
                }}
            >
                <Row className="mt-4">
                    <Col span={12}>
                        <h2>Pre Processor</h2>
                    </Col>
                    <Col span={12}>
                        {isListing === true ?
                            <Button className="float-right" onClick={handleAddData} >Add Listing</Button>
                            :
                            <Button className="float-right" onClick={handleViewData} >View Listing</Button>
                        }
                    </Col>
                </Row>
                {isListing === true ?
                    <Row className="mt-4">
                        <Col span="24">
                            <Table dataSource={fileListingLog} columns={ListingColumns} />
                        </Col>
                    </Row>
                    :
                    <>
                        <Row>
                            <Col span={4}>
                                <div>
                                    {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                                    <Space className="mr-1" direction="horizontal">
                                        {/* <DatePicker picker="year" onChange={(date, dateString) => handleFilterYear(dateString)} /> */}
                                        <DatePicker
                                            picker="year"
                                            value={selectedYear}
                                            allowClear={false}
                                            onChange={(date, dateString) => handleFilterYear(dateString)}
                                        />
                                    </Space>
                                </div>
                            </Col>
                            <Col span={4}>
                                <Input style={{ width: '90%' }} placeholder="File Name" name="file_name" onChange={(e: any) => handleChangeName(e)} />
                            </Col>
                            <Col span={4}>
                                <div>
                                    {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                                    <Select
                                        style={{ width: "90%", borderRadius: "6px" }}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={filterOption}
                                        dropdownStyle={{ borderRadius: "6px" }}
                                        allowClear
                                        status={errors ? 'error' : ''}
                                        placeholder="Select a Clinic"
                                        onChange={(value) => handleClinicIdChange(value)}
                                        options={clinics.map((items: any) => ({
                                            value: items.id,
                                            label: items.name,
                                        }))}
                                    />
                                </div>
                            </Col>
                            <Col span={4}>
                                <div>
                                    {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                                    <Select
                                        style={{ width: "90%", borderRadius: "6px" }}
                                        showSearch
                                        optionFilterProp="children"
                                        filterOption={filterOption}
                                        dropdownStyle={{ borderRadius: "6px" }}
                                        allowClear
                                        status={errors ? 'error' : ''}
                                        placeholder="Select an Insurance"
                                        onChange={(value: number) => handleInsuranceIdChange(value)}
                                        options={insurancesCLinic.map((items: { id: any, name: any }) => ({
                                            value: items.id,
                                            label: items.name,
                                        }))}
                                    />

                                </div>
                            </Col>
                            <Col span={5}>
                                <div style={{ height: "30px" }}>
                                    <Dragger
                                        accept=".xlsx"
                                        maxCount={1}
                                        disabled={isDisabledUpload}
                                        showUploadList={false}
                                        onChange={handleFileChange}
                                        beforeUpload={() => false}
                                        style={{ borderColor: fileUploaded ? "green" : "red" }}
                                    >
                                        <span>
                                            <UploadOutlined /> Upload the file
                                        </span>
                                    </Dragger>
                                </div>
                            </Col>
                            <Col span={3}>
                                <Button type="primary" className="float-right" onClick={handleBulkSubmit}>Submit</Button>
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col span={24}>
                                <Tabs type="line" tabBarGutter={65} defaultActiveKey="existingPatient" activeKey={activeTabKey} onChange={handleTabChange}
                                // animated={true}
                                // tabBarExtraContent={
                                //     <div>
                                //         <Text className="float-left"><LeftOutlined /> </Text>
                                //         <Text className="float-right"> <RightOutlined /></Text>
                                //     </div>
                                // }
                                >
                                    <Tabs.TabPane tab={existingCustomTab} key="existingPatient">
                                        <div style={{ overflowX: 'auto' }}>
                                            <Table
                                                dataSource={currentExistingPatients}
                                                style={{ width: 1250 }}
                                                columns={columns}
                                                className="text-nowrap"
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination
                                            defaultCurrent={1}
                                            total={existingPatients?.length}
                                            pageSize={pageSize}
                                            onChange={handleExistingPageChange}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={newCustomTab} key="newPatient">
                                        <div style={{ overflowX: 'auto' }}>
                                            <Table
                                                dataSource={currentNewPatients}
                                                style={{ width: 1250 }}
                                                columns={columns}
                                                className="text-nowrap"
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination
                                            defaultCurrent={1}
                                            total={newPatients?.length}
                                            pageSize={pageSize}
                                            onChange={handleNewPageChange}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={missingidCustomTab} key="missingMemberID">
                                        <div style={{ overflowX: 'auto' }}>
                                            <Table
                                                dataSource={currentMemberPatients}
                                                style={{ width: 1250 }}
                                                columns={columns}
                                                rowClassName={getRowClassName}
                                                className="text-nowrap"
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination
                                            defaultCurrent={1}
                                            total={missingMemberId?.length}
                                            pageSize={pageSize}
                                            onChange={handleMemberPageChange}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={firstNameCustomTab} key="firstNameIssue" active>
                                        <div style={{ overflowX: 'auto' }}>
                                            <Table
                                                dataSource={currentFirstPatients}
                                                style={{ width: 1250 }}
                                                columns={columns}
                                                rowClassName={getRowClassName}
                                                className="text-nowrap"
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination
                                            defaultCurrent={1}
                                            total={firstNameIssue?.length}
                                            pageSize={pageSize}
                                            onChange={handleFirstPageChange}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={lastNameCustomTab} key="lastNameIssue" active>
                                        <div style={{ overflowX: 'auto' }}>
                                            <Table
                                                dataSource={currentLastPatients}
                                                style={{ width: 1250 }}
                                                columns={columns}
                                                rowClassName={getRowClassName}
                                                className="text-nowrap"
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination
                                            defaultCurrent={1}
                                            total={lastNameIssue?.length}
                                            pageSize={pageSize}
                                            onChange={handleLastPageChange}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={dobCustomTab} key="dobIssue" active>
                                        <div style={{ overflowX: 'auto' }}>
                                            <Table
                                                dataSource={currentDobPatients}
                                                style={{ width: 1250 }}
                                                columns={columns}
                                                rowClassName={getRowClassName}
                                                className="text-nowrap"
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination
                                            defaultCurrent={1}
                                            total={ldobIssue?.length}
                                            pageSize={pageSize}
                                            onChange={handleDobPageChange}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={insuranceCustomTab} key="insuranceIssue" active>
                                        <div style={{ overflowX: 'auto' }}>
                                            <Table
                                                dataSource={currentInsPatients}
                                                style={{ width: 1250 }}
                                                columns={columns}
                                                rowClassName={getRowClassName}
                                                className="text-nowrap"
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination
                                            defaultCurrent={1}
                                            total={insuranceIssue?.length}
                                            pageSize={pageSize}
                                            onChange={handleInsPageChange}
                                        />
                                    </Tabs.TabPane>
                                    <Tabs.TabPane tab={multipleCustomTab} key="multipleIssue" active>
                                        <div style={{ overflowX: 'auto' }}>
                                            <Table
                                                dataSource={currentMulPatients}
                                                style={{ width: 1250 }}
                                                columns={columns}
                                                rowClassName={getRowClassName}
                                                className="text-nowrap"
                                                pagination={false}
                                            />
                                        </div>
                                        <Pagination
                                            defaultCurrent={1}
                                            total={multipleIssues?.length}
                                            pageSize={pageSize}
                                            onChange={handleMulPageChange}
                                        />
                                    </Tabs.TabPane>
                                </Tabs>
                            </Col>
                        </Row>
                        <Row><Col span={24}><Button className="float-right" onClick={handleSubmitNewData}>Submit</Button></Col></Row></>
                }


            </div>
            <Modal width={600} title="Edit And Move Record" open={isModalOpen} onOk={handleSubmitRecord} onCancel={handleCancel}>
                <Row>
                    <Col span={11}>
                        <label htmlFor="">Member ID</label>
                        <Input type="text" placeholder="Member Id" name="member_id" value={moveSingleData?.member_id} onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">Patient Full Name</label>
                        <Input
                            type="text"
                            className="float-right text-uppercase"
                            autoComplete="none"
                            placeholder="Patient Full Name"
                            maxLength={60}
                            name="name"
                            value={moveSingleData?.name}
                            style={{ textTransform: "uppercase" }}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">First Name</label>
                        <Input
                            type="text"
                            className="float-right text-uppercase"
                            autoComplete="none"
                            placeholder="First Name"
                            maxLength={60}
                            name="first_name"
                            value={moveSingleData?.first_name}
                            style={{ textTransform: "uppercase" }}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">Last Name</label>
                        <Input type="text"
                            className="float-right text-uppercase"
                            autoComplete="none"
                            placeholder="Last Name"
                            maxLength={60}
                            required
                            name="last_name"
                            value={moveSingleData?.last_name}
                            style={{ textTransform: "uppercase" }}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">Middle Name</label>
                        <Input type="text"
                            className="float-right text-uppercase"
                            autoComplete="none"
                            placeholder="Middle Name"
                            maxLength={60}
                            name="mid_name"
                            value={moveSingleData.mid_name}
                            style={{ textTransform: "uppercase" }}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">DOB</label>
                        <DatePicker
                            onChange={(e, dateString) =>
                                handledateChanges("dob", dateString)
                            }
                            className="form-control"
                            style={{ height: "32px" }}
                            value={dates?.dob}
                            format={"MM/DD/YYYY"}
                            placeholder={"MM/DD/YYYY"}
                            name="urine_microalbumin_date"
                        />
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">Age</label>
                        <Input type="text"
                            placeholder="Age"
                            maxLength={60}
                            name="age"
                            disabled
                            value={years} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">Groups</label>
                        <select
                            name="group"
                            className="form-control text-uppercase"
                            value={moveSingleData?.group}
                            onChange={(e: any) => handleChange(e)}
                        >
                            <option value="" selected className="text-uppercase">
                                Select
                            </option>
                            {patientGroups?.map((items: any, i) => (
                                <option value={items.id} key={i} className="text-uppercase">
                                    {items.label}
                                </option>
                            ))}

                        </select>
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">AWV Gaps Status</label>
                        <Input
                            className="float-right text-uppercase"
                            autoComplete="none"
                            placeholder="AWV Gaps Status"
                            maxLength={60}
                            name="awv_gap"
                            value={moveSingleData.awv_gap}
                            style={{ textTransform: "uppercase" }}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">Status</label>
                        <Input className="float-right text-uppercase"
                            autoComplete="none"
                            placeholder="Status"
                            maxLength={60}
                            name="status"
                            value={moveSingleData.status}
                            style={{ textTransform: "uppercase" }}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">Gender</label>
                        <select
                            className="form-control form-control-sm text-uppercase"
                            style={{ height: "32px" }}
                            name="gender"
                            required
                            value={moveSingleData?.gender?.toUpperCase()}
                            onChange={(e: any) => handleChangeRecord(e)}
                        >
                            <option value="" selected disabled className="text-uppercase">
                                Select
                            </option>
                            <option value="MALE" className="text-uppercase">
                                Male
                            </option>
                            <option value="FEMALE" className="text-uppercase">
                                Female
                            </option>
                        </select>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">Address Line 1</label>
                        <Input type="text"
                            className="text-uppercase"
                            autoComplete="none"
                            placeholder="Address Line 1"
                            maxLength={60}
                            name="address"
                            required
                            value={moveSingleData.address}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">City</label>
                        <Input type="text"
                            className="text-uppercase"
                            autoComplete="none"
                            placeholder="City"
                            maxLength={60}
                            name="city"
                            value={moveSingleData.city}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">State</label>
                        <Input type="text"
                            className=" text-uppercase"
                            autoComplete="none"
                            maxLength={2}
                            placeholder="State (2 alpha characters only)"
                            name="state"
                            required
                            value={moveSingleData.state}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">Zip Code</label>
                        <Input type="tel"
                            autoComplete="none"
                            name="zipCode"
                            maxLength={5}
                            pattern="[0-9]{5}"
                            placeholder="Five digit zip code"
                            required
                            value={moveSingleData.zipCode}
                            onChange={(e: any) => handlezipChange(e)} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">Phone</label>
                        <Input type="tel"
                            autoComplete="none"
                            maxLength={12}
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            placeholder="301-123-4567"
                            required
                            name="contact_no"
                            value={moveSingleData.contact_no?.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                            onChange={(e: any) => handlecellChange(e)} />
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">Cell</label>
                        <Input type="tel"
                            placeholder="301-123-4567"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            autoComplete="none"
                            maxLength={12}
                            name="cell"
                            value={moveSingleData.cell?.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                            onChange={(e: any) => handlecellChange(e)} />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">Email</label>
                        <Input type="email"
                            autoComplete="none"
                            placeholder="Email"
                            maxLength={60}
                            name="email"
                            className=""
                            value={moveSingleData?.email}
                            onChange={(e: any) => handleChangeRecord(e)} />
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">Clinic</label>
                        <select
                            style={{ width: "100%" }}
                            name="clinic_id"
                            className="form-control"
                            value={moveSingleData?.clinic_id}
                            required
                            onChange={(e: any) => handleClinicChange(e)}
                        >
                            <option value="" selected disabled>
                                Select
                            </option>
                            {clinics?.map((key: { id: any; name: any }) => (
                                <option value={key.id} key={key.id}>
                                    {key.name}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">Primary Care Physician</label>
                        <select
                            style={{ width: "100%" }}
                            name="doctor_id"
                            className="form-control"
                            value={moveSingleData?.doctor_id}
                            required
                            onChange={(e: any) => handleChange(e)}
                        >
                            <option value="" selected disabled>
                                Select
                            </option>
                            {doctorsClinic?.map((key: { id: any; name: any }) => (
                                <option value={key.id} key={key.id}>
                                    {key.name}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col span={11}>
                        <label htmlFor="">Insurance</label>
                        <select
                            style={{ width: "100%" }}
                            name="insurance_id"
                            className="form-control"
                            value={moveSingleData?.insurance_id}
                            required
                            onChange={(e: any) => handleChange(e)}
                        >
                            <option value="" selected disabled>
                                Select
                            </option>
                            {insurancesCLinic?.map((key: { id: any; name: any }) => (
                                <option value={key.id} key={key.id}>
                                    {key.name}
                                </option>
                            ))}
                        </select>
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}></Col>

                </Row>
            </Modal>
            <Modal title="Add Existing Insurance Details" open={isInsModalOpen} onOk={handleInsOk} onCancel={handleInsCancel}>
                <Row>
                    <Col span={8}><Text strong>Existing Insurance:</Text> </Col>
                    <Col span={16}><Text strong>{moveSingleData?.insurance_name}</Text></Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <label htmlFor="">Start Date</label>
                        <DatePicker
                            onChange={(e, dateString) =>
                                handleinsChanges("insurance_start_date", dateString)
                            }
                            className="form-control"
                            style={{ height: "32px" }}
                            value={moment(inputValues?.insurance_start_date)}
                            allowClear={false}
                            format={"MM/DD/YYYY"}
                            placeholder={"MM/DD/YYYY"}
                            name="insurance_start_date"
                        />
                    </Col>
                    <Col span={2}></Col>
                    <Col span={11}>
                        <label htmlFor="">End Date</label>
                        <DatePicker
                            onChange={(e, dateString) =>
                                handleinsChanges("insurance_end_date", dateString)
                            }
                            allowClear={false}
                            className="form-control"
                            style={{ height: "32px" }}
                            value={moment(inputValues?.insurance_end_date)}
                            format={"MM/DD/YYYY"}
                            placeholder={"MM/DD/YYYY"}
                            name="insurance_end_date"
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={11}>
                        <label htmlFor="">Status</label>
                        <select
                            style={{ width: "100%" }}
                            name="insurance_status"
                            className="form-control"
                            value={inputValues?.insurance_status ?? ""}
                            onChange={(e: any) => handleInsChangeStatus(e)}
                        >
                            <option value="" selected disabled>
                                Select
                            </option>
                            <option value="Active" >Active</option>
                            <option value="InActive" >InActive</option>
                        </select>
                    </Col>
                    <Col span={13}>

                    </Col>
                </Row>
            </Modal>
        </>
    );
}

export default PreProcessor;
