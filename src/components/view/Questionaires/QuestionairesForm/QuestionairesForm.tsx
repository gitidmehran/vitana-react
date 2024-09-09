import React, { useState } from "react";
import { RootState } from "@/store/store";
import { useAppSelector, useAppDispatch } from "../../../../hooks/hooks";
import { QuestionaireResponse } from "../../../../Types/QuestionaireTypes";
import {
  setLoader,
  setQuestionId,
  setQuestions,
  setAllQuestion,
  setProgramId,
  setPatientId,
  addPatientProfileData,
  setMedicareOptions,
  setBpRows,
  setMonthlyQuestionId,
  setMonthlyAssessmentId,
} from "../../../../store/reducer/QuestionairesReducer";
import Awv from "../../../Program/Questionaires";
import {
  addNewawv,
  updateQuestionnaire,
} from "../../../../actions/AwvQuestions/AwvActions";
import CCM from "../../../../components/Program/CCMQuestionaires";
import { quesedit } from "../../../../actions/Questionnaire/questionnaire";
import { useLocation } from "react-router-dom";
import { Spin } from "antd";
import { OpenNotification } from "./../../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";

function QuestionairesForm() {
  const location = useLocation();
  const id = location.state?.id;
  const age = location.state?.age;
  const name = location?.state?.name;
  const patientData = location?.state?.patientData;
  const dob = location?.state?.dob;
  const gender = location?.state?.gender;
  const monthly_assessment = location?.state?.monthly_assessment;
  const insurance_name = location?.state?.insurance_name;
  const last_dateofService = location?.state?.last_dateofService;
  // const insurance_provider = location?.state?.insurance_provider;
  const step = location?.state?.step;
  const disableAfterSeven = location?.state?.disableAfterSeven;
  const disableFirstSeven = location?.state?.disableFirstSeven;
  const monthlyAssesmentId = location?.state?.monthly_assessment_id;
  const [signed, setSigned] = useState("");
  const [status, setStatus] = useState("");

  React.useEffect(() => {
    dispatch(setQuestionId(""));
  }, []);
  const dispatch = useAppDispatch();
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const {
    programmId,
    questionId,
    patientId,
    date_of_service,
    loading,
    diagnosis,
    medicareOptions,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  React.useEffect(() => {
    if (id) {
      dispatch(setLoader(true));
      dispatch(setBpRows([]))
      quesedit(id, monthlyAssesmentId).then(({ data: response }) => {
        dispatch(setLoader(false));
        const row = response.data.row;
        if (response.success) {

          setSigned(row.signed_date);
          dispatch(setAllQuestion(response.data.list));
          dispatch(setMedicareOptions(response.data.list.medicareOptions));
          dispatch(setQuestionId(row.id));
/*           dispatch(setDateofService(row.date_of_service));
 */          dispatch(setProgramId(row.program_id.toString()));
          dispatch(setPatientId(row.patient_id));/* 
          dispatch(setDateofService(row.date_of_service)); */
          dispatch(
            addPatientProfileData({
              patient: row?.patient,
              programmId: row.program_id.toString(),
            })
          );
        } else {
          OpenNotification("error", response.error);
        }
      });
    }
  }, []);

  const saveQuestionairsData = async (
    key: string,
    data: any,
    moreThanOneRecord?: object
  ): Promise<QuestionaireResponse | undefined> => {
    if (date_of_service && medicareOptions && programmId === '1') {
      setStatus('')
      const request = {};
      const dispatchdata = { key, data };
      Object.assign(request, { patient_id: patientId });
      Object.assign(request, { program_id: programmId });
      if (monthly_assessment !== undefined) {
        Object.assign(request, { isMonthly: monthly_assessment });
      } else if (monthly_assessment === undefined && programmId === String(2)) {
        Object.assign(request, { isMonthly: "0" });
      }

      dispatch(setLoader(true));
      if (questionId === "") {
        Object.assign(request, { [key]: data });
        Object.assign(request, { date_of_service });
        if (programmId === '1') {
          Object.assign(request, { medicareOptions });
        }

        try {
          const response = await addNewawv(request);

          const result = await response.data;
          dispatch(setLoader(false));
          if (result.success) {
            dispatch(setQuestionId(result.questionnaire_id.toString()));
          }
          dispatch(setQuestions(dispatchdata));
          return result;
        } catch (error) {
          dispatch(setLoader(false));
          return {
            success: false,
            message: "Something went wrong",
          };
        }
      } else {
        try {
          if (moreThanOneRecord != null) {
            Object.entries(moreThanOneRecord).map(([itemKey, itemValue]) => {
              Object.assign(request, { [itemKey]: itemValue });
              Object.assign(request, { ["date_of_service"]: date_of_service });
              if (programmId === '1') {
                Object.assign(request, { ["medicareOptions"]: medicareOptions });
              }
            });
          } else {
            Object.assign(request, { [key]: data });
            Object.assign(request, { ["date_of_service"]: date_of_service });
            if (programmId === '1') {
              Object.assign(request, { ["medicareOptions"]: medicareOptions });
            }
          }
          const response = await updateQuestionnaire(questionId, request);
          const result = await response.data;
          dispatch(setLoader(false));
          if (moreThanOneRecord != null) {
            Object.entries(moreThanOneRecord).map(([itemKey, itemValue]) => {
              const newdata = { key: itemKey, data: itemValue };
              dispatch(setQuestions(newdata));
            });
          } else {
            dispatch(setQuestions(dispatchdata));
          }
          return result;
        } catch (error) {
          dispatch(setLoader(false));
          return {
            success: false,
            message: "Something went wrong",
          };
        }
      }
    } else {
      setStatus('error')
    }
    if (date_of_service && programmId === '2') {

      setStatus('')
      const request = {};
      const dispatchdata = { key, data };
      Object.assign(request, { patient_id: patientId });
      Object.assign(request, { program_id: programmId });
      if (monthly_assessment !== undefined) {
        Object.assign(request, { isMonthly: monthly_assessment });
      } else if (monthly_assessment === undefined && programmId === "2") {
        Object.assign(request, { isMonthly: "0" });
      }

      dispatch(setLoader(true));
      if (questionId === "") {
        Object.assign(request, { [key]: data });
        Object.assign(request, { date_of_service });

        try {
          const response = await addNewawv(request);

          const result = await response.data;
          dispatch(setLoader(false));
          if (result.success) {
            dispatch(setQuestionId(result.questionnaire_id.toString()));
            dispatch(setMonthlyQuestionId(result.monthly_assessment_id.toString()));
          }
          dispatch(setQuestions(dispatchdata));
          return result;
        } catch (error) {
          dispatch(setLoader(false));
          return {
            success: false,
            message: "Something went wrong",
          };
        }
      } else {
        try {
          if (moreThanOneRecord != null) {
            Object.entries(moreThanOneRecord).map(([itemKey, itemValue]) => {
              Object.assign(request, { [itemKey]: itemValue });
              Object.assign(request, { ["date_of_service"]: date_of_service });

            });
          } else {
            Object.assign(request, { [key]: data });
            Object.assign(request, { ["date_of_service"]: date_of_service });

          }
          const response = await updateQuestionnaire(questionId, request);
          const result = await response.data;
          dispatch(setLoader(false));
          dispatch(setMonthlyAssessmentId(result.monthly_assessment_id));
          if (moreThanOneRecord != null) {
            Object.entries(moreThanOneRecord).map(([itemKey, itemValue]) => {
              const newdata = { key: itemKey, data: itemValue };
              dispatch(setQuestions(newdata));
            });
          } else {
            dispatch(setQuestions(dispatchdata));
          }
          return result;
        } catch (error) {
          dispatch(setLoader(false));
          return {
            success: false,
            message: "Something went wrong",
          };
        }
      }
    } else {
      setStatus('error')
    }
  };

  return (
    <div>
      <Spin spinning={loading} indicator={antIcon}>
        {programmId === "1" && (
          <Awv
            saveQuestionairsData={saveQuestionairsData}
            id={id}
            name={name}
            dob={dob}
            status={status}
            gender={gender}
            age={age}
            patientData={patientData}
            step={step}
            signed={signed}
            insurance_name={insurance_name}
            // insurance_provider={insurance_provider}
            last_dateofService={last_dateofService}

          />
        )}
        {programmId === "2" && (
          <CCM
            saveQuestionairsData={saveQuestionairsData}
            patient={patientId}
            diagnosis={diagnosis}
            id={age}
            name={name}
            status={status}
            dob={dob}
            patientData={patientData}
            gender={gender}
            disableAfterSeven={disableAfterSeven}
            disableFirstSeven={disableFirstSeven}
            insurance_name={insurance_name}
          />
        )}
      </Spin>
    </div>
  );
}
export default QuestionairesForm;
