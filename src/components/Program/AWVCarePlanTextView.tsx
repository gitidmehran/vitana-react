import React, { useEffect } from "react";
import { Typography } from "antd";
import moment from "moment";
import { useState } from "react";
import {
    BpAssessmentType,
    CholestrolType,
    DepressionOutComesType,
    DiabetesType,
    ImmunizationType,
    PatientHeightWeightNextDueType,
    PatientRowDetailsType,
    PatientType,
    ProgramType,
    ScreeningType,
    WeightAssessmentType
} from "@/Types/CarePlan";
const { Text } = Typography;
interface AWVCarePlanTextViewProps {
    data: any;
}
const AWVCarePlanTextView: React.FC<AWVCarePlanTextViewProps> = ({ data }) => {

    const dateFormat = "MM/DD/YYYY";
    const [patient, setPatient] = useState<PatientType>({} as PatientType);
    const [program, setProgram] = useState<ProgramType>({} as ProgramType);
    const [patientHeightWeightNextDue, setPatientHeightWeightNextDue] = useState<PatientHeightWeightNextDueType>({} as PatientHeightWeightNextDueType);
    const [depressionoutcomes, setDepressionOutComes] = useState<DepressionOutComesType>({} as DepressionOutComesType);
    const [immunization, setImmunization] = useState<ImmunizationType>({} as ImmunizationType);
    const [screening, setScreening] = useState<ScreeningType>({} as ScreeningType);
    const [diabetes, setDiabetes] = useState<DiabetesType>({} as DiabetesType);
    const [cholestrol, setCholestrol] = useState<CholestrolType>({} as CholestrolType);
    const [bpAssessment, setBpAssessment] = useState<BpAssessmentType>({} as BpAssessmentType);
    const [weightAssessment, setWeightAssessment] = useState<WeightAssessmentType>({} as WeightAssessmentType);
    const [title, setTitle] = useState<string>("");
    const [patientRowDetails, setPatientRowDetails] = useState<PatientRowDetailsType>({} as PatientRowDetailsType);
    const nextYearDue = moment(patientHeightWeightNextDue?.next_year_due).format(
        "MM/YYYY"
    );
    useEffect(() => {
        fetchAWVCareplan();
    }, []);
    function fetchAWVCareplan() {
        setPatientHeightWeightNextDue(data);
        setDepressionOutComes(data.depression_out_comes);
        setImmunization(data.immunization);
        setScreening(data.screening);
        setDiabetes(data.diabetes);
        setCholestrol(data.cholesterol_assessment);
        setBpAssessment(data.bp_assessment);
        setWeightAssessment(data.weight_assessment);
        setPatientRowDetails(data.row);
        setPatient(data.row.patient);
        setProgram(data.row.program);
        setTitle("Care Plan");
    }

    return (
        <div className="container">
            <div className="card main-card">
                <div className="card-body">
                    <h3 className="main-heading ">
                        {program.short_name} {title}
                    </h3>
                    <div className="row">
                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4" style={{ cursor: 'pointer' }}>
                                Patient Name: <span className="text-primary">{patient?.name}</span>
                            </h6>
                        </div>
                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">
                                Date of Birth:
                                <>{moment(patient?.dob).format(dateFormat)}</>
                            </h6>
                        </div>

                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">Age: {patient?.age}</h6>
                        </div>

                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">Gender: {patient?.gender}</h6>
                        </div>

                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">
                                Primary care Physician:
                                {patientRowDetails?.primary_care_physician}
                            </h6>
                        </div>

                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">
                                Program: {program?.name} ({program?.short_name})
                            </h6>
                        </div>

                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">
                                Height: {patientHeightWeightNextDue?.height} in
                            </h6>
                        </div>

                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">
                                Weight: {patientHeightWeightNextDue?.weight} lbs
                            </h6>
                        </div>

                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">
                                Date of Service:
                                {moment(patientRowDetails?.date_of_service).format(
                                    "MM/DD/YYYY"
                                )}
                            </h6>
                        </div>

                        <div className="col-lg-3 md-3 sm-3">
                            <h6 className="d-inline ms-4">
                                Next Due:
                                {moment(patientHeightWeightNextDue?.next_year_due).format(
                                    dateFormat
                                )}
                            </h6>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div>
                PATIENT NAME: <Text strong>{patient?.name}</Text> <br />
                DATE OF BIRTH: <Text strong>{moment(patient?.dob).format(dateFormat)}</Text> <br />
                AGE: {patient?.age} <br />
                GENDER: <Text strong>{patient?.gender}</Text> <br />
                HEIGHT: <Text strong>{patientHeightWeightNextDue?.height}</Text> <br />
                IN WEIGHT:  <Text strong>{patientHeightWeightNextDue?.weight} LBS</Text>  <br />
                PROGRAM:  <Text strong>{program?.name} ({program?.short_name})</Text>  <br />
                PRIMARY CARE PHYSICIAN: <Text strong>{patientRowDetails?.primary_care_physician}</Text>  <br />
                NEXT DUE: <Text strong>{moment(patientHeightWeightNextDue?.next_year_due).format(dateFormat)}</Text>  <br />
                DATE OF SERVICE: <Text strong>{moment(patientRowDetails?.date_of_service).format("MM/DD/YYYY")}</Text>  <br />
            </div> */}

            <div className="card main-card">
                <div className="card-body">
                    <div className="mb-3">
                        <div><Text strong>Depression PHQ-9</Text></div>
                        Depression PHQ-9: {depressionoutcomes?.severity} {depressionoutcomes?.referrals} {depressionoutcomes?.referrals1} Next Due: {nextYearDue}
                    </div>

                    <div className="mb-3">
                        <div><Text strong>Immunization</Text></div>
                        Immunization: {immunization?.flu_vaccine} {immunization?.flu_vaccine_script} {immunization?.pneumococcal_vaccine} {immunization?.pneumococcal_vaccine_script}
                    </div>

                    <div className="mb-3">
                        <div><Text strong>Screening</Text></div>
                        Mammogram: {screening?.mammogram} {screening?.next_mammogram} {screening?.mammogram_script} {screening?.next_mammogram_date}
                    </div>

                    <div className="mb-3">
                        Colon Cancer:{screening?.colonoscopy !== undefined ? (
                            <>
                                {screening?.colonoscopy} <br />
                            </>
                        ) : null}
                        {screening?.next_colonoscopy !== undefined ? (
                            <>
                                {" "}
                                {screening?.next_colonoscopy} <br />{" "}
                            </>
                        ) : null}
                        {screening?.colonoscopy_script !== undefined ? (
                            <> {screening?.colonoscopy_script} </>
                        ) : null}

                        <strong>
                            {screening?.test_type ? (
                                <span>{screening?.test_type}:</span>
                            ) : (
                                ""
                            )}
                        </strong>
                        {screening?.next_col_fit_guard}
                    </div>

                    <div>
                        <div><Text strong>Metabolic Screening</Text></div>
                        {diabetes?.is_diabetic === "Yes" ? (<>
                            <div>
                                Diabetes: {diabetes?.diabetes}
                                <strong>HBA1C:</strong> {diabetes?.next_hba1c_date}
                            </div>
                            <div>
                                DM - Eye Examination: {diabetes?.diabetec_eye_exam}
                                {nextYearDue}
                            </div>
                            <div>
                                DM - Nephropathy: {diabetes?.nepropathy}
                                {nextYearDue}
                            </div>
                        </>) : (<>

                            <div>
                                Fasting Blood Sugar: {diabetes?.nepropathy} {diabetes?.diabetes} <strong>FBS:</strong> {diabetes?.next_fbs_date}
                            </div>
                            {typeof diabetes?.diabetec_eye_exam != "undefined" && (
                                <div>
                                    Eye Examination:{diabetes?.diabetec_eye_exam}
                                    {nextYearDue}
                                </div>
                            )}
                            {typeof diabetes?.nepropathy != "undefined" && (<>
                                <div>
                                    Nephropathy: {diabetes?.nepropathy}
                                    {nextYearDue}
                                </div>
                            </>)}
                        </>)}
                        <div>
                            Cholesterol: {cholestrol?.ldl_result} {cholestrol?.outcome} {cholestrol?.ldl_next_due}
                        </div>
                        <div>
                            BP Assessment: {bpAssessment?.bp_result} {bpAssessment?.outcome}
                            {nextYearDue}
                        </div>
                        <div>
                            Weight Assessment: {weightAssessment?.bmi_result} {weightAssessment?.outcome} {nextYearDue}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AWVCarePlanTextView;
