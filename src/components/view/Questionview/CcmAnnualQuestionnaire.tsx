import { RootState } from "@/store/store";
import React, { useState, useEffect } from "react";
import { Button, Spin } from "antd";
import { PatientType, ProgramType } from "@/Types/CarePlan";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { setLoader } from "../../../store/reducer/QuestionairesReducer";
import { getQuestionnairList } from "../../../actions/AwvCarePlan/AwvCarePlanActions";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import { useNavigate } from "react-router";

const CcmAnnualQuestionnaire: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [servicedate, setServiceDate] = useState<any>();
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);
  const [fallscreening, setFallScreening] = useState<any>({} as any);
  const [cognitiveAssessment, setCognitiveAssessment] = useState<any>(
    {} as any
  );
  const [caregiverAssessment, setCaregiverAssessment] = useState<any>(
    {} as any
  );
  const [otherProvider, setOtherProvider] = useState<any>({} as any);
  const [immunization, setImmunization] = useState<any>({} as any);
  const [screening, setScreening] = useState<any>({} as any);
  const [generalAssessment, setGeneralAssessment] = useState<any>({} as any);
  const { loading, questionId, diagnosis } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );
  useEffect(() => {
    fetchawvcareplan();
  }, []);
  const dispatch = useAppDispatch();

  const activeDiagnosis = [] as any;

  Object.entries(diagnosis).map(([keys, values]) => {
    if (values === "true") {
      const val = keys
        .replace(/(_|-)/g, " ")
        .trim()
        .replace(/\w\S*/g, function (str) {
          return str.charAt(0).toUpperCase() + str.substr(1);
        })
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
      activeDiagnosis.push(val);
    }
  });

  function fetchawvcareplan() {
    dispatch(setLoader(true));
    getQuestionnairList(questionId).then(({ data: response }) => {
      dispatch(setLoader(false));
      setPatient(response.data.patient);
      setServiceDate(response.data.date_of_service);
      setProgram(response.data.program);
      setTitle("Annual Assessment");
      setFallScreening(response.data.questionaire.fall_screening);
      setCognitiveAssessment(response.data.questionaire.cognitive_assessment);
      setCaregiverAssessment(response.data.questionaire.caregiver_assessment);
      setOtherProvider(response.data.questionaire.other_Provider);
      setImmunization(response.data.questionaire.immunization);
      setScreening(response.data.questionaire.screening);
      setGeneralAssessment(response.data.questionaire.general_assessment);
    });
  }
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
  const dateFormat = "MM/DD/YYYY";
  const navigate = useNavigate();

  return (
    <Spin spinning={loading} indicator={antIcon}>
      <div className="card main-card" style={{ minHeight: "auto" }}>
        <div className="card-body">
          <h5 className="main-heading ">
            {program.short_name} {title}
          </h5>
          <div className="row">
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">Patient Name: {patient?.name}</h6>
            </div>
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">
                Date of Birth: {moment(patient?.dob).format(dateFormat)}
              </h6>
            </div>
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">Age: {patient?.age}</h6>
            </div>
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">Gender: {patient?.gender}</h6>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">
                Program: {program?.name} ({program?.short_name})
              </h6>
            </div>
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">Primary Care Physician: {patient?.pcp_name}</h6>
            </div>
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">CCM Coordinaotr: {patient?.coordinator_name}</h6>
            </div>
          </div>

          <div className="row">
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">
                CCM Annual Assessment Date:{" "}
                {moment(servicedate).format(dateFormat)}
              </h6>
            </div>
            <div className="col-lg-3 md-3 sm-3">
              <h6 className="d-inline ms-4">
                Next Due: {moment().startOf('year').add(1, 'year').format(dateFormat)}
              </h6>
              <div className="col-lg-9 md-3 sm-3 text-right">
                <Button type="primary" onClick={() => navigate("/Questionnaires")} >
                  Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className=" col-md-12 col-lg-12">
            <div className="card mb-3">
              <div className="card-body ">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Physical Health - Fall Screening
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>Have you fallen in the past 1 year? </td>
                      <td className="font-weight-bold text-right text-dark">
                        {fallscreening?.fall_in_one_year}
                      </td>
                    </tr>
                    <tr>
                      <td> Number of times you fell in last 1 year?</td>
                      <td className="font-weight-bold text-right text-dark">
                        {fallscreening?.number_of_falls}
                      </td>
                    </tr>
                    <tr>
                      <td> Was their any injury?</td>
                      <td className="font-weight-bold text-right text-dark">
                        {fallscreening?.injury}
                      </td>
                    </tr>
                    <tr>
                      <td> Physical Therapy?</td>
                      <td className="font-weight-bold text-right text-dark">
                        {fallscreening?.physical_therapy}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Do you feel unsteady or do thing move when standing or
                        Walking ?
                      </td>
                      <td className="font-weight-bold text-right text-dark">
                        {fallscreening?.unsteady_todo_things}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Do you feel like “blacking out” when getting up from bed
                        or chair?
                      </td>
                      <td className="font-weight-bold text-right text-dark">
                        {fallscreening?.blackingout_from_bed}
                      </td>
                    </tr>
                    <tr>
                      <td>Do you use any assistance device?</td>
                      <td className="font-weight-bold text-right text-dark">
                        {fallscreening?.assistance_device}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className=" col-md-12 col-lg-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Cognitive Assessment
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>Score</td>
                      <td className="font-weight-bold text-right text-dark">
                        {cognitiveAssessment?.score}
                      </td>
                    </tr>

                    <tr>
                      <td>What year is it?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {cognitiveAssessment?.year_recalled}
                      </td>
                    </tr>

                    <tr>
                      <td>What month is it?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {cognitiveAssessment?.month_recalled}
                      </td>
                    </tr>
                    <tr>
                      <td>About what time is it (within 1 hour) ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {cognitiveAssessment?.hour_recalled}
                      </td>
                    </tr>
                    <tr>
                      <td>Count backwards from 20-1.</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {cognitiveAssessment?.reverse_count}
                      </td>
                    </tr>
                    <tr>
                      <td>Say the months of the year in reverse.</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {cognitiveAssessment?.reverse_month}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Repeat address phrase John, Smith, 42, High St, Bedford
                      </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {cognitiveAssessment?.address_recalled}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className=" col-md-12 col-lg-12"></div>
        </div>

        <div className="row">
          <div className=" col-md-12 col-lg-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Caregiver Assessment
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>
                        In the past 7 days, did you need help from others to
                        perform every day activities such as eating, getting
                        dressed, grooming, bathing, walking or using the toilet?
                      </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {caregiverAssessment?.every_day_activities}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        In the past 7 days, did you need help from others to
                        take care of things such as laundry, house-keeping,
                        banking, shopping, using the telephone, food
                        preparation, transportation or taking your own
                        medications?
                      </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {caregiverAssessment?.medications}
                      </td>
                    </tr>
                    <tr>
                      <td>
                        Do You have a Care giver to help take care of ADLs?
                      </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {caregiverAssessment?.adls}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className=" col-md-12 col-lg-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Other Providers
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>Do you see any other Provider beside PCP?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {otherProvider?.other_provider_beside_pcp}
                      </td>
                    </tr>
                    {/* {otherProvider?.provider.map((item: any, index: any) => {
                      return (
                        <>
                          <tr>
                            <td>Name</td>
                            <td className=" font-weight-bold text-center text-dark">
                              {item?.full_name}
                            </td>
                          </tr>
                          <tr>
                            <td>Speciality</td>
                            <td className=" font-weight-bold text-center text-dark">
                              {item?.speciality}
                            </td>
                          </tr>
                        </>
                      )
                    })} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className=" col-md-12 col-lg-12">
            <div className="card mb-3">
              <div className="card-body ">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Immunization
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>Refused Flu Vaccine ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.flu_vaccine_refused}
                      </td>
                    </tr>
                    <tr>
                      <td>Received Flu Vaccine ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.flu_vaccine_recieved}
                      </td>
                    </tr>
                    <tr>
                      <td>Flu vaccine recieved on</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.flu_vaccine_recieved_on}
                      </td>
                    </tr>
                    <tr>
                      <td>Flu vaccine recieved at</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.flu_vaccine_recieved_at}
                      </td>
                    </tr>
                    <tr>
                      <td>Script given for Flu Vaccine</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.flu_vaccine_script_given}
                      </td>
                    </tr>
                    <tr>
                      <td>Refused Pneumococcal Vaccine ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.pneumococcal_vaccine_refused}
                      </td>
                    </tr>
                    <tr>
                      <td>Received Pneumococcal Vaccine ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.pneumococcal_vaccine_recieved}
                      </td>
                    </tr>
                    <tr>
                      <td>Recieved Prevnar 20 on</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.pneumococcal_prevnar_recieved_on}
                      </td>
                    </tr>
                    <tr>
                      <td>Recieved Prevnar 20 at</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.pneumococcal_prevnar_recieved_at}
                      </td>
                    </tr>
                    <tr>
                      <td>Recieved PPSV 23 on</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.pneumococcal_ppsv23_recieved_on}
                      </td>
                    </tr>
                    <tr>
                      <td>Recieved PPSV 23 at</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.pneumococcal_ppsv23_recieved_at}
                      </td>
                    </tr>
                    <tr>
                      <td>Script given for Prevnar 20 / PPSV 23</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {immunization?.pneumococcal_vaccine_script_given}
                      </td>
                    </tr>
                    <tr>
                      <table>
                        <tr>
                          <td>Comments</td>
                          <td className=" font-weight-bold text-left text-dark">
                            {immunization?.comments}
                          </td>
                        </tr>
                      </table>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className=" col-md-12 col-lg-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      Screening
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>Refused Mammogram ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.mammogram_refused}
                      </td>
                    </tr>
                    <tr>
                      <td>Mammogram done on ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.mammogram_done_on}
                      </td>
                    </tr>
                    <tr>
                      <td>Mammogram done at ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.mammogram_done_at}
                      </td>
                    </tr>
                    <tr>
                      <td>Report reviewed </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.mommogram_report_reviewed}
                      </td>
                    </tr>
                    <tr>
                      <td>Next Mammogram due on</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.next_mommogram}
                      </td>
                    </tr>
                    <tr>
                      <td>Script given for the Screening Mammogram ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.mammogram_script}
                      </td>
                    </tr>

                    <tr>
                      <td>Colonoscopy / FIT Test / Cologuard done ?</td>
                      <td className=" font-weight-bold text-center text-dark">
                        {screening?.colonoscopy_done}
                      </td>
                    </tr>

                    <tr>
                      <td>Refused Colonoscopy & FIT Test ?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.colonoscopy_refused}
                      </td>
                    </tr>
                    <tr>
                      <td>Colonoscopy / FIT Test / Cologuard done on </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.colonoscopy_done_on}
                      </td>
                    </tr>
                    <tr>
                      <td>Colonoscopy / FIT Test / Cologuard done at </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.colonoscopy_done_at}
                      </td>
                    </tr>
                    <tr>
                      <td>Report reviewed</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.colonoscopy_report_reviewed}
                      </td>
                    </tr>
                    <tr>
                      <td>Next Colonoscopy / FIT Test due on </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.next_colonoscopy}
                      </td>
                    </tr>
                    <tr>
                      <td>Script given for the Screening Colonoscopy</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {screening?.colonoscopy_script}
                      </td>
                    </tr>
                    <tr>
                      <table>
                        <tr>
                          <td style={{ width: '16%' }}>Comments</td>
                          <td className=" font-weight-bold text-left text-dark">
                            {screening?.comments}
                          </td>
                        </tr>
                      </table>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className=" col-md-12 col-lg-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table">
                  <tr className="text-center">
                    <th colSpan={2} className="border-top-0 pt-0">
                      General Assessment
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>
                        Are you taking all medications for{" "}
                        <b>
                          {activeDiagnosis
                            .toString()
                            .replaceAll(",", ", ")
                            .replace(/,(?=[^,]+$)/, " &")}
                        </b>{" "}
                        as prescribed?
                      </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {generalAssessment?.is_taking_medication}
                      </td>
                    </tr>

                    {/* <tr>
                      <td>WHICH MEDICATIONS ARE NOT BEING TAKEN AS PRESCRIBED?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {generalAssessment?.medications}
                      </td>
                    </tr> */}

                    <tr>
                      <td>Reason</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {generalAssessment?.reason_for_not_taking_medication}
                      </td>
                    </tr>

                    <tr>
                      <td>In the last 30 days, have you used tobacco?</td>
                      <td className=" font-weight-bold text-right text-dark">
                        {generalAssessment?.is_consuming_tobacco}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        In the last 30 days, other than the activities you did
                        for work, on average, how many days per week did you
                        engage in moderate exercise (like walking fast, running,
                        jogging, dancing, swimming, biking, or other similar
                        activities)?
                      </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {generalAssessment?.physical_exercises}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        On average, how many minutes did you usually spend
                        exercising at this level on one of those days?
                      </td>
                      <td className=" font-weight-bold text-right text-dark">
                        {generalAssessment?.physical_exercise_level}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className=" col-md-12 col-lg-12">
            <div className="card mb-3">
              <div className="card-body">
                <table className="table ">
                  <tr className="text-center">
                    <th className="border-top-0 pt-0" style={{ width: "80%" }}>
                      GOALS
                    </th>
                    <th className="border-top-0 pt-0">Start Date</th>
                    <th className="border-top-0 pt-0">End Date</th>
                  </tr>
                  <tbody>
                    <tr>
                      <td style={{ width: "80%" }}>
                        To Understand importance of Hand Washing in Infection
                        Controls
                      </td>
                      <td className="font-weight-bold text-center text-dark"></td>
                      <td className=" font-weight-bold text-center text-dark"></td>
                    </tr>

                    <tr>
                      <td>Instructed on Importance of Hand Washing</td>
                      <td className="font-weight-bold text-center text-dark">
                        {generalAssessment?.imp_handwash_start_date}
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {generalAssessment?.imp_handwash_end_date}
                      </td>
                    </tr>

                    <tr>
                      <td>Instructed on how washing with Soap remove germs</td>
                      <td className="font-weight-bold text-center text-dark">
                        {generalAssessment?.washwithsoap_start_date}
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {generalAssessment?.washwithsoap_end_date}
                      </td>
                    </tr>

                    <tr>
                      <td>Instructed on proper way to turn off the faucet</td>
                      <td className="font-weight-bold text-center text-dark">
                        {generalAssessment?.turnoff_faucet_start_date}
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {generalAssessment?.turnoff_faucet_end_date}
                      </td>
                    </tr>

                    <tr>
                      <td>Is Bar Soap or Liquid Soap better?</td>
                      <td className="font-weight-bold text-center text-dark">
                        {generalAssessment?.bar_or_liquid_start_date}
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {generalAssessment?.bar_or_liquid_end_date}
                      </td>
                    </tr>

                    <tr>
                      <td>
                        Which Soap is better: Plain or Anti-bacterial Soap?
                      </td>
                      <td className="font-weight-bold text-center text-dark">
                        {generalAssessment?.uips_start_date}
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {generalAssessment?.uips_end_date}
                      </td>
                    </tr>

                    <tr>
                      <td>What if there is no Soap?</td>
                      <td className="font-weight-bold text-center text-dark">
                        {generalAssessment?.no_soap_condition_start_date}
                      </td>
                      <td className=" font-weight-bold text-center text-dark">
                        {generalAssessment?.no_soap_condition_end_date}
                      </td>
                    </tr>
                    <tr>
                      <table>
                        <tr>
                          <td >
                            Comments
                          </td>
                          <td className=" font-weight-bold text-left text-dark" style={{ width: '100%' }}>
                            {generalAssessment?.comments}
                          </td>
                        </tr>
                      </table>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Spin>
  );
};
export default CcmAnnualQuestionnaire;
