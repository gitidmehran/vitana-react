import React from "react";
import { Button, Checkbox, DatePicker, Input, Radio, Space } from "antd";
import {
  DiabetesMellitusType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import moment from "moment";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";
import DatePickerComponent from "../../../components/DatePickerComponent/DatePickerComponent";

function DiabetesMellitus({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { diabetes_mellitus, cholesterol_assessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [diabetes, setDiabetes] =
    React.useState<DiabetesMellitusType>(diabetes_mellitus as DiabetesMellitusType);



  const options = ["Yes", "No"];

  const testResult = ["Positve", "Negative"];

  const noNephropathy = [
    "Script generated for Urine for Micro-albumin",
    "Patient refused urine for Microalbuminemia testing",
  ];

  const inhibitors = ["ACE Inhibitor", "ARB", "None"];

  const dateFormat = "MM/DD/YYYY";
  const monthFormat = "MM/YYYY";

  const defaultOptions = ["Yes", "No"];

  const ldlDate = diabetes?.ldl_date ?? cholesterol_assessment?.ldl_date;

  const dates = {
    result_month: diabetes?.result_month
      ? moment(diabetes?.result_month, monthFormat)
      : undefined,
    checkup_date: diabetes?.checkup_date
      ? moment(diabetes?.checkup_date, monthFormat)
      : undefined,
    diabetic_nephropathy_date: diabetes?.diabetic_nephropathy_date
      ? moment(diabetes?.diabetic_nephropathy_date, monthFormat)
      : undefined,
    ldl_date: ldlDate
      ? moment(ldlDate, monthFormat)
      : undefined,
  };


  /* CONST TO SHOW THE CHECKBOX BODY FOR HBA1C SCRIP */
  let monthDifference = 0;
  const [showHba1cScriptBody, setShowHba1cScriptBody] = React.useState<boolean>(
    Boolean(monthDifference > 6) ?? false
  );


  /* USE EFFECT TO SHOW THE HBA1C SCRIPT GENERATED BODY */
  React.useEffect(() => {
    if (diabetes?.result_month) {
      const startDate = moment(new Date(), monthFormat);
      const endDate = moment(diabetes?.result_month, monthFormat);
      monthDifference = startDate.diff(endDate, "months");
    }

    if (monthDifference < 6) {
      setDiabetes({
        ...diabetes,
        hba1c_script: "",
      });
    }

    setShowHba1cScriptBody(Boolean(monthDifference > 6));
  }, [diabetes?.result_month]);

  const [showCounselledBody, setShowCounselledBody] = React.useState<boolean>(
    Boolean(diabetes?.hb_result >= "8.5") ?? false
  );

  React.useEffect(() => {
    const hba1cValue = diabetes?.hb_result;
    /* Eye and Nephro Body Bodies */
    setShowCounselledBody(Boolean(hba1cValue >= "8.5"));
  }, [diabetes?.hb_result]);

  /* CONST TO SHOW THE FIELDS BODY FOR EYE EXAM DETAILS */
  const [showEyeexamdetailBody, setShowEyeexamdetailBody] =
    React.useState<boolean>(
      Boolean(diabetes?.eye_examination === "Yes") ?? false
    );

  /* CONST TO SHOW THE REPORT REQUESTED BODY */
  const [showReportrequestedBody, setShowReportrequestedBody] =
    React.useState<boolean>(
      Boolean(diabetes?.report_available === "No") ?? false
    );

  /* CONST TO SHOW THE RATINAVUE BODY */
  const [showRatinavueBody, setShowRatinavueBody] = React.useState<boolean>(
    Boolean(diabetes?.eye_examination === "No") ?? false
  );

  /* CONST TO SHOW THE FIELDS FOR NEPHROPATHY DETAILS */
  const [showNephropathyBody, setShowNephropathyBody] = React.useState<boolean>(
    Boolean(diabetes?.diabetic_nephropathy === "Yes") ?? false
  );

  /* CONST TO SHOW THE INHIBITORS BODY */
  const [showInhibitorBody, setShowInhibitorBody] = React.useState<boolean>(
    Boolean(diabetes?.diabetic_nephropathy === "No") ?? false
  );

  /* CONST TO SHOW THE CKD STAGE4 QUESTION BODY */
  const [showCKDbody, sethowCKDbody] = React.useState<boolean>(
    Boolean(diabetes?.diabetic_inhibitors === "None") ?? false
  );

  const [showLDLFieldsBody, setShowLdlFieldsBody] = React.useState<boolean>(
    Boolean(diabetes?.ldl_in_last_12months === "Yes") ?? false
  );

  /* Eye Exam Body */
  React.useEffect(() => {
    const eyeExamPerformed = diabetes?.eye_examination;
    if (eyeExamPerformed === "No") {
      setDiabetes({
        ...diabetes,
        name_of_doctor: "",
        name_of_facility: "",
        checkup_date: "",
        report_available: "",
        report_requested: "",
      });
    } else {
      setDiabetes({
        ...diabetes,
        retinavue_ordered: "",
        eye_examination_script: "",
      });
    }

    /* Eye and Nephro Body Bodies */
    setShowEyeexamdetailBody(Boolean(eyeExamPerformed === "Yes"));

    /* Ratinavuw Order and Eye Examination script Body */
    setShowRatinavueBody(Boolean(eyeExamPerformed === "No"));
  }, [diabetes?.eye_examination]);

  /* Eye Exam Report Requested */
  React.useEffect(() => {
    const reportAvailable = diabetes?.report_available;
    if (reportAvailable === "Yes") {
      setDiabetes({
        ...diabetes,
        report_requested: "",
      });
    }

    /* Eye and Nephro Body Bodies */
    setShowReportrequestedBody(Boolean(reportAvailable === "No"));
  }, [diabetes?.report_available]);

  /* TO show the nephropathy Body */
  React.useEffect(() => {
    const nephropathyPerformed = diabetes?.diabetic_nephropathy;
    if (nephropathyPerformed === "No") {
      setDiabetes({
        ...diabetes,
        diabetic_nephropathy_date: "",
        diabetic_nephropathy_result: "",
      });
    }
    setShowNephropathyBody(Boolean(nephropathyPerformed === "Yes"));
  }, [diabetes?.diabetic_nephropathy]);

  /* To Show The inhibitors Body */
  React.useEffect(() => {
    const nephropathyPerformed = diabetes?.diabetic_nephropathy;
    if (nephropathyPerformed === "Yes") {
      setDiabetes({
        ...diabetes,
        diabetic_nephropathy_date: "",
        diabetic_nephropathy_result: "",
        diabetic_nephropathy_not_conducted: "",
        diabetic_inhibitors: "",
        nephropathy_patient_has: "",
      });
    }
    setShowInhibitorBody(Boolean(nephropathyPerformed === "No"));
  }, [diabetes?.diabetic_nephropathy]);

  /* To Show the CKD STAGE 4 Body */
  React.useEffect(() => {
    const onInhibitor = diabetes?.diabetic_inhibitors;
    if (onInhibitor !== "None") {
      setDiabetes({
        ...diabetes,
        nephropathy_patient_has: "",
      });
    }
    sethowCKDbody(Boolean(onInhibitor === "None"));
  }, [diabetes?.diabetic_inhibitors]);

  /* LDL FIELDS AND BODY */
  React.useEffect(() => {
    const ldlDone = diabetes?.ldl_in_last_12months ?? cholesterol_assessment?.ldl_in_last_12months;
    if (ldlDone === "No") {
      setDiabetes({
        ...diabetes,
        ldl_value: "",
        ldl_date: "",
      });
    }
    setShowLdlFieldsBody(Boolean(ldlDone === "Yes"));
  }, [diabetes?.ldl_in_last_12months])

  /* Assessment not compelted */
  const SaveAndNext = async () => {
    const ldlValue = diabetes?.ldl_value !== undefined ? diabetes?.ldl_value : cholesterol_assessment?.ldl_value !== undefined ? cholesterol_assessment?.ldl_value : "";
    const ldlDate = diabetes?.ldl_date !== undefined ? diabetes?.ldl_date : cholesterol_assessment?.ldl_date !== undefined ? cholesterol_assessment?.ldl_date : "";

    const completed = { completed: "0", ldl_value: ldlValue, ldl_date: ldlDate };
    const diabetesMellitus = { ...diabetes };
    Object.assign(diabetesMellitus, completed);
    console.log(diabetesMellitus);

    const response = await saveQuestionairsData(
      "diabetes_mellitus",
      diabetesMellitus
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment completed */
  const handleSave = async () => {
    const ldlValue = diabetes?.ldl_value !== undefined ? diabetes?.ldl_value : cholesterol_assessment?.ldl_value !== undefined ? cholesterol_assessment?.ldl_value : "";
    const ldlDate = diabetes?.ldl_date !== undefined ? diabetes?.ldl_date : cholesterol_assessment?.ldl_date !== undefined ? cholesterol_assessment?.ldl_date : "";

    const completed = { completed: "1", ldl_value: ldlValue, ldl_date: ldlDate };
    const diabetesMellitus = { ...diabetes };
    Object.assign(diabetesMellitus, completed);

    const response = await saveQuestionairsData(
      "diabetes_mellitus",
      diabetesMellitus
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  function dateChange(name: string, value: string) {
    setDiabetes({
      ...diabetes,
      [name]: value,
    });
  }

  function valueChange(e: any) {
    const value = e.target.value;

    setDiabetes({
      ...diabetes,
      [e.target.name]: value,
    });
  }

  function hba1cScript(e: any) {
    const value = e.target.checked === true ? e.target.value : "";

    setDiabetes({
      ...diabetes,
      [e.target.name]: value,
    });
  }


  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Diabetes</h2>
        <div>
          <label className="question-text">
            When was your last HbA1c test performed and what was the result?
          </label>
        </div>

        {/* HBA1C Question */}
        <div className="row mb-3">
          <div className="col-lg-6">
            <input
              style={{ height: "35px" }}
              type="number"
              className="form-control"
              name="hb_result"
              placeholder="HbA1c result"
              value={diabetes?.hb_result}
              onChange={(e) => {
                valueChange(e);
              }}
            />
          </div>
          <div className="col-lg-6">
            <DatePicker
              name="result_month"
              value={dates.result_month}
              onChange={(e, datestring) =>
                dateChange("result_month", datestring)
              }
              format={monthFormat}
              picker="month"
              style={{ width: "100%" }}
            />
          </div>
        </div>

        {showHba1cScriptBody && (
          <div className="mb-3">
            <Checkbox
              className="mr-2"
              name="hba1c_script"
              value="Yes"
              checked={diabetes?.hba1c_script === "Yes"}
              onChange={hba1cScript}
            />
            <label className="question-text">
              HBA1C script generated to be picked up by patient
            </label>
          </div>
        )}

        {showCounselledBody && (
          <div className="mb-3">
            <div>
              <Checkbox
                className="mr-2"
                name="intensive_diabetic_control"
                value="Yes"
                checked={diabetes?.intensive_diabetic_control === "Yes"}
                onChange={hba1cScript}
              />
              <label className="question-text">
                Patient counselled to visit Diabetic Clinic for intensive
                Diabetic control
              </label>
            </div>

            <div className="row">
              <div className="col-6">
                <label>Appointment scheduled for</label>
                <DatePickerComponent
                  fieldName={"diabetic_clinic_appoinment"}
                  value={diabetes?.diabetic_clinic_appoinment}
                  placeHolder={"Appoinment Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
          </div>
        )}

        {/* EYE AND NEPHROPATHY */}
        <div className="mb-3">
          <div className="row mb-2">
            <div className="col-lg-6">
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    Have you had a Diabetic Eye Examination in last 12 months?
                  </label>
                </div>
                <Radio.Group
                  name="eye_examination"
                  value={diabetes?.eye_examination}
                  onChange={(e) => {
                    valueChange(e);
                  }}
                >
                  <Space direction="horizontal">
                    {options.map((item, key) => (
                      <Radio value={item} key={key}>
                        {item}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>

              {/* Eye Exam Details body */}
              {showEyeexamdetailBody && (
                <div className={"d-block mb-3"}>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control mt-2 mb-2"
                      name="name_of_doctor"
                      value={diabetes?.name_of_doctor}
                      style={{ height: "35px" }}
                      placeholder="Name of Doctor"
                      onChange={(e) => {
                        valueChange(e);
                      }}
                    />

                    <input
                      type="text"
                      className="form-control mb-2"
                      name="name_of_facility"
                      value={diabetes?.name_of_facility}
                      style={{ height: "35px" }}
                      placeholder="Facility"
                      onChange={(e) => {
                        valueChange(e);
                      }}
                    />

                    <DatePicker
                      name="checkup_date"
                      value={dates.checkup_date}
                      onChange={(e, datestring) =>
                        dateChange("checkup_date", datestring)
                      }
                      format={monthFormat}
                      picker="month"
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-lg-6 md-6 sm-12">
                      <label className="question-text">Report Available</label>

                      <Radio.Group
                        name="report_available"
                        value={diabetes?.report_available}
                        onChange={(e) => {
                          valueChange(e);
                        }}
                      >
                        <Space direction="horizontal">
                          {options.map((item, key) => (
                            <Radio value={item} key={key}>
                              {item}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </div>
                    <div className="col-lg-6">
                      {showReportrequestedBody && (
                        <div className={"d-block"}>
                          <label className="question-text">
                            Report Requested
                          </label>

                          <Radio.Group
                            name="report_requested"
                            value={diabetes?.report_requested}
                            onChange={(e) => valueChange(e)}
                          >
                            <Space direction="horizontal">
                              {options.map((item, key) => (
                                <Radio value={item} key={key}>
                                  {item}
                                </Radio>
                              ))}
                            </Space>
                          </Radio.Group>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {showRatinavueBody && (
                <div className={"d-block"}>
                  <div className="row">
                    <div className="col-lg-6 md-6 sm-12">
                      <div>
                        <label className="question-text">
                          Retinavue ordered
                        </label>
                      </div>
                      <Radio.Group
                        name="retinavue_ordered"
                        value={diabetes?.retinavue_ordered}
                        onChange={(e) => valueChange(e)}
                      >
                        <Space direction="horizontal">
                          {options.map((item, key) => (
                            <Radio value={item} key={key}>
                              {item}
                            </Radio>
                          ))}
                        </Space>
                      </Radio.Group>
                    </div>

                    <div className={"col-lg-6"}>
                      <div>
                        <label className="question-text">
                          Script given for eye examination
                        </label>
                      </div>
                      <Radio.Group
                        name="eye_examination_script"
                        value={diabetes?.eye_examination_script}
                        onChange={(e) => valueChange(e)}
                      >
                        <Space direction="horizontal">
                          {options.map((item, key) => (
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
            </div>

            <div className="col-lg-6">
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    Have you had a Diabetic Nephropathy screening in the last 6
                    months?
                  </label>
                </div>
                <Radio.Group
                  name="diabetic_nephropathy"
                  value={diabetes?.diabetic_nephropathy}
                  onChange={(e) => {
                    valueChange(e);
                  }}
                >
                  <Space direction="horizontal">
                    {options.map((item, key) => (
                      <Radio value={item} key={key}>
                        {item}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>

              {/* Nephropathy Date and test Result Body */}
              {showNephropathyBody && (
                <div className={"mb-3 d-block"}>
                  <div className="mb-3">
                    <div>
                      <label className="question-text">
                        Nephropathy Screening
                      </label>
                    </div>
                    <DatePicker
                      name="diabetic_nephropathy_date"
                      placeholder="Nephropathy Test Date"
                      value={dates.diabetic_nephropathy_date}
                      onChange={(e, datestring) =>
                        dateChange("diabetic_nephropathy_date", datestring)
                      }
                      format={monthFormat}
                      picker="month"
                      style={{ width: "100%" }}
                    />
                  </div>

                  <div className="mb-3">
                    <div>
                      <label className="question-text mt-3">Test Result</label>
                    </div>
                    <Radio.Group
                      name="diabetic_nephropathy_result"
                      value={diabetes?.diabetic_nephropathy_result}
                      onChange={(e) => valueChange(e)}
                    >
                      <Space direction="horizontal">
                        {testResult.map((item, key) => (
                          <Radio value={item} key={key}>
                            {item}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>
                </div>
              )}

              {/* Inhibitors Body */}
              {showInhibitorBody && (
                <div className={"d-block"}>
                  <div className="mb-3">
                    <Radio.Group
                      name="diabetic_nephropathy_not_conducted"
                      value={diabetes?.diabetic_nephropathy_not_conducted}
                      onChange={(e) => {
                        valueChange(e);
                      }}
                    >
                      <Space direction="horizontal">
                        {noNephropathy.map((item, key) => (
                          <Radio value={item} key={key}>
                            {item}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>

                  <div className="mb-3">
                    <div>
                      <label className="question-text">Patient is on</label>
                    </div>
                    <Radio.Group
                      name="diabetic_inhibitors"
                      value={diabetes?.diabetic_inhibitors}
                      onChange={(e) => {
                        valueChange(e);
                      }}
                    >
                      <Space direction="horizontal">
                        {inhibitors.map((item, key) => (
                          <Radio value={item} key={key}>
                            {item}
                          </Radio>
                        ))}
                      </Space>
                    </Radio.Group>
                  </div>

                  {showCKDbody && (
                    <div className="">
                      <div>
                        <label className="question-text">Patient is on</label>
                      </div>

                      <Radio.Group
                        name="nephropathy_patient_has"
                        value={diabetes?.nephropathy_patient_has}
                        onChange={(e) => {
                          valueChange(e);
                        }}
                      >
                        <Space direction="horizontal">
                          <Radio value={"ckd_stage_4"}>{"CKD Stage 4"}</Radio>
                          <Radio value={"patient_see_nephrologist"}>
                            {"Patient see Nephrologist"}
                          </Radio>
                        </Space>
                      </Radio.Group>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LDL QUESTION BODY */}
        <div className="mb-5">
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
                value={diabetes?.ldl_in_last_12months ?? cholesterol_assessment?.ldl_in_last_12months}
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
                    value={diabetes?.ldl_value ?? cholesterol_assessment?.ldl_value}
                  />
                </div>
                <div className="col-lg-6 md-6 sm-12">
                  <label className="question-text">Date</label>
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
        </div>

        {/* Treatment Goals */}
        <div>
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

          {/* GOAL 1 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b>
                  To understand the importance of Blood Glucose Monitoring and control
                </b>
              </label>
            </div>
          </div>


          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>
                  Assess the patients current knowledge and understanding
                  regarding disease
                </b>
                <p>
                  Diabetes is a medical condition in which either your body is resistant to insulin or is not making enough insulin this leads to elevated blood sugars.
                  High blood sugars for a long period of time can cause complications in small vessels (Eyes and Kidneys) and large vessels (Heart, Brain and Legs) of the body.
                  Monitoring blood sugar helps to determine if you are meeting your glucose targets which helps to reduce the unpleasant symptoms of high and low blood sugar and avoid long-term diabetes complications.
                  Blood sugar readings are simply information used to help you learn what is working well and identify areas for improvement in your diabetes management.
                  Our goal is to keep your Fasting Blood sugar less than 120 and blood sugars 2 hours after meals between 130-170 this will keep your A1c below 7 and Diabetes well controlled.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"monitoring_blood_sugar_start_date"}
                value={diabetes?.monitoring_blood_sugar_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"monitoring_blood_sugar_end_date"}
                value={diabetes?.monitoring_blood_sugar_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Weight daily, Explain the importance of weight loss to obese patients with diabetes.</b>
                <p>
                  When you have diabetes, there are huge benefits to losing weight if you're carrying extra weight.
                  You’ll have more energy, and you’ll reduce your risk of serious complications like heart disease and stroke.
                  Losing weight can help with your diabetes control too. And if you have type 2 diabetes, losing weight could even mean going into diabetes remission.
                  Extra weight around your waist means fat can build up around your organs, like your liver and pancreas.
                  This can cause something called insulin resistance. So, losing this weight could help the insulin you produce or the insulin you inject work properly.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"importance_of_weight_start_date"}
                value={diabetes?.importance_of_weight_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"importance_of_weight_end_date"}
                value={diabetes?.importance_of_weight_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Assess the pattern of physical activity.</b>
                <p>
                  If you have diabetes, being active makes your body more sensitive to insulin (the hormone that allows cells in your body to use blood sugar for energy),
                  which helps manage your diabetes. Physical activity also helps control blood sugar levels and lowers your risk of heart disease and nerve damage.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"assess_the_pattern_start_date"}
                value={diabetes?.assess_the_pattern_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"assess_the_pattern_end_date"}
                value={diabetes?.assess_the_pattern_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>
                  Monitor blood glucose levels before meals and at bedtime to
                  control
                </b>
                <p>
                  It is important to check Fasting Blood sugars every morning along with 2 hours after every meal. Blood glucose testing is one part of managing your diabetes successfully.
                  Testing your blood glucose both before and after a meal allows you to see how that meal affects your blood glucose levels and helps you to understand which meals may be best for your blood glucose control.
                </p>
                <p>
                  The most powerful influence on blood glucose levels comes from food. Whether you have type 1 or type2 diabetes,
                  the peak blood glucose levels are often likely to occur around two hours after meals.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"monitor_blood_glucose_start_date"}
                value={diabetes?.monitor_blood_glucose_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"monitor_blood_glucose_end_date"}
                value={diabetes?.monitor_blood_glucose_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 1 ENDS */}

          {/* GOAL 2 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b>To Understand the importance of Diabetic Diet.</b>
              </label>
            </div>
          </div>

          {/* TASKS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Understanding A, B and C of Diabetes:</b>
                <p>
                  Making changes to your diet is a key part of managing type 2 diabetes. You may have heard of the "ABCs of diabetes."
                  This refers to three aspects of your health that should be well-controlled in order to manage your diabetes:
                  <ul>
                    <li> <b>A</b>1C (a blood test that measures your average blood sugar level over the past few months)</li>
                    <li><b>B</b>lood pressure</li>
                    <li><b>C</b>holesterol</li>
                  </ul>
                  Keeping your blood sugar at or near your goal level helps decrease the risk of complications that can affect the eyes, kidneys, and nerves.
                  Keeping your blood pressure and cholesterol levels under control helps reduce your risk of cardiovascular (heart) disease, which is a common complication of type 2 diabetes.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"abc_of_diabetes_start_date"}
                value={diabetes?.abc_of_diabetes_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"abc_of_diabetes_end_date"}
                value={diabetes?.abc_of_diabetes_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Keeping your Weight under control.</b>
                <p>
                  Many factors affect how well a person's diabetes is controlled.
                  You can reduce your risk of complications by following your health care provider's guidance around diet, exercise, blood sugar monitoring, and medication regimens.
                  Dietary changes are typically focused on eating nutritious foods and getting to (and maintaining) a healthy weight.
                  If you take insulin, you may also need to be consistent about what you eat and when.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"undercontrol_weight_start_date"}
                value={diabetes?.undercontrol_weight_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"undercontrol_weight_end_date"}
                value={diabetes?.undercontrol_weight_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Seeing a Dietician.</b>
                <p>
                  Having to pay careful attention to your diet can be challenging.
                  It can help to work with a dietitian to create a plan that is tailored to your specific situation (including what diabetes medications you take), lifestyle, and personal preferences.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"seeing_dietician_start_date"}
                value={diabetes?.seeing_dietician_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"seeing_dietician_end_date"}
                value={diabetes?.seeing_dietician_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 2 ENDS */}

          {/* GOAL 3 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b>
                  To Understand Hypoglycemia, hyperglycemia and how to prevent them.
                </b>
              </label>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Assess for signs of hyperglycemia/hypoglycemia</b>
                <p>Hyperglycemia can become an emergency if you begin to develop symptoms of DKA: shortness of breath, fruity-smelling breath, nausea and vomiting, confusion, or you lose consciousness.
                  Likewise, hypoglycemia requires emergency care if you begin to experience confusion, a loss of consciousness, or seizures.
                </p>
                <p>If you start experiencing symptoms of DKA or severe hypoglycemia, or if a loved one notices signs of these symptoms, seek medical care immediately.</p>
                <p>
                  Talk to your healthcare team if you are experiencing frequent episodes of hyperglycemia and/or hypoglycemia, if your glucose is consistently above 240 mg/dL, or anytime you experience severe hypoglycemia.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"signs_of_hyperglycemia_start_date"}
                value={diabetes?.signs_of_hyperglycemia_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"signs_of_hyperglycemia_end_date"}
                value={diabetes?.signs_of_hyperglycemia_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>
                  Prevention of hyperglycemia by exercise to help lower blood
                  sugar, follow your meal plan maintain a healthy weight, don't
                  smoke and limit alcohol
                </b>
                <p>
                  Exercise to help lower blood sugar. Work with your healthcare provider to make a daily activity plan.
                  Follow your meal plan if you have one. Learn how carbohydrates impact your blood sugar, and work with your diabetes care team to find the best meal plan for you.
                  Maintain a healthy weight.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"prevention_of_hyperglycemia_start_date"}
                value={diabetes?.prevention_of_hyperglycemia_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"prevention_of_hyperglycemia_end_date"}
                value={diabetes?.prevention_of_hyperglycemia_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>
                  Prevention of hypoglycemia to help lower blood sugar, follow
                  your meal plan maintain a healthy weight, don't smoke and
                  limit alcohol
                </b>
                <p>
                  Monitor your blood sugar. Depending on your treatment plan, you may check and record your blood sugar level several times a week or multiple times a day.
                  Careful monitoring is the only way to make sure that your blood sugar level remains within your target range.
                </p>
                <p>
                  Don't skip or delay meals or snacks. If you take insulin or oral diabetes medication, be consistent about the amount you eat and the timing of your meals and snacks.
                </p>
                <p>
                  Measure medication carefully and take it on time. Take your medication as recommended by your health care provider.
                </p>
                <p>
                  Adjust your medication or eat additional snacks if you increase your physical activity.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"lower_blood_sugar_start_date"}
                value={diabetes?.lower_blood_sugar_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"lower_blood_sugar_end_date"}
                value={diabetes?.lower_blood_sugar_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 3 ENDS */}

          {/* GOAL 4 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b>To Understand the importance of Diabetic Eye exam. </b>
              </label>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Understanding how high blood sugar effects Eyes.</b>
                <p>
                  There are several eye problems related to diabetes. The most common affects the retina, a layer at the back of the eye; this is called "diabetic retinopathy."
                  In diabetic retinopathy, the small blood vessels in the retina grow abnormally and leak, which can lead to vision loss and eventually blindness if not treated.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"sugar_effect_on_eye_start_date"}
                value={diabetes?.sugar_effect_on_eye_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"sugar_effect_on_eye_end_date"}
                value={diabetes?.sugar_effect_on_eye_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Understanding different ways Diabetes can affect the Eyes.</b>
                <p>
                  Other eye problems associated with diabetes include diabetic macular edema (swelling of the central area of the retina that has the sharpest vision),
                  glaucoma (high pressure in the eyeball), and cataracts (clouding of the lens of the eye).
                  Regular eye exams are essential for detecting retinopathy and other eye problems at an early stage, when the condition can be monitored and treated to preserve vision.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"sugar_ways_to_effect_on_eye_start_date"}
                value={diabetes?.sugar_ways_to_effect_on_eye_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"sugar_ways_to_effect_on_eye_end_date"}
                value={diabetes?.sugar_ways_to_effect_on_eye_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 4 ENDS */}

          {/* GOAL 5 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b> To develop an understanding of Diabetic Foot care</b>
              </label>
            </div>
          </div>

          {/* TASKS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Understanding how Diabetic damage the nerves in the Foot.</b>
                <p>
                  Diabetes can decrease blood flow to the feet and damage the nerves that carry sensation; this nerve damage is known as "diabetic neuropathy."
                  Because people with neuropathy may lose their ability to sense pain, they are at increased risk for developing potentially serious foot-related complications such as ulcers.
                  Foot complications are very common among people with diabetes and sometimes go unnoticed until symptoms become severe.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"foot_nerves_damage_start_date"}
                value={diabetes?.foot_nerves_damage_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"foot_nerves_damage_end_date"}
                value={diabetes?.foot_nerves_damage_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>How to protect your feet in Diabetes?</b>
                <p>
                  Although there is no way to reverse nerve damage once it has happened, there are things you can do to lower your risk of developing serious foot problems as a consequence.
                  In addition to managing your glucose levels, doing regular exams to check for any changes in the feet also helps reduce the risk of serious foot problems.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"protect_feet_start_date"}
                value={diabetes?.protect_feet_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"protect_feet_end_date"}
                value={diabetes?.protect_feet_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>How to do your foot examination?</b>
                <p>
                  Self-exams and foot care — It is important to examine your feet every day. This should include looking carefully at all parts of your feet, especially the area between the toes.
                  Look for broken skin, ulcers, blisters, areas of increased warmth or redness, or changes in callus formation; let your health care provider know if you notice if any of these changes or have any concerns.
                </p>
                <p>
                  It may help to make the foot exam a part of your daily bathing or dressing routine. You might need to use a mirror to see the bottoms of your feet clearly.
                  If you are unable to reach your feet or see them completely, even with a mirror, ask another person (such as a spouse or other family member) to help you.
                  It is important to dry your feet thoroughly after bathing and wear cotton socks and comfortable, well-fitting shoes.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"foot_examination_start_date"}
                value={diabetes?.foot_examination_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"foot_examination_end_date"}
                value={diabetes?.foot_examination_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 5 ENDS */}

          {/* GOAL 6 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b>To understand Cardiovascular Complications secondary to Diabetes.</b>
              </label>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Learning the leading cause of death in Diabetics.</b>
                <p>
                  People with diabetes are at increased risk of cardiovascular disease, which can lead to heart attack and stroke. Cardiovascular disease is the leading cause of death in people with diabetes.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"death_cause_in_diabetes_start_date"}
                value={diabetes?.death_cause_in_diabetes_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"death_cause_in_diabetes_end_date"}
                value={diabetes?.death_cause_in_diabetes_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Learning three ways to decrease the risk of Cardio-vascular disease?</b>
                <p>
                  Whether you have type 1 or type 2 diabetes, you can lower your risk of cardiovascular disease by Quitting Smoking, controlling cholesterol and daily use of aspirin.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"risk_of_cardio_disease_start_date"}
                value={diabetes?.risk_of_cardio_disease_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"risk_of_cardio_disease_end_date"}
                value={diabetes?.risk_of_cardio_disease_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Learning to keep your cholesterol and triglyceride levels in a healthy range.</b>
                <p>
                  Your health care provider can measure these with a blood test. In addition to making healthy lifestyle changes, most people with diabetes will also need to take a cholesterol-lowering medication.
                  If you are over 40 years old or have multiple risk factors for cardiovascular disease (e.g., family history, high cholesterol, high blood pressure, or obesity),
                  your doctor will likely prescribe a cholesterol-lowering medication called a statin.
                  In people with diabetes, statins have been shown to decrease the future risk of heart attacks, strokes, and death, even when cholesterol levels are normal.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"cholesterol_healthy_range_start_date"}
                value={diabetes?.cholesterol_healthy_range_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"cholesterol_healthy_range_end_date"}
                value={diabetes?.cholesterol_healthy_range_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Consider daily low-dose aspirin, depending on your other conditions.</b>
                <p>
                  Most people with diabetes and heart disease (such as history of angina or heart attack) should take low-dose aspirin (for example, 81 mg per day).
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"low_dose_aspirin_start_date"}
                value={diabetes?.low_dose_aspirin_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"low_dose_aspirin_end_date"}
                value={diabetes?.low_dose_aspirin_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 6 ENDS */}

          {/* GOAL 7 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b>To understand Kidney complications secondary to diabetes.</b>
              </label>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Understanding the effect of diabetes on Kidneys.</b>
                <p>
                  Diabetes can alter the normal function of the kidneys. Kidney problems related to diabetes are referred to as "diabetic kidney disease" or by the older term, "diabetic nephropathy."
                  Over time, diabetic kidney disease can lead to chronic kidney disease and even kidney failure.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"diabetes_effect_on_kidneys_start_date"}
                value={diabetes?.diabetes_effect_on_kidneys_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"diabetes_effect_on_kidneys_end_date"}
                value={diabetes?.diabetes_effect_on_kidneys_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>How to know if your kidneys are being affected by diabetes?</b>
                <p>
                  To monitor your kidney function, your health care provider will check your blood creatinine level and use this to calculate an estimated glomerular filtration rate,
                  or eGFR, which measures how well your kidneys are working. Your provider will also order urine tests to measure the amount of protein in your urine.
                  When the kidneys are working normally, they prevent protein from leaking into the urine, so finding protein (measured as albumin) in the urine (even in very small amounts) may be an early sign of kidney damage.
                  These tests are usually checked once yearly.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"know_how_kidneys_effected_start_date"}
                value={diabetes?.know_how_kidneys_effected_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"know_how_kidneys_effected_end_date"}
                value={diabetes?.know_how_kidneys_effected_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>How to protect your kidneys if diabetes has started to damage it?</b>
                <p>
                  If you continue to have protein in your urine over time, your health care provider may prescribe a medication called an angiotensin-converting enzyme (ACE) inhibitor or angiotensin receptor blocker (ARB).
                  These medications can help decrease the amount of protein in the urine and slow the progression of kidney disease.
                  These medications also help lower blood pressure; this is important as high blood pressure can speed up the development of kidney problems.
                </p>
                <p>
                  A class of medications called sodium-glucose cotransporter 2 (SGLT2) inhibitors lowers blood glucose and blood pressure and
                  prevents worsening of kidney function in people with early kidney damage, especially when the urine albumin level is high.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"protect_kidneys_start_date"}
                value={diabetes?.protect_kidneys_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"protect_kidneys_end_date"}
                value={diabetes?.protect_kidneys_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 7 ENDS */}

          {/* GOAL 8 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b>To recognize the importance if Blood Pressure control in diabetic patients.</b>
              </label>
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>What should be your BP if you are diabetic?</b>
                <p>In general, experts recommend keeping blood pressure below 130/80 mmHg for adults with diabetes.</p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"bp_recommendation_start_date"}
                value={diabetes?.bp_recommendation_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"bp_recommendation_end_date"}
                value={diabetes?.bp_recommendation_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>How to lower your BP?</b>
                <p>If you need to lower your blood pressure, your provider will probably recommend lifestyle changes such as weight loss,
                  exercise, changing your diet (to cut back on salt and processed foods and eat more fruits, vegetables, and whole grains),
                  quitting smoking (if you smoke), and cutting back on alcohol.
                  Most people with type 2 diabetes also need to take medications to keep their blood pressure within the goal range.
                  Your health care provider can talk to you about the benefits and risks of the different treatment options.</p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"how_to_lower_bp_start_date"}
                value={diabetes?.how_to_lower_bp_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"how_to_lower_bp_end_date"}
                value={diabetes?.how_to_lower_bp_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 8 ENDS */}

          {/* GOAL 9 STARTS */}
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label className=" mt-2">
                <b> To recognize the signs and symptoms of exacerbation that must be reported to the doctor/nurse </b>
              </label>
            </div>

          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Monitor hunger and fatigue that would be exacerbate later</b>
                <p>
                  <b>Fatigue:</b>Your body isn’t getting the energy it needs from the food you’re eating, so you may feel very tired.
                </p>
                <p>
                  <b>Extreme hunger:</b>Even after you eat, you may still feel very hungry.
                  That’s because your muscles aren’t getting the energy they need from the food; your body’s insulin resistance keeps glucose from entering the muscle and providing energy.
                  Therefore, the muscles and other tissues send a “hunger” message, trying to get more energy into the body.
                </p>
                <p>
                  Blood glucose fluctuation is often thought of as the first cause of fatigue and hunger in diabetes.
                  Treating both conditions is most successful when regarded as whole, rather than separate, conditions.
                  Healthy lifestyle habits, social support, and mental health therapies can positively impact on both at the same time.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"monitor_hunger_and_fatigue_start_date"}
                value={diabetes?.monitor_hunger_and_fatigue_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"monitor_hunger_and_fatigue_end_date"}
                value={diabetes?.monitor_hunger_and_fatigue_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Assess Frequent urination, dry mouth, or blurred vision</b>
                <p>
                  <b>Frequent urination:</b>
                  This is related to drinking so much more to
                  satisfy your thirst. Since you're drinking more, you'll have to
                  urinate more. Additionally, the body will try to get rid of the
                  excess glucose through urination.
                </p>
                <p>
                  <b>Blurry vision:</b>
                  To get more fluid into the blood to counteract the high blood glucose level,
                  your body may pull fluid from the eyes. You may have trouble
                  focusing then, leading to blurry vision.
                </p>
              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"assess_frequent_urination_start_date"}
                value={diabetes?.assess_frequent_urination_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"assess_frequent_urination_end_date"}
                value={diabetes?.assess_frequent_urination_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Assess slow healing of wound</b>
                <p>
                  <b>Slow wound healing:</b>Like the body's inability to fight off
                  infections, it might take longer for wounds (even small cuts) to
                  heal. The high blood glucose level affects how well the white
                  blood cells (which are in charge of healing wounds) work.
                </p>

              </p>
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"assess_slow_healing_start_date"}
                value={diabetes?.assess_slow_healing_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-lg-3 md-3 sm-6">
              <DatePickerComponent
                fieldName={"assess_slow_healing_end_date"}
                value={diabetes?.assess_slow_healing_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          {/* GOAL 9 ENDS */}
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
    </>
  );
}
export default DiabetesMellitus;
