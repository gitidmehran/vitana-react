import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/hooks";
import { PatientType } from "@/Types/PatientType";
import ProgramType from "@/Types/ProgramType";
import {
  setDateofService,
  setdiagnosis,
  setLoader,
  setProgramId,
  setQuestionId,
} from "../../../../store/reducer/QuestionairesReducer";
import { getCCMGeneralCarePlan } from "../../../../actions/AwvCarePlan/AwvCarePlanActions";
import { RootState } from "../../../../store/store";
import { DatePicker, Spin } from "antd";
import {
  CaregiverAssesmentType,
  CognitiveAssessmentType,
  DepressionOutComesType,
  FallScreeningType,
  GeneralAssessmentType,
  ObesityType,
  CopdAssessmentType,
  DiabetesMellitusType,
  HypertensionType,
  ChfAssessmentType,
  ImmunizationType,
  OtherProviderType,
  PatientRowDetailsType,
  ScreeningType,
  CkdAssessmentType,
  HypercholesterolemiaType,
  chronicDiseasesType,
} from "@/Types/CarePlan";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";

const CCMEncounterCarePlan = ({ questionIds }: { questionIds: any }) => {
  const { questionId, loading, programmId } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );

  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);

  const [signer, setsigner] = useState<any>();
  const [docid, setDocid] = useState<any>();
  const [signed_date, setSigned_date] = useState<any>();
  const [showbutton, setShowbutton] = useState<any>(false);
  const [showtext, setshowtext] = useState<any>(false);
  const [questio, setQuestio] = useState<any>();
  const [value, setvalue] = useState<any>("");

  const [patientRowDetails, setPatientRowDetails] =
    useState<PatientRowDetailsType>({} as PatientRowDetailsType);

  const [fallscreening, setFallScreening] = useState<FallScreeningType>(
    {} as FallScreeningType
  );
  const [title, setTitle] = useState<string>("");

  const [depressionphq9, setDepressionOutComes] =
    useState<DepressionOutComesType>({} as DepressionOutComesType);
  const [cognitiveAssessment, setCognitiveAssessment] =
    useState<CognitiveAssessmentType>({} as CognitiveAssessmentType);
  const [caregiveAssessment, setCaregiveAssessment] =
    useState<CaregiverAssesmentType>({} as CaregiverAssesmentType);
  const [otherProvider, setOtherProvider] = useState<OtherProviderType>(
    {} as OtherProviderType
  );
  const [copd, setCopd] = useState<CopdAssessmentType>(
    {} as CopdAssessmentType
  );
  const [ckd, setCkd] = useState<CkdAssessmentType>({} as CkdAssessmentType);
  const [chf, setChf] = useState<ChfAssessmentType>({} as ChfAssessmentType);
  const [immunization, setImmunization] = useState<ImmunizationType>(
    {} as ImmunizationType
  );
  const [screening, setScreening] = useState<ScreeningType>(
    {} as ScreeningType
  );
  const [generalAssessment, setGeneralAssessment] =
    useState<GeneralAssessmentType>({} as GeneralAssessmentType);
  const [obesity, setObesity] = useState<ObesityType>({} as ObesityType);
  const [hypertension, setHypertension] = useState<HypertensionType>(
    {} as HypertensionType
  );
  const [hypercholesterolemia, setHypercholesterolemia] =
    useState<HypercholesterolemiaType>({} as HypercholesterolemiaType);
  const [diabetes, setDiabetes] = useState<DiabetesMellitusType>(
    {} as DiabetesMellitusType
  );
  const [chronicDisease, setChronicDisease] = useState<chronicDiseasesType>(
    {} as chronicDiseasesType
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchccmgeneralCareplan();
  }, []);

  useEffect(() => {
    if (signed_date && docid) {
      setshowtext(true);
      setShowbutton(false);
    } else {
      if (signer && signed_date === null) {
        setShowbutton(true);
        setshowtext(false);
      }
    }
    fetchccmgeneralCareplan();
  }, [showbutton, showtext, signer, signed_date, value]);

  function fetchccmgeneralCareplan() {
    dispatch(setLoader(true));
    getCCMGeneralCarePlan(questionIds, value).then(({ data: response }) => {
      dispatch(setLoader(false));
      dispatch(setDateofService(response.row?.date_of_service));
      dispatch(setdiagnosis(response?.diagnosis));

      /* General Data */
      setTitle("Care Plan");
      setPatient(response.row.patient);
      setQuestio(response.row);
      setChronicDisease(response.chronic_disease);
      setPatientRowDetails(response.row);
      setProgram(response.row.program);
      setsigner(response.row.signer_doctor);
      setSigned_date(response.row.signed_date);
      setDocid(response.row.doctor_id);

      /* Careplan Data */
      setFallScreening(response.fall_screening);
      setDepressionOutComes(response.depression_out_comes);
      setCognitiveAssessment(response.cognitive_assessment);
      setCaregiveAssessment(response.caregiver_assesment_outcomes);
      setOtherProvider(response.other_providers_outcome);
      setImmunization(response.immunization);
      setScreening(response.screening);
      setGeneralAssessment(response.general_assessment_outcomes);
      setHypertension(response.hypertension_outcomes);
      setHypercholesterolemia(response.hypercholestrolemia_outcomes);
      setObesity(response.obesity_outcomes);
      setCopd(response.copd_outcomes);
      setCkd(response.ckd_outcomes);
      setChf(response.chf_outcomes);
      setDiabetes(response.diabetes_outcome);
    });
  }

  const navigate = useNavigate();

  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const handlestep = (questionId: any, programid: any, step: any) => {
    dispatch(setProgramId(programid));
    dispatch(setQuestionId(questionId));
    navigate(`/questionaire/edit/${questionId}`, {
      state: {
        step: step,
        id: questionId,
        age: patient.age,
        name: patient.name,
        dob: patient.dob,
        gender: patient.gender,
        insurance_name: patient.insurance_name,
      },
    });
  };

  const dateFormat = "MM/DD/YYYY";
  const monthFormat = "YYYY/MM";

  const nextDue = moment().add(1, 'y').startOf('year').format(dateFormat);

  const onChange = (name: any, value: any) => {
    const string = value.replace(/^.{5}/g, "");

    setvalue({ [name]: string });
  };
  return (
    <>
      <Spin spinning={loading} indicator={antIcon}>
        <div className="card main-card">
          <div className="card main-card">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 col-lg-6">
                  <h3 className="main-heading ">
                    {program.short_name} {title}
                  </h3>
                </div>
                <div className="col-md-6 col-lg-6 text-right">
                  <DatePicker
                    style={{ borderColor: "#1890ff" }}
                    status="warning"
                    onChange={(e, dateString) =>
                      onChange("filter_month", dateString)
                    }
                    format={monthFormat}
                    picker="month"
                    placeholder="Filter by Month"
                    size="large"
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Patient Name: {patient?.name}
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Date of Birth:
                    <>{moment(patient?.dob).format(dateFormat)}</>
                  </h6>
                </div>

                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">Gender: {patient?.gender}</h6>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Primary care Physician:
                    {patientRowDetails?.primary_care_physician}
                  </h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Next Due: {nextDue}
                  </h6>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">Age: {patient?.age}</h6>
                </div>
                <div className="col-lg-3 md-3 sm-3">
                  <h6 className="d-inline ms-4">
                    Date of Service:
                    {moment(patientRowDetails?.date_of_service).format(
                      "MM/DD/YYYY"
                    )}
                  </h6>
                </div>
                {showtext && (
                  <h6 className="m-3">
                    <b>
                      This careplan is electronically signed by{" "}
                      {questio?.doctor} on{" "}
                      {moment(signed_date).format("MM/DD/YYYY")}
                    </b>
                  </h6>
                )}
              </div>
            </div>
          </div>
          <div className="card-body">
            <table className="table table-light">
              <tbody>
                {/* <!--PHYSICAL HEALTH STARTS --> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Physical Activity
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer", width: "100px" }}
                    onClick={() => handlestep(questionId, programmId, 1)}
                  >
                    Physical Health - <br /> Fall Screening
                  </th>
                  <td>{fallscreening?.outcome}</td>
                </tr>
                {/* <!--PHYSICAL HEALTH ENDS --> */}

                {/* <!--Cognitive Assessment--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Cognitive Assessment
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 3)}
                  >
                    Cognitive Assessment
                  </th>
                  <td width="80%">{cognitiveAssessment?.outcome}</td>
                </tr>
                {/* <!--Cognitive Assessment ENDS--> */}
                {/* <!--Caregiver Assessment--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Caregiver Assessment
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 4)}
                  >
                    Caregiver Assessment
                  </th>
                  <td width="80%">
                    {caregiveAssessment?.every_day_activities} <br />
                    {caregiveAssessment?.medications}
                  </td>
                </tr>
                {/* <!--Caregiver Assessment ENDS--> */}
                {/* <!--Other Providers--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Other Providers
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 5)}
                  >
                    Other Providers
                  </th>
                  <td width="80%">
                    {otherProvider?.other_provider_beside_pcp}
                  </td>
                </tr>
                {/* <!--Other Providers ENDS--> */}
                {/* <!--Immunization--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Immunization
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 6)}
                  >
                    Immunization
                  </th>
                  <td width="80%">
                    {immunization?.flu_vaccine}
                    <br />
                    {immunization?.flu_vaccine_script}
                    <br />
                    {immunization?.pneumococcal_vaccine}
                    <br />
                    {immunization?.pneumococcal_vaccine_script}
                  </td>
                </tr>
                {/* <!--Immunization ENDS--> */}
                {/* <!--Screening--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    Screening
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 7)}
                  >
                    Mammogram
                  </th>
                  <td width="80%">
                    {screening?.mammogram}
                    <br />
                    {screening?.next_mammogram}
                    <br />
                    {screening?.mammogram_script}
                  </td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 7)}
                  >
                    Colon Cancer
                  </th>
                  <td width="80%">
                    {screening?.colonoscopy}
                    <br />
                    {screening?.next_colonoscopy}
                    <br />
                    {screening?.colonoscopy_script}
                    <br />
                  </td>
                </tr>
                {/* <!--Screening ENDS--> */}
                {/* <!--General Assessment--> */}
                <tr>
                  <th colSpan={12} className="text-center table-primary">
                    General Assessment
                  </th>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 8)}
                  >
                    Medication Reconciliation
                  </th>
                  <td width="80%">{generalAssessment?.is_taking_medication}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 8)}
                  >
                    Tobacco Usage
                  </th>
                  <td width="80%">{generalAssessment?.is_consuming_tobacco}</td>
                </tr>
                <tr>
                  <th
                    scope="row"
                    className="text-nowrap"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlestep(questionId, programmId, 8)}
                  >
                    Physical Exercise
                  </th>
                  <td colSpan={12}>
                    {generalAssessment?.physical_exercise_level}
                  </td>
                </tr>
                <tr>
                  <th colSpan={9} className="text-center table-primary">
                    General Assessment Goals
                  </th>
                  <th colSpan={1} className="text-center table-primary">
                    Start Date
                  </th>
                  <th colSpan={1} className="text-center table-primary">
                    End Date
                  </th>
                  <th colSpan={1} className="text-center table-primary">
                    Status
                  </th>
                </tr>
                <tr>
                  <td
                    colSpan={9}
                    className="text-dark font-weight-bold"
                    width="70%"
                  >
                    Instructed on Importance of Hand Washing
                  </td>
                  <td
                    colSpan={1}
                    width="10%"
                    className="text-center text-dark pr-0"
                  >
                    {generalAssessment?.imp_handwash_start_date}
                  </td>
                  <td
                    colSpan={1}
                    width="10%"
                    className="text-center text-dark pr-0"
                  >
                    {generalAssessment?.imp_handwash_end_date}
                  </td>
                  <td
                    colSpan={1}
                    width="10%"
                    className="text-center text-dark pr-0"
                  >
                    {generalAssessment?.imp_handwash_status}
                  </td>
                </tr>
                {/* <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Patient shows understanding of Importance of Hand Washing
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.und_handwash_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.und_handwash_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.und_handwash_status}
                  </td>
                </tr> */}
                <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Instructed on how washing with Soap remove germs
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.washwithsoap_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.washwithsoap_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.washwithsoap_status}
                  </td>
                </tr>
                {/* <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Patient shows understanding on how washing with Soap remove
                    germs
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.und_washhands_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.und_washhands_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.und_washhands_status}
                  </td>
                </tr> */}
                <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Instructed on proper way to turn off the faucet
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.turnoff_faucet_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.turnoff_faucet_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.turnoff_faucet_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Patient shows understanding on proper way to turn off the
                    faucet
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.understand_faucet_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.understand_faucet_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.understand_faucet_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Patient shows understanding of using plain Soap
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.plain_soap_usage_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.plain_soap_usage_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.plain_soap_usage_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Is Bar Soap or Liquid Soap better?
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.bar_or_liquid_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.bar_or_liquid_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.bar_or_liquid_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Patient shows understanding about importance of plain soap
                    in any form
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.uips_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.uips_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.uips_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    What if there is no Soap?
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.no_soap_condition_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.no_soap_condition_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.no_soap_condition_status}
                  </td>
                </tr>
                <tr>
                  <td colSpan={9} className="text-dark font-weight-bold">
                    Patient shows understanding about Hand Sanitizer
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.understand_hand_sanitizer_start_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.understand_hand_sanitizer_end_date}
                  </td>
                  <td colSpan={1} className="text-center text-dark pr-0">
                    {generalAssessment?.understand_hand_sanitizer_status}
                  </td>
                </tr>
                {/* <!--General Assessment ENDS--> */}

                {/* <!-- MENTAL HEALTH STARTS --> */}
                {chronicDisease.Depression === true ? (
                  <>
                    {/* <tr>
                      <th colSpan={12} className="text-center table-primary" >
                        Mental Health
                      </th>
                    </tr>

                    <tr>
                      <th colSpan={1} style={{ paddingLeft: "2px" }}>
                        Prognosis
                      </th>
                      <td style={{ textAlign: "left" }}>
                        {depressionphq9?.prognosis}
                      </td>
                    </tr>

                    <tr>
                      <th colSpan={1} style={{ paddingLeft: "2px" }}>
                        Assessment
                      </th>
                      <td style={{ textAlign: "left" }}>
                        {depressionphq9?.assessment}
                      </td>
                    </tr> */}

                    {/* Depression PHQ-9 Goals */}
                    <tr>
                      <th colSpan={9} className="text-center table-primary">
                        Depression Goals
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Start Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        End Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Status
                      </th>
                    </tr>

                    {/* GOAL 1 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To acquire knowledge about depression and how it can affect you.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.goal1_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Assess the patient’s current knowledge and understanding regarding disease </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.understand_about_disease_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.understand_about_disease_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.understand_about_disease_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Monitor PHQ-9 levels of patients </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.monitor_phq9_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.monitor_phq9_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.monitor_phq9_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> ADVANTAGES OF THE PHQ-9 </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.advantages_of_phq9_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.advantages_of_phq9_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.advantages_of_phq9_status}
                      </td>
                    </tr>
                    {/* GOAL 1 ENDS */}

                    {/* GOAL 2 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To understand the effect of depression on overall health.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.goal2_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Understanding depression relationship with other medical problems </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.effect_with_other_problems_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.effect_with_other_problems_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.effect_with_other_problems_status}
                      </td>
                    </tr>
                    {/* GOAL 2 ENDS */}

                    {/* GOAL 3 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To understand the importance of different approaches that are used to treat depression.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.goal3_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Understanding Counseling (with a psychiatrist, psychologist, nurse, or social worker) & medicines that relieve depression </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.relieve_depression_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.relieve_depression_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.relieve_depression_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Understanding CBT </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.understand_cbt_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.understand_cbt_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.understand_cbt_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Importance of Physical activity </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.physical_activity_importance_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.physical_activity_importance_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.physical_activity_importance_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Understanding treatments that pass magnetic waves or electricity into the brain </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.waves_treatment_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.waves_treatment_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.waves_treatment_status}
                      </td>
                    </tr>
                    {/* GOAL 3 ENDS */}

                    {/* GOAL 4 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To understand the importance of changes to your habits and lifestyle to treat depression.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.goal4_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Exercise a specific number of days per week </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.exercise_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.exercise_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.exercise_status}
                      </td>
                    </tr>
                    {/* GOAL 4 ENDS */}

                    {/* GOAL 5 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To understand the importance of regular follow-ups
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.goal5_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>  </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.regular_follow_ups_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.regular_follow_ups_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.regular_follow_ups_status}
                      </td>
                    </tr>
                    {/* GOAL 5 ENDS */}

                    {/* GOAL 6 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To understand what to do if you are having thoughts of harming yourself.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.goal6_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>  </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.helping_guides_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.helping_guides_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.helping_guides_status}
                      </td>
                    </tr>
                    {/* GOAL 6 ENDS */}

                    {/* GOAL 7 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To utilize counseling/group support
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.goal7_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> To improve your relationships with other people can help to lower your risk of being affected by depression. </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.improve_relations_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.improve_relations_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.improve_relations_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> To take part in therapy on a regular basis not only lets you receive the mental health benefits of psychotherapy, but it can also help create a routine in your life. </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.psychotherapy_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.psychotherapy_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {depressionphq9?.psychotherapy_status}
                      </td>
                    </tr>
                    {/* GOAL 7 ENDS */}
                  </>
                ) : null}
                {/* <!-- MENTAL HEALTH ENDS --> */}

                {/* Obesity Starts */}
                {chronicDisease.Obesity === true ? (
                  <>
                    <tr>
                      <th colSpan={9} className="text-center table-primary">
                        Obesity Goals
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Start Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        End Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Status
                      </th>
                    </tr>

                    {/* Goal 1  */}
                    <>
                      <tr>
                        <td colSpan={9} className="text-dark font-weight-bold">
                          Assessment of patient knowledge on Obesity, BMI and its effect on overall health.
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0"></td>
                        <td colSpan={1} className="text-center text-dark pr-0"></td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.goal1_status}
                        </td>
                      </tr>

                      {/* Task 1 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              To gain education and awareness about BMI and current BMI range.
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.bmi_awareness_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.bmi_awareness_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.bmi_awareness_status}
                        </td>
                      </tr>

                      {/* Task 2 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              To understand how your weight affects your health.
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_effect_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_effect_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_effect_status}
                        </td>
                      </tr>

                      {/* Task 3 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              To understand the importance of maintaining a healthy weight
                            </b>

                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.maintain_healthy_weight_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.maintain_healthy_weight_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.maintain_healthy_weight_status}
                        </td>
                      </tr>

                      {/* Task 4 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              Understanding the effectiveness of different advertised diets
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.advertised_diets_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.advertised_diets_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.advertised_diets_status}
                        </td>
                      </tr>

                      {/* Task 5 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              Understanding the effectiveness of exercise and healthy habits
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.healthy_habits_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.healthy_habits_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.healthy_habits_status}
                        </td>
                      </tr>
                    </>
                    {/* Goal 1 Ends */}

                    {/* Goal 2 */}
                    <>
                      <tr>
                        <td colSpan={9} className="text-dark font-weight-bold">
                          Assess knowledge on weight loss techniques and make a plan on working on weight loss with lifestyle changes and other measures.
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0"></td>
                        <td colSpan={1} className="text-center text-dark pr-0"></td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.goal2_status}
                        </td>
                      </tr>

                      {/* Task 1 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              To educate patient on starting a weight loss program.
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_loss_program_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_loss_program_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_loss_program_status}
                        </td>
                      </tr>

                      {/* Task 2 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              Importance of BMI in Weight Loss Programs
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.bmi_importance_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.bmi_importance_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.bmi_importance_status}
                        </td>
                      </tr>

                      {/* Task 3 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              Importance of waist circumference in weight loss
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.waist_circumference_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.waist_circumference_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.waist_circumference_status}
                        </td>
                      </tr>

                      {/* Task 4 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              Different type of treatments to lose weight
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.treatment_type_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.treatment_type_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.treatment_type_status}
                        </td>
                      </tr>

                      {/* Task 5 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              To understand the importance of setting weight loss goals.
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_loss_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_loss_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weight_loss_status}
                        </td>
                      </tr>

                      {/* Task 6 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              To understand the importance of “triggers” for eating.
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.eating_triggers_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.eating_triggers_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.eating_triggers_status}
                        </td>
                      </tr>

                      {/* Task 7 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              Understand healthy and un-healthy food
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.healthy_unhealthy_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.healthy_unhealthy_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.healthy_unhealthy_status}
                        </td>
                      </tr>

                      {/* Task 8 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              Understand different factors when losing weight
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weightloss_factors_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weightloss_factors_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.weightloss_factors_status}
                        </td>
                      </tr>

                      {/* Task 9 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              How many calories do I need?
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.calories_needed_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.calories_needed_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.calories_needed_status}
                        </td>
                      </tr>

                      {/* Task 10 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              Are meal replacement plans good to count calories?
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.calories_count_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.calories_count_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.calories_count_status}
                        </td>
                      </tr>

                      {/* Task 11 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              How to reduce fat in your diet?
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.reduce_fat_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.reduce_fat_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.reduce_fat_status}
                        </td>
                      </tr>

                      {/* Task 12 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              How to reduce Carbohydrate in your diet?
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.reduce_carbs_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.reduce_carbs_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.reduce_carbs_status}
                        </td>
                      </tr>

                      {/* Task 13 */}
                      <tr>
                        <td colSpan={9}>
                          <p className="question-text mt-2 pl-5">
                            <b>
                              What is a Mediterranean diet?
                            </b>
                          </p>
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.mediterranean_diet_start_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.mediterranean_diet_end_date}
                        </td>
                        <td colSpan={1} className="text-center text-dark pr-0">
                          {obesity?.mediterranean_diet_status}
                        </td>
                      </tr>
                    </>
                    {/* Goal 2 Ends */}

                    {/* Goal 3 Starts */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Assess Knowledge on Weight loss medications and supplements.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.goal3_status}
                      </td>
                    </tr>

                    {/* Tasks 1 */}
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            To educate on weight loss medications.
                          </b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.weightloss_medication_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.weightloss_medication_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.weightloss_medication_status}
                      </td>
                    </tr>

                    {/* Task 2 */}
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            To educate patient on Dietary supplements.
                          </b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.dietary_supplements_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.dietary_supplements_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.dietary_supplements_status}
                      </td>
                    </tr>

                    {/* Task 3 */}
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            To educate on other weight loss methods.
                          </b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.weightloss_method_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.weightloss_method_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.weightloss_method_status}
                      </td>
                    </tr>

                    {/* Task 3 */}
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            To understand the importance of seeing a Dietitian.
                          </b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.seeing_dietitian_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.seeing_dietitian_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {obesity?.seeing_dietitian_status}
                      </td>
                    </tr>
                  </>
                ) : null}
                {/* Obesity Ends */}

                {/* COPD Assessment Starts */}
                {chronicDisease.ChronicObstructivePulmonaryDisease === true ? (
                  <>
                    <tr>
                      <th colSpan={9} className="text-center table-primary">
                        COPD Goals
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Start Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        End Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Status
                      </th>
                    </tr>

                    {/* GOAL 1 Starts */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Provide education on COPD.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.goal1_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            To educate the patient of symptoms and complications of COPD.
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_disease_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_disease_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_disease_status}
                      </td>
                    </tr>
                    {/* GOAL 1 ENDS */}


                    {/* GOAL 2 Starts */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Smoking Cessation.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.goal2_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            To educate patients on the importance of smoking cessation (if applicable) for better COPD management.
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.smoking_cessation_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.smoking_cessation_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.smoking_cessation_status}
                      </td>
                    </tr>
                    {/* GOAL 2 Ends */}

                    {/* GOAL 3 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Lowering Risk of Infection
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.goal3_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            To educate the patient on lowering the risk of infections.
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.lowering_infection_risk_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.lowering_infection_risk_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.lowering_infection_risk_status}
                      </td>
                    </tr>
                    {/* GOAL 3 ENDS */}

                    {/* GOAL 4 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Lifestyle changes that can help with COPD.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.goal4_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>To educate the patient on lifestyle changes.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_lifestyle_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_lifestyle_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_lifestyle_status}
                      </td>
                    </tr>
                    {/* GOAL 4 STARTS */}

                    {/* GOAL 5 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Know when it is an emergency.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.goal5_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>To educate the patient on when to contact emergency services</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_emergency_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_emergency_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.educate_on_emergency_status}
                      </td>
                    </tr>
                    {/* GOAL 5 STARTS */}

                    {/* GOAL 6 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Know when you are having a COPD flare.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.goal6_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>To educate patients on COPD flare.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.having_copd_flare_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.having_copd_flare_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.having_copd_flare_status}
                      </td>
                    </tr>
                    {/* GOAL 6 STARTS */}

                    {/* GOAL 7 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Prevention of COPD flare.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.goal7_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>To educate the patient on the prevention of COPD flare.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.prevention_copd_flare_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.prevention_copd_flare_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.prevention_copd_flare_status}
                      </td>
                    </tr>
                    {/* GOAL 7 STARTS */}

                    {/* GOAL 8 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Understand the importance of treatment adherence and regular follow-ups.
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.goal8_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>To educate the patient on the importance of treatment adherence and regular follow-ups with PCP and Pulmonologist.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.followup_imp_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.followup_imp_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {copd?.followup_imp_status}
                      </td>
                    </tr>
                    {/* GOAL 8 STARTS */}

                  </>
                ) : null}
                {/* COPD ASSESSMENT ENDS */}

                {/* CKD Assessment STARTS */}
                {chronicDisease.CKD === true ? (
                  <>
                    <tr>
                      <th colSpan={9} className="text-center table-primary">
                        CKD Goals
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Start Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        End Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Status
                      </th>
                    </tr>

                    {/* GOAL 1 STARTS */}
                    <tr>
                      <td className="text-dark" colSpan={9}>
                        <b>
                          Assess patient knowledge on CKD and its complications and educate on steps to prevent worsening of renal function.
                        </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.goal1_status}
                      </td>
                    </tr>

                    {/* TASKS */}
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate patient on CKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_ckd_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_ckd_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_ckd_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate patient on symptoms of worsening CKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.worsening_symptoms_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.worsening_symptoms_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.worsening_symptoms_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To understand the importance of follow up with PCP and nephrologist if needed for management of CKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.followup_importance_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.followup_importance_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.followup_importance_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To understand what the patient can do to prevent worsening of kidney function.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.prevent_worsening_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.prevent_worsening_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.prevent_worsening_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To learn about the medication that you should avoid
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.aviod_medications_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.aviod_medications_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.aviod_medications_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To understand how CKD is treated and importance of treatment compliance.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.ckd_treatment_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.ckd_treatment_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.ckd_treatment_status}
                      </td>
                    </tr>
                    {/* GOAL 1 ENDS */}

                    {/* GOAL 2 STARTS */}
                    <tr>
                      <td className="text-dark" colSpan={9}>
                        <b>
                          Assess patient knowledge on risk factors of CKD and ways to prevent developing CKD.
                        </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.goal2_status}
                      </td>
                    </tr>

                    {/* TASKS */}
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate on factors that can increase risk of developing CKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_risk_factors_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_risk_factors_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_risk_factors_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate patient on lowering the risk of CKD development and rate of CKD progression.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_lowering_risk_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_lowering_risk_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_lowering_risk_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          Understanding effects of Hypertension on Kidneys
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hypertension_effects_risk_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hypertension_effects_risk_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hypertension_effects_risk_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To understand healthy diet for Kidneys
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.healthy_diet_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.healthy_diet_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.healthy_diet_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To understand effect of Protein on Kidneys
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.protein_effects_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.protein_effects_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.protein_effects_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To understand health effects of elevated Cholesterol and triglycerides with CKD
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.elevated_cholesterol_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.elevated_cholesterol_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.elevated_cholesterol_status}
                      </td>
                    </tr>
                    {/* GOAL 2 ENDS */}

                    {/* GOAL 3 STARTS */}
                    <tr>
                      <td className="text-dark" colSpan={9}>
                        <b>
                          Assess patient knowledge on Diabetic Kidney Disease.
                        </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.goal3_status}
                      </td>
                    </tr>

                    {/* TASKS */}
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate patient on DKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_dkd_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_dkd_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.educate_on_dkd_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate patient on DKD symptoms.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_symptoms_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_symptoms_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_symptoms_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate patient on risk factors of DKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_risk_factors_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_risk_factors_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_risk_factors_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate patient on prevention of progression of DKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_progression_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_progression_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.dkd_progression_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate the effect of healthy lifestyle on DKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.healthy_lifestyle_effect_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.healthy_lifestyle_effect_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.healthy_lifestyle_effect_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate the effect of controlling blood sugar.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.blood_sugar_control_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.blood_sugar_control_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.blood_sugar_control_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate importance of HBA1C.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hba1c_importance_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hba1c_importance_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hba1c_importance_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate how to bring blood sugars under control.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.control_blood_sugar_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.control_blood_sugar_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.control_blood_sugar_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate the effect of Blood Pressure on DKD.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.bp_effect_on_dkd_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.bp_effect_on_dkd_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.bp_effect_on_dkd_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate about the treatment of Hypertension.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hypertension_treatment_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hypertension_treatment_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.hypertension_treatment_status}
                      </td>
                    </tr>
                    {/* GOAL 3 ENDS */}

                    {/* GOAL 4 STARTS */}
                    <tr>
                      <td className="text-dark" colSpan={9}>
                        <b>
                          Assess knowledge of association between CKD and Cardiovascular disease.
                        </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.goal4_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          To educate patient on association between CKD and heart disease.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.ckd_heart_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.ckd_heart_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {ckd?.ckd_heart_status}
                      </td>
                    </tr>
                    {/* GOAL 4 ENDS */}
                  </>
                ) : null}
                {/* CKD Assessment ENDS */}

                {chronicDisease.CongestiveHeartFailure === true ? (
                  <>
                    <tr>
                      <th colSpan={9} className="text-center table-primary">
                        CHF Goals
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Start Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        End Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Status
                      </th>
                    </tr>

                    <tr>
                      <td colSpan={9} className="text-dark">
                        <b>
                          To acquire knowledge about congestive heart failure
                          and how it can affect you
                        </b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.goal1_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            Assess the patient's current knowledge and
                            understanding regarding disease
                          </b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.understanding_regarding_disease_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.understanding_regarding_disease_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.understanding_regarding_disease_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>Monitor blood pressure levels of patients</b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.monitor_blood_pressure_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.monitor_blood_pressure_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.monitor_blood_pressure_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>Monitor ECG levels of patients</b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.monitor_ECG_levels_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.monitor_ECG_levels_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.monitor_ECG_levels_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9} className="text-dark">
                        <b>
                          To closely monitor the signs and symptoms to mitigate
                          the chances or relapse.
                        </b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.goal2_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            Patient will demonstrate adequate cardiac output as
                            evidenced by vital signs within acceptable limits,
                            dysrhythmias absent/controlled, and no symptoms of
                            failure (e.g., hemodynamic parameters within
                            acceptable limits, urinary output adequate)
                          </b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.adequate_cardiac_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.adequate_cardiac_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.adequate_cardiac_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            MONITOR Symptoms like Cerebral hypoperfusion occurs
                            because of hypoxia to the brain from the decreased
                            cardiac output. The patient may report this as
                            confusion, forgetfulness, restlessness. Through
                            assessment is necessary to evaluate for possible
                            related conditions, including psychologic disorders.
                            Depression is common among patients with heart
                            failure and can lead to poor adherence to treatment
                            plans.
                          </b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.cerebral_hypoperfusion_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.cerebral_hypoperfusion_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.cerebral_hypoperfusion_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9} className="text-dark">
                        <b>To assess the signs of respiratory distress</b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.goal3_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            Give awareness to patient regarding pulmonary
                            hygiene as needed
                          </b>
                          <br />
                          Pulmonary hygiene, refers to exercises and procedures
                          that help to clear your airways of mucus and other
                          secretions. This ensures that your lungs get enough
                          oxygen, and your respiratory system works efficiently.
                          There are several pulmonary hygiene methods and
                          approaches. Some can be done on your own at home,
                          while others require a visit to your healthcare
                          provider like breathing exercise, relaxed breathing,
                          Huffing=This exercise requires you to “huff” by
                          breathing hard out of your mouth, as though you were
                          creating fog on a mirror. Spirometry, This method of
                          strengthening and controlling your breathing uses a
                          device called an incentive spirometer.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.pulmonary_hygiene_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.pulmonary_hygiene_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.pulmonary_hygiene_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            Keep the head of the bed elevated in case of
                            respiratory distress
                          </b>
                          <br />
                          Head-end elevation is known to improve oxygenation and
                          respiratory mechanics. In poor lung compliance limits
                          positive pressure ventilation causing delivery of
                          inadequate minute ventilation (MVe). We observed that,
                          in moderate-to-severe cases, the respiratory system
                          compliance reduces upon elevating the head-end of the
                          bed, and vice-versa, which can be utilized to improve
                          ventilation and avoid respiratory distress.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.respiratory_distress_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.respiratory_distress_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.respiratory_distress_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>Monitor ABG levels of patients</b>
                          <br />
                          Your lungs and your kidneys do much of the work to
                          keep your acid-base balance normal. So, the acid-base
                          measurement from an ABG test can help diagnose and
                          monitor conditions that affect your lungs and kidneys
                          as well as many other conditions that may upset your
                          acid-base balance.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.monitor_ABG_levels_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.monitor_ABG_levels_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.monitor_ABG_levels_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9} className="text-dark">
                        <b>
                          To understand the importance of Monitoring signs of
                          altered cardiac output, including
                        </b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.goal4_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>Monitoring of Pulmonary edemas</b>
                          <br />
                          Pulmonary edema is a condition caused by too much
                          fluid in the lungs. This fluid collects in the many
                          air sacs in the lungs, making it difficult to breathe.
                          It needs to be monitor by feeling any difficulty in
                          respiration.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.pulmonary_edemas_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.pulmonary_edemas_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.pulmonary_edemas_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            Assess conditions of Arrhythmias, including extreme
                            tachycardia and bradycardia
                          </b>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.conditions_of_Arrhythmias_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.conditions_of_Arrhythmias_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.conditions_of_Arrhythmias_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <b>
                            Check ECG and heart sound changes in every
                            cardiologist visit.
                          </b>
                          <br />
                          The electrocardiogram (ECG) at rest is a non-invasive
                          investigation that is recommended in the initial
                          evaluation of patients with heart failure (HF). This
                          is because the ECG is crucial in the detection of many
                          abnormalities that may either cause or worsen HF.
                          Therefore it is important to evaluate any changes in
                          your heart sound by ECG (ELECTRO CARDIO GRAM).
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.cardiologist_visit_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.cardiologist_visit_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.cardiologist_visit_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9} className="text-dark">
                        <b>
                          Demonstrate stabilized fluid volume with balanced
                          intake and output, breath sounds clear/clearing, vital
                          signs within acceptable range, stable weight, and
                          absence of edema.
                        </b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.goal5_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          Evaluate fluid status by Monitor daily weights Assess
                          for edema and severe diaphoresis Monitor electrolyte
                          values and hematocrit level Verbalize understanding of
                          individual dietary/fluid restrictions.
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.fluid_status_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.fluid_status_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.fluid_status_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9} className="text-dark">
                        <b>
                          Identify relationship of ongoing therapies (treatment
                          program) to reduction of recurrent episodes and
                          prevention of complications.
                        </b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.goal6_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          Antiarrhythmias to increase cardiac performance
                          Diuretics, to reduce venous and systemic congestion
                          Iron and folic acid supplements to improve nutritional
                          status Angiotensin-converting enzyme (ACE)
                          inhibitors.These drugs relax blood vessels to lower
                          blood pressure, improve blood flow and decrease the
                          strain on the heart. Beta blockers.These drugs slow
                          your heart rate and reduce blood pressure. Beta
                          blockers may reduce signs and symptoms of heart
                          failure, improve heart function. Digoxin
                          (Lanoxin).This drug, also called digitalis, increases
                          the strength of your heart muscle contractions
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.antiarrhythmias_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.antiarrhythmias_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.antiarrhythmias_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9} className="text-dark">
                        <b>
                          To understand the importance of regular follow-up with
                          PCP and cardiologist.
                        </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.followup_pcp_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.followup_pcp_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.followup_pcp_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9} className="text-dark">
                        <b>
                          To recognize the importance of discipline in taking
                          all medications as prescribed.
                        </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.importance_medication_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {chf?.importance_medication_end_date}
                      </td>
                      <td
                        colSpan={1}
                        className="text-nowrap text-center text-dark pr-0"
                      >
                        {chf?.importance_medication_status}
                      </td>
                    </tr>
                  </>
                ) : null}

                {/* Hypertension STARTS */}
                {chronicDisease.Hypertensions === true ? (
                  <>
                    <tr>
                      <th colSpan={9} className="text-center table-primary">
                        Hypertension Goals
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Start Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        End Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Status
                      </th>
                    </tr>

                    {/* GOAL 1 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b> To acquire Knowledge about Hypertension and its effect on the multiple body organs. </b>
                      </td>
                      <td colSpan={1}></td>
                      <td
                        colSpan={1}
                        style={{ paddingLeft: "10px" }}
                      ></td>
                      <td colSpan={1} style={{ paddingLeft: "10px" }}>
                        {hypertension?.goal1_status}
                      </td>
                    </tr>

                    {/* TASKS STARTS */}
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p> Assess the patient's current knowledge and understanding regarding disease </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypertension?.understanding_regarding_disease_start_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.understanding_regarding_disease_end_date}
                      </td>
                      <td colSpan={1} className="text-nowrap text-center text-dark pr-0">
                        {hypertension?.understanding_regarding_disease_status}
                      </td>
                    </tr>
                    {/* GOAL 1 ENDS */}

                    {/* GOAL 2 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To educate patient on Lifestyle modifications to help with better BP control.
                      </td>
                      <td colSpan={1}></td>
                      <td
                        colSpan={1}
                        style={{ paddingLeft: "10px" }}
                      ></td>
                      <td colSpan={1} style={{ paddingLeft: "10px" }}>
                        {hypertension?.goal2_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Educate the patient about DASH diet
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypertension?.educate_about_dash_diet_start_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.educate_about_dash_diet_end_date}
                      </td>
                      <td colSpan={1} className="text-nowrap text-center text-dark pr-0">
                        {hypertension?.educate_about_dash_diet_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Educate patient about low sodium diet
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypertension?.educate_about_sodium_diet_start_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.educate_about_sodium_diet_end_date}
                      </td>
                      <td colSpan={1} className="text-nowrap text-center text-dark pr-0">
                        {hypertension?.educate_about_sodium_diet_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Educate patient about importance of exercise
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypertension?.educate_about_excercise_start_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.educate_about_excercise_end_date}
                      </td>
                      <td colSpan={1} className="text-nowrap text-center text-dark pr-0">
                        {hypertension?.educate_about_excercise_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Educate patient on effects of alcohol on BP
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypertension?.educate_about_alcoholeffects_start_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.educate_about_alcoholeffects_end_date}
                      </td>
                      <td colSpan={1} className="text-nowrap text-center text-dark pr-0">
                        {hypertension?.educate_about_alcoholeffects_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Educate patients about the effect of smoking on BP
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypertension?.educate_about_smokingeffects_start_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.educate_about_smokingeffects_end_date}
                      </td>
                      <td colSpan={1} className="text-nowrap text-center text-dark pr-0">
                        {hypertension?.educate_about_smokingeffects_status}
                      </td>
                    </tr>
                    {/* Goal 2 ENDS */}

                    {/* GOALS 3 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Patient will understand the importance of Treatment Adherence and Regular BP monitoring.
                      </td>
                      <td colSpan={1}></td>
                      <td
                        colSpan={1}
                        style={{ paddingLeft: "10px" }}
                      ></td>
                      <td colSpan={1} style={{ paddingLeft: "10px" }}>
                        {hypertension?.goal3_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Explain to the patient the role of regular BP monitoring and treatment adherence in BP control.
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.regular_bp_monitoring_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.regular_bp_monitoring_end_date}
                      </td>
                      <td colSpan={1} className="text-nowrap text-center text-dark pr-0">
                        {hypertension?.regular_bp_monitoring_status}
                      </td>
                    </tr>
                    {/* GOALS 3 ENDS */}

                    {/* GOALS 4 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        Regular Follow up with PCP.
                      </td>
                      <td colSpan={1}></td>
                      <td
                        colSpan={1}
                        style={{ paddingLeft: "10px" }}
                      ></td>
                      <td colSpan={1} style={{ paddingLeft: "10px" }}>
                        {hypertension?.goal3_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Patient will understand the importance of regular follow ups with PCP for BP monitoring as well as overall health assessment periodically.
                          </p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.regular_pcp_folloup_start_date}
                      </td>

                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypertension?.regular_pcp_folloup_end_date}
                      </td>

                      <td colSpan={1} className="text-nowrap text-center text-dark pr-0" >
                        {hypertension?.regular_pcp_folloup_status}
                      </td>
                    </tr>
                    {/* GOALS 4 ENDS */}
                  </>
                ) : null}
                {/* Hypertension ENDS */}

                {/* Hypercholesterolemis Starts */}
                {chronicDisease.Hypercholesterolemia === true ? (
                  <>
                    <tr>
                      <th colSpan={9} className="text-center table-primary">
                        Hypercholesterolemia Goals
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Start Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        End Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Status
                      </th>
                    </tr>

                    <tr>
                      <td className="text-dark" colSpan={9}>
                        <b>
                          To develope an understanding regarding risk factors and monitoring for Hyperlipidemia.
                        </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.goal1_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Patient will learn various causes of hyperlipidemia.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypercholesterolemia?.causes_of_hyperlipidemia_start_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypercholesterolemia?.causes_of_hyperlipidemia_end_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.causes_of_hyperlipidemia_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Patient will learn to avoid saturated & trans-fat.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypercholesterolemia?.saturated_trans_fat_start_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {
                          hypercholesterolemia?.saturated_trans_fat_end_date
                        }
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.saturated_trans_fat_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Patient will learn importance of checking yearly Lipids & LDL goal.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.lab_mandatory_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.lab_mandatory_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.lab_mandatory_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Patient will learn other conditions that can co-exist and managing Lipid can help them.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.monitor_comorbid_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.monitor_comorbid_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.monitor_comorbid_status}
                      </td>
                    </tr>

                    <tr>
                      <td className="text-dark" colSpan={9}>
                        <b>
                          To understand the effect of Lipids on Cardiovascular System.
                        </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.goal2_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Understanding how high LDL leads to heart attack</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.understand_etiology_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.understand_etiology_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.understand_etiology_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Cholesterol is a factor in ASCVD score.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.calculate_ASCVD_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.calculate_ASCVD_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.calculate_ASCVD_status}
                      </td>
                    </tr>

                    <tr>
                      <td className="text-dark" colSpan={9}>
                        <b> To understand the importance of healthy diet in controlling Lipids. </b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0"></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.goal3_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Teaching about healthy diet</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.dietary_factors_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.dietary_factors_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.dietary_factors_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Visiting to nutritionist for proper diet plan</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.visiting_nutritionist_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.visiting_nutritionist_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.visiting_nutritionist_status}
                      </td>
                    </tr>

                    <tr>
                      <td className="text-dark" colSpan={9}>
                        <b>To understand the effect of Exercise on Lipids</b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.goal4_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>How much exercise is better?</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.amount_of_exercise_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.amount_of_exercise_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.amount_of_exercise_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>What is the effect of exercise on Lipids?</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.effect_of_exercise_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.effect_of_exercise_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {hypercholesterolemia?.effect_of_exercise_status}
                      </td>
                    </tr>
                  </>
                ) : null}
                {/* Hypercholesterolemis Ends */}

                {/* Diabetes Mellitus Starts */}
                {chronicDisease.DiabetesMellitus === true ? (
                  <>
                    <tr>
                      <th colSpan={9} className="text-center table-primary">
                        Diabetes Goals
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Start Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        End Date
                      </th>
                      <th colSpan={1} className="text-center table-primary">
                        Status
                      </th>
                    </tr>

                    {/* GOAL 1 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        To understand the importance of Blood Glucose Monitoring and control
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal1_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Assess the patients current knowledge and
                            understanding regarding disease
                          </p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitoring_blood_sugar_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitoring_blood_sugar_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitoring_blood_sugar_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Weight daily, Explain the importance of weight loss
                            to obese patients with diabetes.
                          </p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.importance_of_weight_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.importance_of_weight_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.importance_of_weight_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Assess the pattern of physical activity.</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_the_pattern_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_the_pattern_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_the_pattern_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Monitor blood glucose levels before meals and at
                            bedtime to control
                          </p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitor_blood_glucose_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitor_blood_glucose_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitor_blood_glucose_status}
                      </td>
                    </tr>
                    {/* GOAL 1 ENDS */}

                    {/* GOAL 2 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b> To Understand the importance of Diabetic Diet. </b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal2_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Understanding A, B & C of Diabetes</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.abc_of_diabetes_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.abc_of_diabetes_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.abc_of_diabetes_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Keeping your Weight under control</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.undercontrol_weight_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.undercontrol_weight_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.undercontrol_weight_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Seeing a Dietician.</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.seeing_dietician_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.seeing_dietician_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.seeing_dietician_status}
                      </td>
                    </tr>
                    {/* GOAL 2 ENDS */}

                    {/* GOAL 3 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b>
                          To Understand Hypoglycemia, hyperglycemia and how to prevent them
                        </b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal3_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Assess for signs of hyperglycemia/hypoglycemia</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.signs_of_hyperglycemia_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.signs_of_hyperglycemia_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.signs_of_hyperglycemia_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Prevention of hyperglycemia by exercise to help
                            lower blood sugar, follow your meal plan maintain a
                            healthy weight, don't smoke and limit alcohol
                          </p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.prevention_of_hyperglycemia_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.prevention_of_hyperglycemia_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.prevention_of_hyperglycemia_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Prevention of hypoglycemia to help lower blood
                            sugar, follow your meal plan maintain a healthy
                            weight, don't smoke and limit alcohol
                          </p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.lower_blood_sugar_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.lower_blood_sugar_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.lower_blood_sugar_status}
                      </td>
                    </tr>
                    {/* GOAL 3 ENDS */}

                    {/* GOAL 4 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b>To Understand the importance of Diabetic Eye exam.</b>
                      </td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td
                        colSpan={1}
                        className="text-center text-dark pr-0"
                      ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal4_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Understanding how high blood sugar effects Eyes</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.sugar_effect_on_eye_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.sugar_effect_on_eye_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.sugar_effect_on_eye_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Understanding different ways Diabetes can affect the Eyes</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.sugar_ways_to_effect_on_eye_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.sugar_ways_to_effect_on_eye_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.sugar_ways_to_effect_on_eye_status}
                      </td>
                    </tr>
                    {/* GOAL 4 ENDS */}

                    {/* GOAL 5 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b>To Understand the importance of Diabetic Foot Care.</b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal5_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Understanding how Diabetic damage the nerves in the Foot.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.foot_nerves_damage_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.foot_nerves_damage_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.foot_nerves_damage_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>How to protect your feet in Diabetes?</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.protect_feet_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.protect_feet_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.protect_feet_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>How to do your foot examination?</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.foot_examination_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.foot_examination_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.foot_examination_status}
                      </td>
                    </tr>
                    {/* GOAL 5 ENDS */}

                    {/* GOAL 6 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b>To understand Cardiovascular Complications secondary to Diabetes.</b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal6_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Learning the leading cause of death in Diabetics.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.death_cause_in_diabetes_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.death_cause_in_diabetes_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.death_cause_in_diabetes_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Learning three ways to decrease the risk of Cardio-vascular disease?</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.risk_of_cardio_disease_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.risk_of_cardio_disease_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.risk_of_cardio_disease_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Learning to keep your cholesterol and triglyceride levels in a healthy range.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.cholesterol_healthy_range_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.cholesterol_healthy_range_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.cholesterol_healthy_range_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Consider daily low-dose aspirin, depending on your other conditions.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.low_dose_aspirin_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.low_dose_aspirin_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.low_dose_aspirin_status}
                      </td>
                    </tr>
                    {/* GOAL 6 ENDS */}

                    {/* GOAL 7 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b>To understand Kidney complications secondary to diabetes.</b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal7_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Understanding the effect of diabetes on Kidneys.</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.diabetes_effect_on_kidneys_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.diabetes_effect_on_kidneys_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.diabetes_effect_on_kidneys_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>How to know if your kidneys are being affected by diabetes?</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.know_how_kidneys_effected_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.know_how_kidneys_effected_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.know_how_kidneys_effected_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>How to protect your kidneys if diabetes has started to damage it?</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.protect_kidneys_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.protect_kidneys_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.protect_kidneys_status}
                      </td>
                    </tr>
                    {/* GOAL 7 ENDS */}

                    {/* GOAL 8 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b>To recognize the importance if Blood Pressure control in diabetic patients.</b>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal8_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>What should be your BP if you are diabetic?</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.bp_recommendation_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.bp_recommendation_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.bp_recommendation_status}
                      </td>
                    </tr>

                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>How to lower your BP?</p>
                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.how_to_lower_bp_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.how_to_lower_bp_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.how_to_lower_bp_status}
                      </td>
                    </tr>
                    {/* GOAL 8 ENDS */}

                    {/* GOAL 9 STARTS */}
                    <tr>
                      <td colSpan={9} className="text-dark font-weight-bold">
                        <b>To recognize the signs and symptoms of exacerbation that must be reported to the doctor/nurse</b>

                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0" ></td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.goal9_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            monitor hunger and fatigue that would be exacerbate
                            later
                          </p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitor_hunger_and_fatigue_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitor_hunger_and_fatigue_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.monitor_hunger_and_fatigue_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>
                            Assess Frequent urination, dry mouth, or blurred
                            vision
                          </p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_frequent_urination_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_frequent_urination_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_frequent_urination_status}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={9}>
                        <p className="question-text mt-2 pl-5">
                          <p>Assess slow healing of wound</p>

                        </p>
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_slow_healing_start_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_slow_healing_end_date}
                      </td>
                      <td colSpan={1} className="text-center text-dark pr-0">
                        {diabetes?.assess_slow_healing_status}
                      </td>
                    </tr>
                    {/* GOAL 9 ENDS */}
                  </>
                ) : null}
                {/* Diabetes Melliyus Ends */}
              </tbody>
            </table>
          </div>
        </div>
      </Spin>
    </>
  );
};
export default CCMEncounterCarePlan;
