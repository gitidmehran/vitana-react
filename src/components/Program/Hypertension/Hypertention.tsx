import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { Button, Checkbox, Input, Radio, Space, Tooltip } from "antd";
import React, { useState } from "react";
import {
  Hypertension,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import TextArea from "antd/lib/input/TextArea";
import { OpenNotification } from "./../../../Utilties/Utilties";
import DatePickerComponent from "../../../components/DatePickerComponent/DatePickerComponent";
import { useDispatch } from "react-redux";
import { setBpRows } from "../../../store/reducer/QuestionairesReducer";
import { hypertensiveUrgency } from "./../../../Constant/constant";

const Hypertensions: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { hypertension },
    bpRows,
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [hp, setHp] = React.useState<Hypertension>(hypertension as Hypertension);
  const [count, setCount] = useState(0);
  const [hypertensionBp, setHypertensionBp] = useState<Hypertension[]>(bpRows?.length > 0 ? bpRows : hypertension !== undefined ? hypertension.bp : []);
  const dateFormat = "MM/DD/YYYY";
  const dispatch = useDispatch()

  const handleHypertensionBpMonitor = (e: any, index: any) => {
    const bloodPressure = [...hypertensionBp];
    let item = hypertensionBp[index];
    item = { ...item, [e.target.name]: e.target.value };
    bloodPressure[index] = item;
    setHypertensionBp(bloodPressure);
  };



  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const hyperTenion = { ...hp };

    Object.assign(hyperTenion, {
      bp: hypertensionBp,
    });
    Object.assign(hyperTenion, completed);
    dispatch(setBpRows(hypertensionBp))
    const response = await saveQuestionairsData("hypertension", hyperTenion);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const hyperTenion = { ...hp };
    Object.assign(hyperTenion, {
      bp: hypertensionBp,
    });
    dispatch(setBpRows(hypertensionBp))
    Object.assign(hyperTenion, completed);

    await saveQuestionairsData("hypertension", hyperTenion);
    handleNextStep && handleNextStep();
  };

  const handleAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newBpRow: Hypertension = {
      key: count,
      bp_day: "",
      systolic_day: "",
      diastolic_day: "",
    };

    const data = [...hypertensionBp, newBpRow];
    setHypertensionBp(data);
    setCount(count + 1);
  };

  const handleDelete = (index: any) => {
    if (hypertensionBp.length > 0) {
      const newData = hypertensionBp.filter((item) => item.key !== index);
      setHypertensionBp(newData);
    }
  };

  const defaultOptions = ["Yes", "No"];

  const [showBpRecordBody, setShowBpRecordBody] =
    React.useState<boolean>(
      Boolean(hp?.daily_bp_reading === "Yes") ?? false
    );

  const [showReasonBody, setShowReasonBody] =
    React.useState<boolean>(
      Boolean(hp?.daily_bp_reading === "No") ?? false
    );


  const [showHypertensiveUrgency, setShowHypertensiveUrgency] =
    React.useState<boolean>(false);


  React.useEffect(() => {
    const dailyBpReading = hp?.daily_bp_reading;
    if (dailyBpReading === "Yes") {
      setHp({
        ...hp,
        reason_for_no_bp: "",
      });
    } else if (dailyBpReading === "No") {
      setHypertensionBp([]);
    }

    setShowBpRecordBody(Boolean(dailyBpReading === "Yes"))
    setShowReasonBody(Boolean(dailyBpReading === "No"))
  }, [hp?.daily_bp_reading])


  React.useEffect(() => {
    if (hypertensionBp?.length >= 2) {
      const diastolicCount = hypertensionBp?.filter((items: any) => {
        return items?.diastolic_day > 120;
      });


      if (diastolicCount.length < 2) {
        setHp({
          ...hp,
          hypertensive_urgency0: "",
          hypertensive_urgency1: "",
          hypertensive_urgency2: "",
          hypertensive_urgency3: "",
          hypertensive_urgency4: "",
          hypertensive_urgency5: "",
          hypertensive_urgency6: "",
          hypertensive_urgency7: "",
        });
      }
      setShowHypertensiveUrgency(Boolean(diastolicCount.length >= 2))
    }
  }, [hypertensionBp])


  function handlevalue(e: any) {
    const value = e.target.value;

    setHp({
      ...hp,
      [e.target.name]: value,
    });
  }

  function handleGoalDate(name: string, value: string) {
    setHp({
      ...hp,
      [name]: value,
    });
  }

  function dateChange(name: string, value: string, index: number) {
    const newHp = [...hypertensionBp];
    let item = hypertensionBp[index];
    item = { ...item, [name]: value };
    newHp[index] = item;
    /*     const assessmentHypertension = { ...hp, bp: newHp };
     */ setHypertensionBp(newHp);
  }

  function hypertensiveUrgencyChange(e: any) {
    const value = e.target.checked === true ? e.target.value : "";
    setHp({
      ...hp,
      [e.target.name]: value,
    });
  }

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Hypertension</h2>

        <div className="mb-3">
          <label>Have you been checking your BP reading on a daily basis?</label>
          <div>
            <Radio.Group
              name="daily_bp_reading"
              value={hp?.daily_bp_reading}
              onChange={(e) => handlevalue(e)}
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

        {showBpRecordBody && (
          <div>
            <label>
              If you have been monitoring your Blood pressure, please tell me the
              readings from the last three days.
            </label>
            <table className="table">
              <tbody>
                {hypertensionBp?.map((items: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td>
                        <DatePickerComponent
                          fieldName={"bp_day"}
                          value={items?.bp_day}
                          placeHolder={"BP Monitor date"}
                          dateFormat={dateFormat}
                          handleChange={(key: string, value: string) =>
                            dateChange(key, value, index)
                          }
                        />
                      </td>
                      <td style={{ paddingLeft: "3px" }}>
                        <Input
                          type="number"
                          value={items?.systolic_day}
                          name="systolic_day"
                          size="middle"
                          placeholder="Systolic value"
                          onChange={(e) => handleHypertensionBpMonitor(e, index)}
                        />
                      </td>
                      <td style={{ paddingLeft: "3px" }}>
                        <Input
                          type="number"
                          value={items?.diastolic_day}
                          name="diastolic_day"
                          placeholder="Diastolic value"
                          onChange={(e) => handleHypertensionBpMonitor(e, index)}
                        />
                      </td>
                      <td style={{ paddingLeft: "3px" }}>
                        <Tooltip title={"Delete"}>
                          <Button danger shape="circle" size="small">
                            <i
                              className="fas fa-times"
                              onClick={() => handleDelete(items.key)}
                            ></i>
                          </Button>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <Button onClick={handleAdd} className="mb-5" type="primary">
              Add a row
            </Button>
          </div>
        )}

        {showReasonBody && (
          <div className="mb-3">
            <label>
              If patient has not been monitoring their blood pressure, please
              state the reason
            </label>
            <div>
              <TextArea
                style={{ width: "50%" }}
                value={hp?.reason_for_no_bp}
                name="reason_for_no_bp"
                onChange={(e) => handlevalue(e)}
              />
            </div>
          </div>
        )}

        {showHypertensiveUrgency && (
          <div className="mb-3">
            <label>
              <b> Hypertensive Emergency </b>
            </label>
            <div className="row">
              <div className="col-lg-12 md-12 sm-12">
                <Space direction="vertical">
                  {hypertensiveUrgency?.length > 0 ? (
                    hypertensiveUrgency?.map((items) => {
                      const name = items?.name;
                      return (
                        <>
                          <Checkbox
                            key={items.value}
                            className="mr-2"
                            name={items?.name}
                            value={items.value}
                            checked={hp[name] === items?.value}
                            onChange={(e) => hypertensiveUrgencyChange(e)}
                          >
                            {items.label}
                          </Checkbox>
                        </>
                      )
                    })
                  ) : null
                  }

                </Space>
              </div>
            </div>
          </div>
        )
        }

        <div className="row mb-2">
          <div className="col-12">
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
              <div className="col-6">
                <label htmlFor="">
                  <b> To acquire Knowledge about Hypertension and its effect on the multiple body organs. </b>
                </label>
              </div>
            </div>

            {/* Tasks Starts */}
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b> Educate patient on HTN and its long-term effects on the body. </b>
                  <p>
                    High blood pressure is a condition that puts you at risk for heart attack, stroke, and kidney disease.
                    It does not usually cause symptoms. But it can be serious. So, it is very important to have good BP control.
                    Most adults with hypertension have primary hypertension (formerly called "essential" hypertension), which means that the cause of the high blood pressure is not known.
                    A small subset of adults has secondary hypertension, which means that there is an underlying and potentially correctable cause, usually a kidney or hormonal disorder.
                    Unfortunately, many people's blood pressure is not well controlled. According to a national survey, hypertension was in good control in only 47 percent of adults.
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"understanding_regarding_disease_start_date"}
                  value={hp?.understanding_regarding_disease_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"understanding_regarding_disease_end_date"}
                  value={hp?.understanding_regarding_disease_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div>

            {/* <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>Monitor blood pressure levels of patients.</b>
                  <br />
                  It's important to get an accurate blood pressure reading so
                  that you have a clearer picture of your risk for heart disease
                  and stroke.
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"monitor_blood_pressure_start_date"}
                  value={hp?.monitor_blood_pressure_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"monitor_blood_pressure_end_date"}
                  value={hp?.monitor_blood_pressure_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div> */}

            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>To educate patient on Lifestyle modifications to help with better BP control. </b>
                </label>
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>Educate the patient about DASH diet </b>
                  <p>
                    DASH diet – The Dietary Approaches to Stop Hypertension (DASH) dietary pattern is high in vegetables, fruits, low-fat dairy products,
                    whole grains, poultry, fish, and nuts and low in sweets, sugar-sweetened beverages, and red meats.
                    The DASH dietary pattern is consequently rich in potassium, magnesium, calcium, protein, and fiber but low in saturated fat, total fat, and cholesterol.
                    Choose a diet rich in fruits, vegetables, and low-fat dairy products, and low in meats, sweets, and refined grains
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_dash_diet_start_date"}
                  value={hp?.educate_about_dash_diet_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_dash_diet_end_date"}
                  value={hp?.educate_about_dash_diet_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>Educate patient about low sodium diet</b>
                  <p>
                    Eat less salt (sodium): The most important thing you can do to cut down on sodium is to eat less processed food.
                    That means that you should avoid most foods that are sold in cans, boxes, jars, and bags.
                    You should also eat in restaurants less often
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_sodium_diet_start_date"}
                  value={hp?.educate_about_sodium_diet_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_sodium_diet_end_date"}
                  value={hp?.educate_about_sodium_diet_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>Educate patient about importance of exercise</b>
                  <p>
                    Do something active for at least 30 minutes a day on most days of the week.
                    If you don't do any activity now, start by walking for just a few minutes every other day.
                    Do that for a few weeks. If you stick with it, try doing it for longer.
                    But if you find that you don't like walking, try a different activity.
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_excercise_start_date"}
                  value={hp?.educate_about_excercise_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_excercise_end_date"}
                  value={hp?.educate_about_excercise_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>Educate patient on effects of alcohol on BP</b>
                  <p>
                    Limit the amount of alcohol you drink.
                    (If applicable): If you are a woman, do not have more than 1 "standard drink" of alcohol a day.
                    If you are a man, do not have more than 2. A "standard drink"
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_alcoholeffects_start_date"}
                  value={hp?.educate_about_alcoholeffects_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_alcoholeffects_end_date"}
                  value={hp?.educate_about_alcoholeffects_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>Educate patients about the effect of smoking on BP</b>
                  <p>
                    If you have high blood pressure, it's also very important to quit smoking (if you smoke).
                    Quitting smoking might not bring your blood pressure down.
                    But it will lower the chances that you'll have a heart attack or stroke, and it will help you feel better and live longer.
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_smokingeffects_start_date"}
                  value={hp?.educate_about_smokingeffects_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_about_smokingeffects_end_date"}
                  value={hp?.educate_about_smokingeffects_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>Patient will understand the importance of Treatment Adherence and Regular BP monitoring. </b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>Explain to the patient the role of regular BP monitoring and treatment adherence in BP control.</b>
                  <p>
                    You need to adhere to your treatment regimen for optimal Blood pressure control.
                    Forgetting to take medications can result in high BP which will increase the risk of complications.
                    Also, you need to have an understanding of the medications you take for Blood pressure control.
                    If you don’t know then please bring all the prescription medications at your next visit and ask your PCP.
                    In addition to that, regular BP monitoring is very important as per the PCP/cardiologist recommendations.
                  </p>

                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"regular_bp_monitoring_start_date"}
                  value={hp?.regular_bp_monitoring_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"regular_bp_monitoring_end_date"}
                  value={hp?.regular_bp_monitoring_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div>

            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>Regular Follow up with PCP. </b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>Patient will understand the importance of regular follow ups with PCP for BP monitoring as well as overall health assessment periodically.</b>
                  <p>
                    Regularly seeing your PCP to be evaluated for your overall health and being specifically assessed for Blood Pressure monitoring is important.
                    Changes in lifestyle and diet as well as other contributing factors can cause Blood Pressure to be affected and your treatment may need to be adjusted based on that.
                    Therefore, it is important to regularly follow up to be evaluated for Blood Pressure as well as other health issues.
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"regular_pcp_folloup_start_date"}
                  value={hp?.regular_pcp_folloup_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"regular_pcp_folloup_end_date"}
                  value={hp?.regular_pcp_folloup_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    handleGoalDate(key, value)
                  }
                />
              </div>
            </div>

          </div>
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
      </div >
    </>
  );
};
export default Hypertensions;
