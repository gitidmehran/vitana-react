import React from "react";
import { Button, Checkbox, DatePicker, Input, Radio, Space } from "antd";
import {
  HyperCholestrolemiaType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import moment from "moment";
import { OpenNotification } from "./../../../Utilties/Utilties";
import DatePickerComponent from "../../DatePickerComponent/DatePickerComponent";

function Cholesterol({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
  programmId,
}: QuestionaireStepProps) {
  const {
    question: { cholesterol_assessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const monthFormat = "MM/YYYY";

  const statinName = [
    "Atorvastatin",
    "Fluvastatin",
    "Lovastatin",
    "Pitavastatin",
    "Pravastatin",
    "Rosuvastatin",
    "Simvastatin",
  ];

  const statinModerateDosage = {
    Atorvastatin: "10 to 20 mg",
    Fluvastatin: "40 mg 2x/day; XL 80 mg",
    Lovastatin: "40 mg",
    Pitavastatin: "2 to 4 mg",
    Pravastatin: "10 to 20 mg",
    Rosuvastatin: "5 to 10 mg",
    Simvastatin: "20 to 40 mg",
  };

  const statinHighDosage = {
    Atorvastatin: "40 to 80 mg",
    Fluvastatin: "",
    Lovastatin: "",
    Pitavastatin: "",
    Pravastatin: "40 to 80 mg",
    Rosuvastatin: "20 to 40 mg",
    Simvastatin: "80 mg",
  };

  const [hyper, setHyper] = React.useState<HyperCholestrolemiaType>(
    cholesterol_assessment as HyperCholestrolemiaType
  );
  /* const [hyper, setHyper] =
    React.useState<HyperCholestrolemiaType>(hypercholestrolemia); */

  const [showLDLFieldsBody, setShowLdlFieldsBody] = React.useState<boolean>(
    Boolean(hyper?.ldl_in_last_12months === "Yes")
  );
  const [showFastingDirectLdlBody, setShowFastingDirectLdlBody] =
    React.useState<boolean>(Boolean(hyper?.patient_has_ascvd === "No"));
  const [showDiabetesQuestionBody, setShowDiabetesQuestionBody] =
    React.useState<boolean>(
      Boolean(
        hyper?.ldlvalue_190ormore === "No" &&
        hyper?.pure_hypercholesterolemia === "No"
      )
    );
  const [showPatientAgeBody, setShowPatientAgeBody] = React.useState<boolean>(
    Boolean(hyper?.active_diabetes === "Yes")
  );
  const [showPastTwoyearLdlBody, setShowPastTwoyearLdlBody] =
    React.useState<boolean>(Boolean(hyper?.diabetes_patient_age === "Yes"));
  const [showStatinQuestionBody, setShowStatinQuestionBody] =
    React.useState<boolean>(
      Boolean(
        hyper?.patient_has_ascvd === "Yes" ||
        hyper?.ldlvalue_190ormore === "Yes" ||
        hyper?.pure_hypercholesterolemia === "Yes" ||
        hyper?.ldl_range_in_past_two_years === "Yes"
      )
    );

  const [showStatinTypeDosageBody, setShowStatinTypeDosageBody] =
    React.useState<boolean>(
      Boolean(
        (hyper?.patient_has_ascvd === "Yes" &&
          hyper?.statin_prescribed === "Yes") ||
        (hyper?.patient_has_ascvd === "No" &&
          hyper?.ldlvalue_190ormore === "Yes" &&
          hyper?.statin_prescribed === "Yes") ||
        (hyper?.patient_has_ascvd === "No" &&
          hyper?.pure_hypercholesterolemia === "Yes" &&
          hyper?.statin_prescribed === "Yes") ||
        (hyper?.patient_has_ascvd === "No" &&
          hyper?.active_diabetes === "Yes" &&
          hyper?.diabetes_patient_age === "Yes" &&
          hyper?.ldl_range_in_past_two_years === "Yes" &&
          hyper?.statin_prescribed === "Yes")
      )
    );
  const [showStatinReasonBody, setShowStatinReasonBody] =
    React.useState<boolean>(
      Boolean(
        (hyper?.patient_has_ascvd === "Yes" &&
          hyper?.statin_prescribed === "No") ||
        (hyper?.patient_has_ascvd === "No" &&
          hyper?.ldlvalue_190ormore === "Yes" &&
          hyper?.statin_prescribed === "No") ||
        (hyper?.patient_has_ascvd === "No" &&
          hyper?.pure_hypercholesterolemia === "Yes" &&
          hyper?.statin_prescribed === "No") ||
        (hyper?.patient_has_ascvd === "No" &&
          hyper?.active_diabetes === "Yes" &&
          hyper?.diabetes_patient_age === "Yes" &&
          hyper?.ldl_range_in_past_two_years === "Yes" &&
          hyper?.statin_prescribed === "No")
      )
    );

  /* LDL BODY USE EFFECT */
  React.useEffect(() => {
    const ldlDone = hyper?.ldl_in_last_12months;
    if (ldlDone === "No") {
      setHyper({
        ...hyper,
        ldl_value: "",
        ldl_date: "",
      });
    }
    setShowLdlFieldsBody(Boolean(ldlDone === "Yes"));
  }, [hyper?.ldl_in_last_12months]);

  /* SHOW STATIN QUESTION OR FASTING LDL QUESTION BODY */
  React.useEffect(() => {
    const patientHasAscvd = hyper?.patient_has_ascvd;
    const fastingLdlValue = hyper?.ldlvalue_190ormore;
    const pureHypercholesterolemia = hyper?.pure_hypercholesterolemia;
    const ldlRangeInTwoYears = hyper?.ldl_range_in_past_two_years;

    if (patientHasAscvd === "Yes") {
      setHyper({
        ...hyper,
        ldlvalue_190ormore: "",
        pure_hypercholesterolemia: "",
        active_diabetes: "",
        diabetes_patient_age: "",
        ldl_range_in_past_two_years: "",
      });
    }

    if (
      patientHasAscvd === "No" &&
      fastingLdlValue == "No" &&
      pureHypercholesterolemia == "No" &&
      ldlRangeInTwoYears == "No"
    ) {
      setHyper({
        ...hyper,
        statin_prescribed: "",
        statintype_dosage: "",
        medical_reason_for_nostatin0: "",
        medical_reason_for_nostatin1: "",
        medical_reason_for_nostatin2: "",
        medical_reason_for_nostatin3: "",
        medical_reason_for_nostatin4: "",
        medical_reason_for_nostatin5: "",
      });
    }

    setShowStatinQuestionBody(
      Boolean(
        patientHasAscvd === "Yes" ||
        fastingLdlValue === "Yes" ||
        pureHypercholesterolemia === "Yes" ||
        ldlRangeInTwoYears === "Yes"
      )
    );
    setShowFastingDirectLdlBody(Boolean(patientHasAscvd === "No"));
  }, [
    hyper?.patient_has_ascvd,
    hyper?.ldlvalue_190ormore,
    hyper?.pure_hypercholesterolemia,
    hyper?.ldl_range_in_past_two_years,
  ]);

  /* Show Statin Type and Dosage Body */
  React.useEffect(() => {
    const statinPrescribed = hyper?.statin_prescribed;
    const hasAscvd = hyper?.patient_has_ascvd;
    const fastingLdl = hyper?.ldlvalue_190ormore;
    const pureHypercholesterol = hyper?.pure_hypercholesterolemia;
    const activeDiabetes = hyper?.active_diabetes;
    const patientAgeQuestion = hyper?.diabetes_patient_age;
    const ldlRange = hyper?.ldl_range_in_past_two_years;

    if (statinPrescribed === "Yes") {
      setHyper({
        ...hyper,
        medical_reason_for_nostatin0: "",
        medical_reason_for_nostatin1: "",
        medical_reason_for_nostatin2: "",
        medical_reason_for_nostatin3: "",
        medical_reason_for_nostatin4: "",
        medical_reason_for_nostatin5: "",
      });
    }

    if (statinPrescribed === "No") {
      setHyper({
        ...hyper,
        statintype_dosage: "",
      });
    }

    if (fastingLdl === "No" && pureHypercholesterol === "No") {
      setHyper({
        ...hyper,
        // statin_prescribed: "",
        statintype_dosage: "",
        medical_reason_for_nostatin0: "",
        medical_reason_for_nostatin1: "",
        medical_reason_for_nostatin2: "",
        medical_reason_for_nostatin3: "",
        medical_reason_for_nostatin4: "",
        medical_reason_for_nostatin5: "",
      });
    }

    setShowStatinTypeDosageBody(
      Boolean(
        (hasAscvd === "Yes" && statinPrescribed === "Yes") ||
        (hasAscvd === "No" &&
          fastingLdl === "Yes" &&
          statinPrescribed === "Yes") ||
        (hasAscvd === "No" &&
          pureHypercholesterol === "Yes" &&
          statinPrescribed === "Yes") ||
        (hasAscvd === "No" &&
          activeDiabetes === "Yes" &&
          patientAgeQuestion === "Yes" &&
          ldlRange === "Yes" &&
          statinPrescribed === "Yes")
      )
    );
    setShowStatinReasonBody(
      Boolean(
        (hasAscvd === "Yes" && statinPrescribed === "No") ||
        (hasAscvd === "No" &&
          fastingLdl === "Yes" &&
          statinPrescribed === "No") ||
        (hasAscvd === "No" &&
          pureHypercholesterol === "Yes" &&
          statinPrescribed === "No") ||
        (hasAscvd === "No" &&
          activeDiabetes === "Yes" &&
          patientAgeQuestion === "Yes" &&
          ldlRange === "Yes" &&
          statinPrescribed === "No")
      )
    );
  }, [hyper?.statin_prescribed]);

  React.useEffect(() => {
    const fastingLdlValue = hyper?.ldlvalue_190ormore;
    const pureHypercholesterolemia = hyper?.pure_hypercholesterolemia;

    if (fastingLdlValue === "Yes" || pureHypercholesterolemia === "Yes") {
      setHyper({
        ...hyper,
        active_diabetes: "",
        diabetes_patient_age: "",
        ldl_range_in_past_two_years: "",
      });
    }

    if (fastingLdlValue === "No" && pureHypercholesterolemia === "No") {
      setHyper({
        ...hyper,
        statin_prescribed: "",
        statintype_dosage: "",
        medical_reason_for_nostatin0: "",
        medical_reason_for_nostatin1: "",
        medical_reason_for_nostatin2: "",
        medical_reason_for_nostatin3: "",
        medical_reason_for_nostatin4: "",
        medical_reason_for_nostatin5: "",
      });
    }
    setShowDiabetesQuestionBody(
      Boolean(fastingLdlValue === "No" && pureHypercholesterolemia === "No")
    );
  }, [hyper?.ldlvalue_190ormore, hyper?.pure_hypercholesterolemia]);

  React.useEffect(() => {
    const activeDiabetes = hyper?.active_diabetes;

    if (activeDiabetes === "No") {
      setHyper({
        ...hyper,
        diabetes_patient_age: "",
        ldl_range_in_past_two_years: "",
      });
    }
    setShowPatientAgeBody(Boolean(activeDiabetes === "Yes"));
  }, [hyper?.active_diabetes]);

  React.useEffect(() => {
    const patientAgeEffect = hyper?.diabetes_patient_age;
    if (patientAgeEffect === "No") {
      setHyper({
        ...hyper,
        ldl_range_in_past_two_years: "",
      });
    }
    setShowPastTwoyearLdlBody(Boolean(patientAgeEffect === "Yes"));
  }, [hyper?.diabetes_patient_age]);

  function valueChange(e: any) {
    const { value } = e.target;
    setHyper({
      ...hyper,
      [e.target.name]: value,
    });
  }

  function reasonforNoStatin(e: any) {
    const value = e.target.checked === true ? e.target.value : "";
    setHyper({
      ...hyper,
      [e.target.name]: value,
    });
  }

  function dateChange(name: string, value: string) {
    setHyper({
      ...hyper,
      [name]: value,
    });
  }

  const defaultOptions = ["Yes", "No"];

  const dates = {
    ldl_date: hyper?.ldl_date
      ? moment(hyper?.ldl_date, monthFormat)
      : undefined,
  };

  const dateFormat = "MM/DD/YYYY";

  /* function valueChange(e: any) {
    const value = e.target.value;
    setHyper({
      ...hyper,
      [e.target.name]: value,
    });
  } */

  /* function dateChange(name: string, value: string) {
    setHyper({
      ...hyper,
      [name]: value,
    });
  } */

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const hyperCholesterolemia = { ...hyper };
    Object.assign(hyperCholesterolemia, completed);

    const response = await saveQuestionairsData(
      "cholesterol_assessment",
      hyperCholesterolemia
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment complted */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const hyperCholesterolemia = { ...hyper };
    Object.assign(hyperCholesterolemia, completed);

    const response = await saveQuestionairsData(
      "cholesterol_assessment",
      hyperCholesterolemia
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification('error', response.errors)
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Cholesterol Assessment</h2>
      <div className="row mb-3">
        <div className="col-lg-12 md-12 sm-12">
          <div className="mb-3">
            <label className="question-text" style={{ marginRight: "10px" }}>
              LDL Done in last 12 months?
            </label>
            <div>
              <Radio.Group
                name="ldl_in_last_12months"
                onChange={(e) => {
                  valueChange(e);
                }}
                value={hyper?.ldl_in_last_12months}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          {showLDLFieldsBody && (
            <div id="" className={"d-block mb-3"} style={{ marginBottom: "10px", marginTop: "10px" }} >
              <div className="row">
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">LDL is ?</label>
                  <Input
                    onChange={valueChange}
                    type="number"
                    min="0"
                    step="0.01"
                    className="form-control"
                    name="ldl_value"
                    placeholder="LDL Result"
                    value={hyper?.ldl_value}
                  />
                </div>
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">Date</label>
                  <br />
                  <DatePicker
                    onChange={(e, datestring) =>
                      dateChange("ldl_date", datestring)
                    }
                    format={monthFormat}
                    picker="month"
                    className="form-control"
                    name="ldl_date"
                    placeholder="LDL Date"
                    value={dates?.ldl_date}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="question-text" style={{ marginRight: "10px" }}>
              Does the patient have ASCVD?
            </label>
            <div>
              <Radio.Group
                name="patient_has_ascvd"
                onChange={(e) => {
                  valueChange(e);
                }}
                value={hyper?.patient_has_ascvd}
              >
                <Space direction="horizontal">
                  {defaultOptions.map((item, key) => (
                    <Radio value={item} key={key}>
                      {item}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </div>
          </div>

          {showFastingDirectLdlBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="mb-3">
                <label className="question-text">
                  Fasting or direct LDL-C ≥ 190 mg/dL? Check from result above
                </label>
                <div>
                  <Radio.Group
                    name="ldlvalue_190ormore"
                    onChange={(e) => {
                      valueChange(e);
                    }}
                    value={hyper?.ldlvalue_190ormore}
                  >
                    <Space direction="horizontal">
                      {defaultOptions.map((item, key) => (
                        <Radio value={item} key={key}>
                          {item}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>
              </div>

              <div className="mb-3">
                <label className="question-text">
                  History or active diagnosis of familial or pure
                  hypercholesterolemia
                </label>

                <div>
                  <Radio.Group
                    name="pure_hypercholesterolemia"
                    onChange={(e) => {
                      valueChange(e);
                    }}
                    value={hyper?.pure_hypercholesterolemia}
                  >
                    <Space direction="horizontal">
                      {defaultOptions.map((item, key) => (
                        <Radio value={item} key={key}>
                          {item}
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                </div>
              </div>
            </div>
          )}

          {showDiabetesQuestionBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <label className="question-text">
                Does Patient have active diagnosis of diabetes?
              </label>
              <div>
                <Radio.Group
                  name="active_diabetes"
                  onChange={(e) => {
                    valueChange(e);
                  }}
                  value={hyper?.active_diabetes}
                >
                  <Space direction="horizontal">
                    {defaultOptions.map((item, key) => (
                      <Radio value={item} key={key}>
                        {item}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>
          )}

          {showPatientAgeBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="row">
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">
                    Patient age between 40-75 years?
                  </label>

                  <div>
                    <Radio.Group
                      name="diabetes_patient_age"
                      onChange={(e) => {
                        valueChange(e);
                      }}
                      value={hyper?.diabetes_patient_age}
                    >
                      <Space direction="horizontal">
                        {defaultOptions.map((item, key) => (
                          <Radio value={item} key={key}>
                            {item}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showPastTwoyearLdlBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <label className="question-text">
                Fasting or Direct LDL-C 70-189 mg/dL any time in the past two
                years (2021-2023)?
              </label>
              <div>
                <Radio.Group
                  name="ldl_range_in_past_two_years"
                  onChange={(e) => {
                    valueChange(e);
                  }}
                  value={hyper?.ldl_range_in_past_two_years}
                >
                  <Space direction="horizontal">
                    {defaultOptions.map((item, key) => (
                      <Radio value={item} key={key}>
                        {item}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>
          )}

          {showStatinQuestionBody && (
            <div
              id=""
              className={"d-block mb-3"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="row">
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">
                    Was the patient prescribed any high or moderate intensity
                    statin in the current calendar year?
                  </label>
                  <div>
                    <Radio.Group
                      name="statin_prescribed"
                      onChange={(e) => {
                        valueChange(e);
                      }}
                      value={hyper?.statin_prescribed}
                    >
                      <Space direction="horizontal">
                        {defaultOptions.map((item, key) => (
                          <Radio value={item} key={key}>
                            {item}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showStatinTypeDosageBody && (
            <div
              id=""
              className={"d-block"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <h6>Statin Type and dosage</h6>
              <div className="row">
                <div className="col-lg-4 md-4 sm-4">
                  <label className="question-text">
                    <b>Statin</b>
                  </label>
                  {statinName.map((item, key) => (
                    <div key={key}>
                      <label className="question-text" key={key}>
                        {item}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="col-lg-4 md-4 sm-4">
                  <label className="question-text">
                    <b>
                      {"Moderate - intensity(LDL - C reduction 30 % to < 50)"}
                    </b>
                  </label>
                  <div>
                    <Radio.Group
                      name="statintype_dosage"
                      onChange={(e) => valueChange(e)}
                      value={hyper?.statintype_dosage}
                    >
                      <Space direction="vertical">
                        {Object.entries(statinModerateDosage).map(
                          ([key, value]) => (
                            <Radio value={key + value} key={key}>
                              {value}
                            </Radio>
                          )
                        )}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>

                <div className="col-lg-4 md-4 sm-4">
                  <label className="question-text">
                    <b>{"High-intensity (LDL-C reduction >50%)"}</b>
                  </label>
                  <div>
                    <Radio.Group
                      name="statintype_dosage"
                      onChange={(e) => valueChange(e)}
                      value={hyper?.statintype_dosage}
                    >
                      <Space direction="vertical">
                        {Object.entries(statinHighDosage).map(([key, value]) =>
                          value != "" ? (
                            <Radio value={key + value} key={key}>
                              {value}
                            </Radio>
                          ) : (
                            <label className="question-text2" key={key}>
                              N/A
                            </label>
                          )
                        )}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showStatinReasonBody && (
            <div
              id=""
              className={"d-block"}
              style={{ marginBottom: "10px", marginTop: "10px" }}
            >
              <div className="row">
                <div className="col-lg-12 md-12 sm-12">
                  <label className="question-text">
                    Documented medical reason for not being on statin therapy
                    is:
                  </label>

                  <div>
                    <Space direction="horizontal">
                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin0"
                        value="Adverse side effect"
                        checked={
                          hyper?.medical_reason_for_nostatin0 ===
                          "Adverse side effect"
                        }
                        onChange={reasonforNoStatin}
                      >
                        Adverse side effect
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin1"
                        value="Allergy, Acute liver disease/ Hepatic insufficiency"
                        checked={
                          hyper?.medical_reason_for_nostatin1 ===
                          "Allergy, Acute liver disease/ Hepatic insufficiency"
                        }
                        onChange={reasonforNoStatin}
                      >
                        Allergy, Acute liver disease/ Hepatic insufficiency
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin2"
                        value="ESRD"
                        checked={hyper?.medical_reason_for_nostatin2 === "ESRD"}
                        onChange={reasonforNoStatin}
                      >
                        ESRD
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin3"
                        value="Rhabdomyolysis"
                        checked={
                          hyper?.medical_reason_for_nostatin3 ===
                          "Rhabdomyolysis"
                        }
                        onChange={reasonforNoStatin}
                      >
                        Rhabdomyolysis
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin4"
                        value="Pregnancy/Breastfeeding"
                        checked={
                          hyper?.medical_reason_for_nostatin4 ===
                          "Pregnancy/Breastfeeding"
                        }
                        onChange={reasonforNoStatin}
                      >
                        Pregnancy/Breastfeeding
                      </Checkbox>

                      <Checkbox
                        className="mr-2"
                        name="medical_reason_for_nostatin5"
                        value="In Hospice"
                        checked={
                          hyper?.medical_reason_for_nostatin5 === "In Hospice"
                        }
                        onChange={reasonforNoStatin}
                      >
                        In Hospice
                      </Checkbox>
                    </Space>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {programmId === "2" ? (
          <div className="col-lg-12 md-12 sm-12">
            <div className="row mb-2">
              <div className="col-6">
                <label>
                  <b>Treatment Goals</b>
                </label>
              </div>
              <div className="col-3">
                <label>
                  <b>Start Date</b>
                </label>
              </div>
              <div className="col-3">
                <label>
                  <b>End Date</b>
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <label>
                  <b>
                    To develope an understanding regarding risk factors and
                    monitoring for Hyperlipidemia.
                  </b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>Patient will learn various causes of hyperlipidemia.</b>
                  <br />
                  Smoking, drinking excessive alcohol & eating foods that have a
                  lot of saturated fats or trans fats. Most animal fats are
                  saturated. The fats of plants and fish are generally healthy.
                  Many processed foods like foods deep-fried and sausage are
                  high in saturated fat content and not healthy. Sitting too
                  much instead of being active. Being stressed. Inheriting genes
                  that make your cholesterol level unhealthy. Being overweight.
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"causes_of_hyperlipidemia_start_date"}
                  value={hyper?.causes_of_hyperlipidemia_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"causes_of_hyperlipidemia_end_date"}
                  value={hyper?.causes_of_hyperlipidemia_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>Patient will learn to avoid saturated & trans-fat.</b>
                  <br />
                  Unhealthy fats – "Trans" fats are especially unhealthy. They
                  are found in margarines, many fast foods, and some
                  store-bought baked goods. "Saturated" fats are found in animal
                  products like meats, egg yolks, butter, cheese, and full-fat
                  milk products. Unhealthy fats can raise your cholesterol level
                  and increase your chance of getting heart disease.
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"saturated_trans_fat_start_date"}
                  value={hyper?.saturated_trans_fat_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"saturated_trans_fat_end_date"}
                  value={hyper?.saturated_trans_fat_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>
                    Patient will learn importance of checking yearly Lipids &
                    LDL goal.
                  </b>
                  <br />
                  It should be mandatory to do labs like levels of
                  triglycerides, cholesterol levels. Patient should know the
                  levels of LDL. It should be less than 130 if patient is not
                  Diabetic or have heart disease. If patient has heart disease,
                  then it should be less than 100 and if Diabetes then the level
                  be less than 70
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"lab_mandatory_start_date"}
                  value={hyper?.lab_mandatory_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"lab_mandatory_end_date"}
                  value={hyper?.lab_mandatory_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>
                    Patient will learn other conditions that can co-exist and
                    managing Lipid can help them.
                  </b>
                  <br />
                  Conditions like obesity, diabetes, hypertension, and heart
                  disease. It can also coexist with arthritis, sleep apnea, and
                  atrial fibrillation. In many cases, managing high cholesterol
                  will help manage other conditions. Your doctor can provide
                  personalized guidance depending on your comorbidities.
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"monitor_comorbid_start_date"}
                  value={hyper?.monitor_comorbid_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"monitor_comorbid_end_date"}
                  value={hyper?.monitor_comorbid_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <label>
                  <b>
                    To understand the effect of Lipids on Cardiovascular System
                  </b>
                </label>
              </div>
              {/* <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="el_cardio_start_date"
              value={dates?.el_cardio_start_date}
              onChange={(e, datestring) =>
                dateChange("el_cardio_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="el_cardio_end_date"
              value={dates?.el_cardio_end_date}
              onChange={(e, datestring) =>
                dateChange("el_cardio_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div> */}
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>Understanding how high LDL leads to heart attack</b>
                  <br />
                  Total Cholesterol has LDL (Bad Cholesterol) and HDL (Good
                  Cholesterol). If you have an excess amount of LDL (LIPIDS) in
                  your bloodstream, waxy plaques can build up along your artery
                  walls, causing arteries to narrow. Over time, arteries may
                  become damaged with these plaques and susceptible to blood
                  clots. These blood clots can dislodge and block a small vessel
                  in the heart causing heart attack.
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"understand_etiology_start_date"}
                  value={hyper?.understand_etiology_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"understand_etiology_end_date"}
                  value={hyper?.understand_etiology_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>Cholesterol is a factor in ASCVD score.</b> <br />
                  The ASCVD (atherosclerotic cardiovascular disease) risk score
                  is a national guideline developed by the American College of
                  Cardiology. It is a calculation of your 10-year risk of having
                  a cardiovascular problem, such as a heart attack or stroke.
                  This risk estimate considers age, sex, race, cholesterol
                  levels, blood pressure, medication use, diabetic status, and
                  smoking status.
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"calculate_ASCVD_start_date"}
                  value={hyper?.calculate_ASCVD_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"calculate_ASCVD_end_date"}
                  value={hyper?.calculate_ASCVD_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <label>
                  <b>
                    To understand the importance of healthy diet in controlling
                    Lipids
                  </b>
                </label>
              </div>
              {/*  <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="ui_controlling_start_date"
              value={dates?.ui_controlling_start_date}
              onChange={(e, datestring) =>
                dateChange("ui_controlling_start_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div>
          <div className="col-lg-3 md-3 sm-6">
            <DatePicker
              name="ui_controlling_end_date"
              value={dates?.ui_controlling_end_date}
              onChange={(e, datestring) =>
                dateChange("ui_controlling_end_date", datestring)
              }
              format={dateFormat}
              style={{ width: "100%" }}
            />
          </div> */}
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>Teaching about healthy diet</b>
                  <br />
                  The most beneficial changes result from reducing intake of
                  saturated and trans fats; mostly found in commercially friend
                  food like French fries and increasing intake of
                  polyunsaturated and monounsaturated fats. Low-carbohydrate, or
                  low-fat diet also has beneficial effects in reducing intake of
                  dietary cholesterol. Increasing intake of soluble fiber and
                  soy protein, and eating fatty marine fish or taking
                  marine-derived omega-3 fatty acid supplements is also
                  beneficial.
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"dietary_factors_start_date"}
                  value={hyper?.dietary_factors_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"dietary_factors_end_date"}
                  value={hyper?.dietary_factors_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>Visiting to nutritionist for proper diet plan</b>
                  <br />
                  Your nutritionist will guide you toward healthy food choices
                  while helping you enjoy the foods you are eating.
                  Nutritionists can also teach you about healthy food habits and
                  behaviors that encourage weight loss. Healthy habits may
                  include eating at the dining table, weighing your food or
                  avoiding late night snacks. The goal of this education is to
                  help you develop healthy habits for the rest of your life.
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"visiting_nutritionist_start_date"}
                  value={hyper?.visiting_nutritionist_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"visiting_nutritionist_end_date"}
                  value={hyper?.visiting_nutritionist_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <label>
                  <b>To understand the effect of Exercise on Lipids</b>
                </label>
              </div>
              {/* <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"ue_exercise_start_date"}
                  value={hyper?.ue_exercise_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"ue_exercise_end_date"}
                  value={hyper?.ue_exercise_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div> */}
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>How much exercise is better?</b>
                  <br />
                  Any amount of exercise is better than sedentary lifestyle. It
                  is important to incorporate exercise as a life habit.
                  Individual should engage in moderate-intensity physical
                  exercise performed for a minimum of 10 minutes four times a
                  week or vigorous-intensity exercise (jogging) performed for a
                  minimum of 20 minutes twice a week. Moderate-intensity
                  exercise is defined as activity sufficient to break a sweat or
                  noticeably raise the heart rate (eg, walking briskly, using an
                  exercise bicycle).
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"amount_of_exercise_start_date"}
                  value={hyper?.amount_of_exercise_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"amount_of_exercise_end_date"}
                  value={hyper?.amount_of_exercise_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="pl-5">
                  <b>What is the effect of exercise on Lipids?</b>
                  <br />
                  Exercise increase good lipids (HDL) and decreases Triglyceride and LDL (bad lipids).
                </p>
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"effect_of_exercise_start_date"}
                  value={hyper?.effect_of_exercise_start_date}
                  placeHolder={"Start date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-3 md-3 sm-6">
                <DatePickerComponent
                  fieldName={"effect_of_exercise_end_date"}
                  value={hyper?.effect_of_exercise_end_date}
                  placeHolder={"End date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      <Space>
        <Button type="primary" onClick={() => handlePreviousStep?.()}>
          Back
        </Button>
        <Button loading={loading} onClick={async () => await SaveAndNext()}>
          Save and Next
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={async () => await handleSave()}
        >
          Finish and Next
        </Button>
      </Space>
    </div>
  );
}
export default Cholesterol;
