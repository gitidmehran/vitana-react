import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { PatientType } from "@/Types/PatientType";
import ProgramType from "@/Types/ProgramType";
import {
  setLoader,
  setdiagnosis,
  setProgramId,
  setQuestionId,
} from "../../store/reducer/QuestionairesReducer";
import { getCCMGeneralCarePlan } from "../../actions/AwvCarePlan/AwvCarePlanActions";
import { RootState } from "../../store/store";
import { Spin, Button, Tooltip, message } from "antd";
import {
  ChfAssessmentType,
  chronicDiseasesType,
  CkdAssessmentType,
  CopdAssessmentType,
  DepressionOutComesType,
  DiabetesMellitusType,
  HypercholesterolemiaType,
  HypertensionType,
  ObesityType,
  PatientRowDetailsType,
} from "@/Types/CarePlan";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingOutlined, DownloadOutlined } from "@ant-design/icons";
import moment from "moment";
import { downloadMonthlycareplan } from "../../actions/Questionnaire/questionnaire";
import fileDownload from "js-file-download";
import { OpenNotification } from "../../Utilties/Utilties";

// import { MonthlyAssessmentType } from "@/Types/QuestionaireTypes";
// import { useNavigate } from "react-router-dom";

const CCMMonthlyCarePlan: React.FC = () => {
  const { programmId, loading, diagnosis } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [rowdata, setRowData] = useState<PatientRowDetailsType>(
    {} as PatientRowDetailsType
  );

  const [patientRowDetails, setPatientRowDetails] =
    useState<PatientRowDetailsType>({} as PatientRowDetailsType);

  /* const [monthly_assessment, setMonthlyAssessment] = useState<MonthlyAssessmentType>(
    {} as MonthlyAssessmentType
  ); */
  const [depressionphq9, setDepressionPhq9] =
    useState<DepressionOutComesType>({} as DepressionOutComesType);

  const [hypercholesterolemia, setHypercholesterolemia] =
    useState<HypercholesterolemiaType>({} as HypercholesterolemiaType);

  const [hypertension, setHypertension] = useState<HypertensionType>(
    {} as HypertensionType
  );

  const [obesity, setObesity] = useState<ObesityType>({} as ObesityType);

  const [diabetesmellitus, setDiabetesMellitus] =
    useState<DiabetesMellitusType>({} as DiabetesMellitusType);

  const [copdassessment, setCopdAssessment] = useState<CopdAssessmentType>(
    {} as CopdAssessmentType
  );

  const [chfassessment, setChfAssessment] = useState<ChfAssessmentType>(
    {} as ChfAssessmentType
  );

  const [ckdassessment, setCkdAssessment] = useState<CkdAssessmentType>(
    {} as CkdAssessmentType
  );

  const [chronicDiseases, setChronicDiseases] = useState<chronicDiseasesType>(
    {} as chronicDiseasesType
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchccmgeneralCareplan();
  }, []);
  const location = useLocation();
  const id = location.state.questionid;
  const monthly_assessment_id = location.state.monthly_assessment_id;
  const date_of_service = location.state.dateOfService;
  function fetchccmgeneralCareplan() {
    dispatch(setLoader(true));
    getCCMGeneralCarePlan(id, {
      monthly_careplan: 1,
      date_of_service: date_of_service,
      monthly_assessment_id: monthly_assessment_id,
    }).then(({ data: response }) => {
      dispatch(setLoader(false));

      /* General Data */
      setPatient(response.row.patient);
      setProgram(response.row.program);
      setRowData(response.row);
      setPatientRowDetails(response.row);

      /* Careplan Data */
      // setMonthlyAssessment(response.monthly_assessment_outcomes);
      setDepressionPhq9(response.depression_out_comes);
      setHypercholesterolemia(response.hypercholestrolemia_outcomes);
      setHypertension(response.hypertension_outcomes);
      setObesity(response.obesity_outcomes);
      setDiabetesMellitus(response.diabetes_outcome);
      setCopdAssessment(response.copd_outcomes);
      setChfAssessment(response.chf_outcomes);
      setCkdAssessment(response.ckd_outcomes);
      setChronicDiseases(response.chronic_disease);
    });
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const dateFormat = "MM/DD/YYYY";
  // const monthFormat = "YYYY/MM";

  const navigate = useNavigate();
  const handleBack = (questionId: any, programid: any) => {
    dispatch(setProgramId(programid));
    dispatch(setdiagnosis(diagnosis));
    dispatch(setQuestionId(questionId));
    navigate(`/questionaire/edit/${questionId}`, {
      state: {
        id: rowdata.id,
        age: patient.age,
        name: patient.name,
        dob: patient.dob,
        patientData: patient.id,
        gender: patient.gender,
        insurance_name: patient.insurance_name,
        diagnosis: diagnosis,
        monthly_assessment_id: rowdata.monthly_assessment.id ?? monthly_assessment_id,
        disableFirstSeven: Boolean(monthly_assessment_id !== ""),
        disableAfterSeven: Boolean(monthly_assessment_id === "")
      },
    });
  };
  const downloadpdf = (id: string) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Downloading is in progress..",
      duration: 0,
      style: { marginTop: "40px" },
    });

    const payloadData = {
      "monthly_assessment_id": monthly_assessment_id,
      "date_of_service": date_of_service,
      "monthly_careplan": 1,
    }

    downloadMonthlycareplan(id, payloadData)
      .then((res) => {
        setTimeout(() => {
          messageApi.open({
            key,
            type: "success",
            content: "Downloaded Successfully!",
            duration: 2,
            style: { marginTop: "40px" },
          });
        }, 1000);
        fileDownload(res.data, "CCMCarePlan.pdf");
      })
      .catch(function (e) {
        OpenNotification("error", e);
      });
  };

  const handleclose = () => {
    navigate("/Questionnaires");
  };
  const handleName = () => {
    navigate("/patients", { state: { patientId: patient.id } });
  };

  return (
    <>
      <Spin spinning={loading} indicator={antIcon}>
        {contextHolder}
        <div className="card-header">
          <div className="card main-card">
            <div className="card">
              <div className="card-body">
                <h3 className="main-heading ">Monthly Care Plan</h3>
                <div className="row">
                  <div className="col-lg-3 md-3 sm-3">
                    <h6
                      className="d-inline ms-4"
                      style={{ cursor: "pointer" }}
                      onClick={handleName}
                    >
                      Patient Name:{" "}
                      <span className="text-primary">{patient?.name}</span>
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
                </div>
                <div className="row">
                  <div className="col-lg-3 md-3 sm-3">
                    <h6 className="d-inline ms-4">Gender: {patient?.gender}</h6>
                  </div>
                  <div className="col-lg-3 md-3 sm-3">
                    <h6 className="d-inline ms-4">
                      Program: {program?.name} ({program?.short_name})
                    </h6>
                  </div>
                  <div className="col-lg-3 md-3 sm-3">
                    <h6 className="d-inline ms-4">
                      Primary care Physician:
                      {patientRowDetails?.primary_care_physician}
                    </h6>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-6 md-3 sm-3">
                    <h6 className="d-inline ms-4">
                      Date of Service:
                      {moment(date_of_service).format(dateFormat)}
                    </h6>
                  </div>

                  <div className="col-lg-6 md-3 sm-6">
                    <Tooltip placement="topLeft" title={"Finish"}>
                      <Button
                        className=" round-pill float-right ml-2"
                        style={{ lineHeight: "15px" }}
                        onClick={handleclose}
                        type="primary"
                      >
                        Close
                      </Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={"Download"}>
                      <Button
                        icon={<DownloadOutlined />}
                        type="primary"
                        className=" float-right ml-2"
                        style={{ lineHeight: "15px" }}
                        onClick={() => {
                          downloadpdf(id);
                        }}
                      >
                        Download
                      </Button>
                    </Tooltip>
                    <Tooltip placement="topLeft" title={"Edit again"}>
                      <Button
                        danger
                        className=" float-right ml-2"
                        style={{ lineHeight: "15px" }}
                        onClick={() => {
                          handleBack(id, programmId);
                        }}
                      >
                        Re-Edit
                      </Button>
                    </Tooltip>
                    {/* {showbutton ? ( */}
                    {/* <Popover
                      placement="bottom"
                      // content={content}
                      title="Sign encounter"
                      trigger="click"
                    // open={open}
                    // onOpenChange={handleOpenChange}
                    >
                      <Button
                        type="default"
                        className=" float-right"
                        style={{ lineHeight: "15px" }}
                      onClick={() => {
                handleSignBack(questionId);
              }}
                      >
                        Sign
                      </Button>
                    </Popover> */}
                    {/* // ) : null} */}
                  </div>
                  {/* {showtext && (
                  <h6 className="m-3">
                    <b>
                      This careplan is electronically signed by {questio?.doctor} on {moment(signed_date).format("MM/DD/YYYY")}
                    </b>
                  </h6>
                )} */}
                </div>
              </div>
            </div>

            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-light">
                  <tbody>

                    {/* {{--Depression PHQ 9 Starts--}} */}
                    {chronicDiseases?.Depression && (
                      <>
                        <tr>
                          <th
                            colSpan={12}
                            className="text-center table-primary"
                          >
                            Depression
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
                        </tr>

                        <tr>
                          <th colSpan={7} className="text-center table-primary">
                            <span style={{ paddingLeft: "290px" }}>Goals</span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            <span
                              className="text-nowrap"
                              style={{ paddingRight: "10px" }}
                            >
                              Start Date
                            </span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            End Date
                          </th>
                          <th colSpan={1} className="text-center table-primary">
                            <span style={{ paddingRight: "25px" }}>Status</span>
                          </th>
                        </tr>

                        {depressionphq9?.goal1_status !== "" && depressionphq9?.goal1_status !== undefined ? (
                          <>
                            <tr>
                              <td
                                className="text-dark font-weight-bold"
                                colSpan={7}
                              >
                                To acquire knowledge about depression and how it can affect you.
                              </td>
                              <td colSpan={2}></td>
                              <td
                                colSpan={2}
                                style={{ paddingLeft: "10px" }}
                              ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {depressionphq9?.goal1_status}
                              </td>
                            </tr>

                            {typeof depressionphq9?.understand_about_disease_status !== "undefined" && depressionphq9?.understand_about_disease_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Assess the patient’s current knowledge and understanding regarding disease</b>

                                    <p className="pl-4">
                                      Depression (major depressive disorder) is a common and serious medical illness that negatively affects how you feel, the way you think and how you act.
                                      Fortunately, it is also treatable. Depression causes feelings of sadness and/or a loss of interest in activities you once enjoyed.
                                      It can lead to a variety of emotional and physical problems and can decrease your ability to function at work and at home.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {
                                    depressionphq9?.understand_about_disease_start_date
                                  }
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    depressionphq9?.understand_about_disease_end_date
                                  }
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    depressionphq9?.understand_about_disease_status
                                  }
                                </td>
                              </tr>
                            ) : null}

                            {typeof depressionphq9?.monitor_phq9_status !== "undefined" && depressionphq9?.monitor_phq9_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Monitor PHQ-9 levels of patients</b>
                                    <p className="pl-4">
                                      The PHQ-9 can function as a screening tool, an aid in diagnosis, and as a symptom tracking tool that can help track a patient's overall depression severity as well as track the improvement of specific symptoms with treatment.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.monitor_phq9_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.monitor_phq9_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.monitor_phq9_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof depressionphq9?.advantages_of_phq9_status !== "undefined" && depressionphq9?.advantages_of_phq9_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>ADVANTAGES OF THE PHQ-9</b>

                                    <p className="pl-4">
                                      Shorter than other depression rating scales. Can be administered in person by a clinician, by telephone, or self-administered by the patient. Facilitates diagnosis of major depression.
                                      Provides assessment of symptom severity. Is well validated and documented in a variety of populations. Can be used in adolescents as young as 12 years of age.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.advantages_of_phq9_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.advantages_of_phq9_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.advantages_of_phq9_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {depressionphq9?.goal2_status !== "" && depressionphq9?.goal2_status !== undefined ? (
                          <>
                            <tr>
                              <td className="text-dark font-weight-bold" colSpan={7} >
                                To understand the effect of depression on overall health.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {depressionphq9?.goal2_status}
                              </td>
                            </tr>

                            {typeof depressionphq9?.effect_with_other_problems_status !== "undefined" && depressionphq9?.effect_with_other_problems_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Understanding depression relationship with other medical problems</b>

                                    <p className="pl-4">
                                      Depression can co-occur with other medical problems, such as diabetes, heart disease, cancer, and many others.
                                      The relationship between depression and medical comorbidities is complicated. Depression can worsen in the face of medical problems and, at the same time, cause the medical conditions themselves to worsen.
                                      In part that's because depression makes it hard for people to take care of their medical conditions.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.effect_with_other_problems_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.effect_with_other_problems_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.effect_with_other_problems_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {depressionphq9?.goal3_status !== "" && depressionphq9?.goal3_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand the importance of different approaches that are used to treat depression.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {depressionphq9?.goal3_status}
                              </td>
                            </tr>

                            {typeof depressionphq9?.relieve_depression_status !== "undefined" && depressionphq9?.relieve_depression_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Understanding Counseling (with a psychiatrist, psychologist, nurse, or social worker) & medicines that relieve depression</b>

                                    <p className="pl-4">
                                      People with depression that is not too severe can get better by taking medicines or talking with a counselor.
                                      People with severe depression usually need medicines to get better, and might also need to see a counselor.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.relieve_depression_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.relieve_depression_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.relieve_depression_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof depressionphq9?.understand_cbt_status !== "undefined" && depressionphq9?.understand_cbt_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Understanding CBT</b>
                                    <p className="pl-4">
                                      CBT (Cognitive Behavioral therapy) teaches you to become aware of and adjust negative patterns, which can help you reframe your thinking during moments of heightened anxiety or panic.
                                      It can also provide new coping skills, like meditation or journaling, for those struggling with a substance use disorder or depression.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.understand_cbt_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.understand_cbt_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.understand_cbt_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof depressionphq9?.physical_activity_importance_status !== "undefined" && depressionphq9?.physical_activity_importance_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Importance of Physical activity</b>
                                    <p className="pl-4">
                                      In addition to treatment, getting regular physical activity can also help you feel better.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.physical_activity_importance_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.physical_activity_importance_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.physical_activity_importance_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof depressionphq9?.waves_treatment_status !== "undefined" && depressionphq9?.waves_treatment_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Understanding treatments that pass magnetic waves or electricity into the brain</b>
                                    <p className="pl-4">
                                      Another treatment involves placing a device against the scalp to pass magnetic waves into the brain.
                                      This is called "transcranial magnetic stimulation" ("TMS"). Doctors might suggest TMS if medicines and counseling have not helped.
                                    </p>
                                    <p>
                                      Some people with severe depression might need a treatment called "electroconvulsive therapy" ("ECT"). During ECT, doctors pass an electric current through a person's brain in a safe way.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.waves_treatment_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.waves_treatment_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.waves_treatment_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {depressionphq9?.goal4_status !== "" && depressionphq9?.goal4_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand the importance of changes to your habits and lifestyle to treat depression.
                              </td>
                              <td colSpan={2}></td>
                              <td
                                colSpan={2}
                                style={{ paddingLeft: "10px" }}
                              ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {depressionphq9?.goal4_status}
                              </td>
                            </tr>

                            {typeof depressionphq9?.exercise_status !== "undefined" && depressionphq9?.exercise_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Exercise a specific number of days per week</b>
                                    <p className="pl-4">
                                      To set a goal to walk around your neighborhood for 30 minutes a day every weekday or go to the gym three times a week.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.exercise_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.exercise_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.exercise_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {depressionphq9?.goal5_status !== "" && depressionphq9?.goal5_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand the importance of regular follow-ups
                              </td>
                              <td colSpan={2}></td>
                              <td
                                colSpan={2}
                                style={{ paddingLeft: "10px" }}
                              ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {depressionphq9?.goal5_status}
                              </td>
                            </tr>

                            {typeof depressionphq9?.regular_follow_ups_status !== "undefined" && depressionphq9?.regular_follow_ups_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b></b>
                                    <p className="pl-4">
                                      It is very important to regularly follow up with your PCP or Psychiatrist to be evaluated for your depression.
                                      It is also very important to understand if for any reason you feel your depression is worsening or medications have stopped working you should let your PCP know and walk in to have your treatment adjusted.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.regular_follow_ups_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.regular_follow_ups_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.regular_follow_ups_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {depressionphq9?.goal6_status !== "" && depressionphq9?.goal6_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand what to do if you are having thoughts of harming yourself.
                              </td>
                              <td colSpan={2}></td>
                              <td
                                colSpan={2}
                                style={{ paddingLeft: "10px" }}
                              ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {depressionphq9?.goal6_status}
                              </td>
                            </tr>

                            {typeof depressionphq9?.helping_guides_status !== "undefined" && depressionphq9?.helping_guides_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b></b>
                                    <p className="pl-4">
                                      If you ever feel like you might hurt yourself or someone else, help is available:
                                      <ul>
                                        <li>
                                          In the US, contact the 988 Suicide & Crisis Lifeline:
                                        </li>
                                        <ul>
                                          <li>To speak to someone, call or text 988.</li>
                                          <li>Call your doctor or nurse, and tell them it is urgent.</li>
                                          <li>Call for an ambulance (in the US and Canada, call 9-1-1).</li>
                                          <li>Go to the emergency department at the nearest hospital.</li>
                                        </ul>
                                      </ul>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.helping_guides_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.helping_guides_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.helping_guides_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {depressionphq9?.goal7_status !== "" && depressionphq9?.goal7_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To utilize counseling/group support
                              </td>
                              <td colSpan={2}></td>
                              <td
                                colSpan={2}
                                style={{ paddingLeft: "10px" }}
                              ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {depressionphq9?.goal7_status}
                              </td>
                            </tr>

                            {typeof depressionphq9?.improve_relations_status !== "undefined" && depressionphq9?.improve_relations_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To improve your relationships with other people can help to lower your risk of being affected by depression.</b>
                                    <p className="pl-4"></p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.improve_relations_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.improve_relations_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.improve_relations_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof depressionphq9?.psychotherapy_status !== "undefined" && depressionphq9?.psychotherapy_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To take part in therapy on a regular basis not only lets you receive the mental health benefits of psychotherapy, but it can also help create a routine in your life.</b>
                                    <p className="pl-4">
                                      Simple but effective short-term goal for treating depression could be to make a note of at least one positive event that happens every day for a certain period of time, such as a whole month.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {depressionphq9?.psychotherapy_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.psychotherapy_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {depressionphq9?.psychotherapy_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                      </>
                    )}
                    {/* {{--Depression PHQ 9 Ends--}} */}

                    {/* {{--Hypercholestrolemia Starts--}} */}
                    {chronicDiseases?.Hypercholesterolemia && (
                      <>
                        <tr>
                          <th colSpan={12} className="text-center table-primary" >
                            Hypercholesterolemia
                          </th>
                        </tr>

                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Prognosis
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {hypercholesterolemia?.prognosis}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Assessment
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {hypercholesterolemia?.assessment}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={7} className="text-center table-primary">
                            <span style={{ paddingLeft: "290px" }}>Goals</span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            <span
                              className="text-nowrap"
                              style={{ paddingRight: "10px" }}
                            >
                              Start Date
                            </span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            End Date
                          </th>
                          <th colSpan={1} className="text-center table-primary">
                            <span style={{ paddingRight: "25px" }}>Status</span>
                          </th>
                        </tr>

                        {hypercholesterolemia?.goal1_status !== "" && hypercholesterolemia?.goal1_status !== undefined ? (
                          <>
                            <tr>
                              <td
                                className="text-dark font-weight-bold"
                                colSpan={7}
                              >
                                To develope an understanding regarding risk
                                factors and monitoring for Hyperlipidemia.
                              </td>
                              <td colSpan={2}></td>
                              <td
                                colSpan={2}
                                style={{ paddingLeft: "10px" }}
                              ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {hypercholesterolemia?.goal1_status}
                              </td>
                            </tr>

                            {typeof hypercholesterolemia?.causes_of_hyperlipidemia_status !== "undefined" && hypercholesterolemia?.causes_of_hyperlipidemia_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Patient will learn various causes of
                                      hyperlipidemia.
                                    </b>
                                    <p className="pl-4">
                                      Smoking, drinking excessive alcohol &
                                      eating foods that have a lot of saturated
                                      fats or trans fats. Most animal fats are
                                      saturated. The fats of plants and fish are
                                      generally healthy. <br /> Many processed foods
                                      like foods deep-fried and sausage are high
                                      in saturated fat content and not healthy.
                                      Sitting too much instead of being active.
                                      Being stressed. <br /> Inheriting genes
                                      that make your cholesterol level
                                      unhealthy. Being overweight.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {
                                    hypercholesterolemia?.causes_of_hyperlipidemia_start_date
                                  }
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    hypercholesterolemia?.causes_of_hyperlipidemia_end_date
                                  }
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    hypercholesterolemia?.causes_of_hyperlipidemia_status
                                  }
                                </td>
                              </tr>
                            ) : null}

                            {typeof hypercholesterolemia?.saturated_trans_fat_status !== "undefined" && hypercholesterolemia?.saturated_trans_fat_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Patient will learn to avoid saturated &
                                      trans-fat.
                                    </b>
                                    <p className="pl-4">
                                      Unhealthy fats – "Trans" fats are
                                      especially unhealthy. They are found in
                                      margarines, many fast foods, and some
                                      store-bought baked goods. "Saturated" fats
                                      are found in animal products like meats,
                                      egg yolks, butter, cheese, and full-fat
                                      milk products. <br /> Unhealthy fats can
                                      raise your cholesterol level and increase
                                      your chance of getting heart disease.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {
                                    hypercholesterolemia?.saturated_trans_fat_start_date
                                  }
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    hypercholesterolemia?.saturated_trans_fat_end_date
                                  }
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    hypercholesterolemia?.saturated_trans_fat_status
                                  }
                                </td>
                              </tr>
                            ) : null}

                            {typeof hypercholesterolemia?.lab_mandatory_status !== "undefined" && hypercholesterolemia?.lab_mandatory_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Patient will learn importance of checking
                                      yearly Lipids & LDL goal.
                                    </b>
                                    <p className="pl-4">
                                      It should be mandatory to do labs like
                                      levels of triglycerides, cholesterol
                                      levels. Patient should know the levels of
                                      LDL. It should be less than 130 if patient
                                      is not Diabetic or have heart disease.{" "}
                                      <br /> If patient has heart disease, then
                                      it should be less than 100 and if Diabetes
                                      then the level be less than 70
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {hypercholesterolemia?.lab_mandatory_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.lab_mandatory_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.lab_mandatory_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof hypercholesterolemia?.monitor_comorbid_status !== "undefined" && hypercholesterolemia?.monitor_comorbid_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Patient will learn other conditions that
                                      can co-exist and managing Lipid can help
                                      them.
                                    </b>
                                    <br />
                                    <p className="pl-4">
                                      Conditions like obesity, diabetes,
                                      hypertension, and heart disease. It can
                                      also coexist with arthritis, sleep apnea,
                                      and atrial fibrillation. <br /> In many
                                      cases, managing high cholesterol will help
                                      manage other conditions. Your doctor can
                                      provide personalized guidance depending on
                                      your comorbidities.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {hypercholesterolemia?.monitor_comorbid_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.monitor_comorbid_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.monitor_comorbid_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {hypercholesterolemia?.goal2_status !== "" && hypercholesterolemia?.goal2_status !== undefined ? (
                          <>
                            <tr>
                              <td className="text-dark font-weight-bold" colSpan={7} >
                                To understand the effect of Lipids on
                                Cardiovascular System
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {hypercholesterolemia?.goal2_status}
                              </td>
                            </tr>

                            {typeof hypercholesterolemia?.understand_etiology_status !== "undefined" && hypercholesterolemia?.understand_etiology_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Understanding how high LDL leads to heart
                                      attack.
                                    </b>
                                    <p className="pl-4">
                                      Total Cholesterol has LDL (Bad
                                      Cholesterol) and HDL (Good Cholesterol).
                                      If you have an excess amount of LDL
                                      (LIPIDS) in your bloodstream, waxy plaques
                                      can build up along your artery walls,
                                      causing arteries to narrow. <br /> Over
                                      time, arteries may become damaged with
                                      these plaques and susceptible to blood
                                      clots. These blood clots can dislodge and
                                      block a small vessel in the heart causing
                                      heart attack.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {
                                    hypercholesterolemia?.understand_etiology_start_date
                                  }
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    hypercholesterolemia?.understand_etiology_end_date
                                  }
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    hypercholesterolemia?.understand_etiology_status
                                  }
                                </td>
                              </tr>
                            ) : null}

                            {typeof hypercholesterolemia?.calculate_ASCVD_status !== "undefined" && hypercholesterolemia?.calculate_ASCVD_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Cholesterol is a factor in ASCVD score.
                                    </b>
                                    <p className="pl-4">
                                      The ASCVD (atherosclerotic cardiovascular
                                      disease) risk score is a national
                                      guideline developed by the American
                                      College of Cardiology. It is a calculation
                                      of your 10-year risk of having a
                                      cardiovascular problem, such as a heart
                                      attack or stroke. <br /> This risk
                                      estimate considers age, sex, race,
                                      cholesterol levels, blood pressure,
                                      medication use, diabetic status, and
                                      smoking status.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {
                                    hypercholesterolemia?.calculate_ASCVD_start_date
                                  }
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    hypercholesterolemia?.calculate_ASCVD_end_date
                                  }
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.calculate_ASCVD_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {hypercholesterolemia?.goal3_status !== "" && hypercholesterolemia?.goal3_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand the importance of healthy diet in
                                controlling Lipids
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {hypercholesterolemia?.goal3_status}
                              </td>
                            </tr>

                            {typeof hypercholesterolemia?.dietary_factors_status !== "undefined" && hypercholesterolemia?.dietary_factors_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Teaching about healthy diet</b>
                                    <p className="pl-4">
                                      The most beneficial changes result from
                                      reducing intake of saturated and trans
                                      fats; mostly found in commercially friend
                                      food like French fries and increasing
                                      intake of polyunsaturated and
                                      monounsaturated fats. <br />{" "}
                                      Low-carbohydrate, or low-fat diet also has
                                      beneficial effects in reducing intake of
                                      dietary cholesterol. Increasing intake of
                                      soluble fiber and soy protein, and eating
                                      fatty marine fish or taking marine-derived
                                      omega-3 fatty acid supplements is also
                                      beneficial.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {hypercholesterolemia?.dietary_factors_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.dietary_factors_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.dietary_factors_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof hypercholesterolemia?.visiting_nutritionist_status !== "undefined" && hypercholesterolemia?.visiting_nutritionist_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Visiting to nutritionist for proper diet
                                      plan.
                                    </b>
                                    <p className="pl-4">
                                      Your nutritionist will guide you toward
                                      healthy food choices while helping you
                                      enjoy the foods you are eating.
                                      Nutritionists can also teach you about
                                      healthy food habits and behaviors that
                                      encourage weight loss. Healthy habits may
                                      include eating at the dining table,
                                      weighing your food or avoiding late night
                                      snacks. <br /> The goal of this education
                                      is to help you develop healthy habits for
                                      the rest of your life.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {hypercholesterolemia?.visiting_nutritionist_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.visiting_nutritionist_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.visiting_nutritionist_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {hypercholesterolemia?.goal4_status !== "" && hypercholesterolemia?.goal4_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand the effect of Exercise on Lipids.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {hypercholesterolemia?.goal4_status}
                              </td>
                            </tr>

                            {typeof hypercholesterolemia?.amount_of_exercise_status !== "undefined" && hypercholesterolemia?.amount_of_exercise_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>How much exercise is better?</b>
                                    <p className="pl-4">
                                      Any amount of exercise is better than
                                      sedentary lifestyle. It is important to
                                      incorporate exercise as a life habit.
                                      Individual should engage in
                                      moderate-intensity physical exercise
                                      performed for a minimum of 10 minutes four
                                      times a week or vigorous-intensity
                                      exercise (jogging) performed for a minimum
                                      of 20 minutes twice a week. <br />
                                      Moderate-intensity exercise is defined as
                                      activity sufficient to break a sweat or
                                      noticeably raise the heart rate (eg,
                                      walking briskly, using an exercise
                                      bicycle).
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {hypercholesterolemia?.amount_of_exercise_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.amount_of_exercise_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.amount_of_exercise_status}
                                </td>
                              </tr>
                            ) : null}
                            {typeof hypercholesterolemia?.effect_of_exercise_status !== "undefined" && hypercholesterolemia?.effect_of_exercise_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      What is the effect of exercise on Lipids?
                                    </b>
                                    <p className="pl-4">
                                      Exercise increase good lipids (HDL) and
                                      decreases Triglyceride and LDL (bad
                                      lipids).
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {hypercholesterolemia?.effect_of_exercise_start_date}
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.effect_of_exercise_end_date}
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {hypercholesterolemia?.effect_of_exercise_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                      </>
                    )}
                    {/* {{--Hypercholestrolemia Ends--}} */}

                    {/*{{--Diabetes Starts--}} */}
                    {chronicDiseases?.DiabetesMellitus && (
                      <>
                        <th colSpan={12} className="text-center table-primary">
                          Diabetes
                        </th>

                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Prognosis
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {diabetesmellitus?.prognosis}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Assessment
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {diabetesmellitus?.assessment}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={7} className="text-center table-primary">
                            <span style={{ paddingLeft: "290px" }}>Goals</span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            <span className="text-nowrap" style={{ paddingRight: "10px" }} >
                              Start Date
                            </span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            End Date
                          </th>
                          <th colSpan={1} className="text-center table-primary">
                            <span style={{ paddingRight: "25px" }}>Status</span>
                          </th>
                        </tr>
                        {/* GOAL 1 STARTS */}
                        {diabetesmellitus?.goal1_status !== "" && diabetesmellitus?.goal1_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7}>
                                <b>
                                  To understand the importance of Blood Glucose Monitoring and control
                                </b>
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {diabetesmellitus?.goal1_status}
                              </td>
                            </tr>

                            {typeof diabetesmellitus?.monitoring_blood_sugar_status !== "undefined" && diabetesmellitus?.monitoring_blood_sugar_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Assess the patients current knowledge and understanding regarding disease
                                    </b>
                                    <p className="pl-4">
                                      Diabetes is a medical condition in which either your body is resistant to insulin or is not making enough insulin this leads to elevated blood sugars. High blood sugars for a long period of time can cause complications in small vessels (Eyes and Kidneys) and large vessels (Heart, Brain and Legs) of the body. Monitoring blood sugar helps to determine if you are meeting your glucose targets which helps to reduce the unpleasant symptoms of high and low blood sugar and avoid long-term diabetes complications. Blood sugar readings are simply information used to help you learn what is working well and identify areas for improvement in your diabetes management. Our goal is to keep your Fasting Blood sugar less than 120 and blood sugars 2 hours after meals between 130-170 this will keep your A1c below 7 and Diabetes well controlled.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{diabetesmellitus?.monitoring_blood_sugar_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.monitoring_blood_sugar_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.monitoring_blood_sugar_status}</td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.importance_of_weight_status !== "undefined" && diabetesmellitus?.importance_of_weight_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Weight daily, Explain the importance of
                                      weight loss to obese patients with
                                      diabetes.
                                    </b>

                                    <p className="pl-4">
                                      When you have diabetes, there are huge benefits to losing weight if you're carrying extra weight.
                                      You’ll have more energy, and you’ll reduce your risk of serious complications like heart disease and stroke.
                                      Losing weight can help with your diabetes control too. And if you have type 2 diabetes, losing weight could even mean going into diabetes remission.
                                      Extra weight around your waist means fat can build up around your organs, like your liver and pancreas.
                                      This can cause something called insulin resistance. So, losing this weight could help the insulin you produce or the insulin you inject work properly.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {
                                    diabetesmellitus?.importance_of_weight_start_date
                                  }
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    diabetesmellitus?.importance_of_weight_end_date
                                  }
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    diabetesmellitus?.importance_of_weight_status
                                  }
                                </td>
                              </tr>
                            ) : null}


                            {typeof diabetesmellitus?.assess_the_pattern_status !== "undefined" && diabetesmellitus?.assess_the_pattern_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Assess the pattern of physical activity.
                                    </b>
                                    <p className="pl-4">
                                      If you have diabetes, being active makes your body more sensitive to insulin (the hormone that allows cells in your body to use blood sugar for energy),
                                      which helps manage your diabetes. Physical activity also helps control blood sugar levels and lowers your risk of heart disease and nerve damage.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {
                                    diabetesmellitus?.assess_the_pattern_start_date
                                  }
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    diabetesmellitus?.assess_the_pattern_end_date
                                  }
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {diabetesmellitus?.assess_the_pattern_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.monitor_blood_glucose_status !== "undefined" && diabetesmellitus?.monitor_blood_glucose_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Monitor blood glucose levels before meals
                                      and at bedtime to control
                                    </b>
                                    <br />
                                    <p className="pl-4">
                                      It is important to check Fasting Blood sugars every morning along with 2 hours after every meal. Blood glucose testing is one part of managing your diabetes successfully.
                                      Testing your blood glucose both before and after a meal allows you to see how that meal affects your blood glucose levels and helps you to understand which meals may be best for your blood glucose control.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">
                                  {
                                    diabetesmellitus?.monitor_blood_glucose_start_date
                                  }
                                </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    diabetesmellitus?.monitor_blood_glucose_end_date
                                  }
                                </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>
                                  {
                                    diabetesmellitus?.monitor_blood_glucose_status
                                  }
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 1 ENDS */}

                        {/* GOAL 2 STARTS */}
                        {diabetesmellitus?.goal2_status !== "" && diabetesmellitus?.goal2_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7}>
                                <b> To Understand the importance of Diabetic Diet </b>
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {diabetesmellitus?.goal2_status}
                              </td>
                            </tr>

                            {typeof diabetesmellitus?.abc_of_diabetes_status !== "undefined" && diabetesmellitus?.abc_of_diabetes_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Understanding A, B & C of Diabetes:
                                    </b>
                                    <p className="pl-4">
                                      Making changes to your diet is a key part of managing type 2 diabetes. You may have heard of the "ABCs of diabetes." This refers to three aspects of your health that should be well-controlled in order to manage your diabetes:
                                      <ul>
                                        <li>
                                          <b>A</b>A1C (a blood test that measures your average blood sugar level over the past few months)
                                        </li>
                                        <li>
                                          <b>B</b>lood Pressure.
                                        </li>
                                        <li>
                                          <b>C</b>holesterol.
                                        </li>
                                      </ul>
                                      Keeping your blood sugar at or near your goal level helps decrease the risk of complications that can affect the eyes, kidneys, and nerves. Keeping your blood pressure and cholesterol levels under control helps reduce your risk of cardiovascular (heart) disease, which is a common complication of type 2 diabetes.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.abc_of_diabetes_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.abc_of_diabetes_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.abc_of_diabetes_status} </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.undercontrol_weight_status !== "undefined" && diabetesmellitus?.undercontrol_weight_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Keeping your Weight under control
                                    </b>

                                    <p className="pl-4">
                                      Many factors affect how well a person's diabetes is controlled. You can reduce your risk of complications by following your health care provider's guidance around diet,
                                      exercise, blood sugar monitoring, and medication regimens. Dietary changes are typically focused on eating nutritious foods and getting to (and maintaining) a healthy weight.
                                      If you take insulin, you may also need to be consistent about what you eat and when.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{diabetesmellitus?.undercontrol_weight_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.undercontrol_weight_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.undercontrol_weight_status} </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.assess_the_pattern_status !== "undefined" && diabetesmellitus?.assess_the_pattern_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Seeing a Dietician.
                                    </b>
                                    <p className="pl-4">
                                      Having to pay careful attention to your diet can be challenging.
                                      It can help to work with a dietitian to create a plan that is tailored to your specific situation (including what diabetes medications you take),
                                      lifestyle, and personal preferences.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.seeing_dietician_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.seeing_dietician_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.seeing_dietician_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 2 ENDS */}

                        {/* GOAL 3 STARTS */}
                        {diabetesmellitus?.goal3_status !== "" && diabetesmellitus?.goal3_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To Understand Hypoglycemia, hyperglycemia and how to prevent them
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {diabetesmellitus?.goal3_status}
                              </td>
                            </tr>

                            {typeof diabetesmellitus?.signs_of_hyperglycemia_status !== "undefined" && diabetesmellitus?.signs_of_hyperglycemia_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Assess for signs of hyperglycemia/hypoglycemia
                                    </b>
                                    <p className="pl-4">
                                      Hyperglycemia can become an emergency if you begin to develop symptoms of DKA: shortness of breath, fruity-smelling breath, nausea and vomiting, confusion, or you lose consciousness. Likewise, hypoglycemia requires emergency care if you begin to experience confusion, a loss of consciousness, or seizures.
                                    </p>
                                    <p className="pl-4">
                                      If you start experiencing symptoms of DKA or severe hypoglycemia, or if a loved one notices signs of these symptoms, seek medical care immediately.
                                    </p>
                                    <p className="pl-4">
                                      Talk to your healthcare team if you are experiencing frequent episodes of hyperglycemia and/or hypoglycemia, if your glucose is consistently above 240 mg/dL, or anytime you experience severe hypoglycemia.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{diabetesmellitus?.signs_of_hyperglycemia_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.signs_of_hyperglycemia_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.signs_of_hyperglycemia_status}</td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.prevention_of_hyperglycemia_status !== "undefined" && diabetesmellitus?.prevention_of_hyperglycemia_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Prevention of hyperglycemia by exercise to
                                      help lower blood sugar, follow your meal
                                      plan maintain a healthy weight, don't
                                      smoke and limit alcohol
                                    </b>
                                    <p className="pl-4">
                                      Exercise to help lower blood sugar. Work with your healthcare provider to make a daily activity plan. Follow your meal plan if you have one.
                                      Learn how carbohydrates impact your blood sugar, and work with your diabetes care team to find the best meal plan for you. Maintain a healthy weight.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.prevention_of_hyperglycemia_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.prevention_of_hyperglycemia_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.prevention_of_hyperglycemia_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.lower_blood_sugar_status !== "undefined" && diabetesmellitus?.lower_blood_sugar_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Prevention of hypoglycemia to help lower
                                      blood sugar, follow your meal plan
                                      maintain a healthy weight, don't smoke and
                                      limit alcohol
                                    </b>
                                    <p className="pl-4">
                                      Monitor your blood sugar. Depending on your treatment plan, you may check and record your blood sugar level several times a week or multiple times a day.
                                      Careful monitoring is the only way to make sure that your blood sugar level remains within your target range.
                                    </p>
                                    <p className="pl-4">
                                      Don't skip or delay meals or snacks. If you take insulin or oral diabetes medication, be consistent about the amount you eat and the timing of your meals and snacks.
                                    </p>
                                    <p className="pl-4">
                                      Measure medication carefully and take it on time. Take your medication as recommended by your health care provider.
                                    </p>
                                    <p className="pl-4">
                                      Adjust your medication or eat additional snacks if you increase your physical activity.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.lower_blood_sugar_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.lower_blood_sugar_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.lower_blood_sugar_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 3 ENDS */}

                        {/* GOAL 4 STARTS */}
                        {diabetesmellitus?.goal4_status !== "" && diabetesmellitus?.goal4_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7}>
                                <b> To Understand the importance of Diabetic Eye exam. </b>
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {diabetesmellitus?.goal4_status}
                              </td>
                            </tr>

                            {typeof diabetesmellitus?.sugar_effect_on_eye_status !== "undefined" && diabetesmellitus?.sugar_effect_on_eye_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Understanding how high blood sugar effects Eyes
                                    </b>
                                    <p className="pl-4">
                                      There are several eye problems related to diabetes. The most common affects the retina, a layer at the back of the eye; this is called "diabetic retinopathy."
                                      In diabetic retinopathy, the small blood vessels in the retina grow abnormally and leak, which can lead to vision loss and eventually blindness if not treated.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.sugar_effect_on_eye_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.sugar_effect_on_eye_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.sugar_effect_on_eye_status}</td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.sugar_ways_to_effect_on_eye_status !== "undefined" && diabetesmellitus?.sugar_ways_to_effect_on_eye_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Understanding different ways Diabetes can affect the Eyes</b>
                                    <p className="pl-4">
                                      Other eye problems associated with diabetes include diabetic macular edema (swelling of the central area of the retina that has the sharpest vision),
                                      glaucoma (high pressure in the eyeball), and cataracts (clouding of the lens of the eye).
                                      Regular eye exams are essential for detecting retinopathy and other eye problems at an early stage, when the condition can be monitored and treated to preserve vision.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.sugar_ways_to_effect_on_eye_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.sugar_ways_to_effect_on_eye_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.sugar_ways_to_effect_on_eye_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 4 ENDS */}

                        {/* GOAL 5 STARTS */}
                        {diabetesmellitus?.goal5_status !== "" && diabetesmellitus?.goal5_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7}>
                                <b> To Understand the importance of Diabetic Foot Care. </b>
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {diabetesmellitus?.goal5_status}
                              </td>
                            </tr>

                            {typeof diabetesmellitus?.foot_nerves_damage_status !== "undefined" && diabetesmellitus?.foot_nerves_damage_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Understanding how Diabetic damage the nerves in the Foot.
                                    </b>
                                    <p className="pl-4">
                                      Diabetes can decrease blood flow to the feet and damage the nerves that carry sensation; this nerve damage is known as "diabetic neuropathy."
                                      Because people with neuropathy may lose their ability to sense pain, they are at increased risk for developing potentially serious foot-related complications such as ulcers.
                                      Foot complications are very common among people with diabetes and sometimes go unnoticed until symptoms become severe.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.foot_nerves_damage_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.foot_nerves_damage_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.foot_nerves_damage_status}</td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.protect_feet_status !== "undefined" && diabetesmellitus?.protect_feet_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>How to protect your feet in Diabetes?</b>
                                    <p className="pl-4">
                                      Although there is no way to reverse nerve damage once it has happened, there are things you can do to lower your risk of developing serious foot problems as a consequence.
                                      In addition to managing your glucose levels, doing regular exams to check for any changes in the feet also helps reduce the risk of serious foot problems.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.protect_feet_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.protect_feet_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.protect_feet_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.foot_examination_status !== "undefined" && diabetesmellitus?.foot_examination_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>How to do your foot examination?</b>
                                    <p className="pl-4">
                                      Self-exams and foot care — It is important to examine your feet every day. This should include looking carefully at all parts of your feet,
                                      especially the area between the toes. Look for broken skin, ulcers, blisters, areas of increased warmth or redness, or changes in callus formation;
                                      let your health care provider know if you notice if any of these changes or have any concerns.
                                    </p>
                                    <p>
                                      It may help to make the foot exam a part of your daily bathing or dressing routine. You might need to use a mirror to see the bottoms of your feet clearly.
                                      If you are unable to reach your feet or see them completely, even with a mirror, ask another person (such as a spouse or other family member) to help you.
                                      It is important to dry your feet thoroughly after bathing and wear cotton socks and comfortable, well-fitting shoes.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.foot_examination_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.foot_examination_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.foot_examination_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 5 ENDS */}

                        {/* GOAL 6 STARTS */}
                        {diabetesmellitus?.goal6_status !== "" && diabetesmellitus?.goal6_status !== "undefined" ? (
                          <>
                            <tr>
                              <td colSpan={7}>
                                <b> To understand Cardiovascular Complications secondary to Diabetes. </b>
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {diabetesmellitus?.goal6_status}
                              </td>
                            </tr>

                            {typeof diabetesmellitus?.death_cause_in_diabetes_status !== "undefined" && diabetesmellitus?.death_cause_in_diabetes_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Learning the leading cause of death in Diabetics.
                                    </b>
                                    <p className="pl-4">
                                      People with diabetes are at increased risk of cardiovascular disease, which can lead to heart attack and stroke. Cardiovascular disease is the leading cause of death in people with diabetes.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.death_cause_in_diabetes_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.death_cause_in_diabetes_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.death_cause_in_diabetes_status}</td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.risk_of_cardio_disease_status !== "undefined" && diabetesmellitus?.risk_of_cardio_disease_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Learning three ways to decrease the risk of Cardio-vascular disease?</b>
                                    <p className="pl-4">
                                      you have type 1 or type 2 diabetes, you can lower your risk of cardiovascular disease by Quitting Smoking, controlling cholesterol and daily use of aspirin.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.risk_of_cardio_disease_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.risk_of_cardio_disease_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.risk_of_cardio_disease_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.cholesterol_healthy_range_status !== "undefined" && diabetesmellitus?.cholesterol_healthy_range_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Learning to keep your cholesterol and triglyceride levels in a healthy range.</b>
                                    <p className="pl-4">
                                      Your health care provider can measure these with a blood test. In addition to making healthy lifestyle changes, most people with diabetes will also need to take a cholesterol-lowering medication.
                                      If you are over 40 years old or have multiple risk factors for cardiovascular disease (e.g., family history, high cholesterol, high blood pressure, or obesity),
                                      your doctor will likely prescribe a cholesterol-lowering medication called a statin.
                                      In people with diabetes, statins have been shown to decrease the future risk of heart attacks, strokes, and death, even when cholesterol levels are normal.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.cholesterol_healthy_range_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.cholesterol_healthy_range_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.cholesterol_healthy_range_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.low_dose_aspirin_status !== "undefined" && diabetesmellitus?.low_dose_aspirin_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Consider daily low-dose aspirin, depending on your other conditions.</b>
                                    <p className="pl-4">
                                      Most people with diabetes and heart disease (such as history of angina or heart attack) should take low-dose aspirin (for example, 81 mg per day).
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.low_dose_aspirin_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.low_dose_aspirin_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.low_dose_aspirin_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 6 ENDS */}

                        {/* GOAL 7 STARTS */}
                        {diabetesmellitus?.goal7_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7}>
                                <b>To understand Kidney complications secondary to diabetes. </b>
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {diabetesmellitus?.goal7_status}
                              </td>
                            </tr>

                            {typeof diabetesmellitus?.diabetes_effect_on_kidneys_status !== "undefined" && diabetesmellitus?.diabetes_effect_on_kidneys_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Understanding the effect of diabetes on Kidneys.
                                    </b>
                                    <p className="pl-4">
                                      Diabetes can alter the normal function of the kidneys. Kidney problems related to diabetes are referred to as "diabetic kidney disease" or by the older term, "diabetic nephropathy." Over time, diabetic kidney disease can lead to chronic kidney disease and even kidney failure.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.diabetes_effect_on_kidneys_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.diabetes_effect_on_kidneys_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.diabetes_effect_on_kidneys_status}</td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.know_how_kidneys_effected_status !== "undefined" && diabetesmellitus?.know_how_kidneys_effected_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>How to know if your kidneys are being affected by diabetes?</b>
                                    <p className="pl-4">
                                      To monitor your kidney function, your health care provider will check your blood creatinine level and use this to calculate an estimated glomerular filtration rate,
                                      or eGFR, which measures how well your kidneys are working. Your provider will also order urine tests to measure the amount of protein in your urine.
                                      When the kidneys are working normally, they prevent protein from leaking into the urine, so finding protein (measured as albumin) in the urine (even in very small amounts) may be an early sign of kidney damage.
                                      These tests are usually checked once yearly.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.know_how_kidneys_effected_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.know_how_kidneys_effected_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.know_how_kidneys_effected_status}
                                </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.protect_kidneys_status !== "undefined" && diabetesmellitus?.protect_kidneys_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>How to protect your kidneys if diabetes has started to damage it?</b>
                                    <p className="pl-4">
                                      A class of medications called sodium-glucose cotransporter 2 (SGLT2) inhibitors lowers blood glucose and blood pressure and prevents worsening of kidney function in people with early kidney damage, especially when the urine albumin level is high.
                                    </p>
                                    <p>

                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.protect_kidneys_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.protect_kidneys_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.protect_kidneys_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 7 ENDS */}

                        {/* GOAL 7 STARTS */}
                        {diabetesmellitus?.goal8_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7}>
                                <b>To recognize the importance if Blood Pressure control in diabetic patients. </b>
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {diabetesmellitus?.goal8_status}
                              </td>
                            </tr>

                            {typeof diabetesmellitus?.bp_recommendation_status !== "undefined" && diabetesmellitus?.bp_recommendation_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      What should be your BP if you are diabetic?
                                    </b>
                                    <p className="pl-4">
                                      In general, experts recommend keeping blood pressure below 130/80 mmHg for adults with diabetes.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.bp_recommendation_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.bp_recommendation_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.bp_recommendation_status}</td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.how_to_lower_bp_status !== "undefined" && diabetesmellitus?.how_to_lower_bp_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>How to lower your BP?</b>
                                    <p className="pl-4">
                                      If you need to lower your blood pressure, your provider will probably recommend lifestyle changes such as weight loss, exercise,
                                      changing your diet (to cut back on salt and processed foods and eat more fruits, vegetables, and whole grains),
                                      quitting smoking (if you smoke), and cutting back on alcohol. Most people with type 2 diabetes also need to take medications to keep their blood pressure within the goal range.
                                      Your health care provider can talk to you about the benefits and risks of the different treatment options.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.how_to_lower_bp_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.how_to_lower_bp_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.how_to_lower_bp_status}
                                </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 8 ENDS */}

                        {/* GOAL 9 STARTS */}
                        {diabetesmellitus?.goal9_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To recognize the signs and symptoms of
                                exacerbation that must be reported to the
                                doctor/nurse
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>{diabetesmellitus?.goal9_status}</td>
                            </tr>

                            {typeof diabetesmellitus?.monitor_hunger_and_fatigue_status !== "undefined" && diabetesmellitus?.monitor_hunger_and_fatigue_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Monitor hunger and fatigue
                                    </b>
                                    <br />
                                    <p className="pl-4">
                                      <ul>
                                        <li>
                                          <b>Fatigue:</b>Your body isn’t getting the energy it needs from the food you’re eating, so you may feel very tired.
                                        </li>
                                        <li>
                                          <b>Extreme hunger:</b>Even after you eat, you may still feel very hungry. That’s because your muscles aren’t getting the energy they need from the food; your body’s insulin resistance keeps glucose from entering the muscle and providing energy.
                                          Therefore, the muscles and other tissues send a “hunger” message, trying to get more energy into the body.
                                        </li>
                                      </ul>
                                      Blood glucose fluctuation is often thought of as the first cause of fatigue and hunger in diabetes. Treating both conditions is most successful when regarded as whole, rather than separate, conditions. Healthy lifestyle habits, social support, and mental health therapies can positively impact on both at the same time.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.monitor_hunger_and_fatigue_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.monitor_hunger_and_fatigue_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.monitor_hunger_and_fatigue_status} </td>
                              </tr>
                            ) : null}

                            {typeof diabetesmellitus?.assess_frequent_urination_status !== "undefined" && diabetesmellitus?.assess_frequent_urination_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Assess Frequent urination, dry mouth, or blurred vision
                                    </b>
                                    <p className="pl-4">
                                      <b>Frequent urination:</b>This is related to drinking so much more to satisfy your thirst.
                                      Since you’re drinking more, you’ll have to urinate more. Additionally, the body will try to get rid of the excess glucose through urination.
                                    </p>
                                    <p className="pl-4">
                                      <b>Blurry vision:</b>To get more fluid into the blood to counteract the high blood glucose level, your body may pull fluid from the eyes.
                                      You may have trouble focusing then, leading to blurry vision.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {diabetesmellitus?.assess_frequent_urination_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.assess_frequent_urination_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {diabetesmellitus?.assess_frequent_urination_status} </td>
                              </tr>
                            ) : null}
                            {typeof diabetesmellitus?.assess_slow_healing_status !== "undefined" && diabetesmellitus?.assess_slow_healing_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Assess slow healing of wound</b>
                                    <p className="pl-4">
                                      <b>Slow wound healing:</b> Like the body’s inability to fight off infections, it might take longer for wounds (even small cuts) to heal.
                                      The high blood glucose level affects how well the white blood cells (which are in charge of healing wounds) work.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{diabetesmellitus?.assess_slow_healing_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.assess_slow_healing_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{diabetesmellitus?.assess_slow_healing_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                      </>
                    )}
                    {/* {{--Diabetes Ends--}} */}

                    {/* {{-- COPD STARTS --}} */}
                    {chronicDiseases?.ChronicObstructivePulmonaryDisease && (
                      <>
                        <th colSpan={12} className="text-center table-primary">
                          COPD
                        </th>

                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Prognosis
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {copdassessment?.prognosis}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Assessment
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {copdassessment?.assessment}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan={7} className="text-center table-primary">
                            <span style={{ paddingLeft: "300px" }}>Goals</span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            <span
                              className="text-nowrap"
                              style={{ paddingRight: "10px" }}
                            >
                              Start Date
                            </span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            End Date
                          </th>
                          <th colSpan={1} className="text-center table-primary">
                            <span style={{ paddingRight: "25px" }}>Status</span>
                          </th>
                        </tr>

                        {/* GOAL 1 STARTED */}
                        {copdassessment?.goal1_status !== "" && copdassessment?.goal1_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Provide education on COPD.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {copdassessment?.goal1_status}
                              </td>
                            </tr>
                            {typeof copdassessment?.educate_on_disease_status !== "undefined" && copdassessment?.educate_on_disease_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="question-text mt-2 pl-4">
                                    <b>
                                      To educate the patient of symptoms and complications of COPD.
                                    </b>
                                    <p>
                                      At first, COPD often causes no symptoms. As it gets worse it can make you:
                                      <ul>
                                        <li> Feel short of breath, especially when you are moving around </li>
                                        <li> Wheeze (make a whistling or squeaking noise as you breathe) </li>
                                        <li> Cough and spit up sputum (mucus) </li>
                                        <li> Cough and spit up sputum (mucus) </li>
                                      </ul>
                                    </p>
                                    <p>
                                      People who have COPD are also at increased risk for:
                                      <ul>
                                        <li> Infections, such as pneumonia </li>
                                        <li> Lung cancer </li>
                                        <li> Heart problems </li>
                                      </ul>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{copdassessment?.educate_on_disease_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{copdassessment?.educate_on_disease_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{copdassessment?.educate_on_disease_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 1 ENDS */}

                        {/* GOAL 2 STARTS */}
                        {copdassessment?.goal2_status !== "" && copdassessment?.goal2_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Smoking Cessation.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {copdassessment?.goal2_status}
                              </td>
                            </tr>

                            {typeof copdassessment?.smoking_cessation_status !== "undefined" && copdassessment?.smoking_cessation_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To educate patients on the importance of smoking cessation (if applicable) for better COPD management.
                                    </b>
                                    <p className="pl-4">
                                      The most common cause of COPD is smoking. Smoke can damage the lungs forever and cause COPD.
                                      If you continue to smoke the damage to the lungs will continue and your COPD will continue to worsen.
                                      Quitting smoking might not repair the damage already done but will significantly reduce the progression of COPD, in addition,
                                      it will also lower the chances that you'll have a heart attack or stroke, and it will help you feel better and live longer.
                                      Quitting smoking is the most important thing that you can do for your health.
                                      This is true no matter how long you have smoked or how much you smoke.
                                      If you are having trouble quitting, your doctor can help as many options are available to assist you.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {copdassessment?.smoking_cessation_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.smoking_cessation_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.smoking_cessation_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 2 ENDS */}

                        {/* GOAL 3 STARTS */}
                        {copdassessment?.goal3_status !== "" && copdassessment?.goal3_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Lowering Risk of Infection
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {copdassessment?.goal3_status}
                              </td>
                            </tr>
                            {typeof copdassessment?.lowering_infection_risk_status !== "undefined" && copdassessment?.lowering_infection_risk_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Lowering Risk of Infection</b>
                                    <p className="pl-4">
                                      Certain infections can be very hard on your lungs and can cause COPD symptoms to flare up.
                                      You can lower your risk by getting certain vaccines. These include the flu shot every year,
                                      the pneumonia vaccine at least once, and the COVID-19 vaccine and boosters.
                                    </p>
                                    <p className="pl-4">
                                      In addition, wash your hands often and stay away from people who are sick. Wearing a face mask in crowded places can also help lower your risk of infection
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {copdassessment?.lowering_infection_risk_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.lowering_infection_risk_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.lowering_infection_risk_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 3 ENDS */}

                        {/* GOAL 4 STARTS */}
                        {copdassessment?.goal4_status !== "" && copdassessment?.goal4_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Lifestyle changes that can help with COPD.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {copdassessment?.goal4_status}
                              </td>
                            </tr>
                            {typeof copdassessment?.educate_on_lifestyle_status !== "undefined" && copdassessment?.educate_on_lifestyle_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate the patient on lifestyle changes.</b>
                                    <p className="pl-4">
                                      If things like fumes, pollution, or dust make your breathing worse, try to avoid these triggers.
                                      Eating a healthy diet can help improve your health.
                                      You can also improve your health by following your pulmonary rehab plan if you have one or finding other ways to move your body.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {copdassessment?.educate_on_lifestyle_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.educate_on_lifestyle_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.educate_on_lifestyle_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 4 ENDS */}

                        {/* GOAL 5 STARTS */}
                        {copdassessment?.goal5_status !== "" && copdassessment?.goal5_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Know when it is an emergency.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {copdassessment?.goal5_status}
                              </td>
                            </tr>
                            {typeof copdassessment?.educate_on_emergency_status !== "undefined" && copdassessment?.educate_on_emergency_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate the patient on when to contact emergency services.</b>
                                    <p>
                                      Call for an ambulance (in the US, call 9-1-1) if
                                      <ul>
                                        <li>You are having trouble breathing, even when you are resting.</li>
                                        <li>You are coughing up blood.</li>
                                        <li> You have signs of a heart attack, such as:</li>
                                        <ul>
                                          <li>
                                            Severe chest pain, pressure, or discomfort with:
                                          </li>
                                          <ul>
                                            <li>Trouble breathing, sweating, upset stomach, or cold clammy skin</li>
                                            <li>Pain in your arms, back, or jaw</li>
                                            <li>Worse pain with activities like walking upstairs</li>
                                          </ul>
                                        </ul>
                                        <li>Fast or irregular heartbeat</li>
                                        <li>Feeling dizzy, faint, or weak</li>
                                      </ul>
                                    </p>
                                    <p>
                                      Call your regular doctor if
                                      <ul>
                                        <li> You have a fever of 100.4°F (38°C) or higher or chills.</li>
                                        <li> You are feeling weak or more short of breath than usual when doing your normal activities.</li>
                                        <li> You have a new or worsening cough, wheezing, sputum, or shortness of breath.</li>
                                      </ul>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {copdassessment?.educate_on_emergency_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.educate_on_emergency_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.educate_on_emergency_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 5 ENDS */}

                        {/* GOAL 6 STARTS */}
                        {copdassessment?.goal6_status !== "" && copdassessment?.goal6_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Know when you are having a COPD flare.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {copdassessment?.goal6_status}
                              </td>
                            </tr>
                            {typeof copdassessment?.having_copd_flare_status !== "undefined" && copdassessment?.having_copd_flare_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>To educate patients on COPD flare.</b>
                                  <p className="pl-4">
                                    A COPD flare is when symptoms suddenly get worse. Doctors sometimes call flares "exacerbations."
                                    If you have a flare, you might need some new medicines until your symptoms improve.
                                    Or you might need to take medicine in a different way than through an inhaler for a while. Please contact your PCP right away in case of a flare-up.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {copdassessment?.having_copd_flare_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.having_copd_flare_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.having_copd_flare_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 6 ENDS */}

                        {/* GOAL 7 STARTS */}
                        {copdassessment?.goal7_status !== "" && copdassessment?.goal7_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Prevention of COPD flare.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {copdassessment?.goal7_status}
                              </td>
                            </tr>
                            {typeof copdassessment?.prevention_copd_flare_status !== "undefined" && copdassessment?.prevention_copd_flare_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>To educate the patient on the prevention of COPD flare.</b>
                                  <p className="pl-4">
                                    <b>To educate the patient on the prevention of COPD flare.</b>
                                    <p>
                                      If you have COPD, you need a flu shot every fall and the pneumonia vaccine at least once.
                                      You should also get vaccinated against COVID-19.
                                      This is because infections like the flu, pneumonia, and COVID-19 can be very hard on your lungs.
                                      It is important to try to prevent them.
                                    </p>
                                    <p>
                                      People who have more than 2 COPD flares a year might need medicine to help prevent them. These include:
                                      <ul>
                                        <li>
                                          Azithromycin – This is an antibiotic pill that is taken at a low dose.
                                          It can help prevent flares in some people but is not used in everyone with COPD.
                                          That's because azithromycin can cause other problems.
                                        </li>
                                        <li>
                                          Roflumilast – This medicine comes in a pill you take by mouth. It can help reduce flares in some people with chronic bronchitis and severe COPD.
                                        </li>
                                      </ul>
                                      <p>It is a good idea to keep a list of all the medicines you take and bring it with you every time you visit a doctor or nurse.</p>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {copdassessment?.prevention_copd_flare_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.prevention_copd_flare_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.prevention_copd_flare_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 7 ENDS */}

                        {/* GOAL 7 STARTS */}
                        {copdassessment?.goal8_status !== "" && copdassessment?.goal8_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Understand the importance of treatment adherence and regular follow-ups.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {copdassessment?.goal8_status}
                              </td>
                            </tr>
                            {typeof copdassessment?.followup_imp_status !== "undefined" && copdassessment?.followup_imp_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>To educate the patient on the importance of treatment adherence and regular follow-ups with PCP and Pulmonologist.</b>
                                  <p className="pl-4">
                                    It is very important that you understand the risks COPD poses to your health and to get better outcomes we need to manage COPD as best as we can.
                                    What you can do is regularly take your medications for COPD, quit smoking (if applicable), and schedule regular follow up with your Pulmonologist/PCP to be evaluated.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {copdassessment?.followup_imp_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.followup_imp_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {copdassessment?.followup_imp_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 7 ENDS */}
                      </>
                    )}
                    {/* {{-- COPD ENDS --}}*/}

                    {/*{{-- CKD START --}} */}
                    {chronicDiseases?.CKD && (
                      <>
                        <th colSpan={12} className="text-center table-primary">
                          CKD
                        </th>

                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Prognosis
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {ckdassessment?.prognosis}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Assessment
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {ckdassessment?.assessment}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={7} className="text-center table-primary">
                            <span style={{ paddingLeft: "290px" }}>Goals</span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            <span className="text-nowrap" style={{ paddingRight: "10px" }} >
                              Start Date
                            </span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            End Date
                          </th>
                          <th colSpan={1} className="text-center table-primary">
                            <span style={{ paddingRight: "25px" }}>Status</span>
                          </th>
                        </tr>

                        {/* GOAL 1 */}
                        {ckdassessment?.goal1_status !== "" && ckdassessment?.goal1_status !== undefined ? (
                          <>
                            {/* GOAL 1 */}
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Assess patient knowledge on CKD and its complications and educate on steps to prevent worsening of renal function.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {ckdassessment?.goal1_status}
                              </td>
                            </tr>
                            {/* TASKS */}
                            {typeof ckdassessment?.educate_on_ckd_status !== "undefined" && ckdassessment?.educate_on_ckd_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To educate patient on CKD.
                                    </b>
                                    <p className="pl-4">
                                      Chronic kidney disease ("CKD") is when the kidneys stop working as well as they should. When they are working normally, the kidneys filter the blood and remove waste and excess salt and water.
                                    </p>
                                    <p>
                                      In people with CKD, the kidneys slowly lose the ability to filter blood. In time, the kidneys can stop working completely. That is why it is so important to keep CKD from getting worse
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {ckdassessment?.educate_on_ckd_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.educate_on_ckd_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.educate_on_ckd_status} </td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.worsening_symptoms_status !== "undefined" && ckdassessment?.worsening_symptoms_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To educate patient on symptoms of worsening CKD.
                                    </b>
                                    <p className="pl-4">
                                      At first, CKD causes no symptoms. As the disease gets worse, it can:
                                      <ul>
                                        <li>Make your feet, ankles, or legs swell (doctors call this "edema")</li>
                                        <li>Give you high blood pressure</li>
                                        <li>Damage your bones</li>
                                      </ul>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {ckdassessment?.worsening_symptoms_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.worsening_symptoms_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.worsening_symptoms_status} </td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.followup_importance_status !== "undefined" && ckdassessment?.followup_importance_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To understand the importance of follow up with PCP and nephrologist if needed for management of CKD.
                                    </b>
                                    <p className="pl-4">
                                      Your doctor will want to see you regularly. You will probably have appointments at least once a year, and you will get regular tests to check your kidneys. These include blood and urine tests.
                                    </p>
                                    <p>
                                      If your CKD gets worse over time, you will probably need to see a "nephrologist." This is a doctor who takes care of people with kidney disease.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {ckdassessment?.followup_importance_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.followup_importance_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.followup_importance_status} </td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.prevent_worsening_status !== "undefined" && ckdassessment?.prevent_worsening_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To understand what the patient can do to prevent worsening of kidney function.
                                    </b>
                                    <p className="pl-4">
                                      If you have CKD, you can protect your kidneys if you:
                                      <ul>
                                        <li>Take all of your prescribed medicines every day, and follow all of your doctor's instructions for how to take them.</li>
                                        <li>Keep your blood sugar in a healthy range, if you have diabetes.</li>
                                        <li>Change your diet, if your doctor or nurse recommends to. They might suggest working with a dietitian (nutrition expert).</li>
                                        <li>Quit smoking, if you smoke.</li>
                                        <li>Lose weight, if you are overweight.</li>
                                      </ul>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.prevent_worsening_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.prevent_worsening_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.prevent_worsening_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.aviod_medications_status !== "undefined" && ckdassessment?.aviod_medications_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To learn about the medication that you should avoid
                                    </b>
                                    <p className="pl-4">
                                      Avoid medicines that can harm the kidneys – One example is "nonsteroidal antiinflammatory drugs," or "NSAIDs." These medicines include ibuprofen (sample brand names: Advil, Motrin) and naproxen (sample brand name: Aleve). There are other medicines that people with CKD need to avoid, too. Check with your doctor, nurse, or kidney specialist before starting any new medicines or supplements, even those you can buy without a prescription.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {ckdassessment?.aviod_medications_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.aviod_medications_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.aviod_medications_status} </td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.ckd_treatment_status !== "undefined" && ckdassessment?.ckd_treatment_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To understand how CKD is treated and importance of treatment compliance.
                                    </b>
                                    <p className="pl-4">
                                      People in the early stages of CKD can take medicines to keep the disease from getting worse. For example, many people with CKD should take medicines known as "ACE inhibitors" or "angiotensin receptor blockers." If your doctor prescribes these medicines, it is very important that you take them every day as directed. If they cause side effects or cost too much, tell your doctor. They might have solutions to offer.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.ckd_treatment_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.ckd_treatment_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.ckd_treatment_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 1 ENDS */}

                        {/* GOAL 2 STARTS */}
                        {ckdassessment?.goal2_status !== "" && ckdassessment?.goal2_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Assess patient knowledge on risk factors of CKD and ways to prevent developing CKD.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {ckdassessment?.goal2_status}
                              </td>
                            </tr>

                            {/* TASKS */}
                            {typeof ckdassessment?.educate_on_risk_factors_status !== "undefined" && ckdassessment?.educate_on_risk_factors_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate on factors that can increase risk of developing CKD. </b>
                                    <p>
                                      A number of factors can increase the risk of developing CKD, including:
                                      <ul>
                                        <li>Diabetes mellitus</li>
                                        <li>High blood pressure</li>
                                        <li>A family history of kidney disease</li>
                                        <li>Obesity</li>
                                        <li>Smoking</li>
                                        <li>Older age</li>
                                        <li>Having protein in the urine</li>
                                        <li>Having autoimmune diseases such as lupus</li>
                                        <li>Being from a Black population or belonging to certain other underrepresented groups.</li>
                                      </ul>
                                      If you have one or more of these risk factors you are at an increased risk so in order to lower the chances of developing CKD you should work with your PCP on addressing these factors if possible.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {ckdassessment?.educate_on_risk_factors_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.educate_on_risk_factors_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.educate_on_risk_factors_status} </td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.educate_on_lowering_risk_status !== "undefined" && ckdassessment?.educate_on_lowering_risk_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To educate patient on lowering the risk of CKD development and rate of CKD progression.
                                    </b>

                                    <p className="pl-4">
                                      The first step in the treatment of CKD is to determine the underlying cause. Some causes are reversible, including use of medications that impair kidney function, blockage in the urinary tract, or decreased blood flow to the kidneys. Treatment of reversible causes may prevent CKD from worsening.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {ckdassessment?.educate_on_lowering_risk_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.educate_on_lowering_risk_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {ckdassessment?.educate_on_lowering_risk_status} </td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.hypertension_effects_risk_status !== "undefined" && ckdassessment?.hypertension_effects_risk_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Understanding effects of Hypertension on Kidneys
                                    </b>
                                    <p>
                                      Hypertension, or high blood pressure, is present in 80 to 85 percent of people with CKD. Maintaining good blood pressure control is the most important goal for trying to slow the progression of CKD. Taking a medication called an angiotensin-converting enzyme (ACE) inhibitor or angiotensin receptor blocker (ARB) reduces blood pressure and levels of protein in the urine and is thought to slow the progression of CKD to a greater extent than some of the other medicines used to treat high blood pressure. Newer medications have also become available in recent years that work with ACE inhibitors or ARBs to slow the progression of CKD.
                                    </p>
                                    <p>
                                      Sometimes, a diuretic (water pill) or other medication is also added. You may be asked to monitor your blood pressure at home to be sure that your blood pressure is well controlled
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.hypertension_effects_risk_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.hypertension_effects_risk_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.hypertension_effects_risk_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.healthy_diet_status !== "undefined" && ckdassessment?.healthy_diet_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To understand healthy diet for Kidneys:
                                    </b>
                                    <p>
                                      Changes in your diet may be recommended to control or prevent some of the complications of CKD; most important is salt restriction to help control the blood pressure.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.healthy_diet_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.healthy_diet_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.healthy_diet_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.protein_effects_status !== "undefined" && ckdassessment?.protein_effects_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To understand effect of Protein on Kidneys:
                                    </b>
                                    <p>
                                      Restricting protein in the diet may slow the progression of CKD, although it is not clear if the benefits of protein restriction are worth the difficulty of sticking to a low-protein diet, particularly when other medications to slow progression of CKD are used. Although a reduced-protein diet may delay dialysis for several years, the unappetizing nature of the diet is difficult for most people to tolerate. Speak to your health care provider about the advantages and disadvantages of a low-protein diet. Some people may benefit from a plant-based diet.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.protein_effects_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.protein_effects_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.protein_effects_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.elevated_cholesterol_status !== "undefined" && ckdassessment?.elevated_cholesterol_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To understand health effects of elevated Cholesterol and triglycerides with CKD
                                    </b>
                                    <p>
                                      High cholesterol and triglyceride levels are common in people with kidney disease. High triglycerides have been associated with an increased risk of coronary artery disease, which can lead to heart attack.
                                    </p>
                                    <p>
                                      Treatments to reduce the risk of coronary artery disease are usually recommended, including dietary changes, medications for high triglyceride and cholesterol levels, stopping smoking, and tight blood sugar control in people with diabetes.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.elevated_cholesterol_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.elevated_cholesterol_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.elevated_cholesterol_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {ckdassessment?.goal3_status !== "" && ckdassessment?.goal3_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Assess patient knowledge on Diabetic Kidney Disease.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {ckdassessment?.goal3_status}
                              </td>
                            </tr>

                            {typeof ckdassessment?.educate_on_dkd_status !== "undefined" && ckdassessment?.educate_on_dkd_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To educate patient on DKD.
                                    </b>
                                    <p>
                                      The key complication of diabetic kidney disease is more advanced kidney disease, called chronic kidney disease. People who develop diabetic kidney disease usually have no symptoms early on, although the condition puts them at risk of developing more serious kidney disease.
                                    </p>
                                    <p>
                                      The kidneys play an important role in the body: they filter the blood, removing waste products and excess salt and water. If the kidneys become diseased, they falter in their task, leaving the blood polluted.
                                    </p>
                                    <p>
                                      Finding out that you have early diabetic kidney disease can alert you that your kidneys are in danger. It is important to take steps to protect your kidneys before the problem advances. Information about advanced kidney disease is also available.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.educate_on_dkd_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.educate_on_dkd_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.educate_on_dkd_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.dkd_symptoms_status !== "undefined" && ckdassessment?.dkd_symptoms_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate patient on DKD symptoms. </b>
                                    <p>
                                      Diabetic kidney disease commonly causes no symptoms until at least 80 percent of your kidneys' function is lost. To detect diabetic kidney disease, health care providers rely on tests that measure protein (albumin) levels in the urine and blood tests to evaluate the level of kidney function.
                                    </p>
                                    <p>
                                      When the kidneys are working normally, they prevent albumin from leaking into the urine, so finding albumin in the urine is a sign that the kidneys are in trouble. Often people who have diabetic kidney disease also have high blood pressure.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.dkd_symptoms_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.dkd_symptoms_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.dkd_symptoms_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.dkd_risk_factors_status !== "undefined" && ckdassessment?.dkd_risk_factors_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate patient on risk factors of DKD. </b>
                                    <p>
                                      Having a family history of kidney disease or belonging to certain ethnic groups (eg, African American, Mexican, Pima Indian) can increase your risk of diabetic kidney disease. Although you cannot do anything to change your family history, there are several factors that increase your risk of developing diabetic kidney disease that you can change and control. These include:
                                      <ul>
                                        <li>Having chronically elevated blood sugar levels</li>
                                        <li>Being overweight or obese</li>
                                        <li>Smoking</li>
                                        <li>Having high blood pressure</li>
                                        <li>Having high cholesterol</li>
                                        <li>Having a diabetes-related vision problem (diabetic retinopathy) or nerve damage (diabetic neuropathy)</li>
                                      </ul>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.dkd_risk_factors_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.dkd_risk_factors_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.dkd_risk_factors_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.dkd_progression_status !== "undefined" && ckdassessment?.dkd_progression_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate patient on prevention of progression of DKD. </b>
                                    <p>
                                      People with diabetes often focus on keeping their blood sugar levels in the right ranges. And while it is important to control blood sugar, it turns out that controlling blood pressure is at least as important. That's because high blood sugar and high blood pressure work in concert to damage the blood vessels and organ systems.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.dkd_progression_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.dkd_progression_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.dkd_progression_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.healthy_lifestyle_effect_status !== "undefined" && ckdassessment?.healthy_lifestyle_effect_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate the effect of healthy lifestyle on DKD </b>
                                    <p>
                                      The most important things you can do to stall kidney disease and protect against other diabetes complications are to:
                                      <ul>
                                        <li>Make healty lifestyle choices</li>
                                      </ul>
                                      <p>
                                        Changing your lifestyle can have a big impact on the health of your kidneys. The following measures are recommended for everyone, but are especially important if you have diabetic kidney disease:
                                        <ul>
                                          <li>Limit the amount of sodium (salt) you eat to less than 2 grams per day) </li>
                                          <li>If you smoke, quit smoking </li>
                                          <li>Lose weight if you are overweight</li>
                                        </ul>
                                      </p>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.healthy_lifestyle_effect_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.healthy_lifestyle_effect_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.healthy_lifestyle_effect_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.blood_sugar_control_status !== "undefined" && ckdassessment?.blood_sugar_control_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate the effect of controlling blood sugar </b>
                                    <p>
                                      <ul>
                                        <li>Keep your blood sugar as close to normal as possible.</li>
                                      </ul>
                                      Keeping blood sugars close to normal can help prevent the long-term complications of diabetes mellitus. For most people, a target for fasting blood glucose and for blood glucose levels before each meal is 80 to 120 mg/dL (4.4 to 6.6 mmol/L); however, these targets may need to be individualized.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.blood_sugar_control_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.blood_sugar_control_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.blood_sugar_control_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.hba1c_importance_status !== "undefined" && ckdassessment?.hba1c_importance_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate importance of HBA1C </b>
                                    <p>
                                      A blood test called A1C is also used to monitor blood sugar levels; the result provides an average of blood sugar levels over the last one to three months. An A1C of 7 percent or less is usually recommended; this corresponds to an average blood glucose of 150 mg/dL (8.3 mmol/L). Even small decreases in the A1C lower the risk of diabetes-related complications to some degree.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.hba1c_importance_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.hba1c_importance_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.hba1c_importance_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.control_blood_sugar_status !== "undefined" && ckdassessment?.control_blood_sugar_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate how to bring blood sugars under control </b>
                                    <p>
                                      Managing your blood sugar involves lifestyle changes (eg, diet and exercise) as well as medications. Type 1 diabetes is treated with insulin. For type 2 diabetes, other medications are often used; some are not recommended for use in people with kidney problems, while others may help slow the progression of kidney disease. Your doctors will work with you to determine what combination of medications is best for you.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.control_blood_sugar_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.control_blood_sugar_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.control_blood_sugar_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.bp_effect_on_dkd_status !== "undefined" && ckdassessment?.bp_effect_on_dkd_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate the effect of Blood Pressure on DKD </b>
                                    <p>
                                      Keep your blood pressure below 130/80, if possible
                                      <p>
                                        Many people with diabetes have hypertension (high blood pressure). Although high blood pressure causes few symptoms, it has two negative effects: it stresses the cardiovascular system and speeds the development of diabetic complications of the kidney and eye. A health care provider can diagnose high blood pressure by measuring blood pressure on a regular basis.
                                      </p>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.bp_effect_on_dkd_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.bp_effect_on_dkd_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.bp_effect_on_dkd_status}</td>
                              </tr>
                            ) : null}

                            {typeof ckdassessment?.hypertension_treatment_status !== "undefined" && ckdassessment?.hypertension_treatment_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate about the treatment of Hypertension</b>
                                    <p>
                                      The treatment of high blood pressure varies. If you have mild hypertension, your health care provider may recommend weight loss, exercise, decreasing the amount of salt in the diet, quitting smoking, and decreasing alcohol intake. These measures can sometimes reduce blood pressure to normal.
                                    </p>
                                    <p>
                                      If these measures are not effective or your blood pressure needs to be lowered quickly, your provider will likely recommend one of several high blood pressure medications. Your provider can discuss the pros and cons of each medication and the goals of treatment.
                                    </p>
                                    <p>
                                      A blood pressure reading below 130/80 is the recommended goal for most people with diabetic kidney disease, especially if you have more than 300 mg of albumin in your urine per day.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.hypertension_treatment_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.hypertension_treatment_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.hypertension_treatment_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {ckdassessment?.goal4_status !== "" && ckdassessment?.goal4_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Assess knowledge of association between CKD and Cardiovascular disease.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {ckdassessment?.goal4_status}
                              </td>
                            </tr>

                            {typeof ckdassessment?.ckd_heart_status !== "undefined" && ckdassessment?.ckd_heart_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      To educate patient on association between CKD and heart disease.
                                    </b>
                                    <p className="pl-4">
                                      There is a large body of evidence that patients with CKD have a substantial increase in cardiovascular risk that can be in part explained by an increase in traditional risk factors such as hypertension, diabetes, and the metabolic syndrome. CKD alone is also an independent risk factor for cardiovascular disease. So better management of CKD will result in lowering the risk of heart disease as well.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{ckdassessment?.ckd_heart_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.ckd_heart_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{ckdassessment?.ckd_heart_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                      </>
                    )}
                    {/* {{-- CKD ENDS --}} */}

                    {/* {{--Hypertension Starts--}} */}
                    {chronicDiseases?.Hypertensions && (
                      <>
                        <th colSpan={12} className="text-center table-primary">
                          Hypertension
                        </th>

                        <tr>
                          <th colSpan={2} style={{ paddingLeft: "2px" }}>
                            Prognosis
                          </th>
                          <td>
                            {hypertension?.prognosis}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={2}> BP Assessment </th>
                          <td>
                            {hypertension?.result?.map((items: string) => {
                              return (
                                <>
                                  {items} <br />
                                </>
                              );
                            })}
                          </td>
                        </tr>
                        <tr>
                          <th colSpan={2}>Assessment </th>
                          <td>
                            {hypertension?.assessment}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={7} className="text-center table-primary">
                            <span style={{ paddingLeft: "290px" }}>Goals</span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            <span className="text-nowrap" style={{ paddingRight: "10px" }} >
                              Start Date
                            </span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            End Date
                          </th>
                          <th colSpan={1} className="text-center table-primary">
                            <span style={{ paddingRight: "25px" }}>Status</span>
                          </th>
                        </tr>

                        {/* GOAL 1 STARTS */}
                        {hypertension?.goal1_status !== "" && hypertension?.goal1_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To acquire Knowledge about Hypertension and its effect on the multiple body organs.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {hypertension?.goal1_status}
                              </td>
                            </tr>

                            {/* TASKS */}
                            {typeof hypertension?.understanding_regarding_disease_status !== "undefined" && hypertension?.understanding_regarding_disease_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Educate patient on HTN and its long-term effects on the body. </b>
                                    <p className="pl-4">
                                      High blood pressure is a condition that puts you at risk for heart attack, stroke, and kidney disease.
                                      It does not usually cause symptoms. But it can be serious. So, it is very important to have good BP control.
                                      Most adults with hypertension have primary hypertension (formerly called "essential" hypertension), which means that the cause of the high blood pressure is not known.
                                      A small subset of adults has secondary hypertension, which means that there is an underlying and potentially correctable cause, usually a kidney or hormonal disorder.
                                      Unfortunately, many people's blood pressure is not well controlled. According to a national survey, hypertension was in good control in only 47 percent of adults.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{hypertension?.understanding_regarding_disease_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.understanding_regarding_disease_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.understanding_regarding_disease_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 1 ENDS */}

                        {/* GOAL 2 STARTS */}
                        {hypertension?.goal2_status !== "" && hypertension?.goal2_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To educate patient on Lifestyle modifications to help with better BP control.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {hypertension?.goal2_status}
                              </td>
                            </tr>

                            {/* TASKS STARTS */}
                            {typeof hypertension?.educate_about_dash_diet_status !== "undefined" && hypertension?.educate_about_dash_diet_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>Educate the patient about DASH diet</b>
                                  <p className="pl-4">
                                    DASH diet – The Dietary Approaches to Stop Hypertension (DASH) dietary pattern is high in vegetables, fruits,
                                    low-fat dairy products, whole grains, poultry, fish, and nuts and low in sweets, sugar-sweetened beverages, and red meats.
                                    The DASH dietary pattern is consequently rich in potassium, magnesium, calcium, protein, and fiber but low in saturated fat, total fat, and cholesterol.
                                    Choose a diet rich in fruits, vegetables, and low-fat dairy products, and low in meats, sweets, and refined grains
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {hypertension?.educate_about_dash_diet_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {hypertension?.educate_about_dash_diet_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {hypertension?.educate_about_dash_diet_status} </td>
                              </tr>
                            ) : null}

                            {typeof hypertension?.educate_about_sodium_diet_status !== "undefined" && hypertension?.educate_about_sodium_diet_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>Educate patient about low sodium diet</b>
                                  <p className="pl-4">
                                    Eat less salt (sodium): The most important thing you can do to cut down on sodium is to eat less processed food.
                                    That means that you should avoid most foods that are sold in cans, boxes, jars, and bags.
                                    You should also eat in restaurants less often.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{hypertension?.educate_about_sodium_diet_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.educate_about_sodium_diet_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.educate_about_sodium_diet_status}</td>
                              </tr>
                            ) : null}

                            {typeof hypertension?.educate_about_excercise_status !== "undefined" && hypertension?.educate_about_excercise_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>Educate patient about importance of exercise</b>
                                  <p className="pl-4">
                                    Do something active for at least 30 minutes a day on most days of the week.
                                    If you don't do any activity now, start by walking for just a few minutes every other day. Do that for a few weeks.
                                    If you stick with it, try doing it for longer. But if you find that you don't like walking, try a different activity.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{hypertension?.educate_about_excercise_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.educate_about_excercise_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.educate_about_excercise_status}</td>
                              </tr>
                            ) : null}

                            {typeof hypertension?.educate_about_alcoholeffects_status !== "undefined" && hypertension?.educate_about_alcoholeffects_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>Educate patient on effects of alcohol on BP</b>
                                  <p className="pl-4">
                                    Limit the amount of alcohol you drink. (If applicable): If you are a woman, do not have more than 1 "standard drink" of alcohol a day.
                                    If you are a man, do not have more than 2. A "standard drink"
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{hypertension?.educate_about_alcoholeffects_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.educate_about_alcoholeffects_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.educate_about_alcoholeffects_status}</td>
                              </tr>
                            ) : null}

                            {typeof hypertension?.educate_about_smokingeffects_status !== "undefined" && hypertension?.educate_about_smokingeffects_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>Educate patients about the effect of smoking on BP</b>
                                  <p className="pl-4">
                                    If you have high blood pressure, it's also very important to quit smoking (if you smoke).
                                    Quitting smoking might not bring your blood pressure down.
                                    But it will lower the chances that you'll have a heart attack or stroke, and it will help you feel better and live longer.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{hypertension?.educate_about_smokingeffects_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.educate_about_smokingeffects_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.educate_about_smokingeffects_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 2 ENDS */}

                        {/* GOAL 3 STARTS */}
                        {hypertension?.goal3_status !== "" && hypertension?.goal3_status !== undefined ? (
                          <>
                            <tr>
                              <td
                                colSpan={7}
                                className="text-dark font-weight-bold"
                              >
                                Patient will understand the importance of Treatment Adherence and Regular BP monitoring.
                              </td>
                              <td colSpan={2}></td>
                              <td
                                colSpan={2}
                                style={{ paddingLeft: "10px" }}
                              ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {hypertension?.goal3_status}
                              </td>
                            </tr>

                            {/* TASKS STARTS */}
                            {typeof hypertension?.regular_bp_monitoring_status !== "undefined" && hypertension?.regular_bp_monitoring_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Explain to the patient the role of regular BP monitoring and treatment adherence in BP control.
                                    </b>
                                    <p className="pl-4">
                                      You need to adhere to your treatment regimen for optimal Blood pressure control.
                                      Forgetting to take medications can result in high BP which will increase the risk of complications.
                                      Also, you need to have an understanding of the medications you take for Blood pressure control.
                                      If you don’t know then please bring all the prescription medications at your next visit and ask your PCP.
                                      In addition to that, regular BP monitoring is very important as per the PCP/cardiologist recommendations.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{hypertension?.regular_bp_monitoring_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.regular_bp_monitoring_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.regular_bp_monitoring_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 3 ENDS */}

                        {/* GOAL 4 STARTS */}
                        {hypertension?.goal4_status !== "" && hypertension?.goal4_status !== undefined ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Regular Follow up with PCP.
                              </td>
                              <td colSpan={2}></td>
                              <td
                                colSpan={2}
                                style={{ paddingLeft: "10px" }}
                              ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {hypertension?.goal4_status}
                              </td>
                            </tr>

                            {/* TASKS STARTS */}
                            {typeof hypertension?.regular_pcp_folloup_status !== "undefined" && hypertension?.regular_pcp_folloup_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Patient will understand the importance of regular follow ups with PCP for BP monitoring as well as overall health assessment periodically.
                                    </b>
                                    <p className="pl-4">
                                      Regularly seeing your PCP to be evaluated for your overall health and being specifically assessed for Blood Pressure monitoring is important. Changes in lifestyle and diet as well as other contributing factors can cause Blood Pressure to be affected and your treatment may need to be adjusted based on that.
                                      Therefore, it is important to regularly follow up to be evaluated for Blood Pressure as well as other health issues.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{hypertension?.regular_pcp_folloup_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.regular_pcp_folloup_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{hypertension?.regular_pcp_folloup_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                        {/* GOAL 4 ENDS */}
                        {/* {{--Hypertension Ends--}} */}
                      </>
                    )}


                    {/* {{--OBESITY START--}} */}
                    {chronicDiseases?.Obesity && (
                      <>
                        <th colSpan={12} className="text-center table-primary">
                          OBESITY
                        </th>

                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Prognosis
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {obesity?.prognosis}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Assessment
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {obesity?.assessment}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={7} className="text-center table-primary">
                            <span style={{ paddingLeft: "290px" }}>Goals</span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            <span
                              className="text-nowrap"
                              style={{ paddingRight: "10px" }}
                            >
                              Start Date
                            </span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            End Date
                          </th>
                          <th colSpan={1} className="text-center table-primary">
                            <span style={{ paddingRight: "25px" }}>Status</span>
                          </th>
                        </tr>

                        {/* GOAL 1 */}
                        {obesity?.goal1_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Assessment of patient knowledge on Obesity, BMI and its effect on overall health.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {obesity?.goal1_status}
                              </td>
                            </tr>

                            {typeof obesity?.bmi_awareness_status !== "undefined" && obesity?.bmi_awareness_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To gain education and awareness about BMI and current BMI range.</b>
                                    <p className="pl-4">
                                      Doctors use a special measure called "body mass index," or "BMI," to help understand a person's weight. Your weight and height are used to calculate your BMI. Based on this number, you fall into 1 of the following categories:
                                      <ul>
                                        <li>Underweight – BMI under 18.5</li>
                                        <li>Healthy weight – BMI between 18.5 and 24.9</li>
                                        <li>Overweight – BMI between 25 and 29.9</li>
                                        <li>Having obesity – BMI 30 or greater</li>
                                      </ul>
                                      Your doctor or nurse will often want to calculate your BMI at your medical appointments. But it's important to remember that your weight and BMI are just 1 piece of your overall health. Someone with a lower BMI might not be healthy overall, and someone with a higher BMI can still be healthy.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.bmi_awareness_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.bmi_awareness_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.bmi_awareness_status}</td>
                              </tr>
                            ) : null}

                            {typeof obesity?.weight_effect_status !== "undefined" && obesity?.weight_effect_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To understand how your weight affects your health.</b>
                                    <p className="pl-4">Having obesity increases the risks of many different health problems. It can also make it harder for you to move, breathe, and do other things that people who are at a healthy weight can do easily.</p>
                                    <p>People with obesity are more likely to get diabetes, heart disease, cancer, and lots of other health problems. People with obesity also live less time than people of normal weight. That's why it's important to try to keep your weight in a healthy range.</p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.weight_effect_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weight_effect_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weight_effect_status}</td>
                              </tr>
                            ) : null}

                            {typeof obesity?.maintain_healthy_weight_status !== "undefined" && obesity?.maintain_healthy_weight_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To understand the importance of maintaining a healthy weight.</b>
                                    <p className="pl-4">If you would like to lose weight, you can start by talking to your doctor or nurse. They can help you make a plan to lose weight in a healthy way. It can also help to work with a dietitian (food expert).</p>
                                    <p>In general, to lose weight, you have to eat fewer calories and move your body more.</p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.maintain_healthy_weight_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.maintain_healthy_weight_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.maintain_healthy_weight_status}</td>
                              </tr>
                            ) : null}

                            {typeof obesity?.advertised_diets_status !== "undefined" && obesity?.advertised_diets_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Understanding the effectiveness of different advertised diets.</b>
                                    <p className="pl-4">
                                      Studies have compared different diets such as the Atkins diet, the Zone diet, and the Weight Watchers diet. No specific diet is better than any other. Any diet that reduces the number of calories you eat can help you lose weight, as long as you stick with it. You should try to find an eating pattern that works for you. A dietitian can help you make healthy changes to your diet while making sure that you get the nutrients your body needs.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.advertised_diets_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.advertised_diets_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.advertised_diets_status}</td>
                              </tr>
                            ) : null}

                            {typeof obesity?.healthy_habits_status !== "undefined" && obesity?.healthy_habits_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Understanding the effectiveness of exercise and healthy habits.</b>
                                    <p className="pl-4">If you go on a diet for a short time, or increase your activity for a while, you might lose weight. But you will regain the weight if you go back to your old habits. Weight loss is about changing your habits for the long term.</p>
                                    <p>The best way to start is to make small changes and stick with them. Then, little by little, you can add new changes that you also stick with.</p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.healthy_habits_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.healthy_habits_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.healthy_habits_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {/* Goal 2 */}
                        {obesity?.goal2_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Assess knowledge on weight loss techniques and make a plan on working on weight loss with lifestyle changes and other measures.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {obesity?.goal2_status}
                              </td>
                            </tr>

                            {/* TASK 1 */}
                            {typeof obesity?.weight_loss_program_status !== "undefined" && obesity?.weight_loss_program_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    To educate patient on starting a weight loss program.
                                  </b>
                                  <p className="pl-4">
                                    It can really help to find a health care professional who has experience in helping people lose weight and make the lifestyle changes needed to keep the weight off. This could be a doctor, nurse, or other provider like a nurse practitioner or physician assistant. Developing a relationship with this person will help improve your chances of long-term success, as they can help you figure out the best plan for you, monitor your process, and provide advice and support along the way.
                                  </p>
                                  <p>
                                    Different approaches and plans work for different people, so it's important to try not to get discouraged and to keep trying until you find something that works for you.
                                  </p>
                                  <p>
                                    Be careful about misinformation online and weight loss clinics with questionable ethics. Nothing out there is magic. Losing weight takes hard work, and keeping it off requires a plan that is sustainable long-term.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.weight_loss_program_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weight_loss_program_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weight_loss_program_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 2 */}
                            {typeof obesity?.bmi_importance_status !== "undefined" && obesity?.bmi_importance_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    Importance of BMI in Weight Loss Programs.
                                  </b>
                                  <p className="pl-4">
                                    The first step is to determine your starting point, which includes weighing yourself and measuring your waist circumference. The body mass index (BMI) is calculated from your height and weight.
                                    <ul>
                                      <li>A person with a BMI between 25 and 29.9 is considered overweight</li>
                                      <li>A person with a BMI of 30 or greater is considered to have obesity</li>
                                    </ul>
                                    The BMI measurement provides an estimate of a person's total body fat, which is why experts find it more useful for assessing cardiovascular risk than a person's weight alone. However, it's not a perfect measure because it does not factor in variability in body composition. While most professional medical societies continue to recommend using a person's BMI when assessing risk, an experienced health care provider will also consider other factors (including a person's overall health) when making recommendations for how to achieve and maintain a healthy weight.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.bmi_importance_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.bmi_importance_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.bmi_importance_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 3 */}
                            {typeof obesity?.waist_circumference_status !== "undefined" && obesity?.waist_circumference_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    Importance of waist circumference in weight loss.
                                  </b>
                                  <p className="pl-4">
                                    It can really help to find a health care professional who has experience in helping people lose weight and make the lifestyle changes needed to keep the weight off. This could be a doctor, nurse, or other provider like a nurse practitioner or physician assistant. Developing a relationship with this person will help improve your chances of long-term success, as they can help you figure out the best plan for you, monitor your process, and provide advice and support along the way.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.waist_circumference_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.waist_circumference_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.waist_circumference_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 4 */}
                            {typeof obesity?.treatment_type_status !== "undefined" && obesity?.treatment_type_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    Different type of treatments to lose weight.
                                  </b>
                                  <p className="pl-4">
                                    Types of treatment — Based on your situation and medical history, your health care provider can help you determine what combination of weight loss treatments would work best for you. Treatments must include changes in lifestyle, physical activity, approach to eating, and, in some cases, weight loss medicines or a surgical procedure. Weight loss surgery, also called bariatric surgery, is reserved for people with obesity who have not had success with other approaches.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.treatment_type_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.treatment_type_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.treatment_type_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 5 */}
                            {typeof obesity?.weight_loss_status !== "undefined" && obesity?.weight_loss_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    To understand the importance of setting weight loss goals.
                                  </b>
                                  <p className="pl-4">
                                    It is important to set a weight loss goal. Your first goal should be to avoid gaining more weight. Once you know your starting point, it is helpful to create milestones and health-related goals in order to start tracking your success.
                                  </p>
                                  <p>
                                    If you are overweight or have obesity, losing 5 percent of your body weight is a reasonable initial weight loss goal. In the longer term, losing more than 15 percent of your body weight and staying at this weight is an extremely good result. However, keep in mind that even losing 5 percent of your body weight leads to important health benefits, so although your ultimate weight loss goal may be greater, try not to get discouraged if you're not able to lose more than this initially.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.weight_loss_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weight_loss_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weight_loss_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 6 */}
                            {typeof obesity?.eating_triggers_status !== "undefined" && obesity?.eating_triggers_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    To understand the importance of “triggers” for eating.
                                  </b>
                                  <p className="pl-4">
                                    You can change your eating habits by breaking the chain of events between the trigger for eating and the act of eating. There are many ways to do this. For instance, you can:
                                    <ul>
                                      <li>Use a smaller plate for meals</li>
                                      <li>Make a conscious effort to eat more slowly</li>
                                      <li>Add more colorful (non-white) foods to your meals</li>
                                      <li>Keep healthy snacks (like chopped raw vegetables, fruits, and nuts) around in case you get hungry between meals</li>
                                    </ul>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.eating_triggers_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.eating_triggers_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.eating_triggers_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 7 */}
                            {typeof obesity?.healthy_unhealthy_status !== "undefined" && obesity?.healthy_unhealthy_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    Understand healthy and un-healthy food.
                                  </b>
                                  <p className="pl-4">
                                    The types of foods we eat on a regular basis are related to whether we gain or lose weight over time. Whole grains, fruits, vegetables, nuts, and yogurt are associated with maintaining a lower weight, while foods like French fries or chips, sugar-sweetened beverages, and red or processed meats are associated with weight gain. High fructose-containing beverages, trans fats, and highly processed foods are particularly harmful for health and maintaining a healthy weight.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.healthy_unhealthy_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.healthy_unhealthy_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.healthy_unhealthy_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 8 */}
                            {typeof obesity?.weightloss_factors_status !== "undefined" && obesity?.weightloss_factors_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    Understand different factors when losing weight.
                                  </b>
                                  <p className="pl-4">
                                    A calorie is a unit of energy found in food. Your body needs calories to function. If you are trying to lose weight, the goal of any eating plan is to burn up more calories than you eat.
                                  </p>
                                  <p>
                                    How quickly you lose weight on a given calorie intake depends upon several factors, such as your age, sex, and starting weight. In general:
                                    <ul>
                                      <li>Older people have a slower metabolism than young people, so it takes longer for them to lose weight.</li>
                                      <li>Males lose more weight than females of similar height and weight when dieting. This is because they have more muscle mass, which uses more energy.</li>
                                      <li>People who are extremely overweight lose weight more quickly than those who are only mildly overweight.</li>
                                    </ul>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.weightloss_factors_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weightloss_factors_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weightloss_factors_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 9 */}
                            {typeof obesity?.calories_needed_status !== "undefined" && obesity?.calories_needed_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    How many calories do I need?
                                  </b>
                                  <p className="pl-4">
                                    The number of calories you need per day depends on your current (or target) weight, sex, and activity level. Your health care provider can help you figure out this number and how to modify your diet accordingly.
                                  </p>
                                  <p>
                                    In general, it is best to choose foods that contain enough protein, carbohydrates, essential fatty acids, and vitamins. Try to avoid or at least limit alcohol, sugar-sweetened beverages (sodas and fruit drinks), and sweets (candy, cakes, cookies), since they have calories but generally lack important nutrients.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.calories_needed_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.calories_needed_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.calories_needed_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 10 */}
                            {typeof obesity?.calories_count_status !== "undefined" && obesity?.calories_count_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    Are meal replacement plans good to count calories?
                                  </b>
                                  <p className="pl-4">
                                    Portion-controlled diets — One simple way to diet is to buy pre-packaged foods, like frozen low-calorie meals or meal-replacement canned drinks or bars. A typical meal plan for one day may include:
                                    <ul>
                                      <li>A meal-replacement drink or breakfast bar for breakfast</li>
                                      <li>A meal-replacement drink or a frozen low-calorie (250 to 350 calories) meal for lunch</li>
                                      <li>A frozen low-calorie meal or other prepackaged, calorie-controlled meal, along with extra vegetables for dinner</li>
                                    </ul>
                                    This would give you 1000 to 1500 calories per day.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.calories_count_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.calories_count_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.calories_count_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 11 */}
                            {typeof obesity?.reduce_fat_status !== "undefined" && obesity?.reduce_fat_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    How to reduce fat in your diet?
                                  </b>
                                  <p className="pl-4">
                                    To reduce the amount of fat in your diet, you can:
                                    <ul>
                                      <li>Eat low-fat foods. You can look at the nutrition label to see how much fat is each serving of a food.</li>
                                      <li>Count fat grams. For a 1500-calorie diet, this would mean about 45 g or fewer of fat per day.</li>
                                    </ul>
                                    If you try a low-fat diet, you should increase the amount of healthy carbohydrates in your diet (e.g., whole grains, fruits, and vegetables).
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.reduce_fat_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.reduce_fat_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.reduce_fat_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 12 */}
                            {typeof obesity?.reduce_carbs_status !== "undefined" && obesity?.reduce_carbs_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    How to reduce Carbohydrate in your diet?
                                  </b>
                                  <p className="pl-4">
                                    Low- and very-low-carbohydrate diets (e.g., Atkins diet, South Beach diet, or "ketogenic" diet) are effective for weight loss and have become popular ways to lose weight quickly.
                                    <ul>
                                      <li>With a low-carbohydrate diet, you eat between 60 and 130 grams of carbohydrates per day.</li>
                                      <li>With a very-low-carbohydrate diet, you eat between 0 and 60 grams of carbohydrates per day (a standard diet contains 200 to 300 grams of carbohydrates).</li>
                                    </ul>
                                    Carbohydrates are found in fruits, vegetables, grains (including breads, rice, pasta, and cereal), alcoholic beverages, and dairy products. Meat and fish contain very few carbohydrates. If you try a low carbohydrate diet, it's important to make healthy choices for fat and protein (e.g., fish, nuts, beans); eating a lot of saturated fats (found in butter and red meat) can increase your cholesterol level and raise your risk of heart disease.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.reduce_carbs_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.reduce_carbs_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.reduce_carbs_status}</td>
                              </tr>
                            ) : null}

                            {typeof obesity?.mediterranean_diet_status !== "undefined" && obesity?.mediterranean_diet_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <b>
                                    What is a Mediterranean diet?
                                  </b>
                                  <p className="pl-4">
                                    The term "Mediterranean diet" refers to a way of eating that is common in olive-growing regions around the Mediterranean Sea. Although there is some variation in Mediterranean diets, there are some similarities. Most Mediterranean diets include:
                                    <ul>
                                      <li>A high level of monounsaturated fats (from olive or canola oil, walnuts, pecans, almonds) and a low level of saturated fats (from butter).</li>
                                      <li>A high number of vegetables, fruits, legumes, and grains (7 to 10 servings of fruits and vegetables per day).</li>
                                      <li>A moderate amount of milk and dairy products, mostly in the form of cheese. Use low-fat dairy products (skim milk, fat-free yogurt, low-fat cheese).</li>
                                      <li>A relatively low amount of red meat and meat products. Substitute fish or poultry for red meat.</li>
                                      <li>For those who drink alcohol, a modest amount (mainly as red wine) may help to protect against cardiovascular disease. A modest amount is up to one (4 ounce) glass per day for females and up to two glasses per day for males.</li>
                                    </ul>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.mediterranean_diet_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.mediterranean_diet_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.mediterranean_diet_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {/* Goal 3 */}

                        {obesity?.goal3_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                Assess Knowledge on Weight loss medications and supplements.
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {obesity?.goal3_status}
                              </td>
                            </tr>

                            {/* Task 1 */}
                            {typeof obesity?.weightloss_medication_status !== "undefined" && obesity?.weightloss_medication_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate on weight loss medications.</b>
                                    <p className="pl-4">
                                      Medication may be helpful for weight loss when used in combination with diet, exercise, and lifestyle changes. However, it is important to understand the risks, benefits, and limitations of these medicines. They can cause side effects that may be bothersome, and in many cases the long-term safety data are limited. In addition, these medicines may not be covered by insurance and can be expensive. Although weight loss medicines may not help you reach your "dream" weight, they can contribute to reducing your risk of diabetes or heart disease.
                                      <p>
                                        Weight loss medicines may be recommended for people who have not been able to lose weight with diet and exercise who have a:
                                        <ul>
                                          <li>Body mass index (BMI) of 30 or more.</li>
                                          <li>BMI between 27 and 29.9 and have other medical problems, such as diabetes, high cholesterol, or high blood pressure.</li>
                                        </ul>
                                      </p>
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.weightloss_medication_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weightloss_medication_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weightloss_medication_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 2 */}
                            {typeof obesity?.dietary_supplements_status !== "undefined" && obesity?.dietary_supplements_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate patient on Dietary supplements.</b>
                                    <h4>DIETARY SUPPLEMENTS NOT RECOMMENDED</h4>
                                    <p className="pl-4">
                                      Dietary supplements are widely used by people who are trying to lose weight. However, doctors <b>DO NOT</b> recommend their use because some are unsafe, and other supplements have not been studied carefully and there is no proof that they are safe or effective.
                                    </p>
                                    <p>
                                      Many herbal weight loss medicines are unsafe or do not work. Check with your doctor or pharmacist before you take any herbal weight loss medicines. There is also an over-the-counter (non-prescription) version of a prescription medicine called orlistat (brand name: Alli). It is probably safe to try, but it can cause unwanted side effects, such as cramps, burping, and gas.
                                    </p>
                                    <p>
                                      Some weight loss medicines are sold over the internet. However, they can contain harmful ingredients and be unsafe.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.dietary_supplements_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.dietary_supplements_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.dietary_supplements_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 3 */}
                            {typeof obesity?.weightloss_method_status !== "undefined" && obesity?.weightloss_method_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To educate on other weight loss methods.</b>
                                    <p className="pl-4">
                                      There are medicines and surgery to help with weight loss. But these treatments are only for people who have not been able to lose weight through diet and exercise.
                                    </p>
                                    <p>
                                      Weight loss treatments <b>DO NOT</b> take the place of diet and exercise. People who have those treatments must also change how they eat and how active they are.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.weightloss_method_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weightloss_method_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.weightloss_method_status}</td>
                              </tr>
                            ) : null}

                            {/* Task 4 */}
                            {typeof obesity?.seeing_dietitian_status !== "undefined" && obesity?.seeing_dietitian_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>To understand the importance of seeing a Dietitian.</b>
                                    <p className="pl-4">
                                      It can also help to work with a dietitian (food expert). They can help you make a diet plan that will be specifically designed for you and your requirements, a plan you can stick to and then you can follow up regularly with the dietitian to evaluate your progress.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{obesity?.seeing_dietitian_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.seeing_dietitian_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{obesity?.seeing_dietitian_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}
                      </>
                    )}
                    {/* {{--OBESITY END--}}

                    {{--CHF START --}} */}
                    {chronicDiseases?.CongestiveHeartFailure && (
                      <>
                        <th colSpan={12} className="text-center table-primary">
                          CHF
                        </th>

                        <tr>
                          <td colSpan={12}>{chfassessment?.careplan}</td>
                        </tr>

                        <tr>
                          <th colSpan={1} style={{ paddingLeft: "2px" }}>
                            Prognosis
                          </th>
                          <td style={{ textAlign: "left" }}>
                            {chfassessment?.prognosis}
                          </td>
                        </tr>

                        <tr>
                          <th colSpan={7} className="text-center table-primary">
                            <span style={{ paddingLeft: "300px" }}>Goals</span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            <span className="text-nowrap" style={{ paddingRight: "10px" }} >
                              Start Date
                            </span>
                          </th>
                          <th colSpan={2} className="text-center table-primary">
                            End Date
                          </th>
                          <th colSpan={1} className="text-center table-primary">
                            <span style={{ paddingRight: "25px" }}>Status</span>
                          </th>
                        </tr>

                        {chfassessment?.goal1_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To gain education about CHF and self-management
                                of the condition
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {chfassessment?.goal1_status}
                              </td>
                            </tr>
                            {typeof chfassessment?.understanding_regarding_disease_status !== "undefined" && chfassessment?.understanding_regarding_disease_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Assess the patient's current knowledge and
                                      understanding regarding disease
                                    </b>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{chfassessment?.understanding_regarding_disease_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.understanding_regarding_disease_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.understanding_regarding_disease_status}</td>
                              </tr>
                            ) : null}

                            {typeof chfassessment?.monitor_blood_pressure_status !== "undefined" && chfassessment?.monitor_blood_pressure_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Monitor blood pressure levels of patients
                                    </b>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{chfassessment?.monitor_blood_pressure_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.monitor_blood_pressure_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.monitor_blood_pressure_status}</td>
                              </tr>
                            ) : null}

                            {typeof chfassessment?.monitor_ECG_levels_status !== "undefined" && chfassessment?.monitor_ECG_levels_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Monitor ECG levels of patients</b>
                                  </p>
                                </td>
                                <td colSpan={2}> {chfassessment?.monitor_ECG_levels_start_date} </td>
                                <td colSpan={2} style={{ paddingLeft: "10px" }}> {chfassessment?.monitor_ECG_levels_end_date} </td>
                                <td colSpan={1} style={{ paddingLeft: "10px" }}> {chfassessment?.monitor_ECG_levels_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {chfassessment?.goal2_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand the importance of smoking
                                cessation and restricting alcohol intake
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {chfassessment?.goal2_status}
                              </td>
                            </tr>
                            {typeof chfassessment?.adequate_cardiac_status !== "undefined" && chfassessment?.adequate_cardiac_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Patient will demonstrate adequate cardiac
                                      output as evidenced by vital signs within
                                      acceptable limits, dysrhythmias
                                      absent/controlled, and no symptoms of
                                      failure (e.g., hemodynamic parameters
                                      within acceptable limits, urinary output
                                      adequate)
                                    </b>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{chfassessment?.adequate_cardiac_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.adequate_cardiac_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.adequate_cardiac_status}</td>
                              </tr>
                            ) : null}

                            {typeof chfassessment?.cerebral_hypoperfusion_status !== "undefined" && chfassessment?.cerebral_hypoperfusion_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      MONITOR Symptoms like Cerebral
                                      hypoperfusion occurs because of hypoxia to
                                      the brain from the decreased cardiac
                                      output. The patient may report this as
                                      confusion, forgetfulness, restlessness.
                                      Through assessment is necessary to
                                      evaluate for possible related conditions,
                                      including psychologic disorders.
                                      Depression is common among patients with
                                      heart failure and can lead to poor
                                      adherence to treatment plans.
                                    </b>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{chfassessment?.cerebral_hypoperfusion_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.cerebral_hypoperfusion_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.cerebral_hypoperfusion_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {chfassessment?.goal3_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand the importance of a low sodium
                                diet
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {chfassessment?.goal3_status}
                              </td>
                            </tr>

                            {typeof chfassessment?.pulmonary_hygiene_status !== "undefined" && chfassessment?.pulmonary_hygiene_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Give awareness to patient regarding
                                      pulmonary hygiene as needed
                                    </b>
                                    <p className="pl-4">
                                      Pulmonary hygiene, refers to exercises and
                                      procedures that help to clear your airways
                                      of mucus and other secretions. This
                                      ensures that your lungs get enough oxygen,
                                      and your respiratory system works
                                      efficiently. There are several pulmonary
                                      hygiene methods and approaches. Some can
                                      be done on your own at home, while others
                                      require a visit to your healthcare
                                      provider like breathing exercise, relaxed
                                      breathing, Huffing=This exercise requires
                                      you to “huff” by breathing hard out of
                                      your mouth, as though you were creating
                                      fog on a mirror. Spirometry, This method
                                      of strengthening and controlling your
                                      breathing uses a device called an
                                      incentive spirometer.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {chfassessment?.pulmonary_hygiene_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.pulmonary_hygiene_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.pulmonary_hygiene_status} </td>
                              </tr>
                            ) : null}

                            {typeof chfassessment?.respiratory_distress_status !== "undefined" && chfassessment?.respiratory_distress_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Keep the head of the bed elevated in case
                                      of respiratory distress
                                    </b>
                                    <p className="pl-4">
                                      Head-end elevation is known to improve
                                      oxygenation and respiratory mechanics. In
                                      poor lung compliance limits positive
                                      pressure ventilation causing delivery of
                                      inadequate minute ventilation (MVe). We
                                      observed that, in moderate-to-severe
                                      cases, the respiratory system compliance
                                      reduces upon elevating the head-end of the
                                      bed, and vice-versa, which can be utilized
                                      to improve ventilation and avoid
                                      respiratory distress.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {chfassessment?.respiratory_distress_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.respiratory_distress_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.respiratory_distress_status} </td>
                              </tr>
                            ) : null}

                            {typeof chfassessment?.monitor_ABG_levels_status !== "undefined" && chfassessment?.monitor_ABG_levels_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Monitor ABG levels of patients</b>
                                    <p className="pl-4">
                                      Your lungs and your kidneys do much of the
                                      work to keep your acid-base balance
                                      normal. So, the acid-base measurement from
                                      an ABG test can help diagnose and monitor
                                      conditions that affect your lungs and
                                      kidneys as well as many other conditions
                                      that may upset your acid-base balance.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top">{chfassessment?.monitor_ABG_levels_start_date}</td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.monitor_ABG_levels_end_date}</td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}>{chfassessment?.monitor_ABG_levels_status}</td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {chfassessment?.goal4_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To understand the importance of fluid
                                restriction for self-management of CHF
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {chfassessment?.goal4_status}
                              </td>
                            </tr>

                            {typeof chfassessment?.pulmonary_edemas_status !== "undefined" && chfassessment?.pulmonary_edemas_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>Monitoring of Pulmonary edemas</b>
                                    <p className="pl-4">
                                      Pulmonary edema is a condition caused by
                                      too much fluid in the lungs. This fluid
                                      collects in the many air sacs in the
                                      lungs, making it difficult to breathe. It
                                      needs to be monitor by feeling any
                                      difficulty in respiration.
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {chfassessment?.pulmonary_edemas_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.pulmonary_edemas_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.pulmonary_edemas_status} </td>
                              </tr>
                            ) : null}

                            {typeof chfassessment?.conditions_of_Arrhythmias_status !== "undefined" && chfassessment?.conditions_of_Arrhythmias_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Assess conditions of Arrhythmias,
                                      including extreme tachycardia and
                                      bradycardia
                                    </b>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {chfassessment?.conditions_of_Arrhythmias_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.conditions_of_Arrhythmias_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.conditions_of_Arrhythmias_status} </td>
                              </tr>
                            ) : null}

                            {typeof chfassessment?.cardiologist_visit_status !== "undefined" && chfassessment?.cardiologist_visit_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    <b>
                                      Check ECG and heart sound changes in every
                                      cardiologist visit.
                                    </b>
                                    <p className="pl-4">
                                      The electrocardiogram (ECG) at rest is a
                                      non-invasive investigation that is
                                      recommended in the initial evaluation of
                                      patients with heart failure (HF). This is
                                      because the ECG is crucial in the
                                      detection of many abnormalities that may
                                      either cause or worsen HF. Therefore it is
                                      important to evaluate any changes in your
                                      heart sound by ECG (ELECTRO CARDIO GRAM).
                                    </p>
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {chfassessment?.cardiologist_visit_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.cardiologist_visit_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.cardiologist_visit_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {chfassessment?.goal5_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" > To understand importance of daily weight monitoring and recording in a daily log </td>
                              <td colSpan={2} className="align-top"> {chfassessment?.uid_weight_monitoring_start_date} </td>
                              <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.uid_weight_monitoring_end_date} </td>
                              <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.uid_weight_monitoring_status} </td>
                            </tr>

                            {typeof chfassessment?.fluid_status_status !== "undefined" && chfassessment?.fluid_status_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    Evaluate fluid status by Monitor daily
                                    weights Assess for edema and severe
                                    diaphoresis Monitor electrolyte values and
                                    hematocrit level Verbalize understanding of
                                    individual dietary/fluid restrictions.
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {chfassessment?.fluid_status_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.fluid_status_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.fluid_status_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {chfassessment?.goal6_status !== "" ? (
                          <>
                            <tr>
                              <td colSpan={7} className="text-dark font-weight-bold" >
                                To recognize the signs of exacerbation which
                                must be reported to the doctor/nurse
                              </td>
                              <td colSpan={2}></td>
                              <td colSpan={2} style={{ paddingLeft: "10px" }} ></td>
                              <td colSpan={1} style={{ paddingLeft: "10px" }}>
                                {chfassessment?.goal6_status}
                              </td>
                            </tr>
                            {typeof chfassessment?.antiarrhythmias_status !== "undefined" && chfassessment?.antiarrhythmias_status !== "Not Started" ? (
                              <tr>
                                <td colSpan={7}>
                                  <p className="pl-4">
                                    Antiarrhythmias to increase cardiac
                                    performance Diuretics, to reduce venous and
                                    systemic congestion Iron and folic acid
                                    supplements to improve nutritional status
                                    Angiotensin-converting enzyme (ACE)
                                    inhibitors.These drugs relax blood vessels
                                    to lower blood pressure, improve blood flow
                                    and decrease the strain on the heart. Beta
                                    blockers.These drugs slow your heart rate
                                    and reduce blood pressure. Beta blockers may
                                    reduce signs and symptoms of heart failure,
                                    improve heart function. Digoxin
                                    (Lanoxin).This drug, also called digitalis,
                                    increases the strength of your heart muscle
                                    contractions
                                  </p>
                                </td>
                                <td colSpan={2} className="align-top"> {chfassessment?.antiarrhythmias_start_date} </td>
                                <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.antiarrhythmias_end_date} </td>
                                <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.antiarrhythmias_status} </td>
                              </tr>
                            ) : null}
                          </>
                        ) : null}

                        {typeof chfassessment?.followup_pcp_status !== "undefined" && chfassessment?.followup_pcp_status !== "Not Started" ? (
                          <tr>
                            <td colSpan={7} className="text-dark font-weight-bold" >
                              To understand the importance of regular follow-up
                              with PCP and cardiologist.
                            </td>
                            <td colSpan={2} className="align-top"> {chfassessment?.followup_pcp_start_date} </td>
                            <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.followup_pcp_end_date} </td>
                            <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.followup_pcp_status} </td>
                          </tr>
                        ) : null}

                        {typeof chfassessment?.importance_medication_status !== "undefined" && chfassessment?.importance_medication_status !== "Not Started" ? (
                          <tr>
                            <td colSpan={7} className="text-dark font-weight-bold" >
                              To recognize the importance of discipline in
                              taking all medications as prescribed.
                            </td>
                            <td colSpan={2} className="align-top"> {chfassessment?.importance_medication_start_date} </td>
                            <td colSpan={2} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.importance_medication_end_date} </td>
                            <td colSpan={1} className="align-top" style={{ paddingLeft: "10px" }}> {chfassessment?.importance_medication_status} </td>
                          </tr>
                        ) : null}
                      </>
                    )}
                    {/* {{--CHF END --}} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </Spin>
    </>
  );
};
export default CCMMonthlyCarePlan;
