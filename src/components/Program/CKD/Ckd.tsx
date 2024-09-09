import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { Button, DatePicker, Input, Radio, Space } from "antd";
import React from "react";
import {
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { CKDType } from "./../../../Types/QuestionaireTypes";
import { OpenNotification } from "./../../../Utilties/Utilties";
import DatePickerComponent from "../../../components/DatePickerComponent/DatePickerComponent";
import moment from "moment";
// import { useDispatch } from "react-redux";
// import { setBpRows } from "../../../store/reducer/QuestionairesReducer";

const CKD: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { ckd_assessment },
    // bpRows,
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [ckd, setCkd] = React.useState<CKDType>(ckd_assessment as CKDType);
  // const [count, setCount] = useState(1);
  // const [bpRowss, setBpRowss] = useState<CKDType[]>(bpRows?.length > 0 ? bpRows : ckd_assessment !== undefined ? ckd_assessment.bp : []);
  // const dispatch = useDispatch()
  const dateFormat = "MM/DD/YYYY";
  const monthFormat = "MM/YYYY";
  const defaultOptions = ["Yes", "No"];

  const dates = {
    egfr_date: ckd?.egfr_date
      ? moment(ckd?.egfr_date, monthFormat)
      : undefined,
  };

  const [showNephrologistNameBody, setShowNephrologistNameBody] = React.useState<boolean>(Boolean(ckd?.nephrologist_question === "Yes") ?? false);

  React.useEffect(() => {
    const seeNephrologist = ckd?.nephrologist_question;
    if (seeNephrologist === "No") {
      setCkd({
        ...ckd,
        nephrologist_name: "",
      });
    }
    setShowNephrologistNameBody(Boolean(seeNephrologist === "Yes"))

  }, [ckd?.nephrologist_question])

  /* const handlebpMonitor = (e: any, index: any) => {

    const bloodPressure = [...bpRowss];
    let item = bpRowss[index];
    item = { ...item, [e.target.name]: e.target.value };
    bloodPressure[index] = item;
    setBpRowss(bloodPressure);
  };

  const handleAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newBpRow: CKDType = {
      key: count,
      bp_day: "",
      systolic_day: "",
      diastolic_day: "",
    };
    const data = [...bpRowss, newBpRow];
    setBpRowss(data);
    setCount(count + 1);
  };

  const handleDelete = (keys: any) => {

    if (bpRowss.length > 0) {
      const newData = bpRowss.filter((item) => item.key !== keys);
      setBpRowss(newData);
    }
  }; */



  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const ckdAssessment = { ...ckd };
    // Object.assign(ckdAssessment, {
    //   bp: bpRowss
    // });
    // dispatch(setBpRows(bpRowss))
    Object.assign(ckdAssessment, completed);

    const response = await saveQuestionairsData(
      "ckd_assessment",
      ckdAssessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const ckdAssessment = { ...ckd };
    // Object.assign(ckdAssessment, {
    //   bp: bpRowss
    // });
    // dispatch(setBpRows(bpRowss))
    Object.assign(ckdAssessment, completed);

    await saveQuestionairsData("ckd_assessment", ckdAssessment);
    handleNextStep && handleNextStep();
  };

  function handlevalue(e: any) {
    const value = e.target.value;

    setCkd({
      ...ckd,
      [e.target.name]: value,
    });
  }

  function dateChange(name: string, value: string) {
    setCkd({
      ...ckd,
      [name]: value,
    });
  }

  /* function bpDateChange(name: string, value: string, index: number) {

    const bloodPressure = [...bpRowss];
    let item = bpRowss[index];
    item = { ...item, [name]: value };
    bloodPressure[index] = item;
    setBpRowss(bloodPressure);
  } */

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Chronic Kidney Disease</h2>

        {/* BLOOD PRESSURE MONITORING FIELDS */}
        {/* <div>
          <label>
            If you have been monitoring your Blood pressure, please tell me the
            readings from the last three days.
          </label>
          <table className="table">
            <tbody>
              {bpRowss?.map((items: any, index: any) => {
                return (
                  <tr key={index}>
                    <td>
                      <DatePickerComponent
                        fieldName={"bp_day"}
                        value={items?.bp_day}
                        placeHolder={"BP Monitor date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          bpDateChange(key, value, index)
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
                        onChange={(e) => handlebpMonitor(e, index)}
                      />
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Input
                        type="number"
                        value={items?.diastolic_day}
                        name="diastolic_day"
                        placeholder="Diastolic value"
                        onChange={(e) => handlebpMonitor(e, index)}
                      />
                    </td>
                    <td style={{ paddingLeft: "3px" }}>
                      <Tooltip title={"Delete"}>
                        <Button danger size="small" shape="circle">
                          <i
                            className="fas fa-times"
                            onClick={() => handleDelete(items.key)}
                          ></i>
                        </Button>
                      </Tooltip>
                    </td>
                  </tr>
                );
              })

              }
            </tbody>
          </table>
          <Button onClick={handleAdd} className="mb-5" type="primary">
            Add a row
          </Button>
        </div> */}

        {/* HBA1C field and eGFR Fields */}
        <div>
          {/* <div className="row">
            <div className="col-lg-6 mb-3">
              <Input
                value={ckd?.hba1c}
                name="hba1c"
                placeholder="HBA1C Result"
                onChange={(e) => handlevalue(e)}
              />
            </div>
          </div> */}

          <div className="mb-3">
            <div className="mb-2">
              <label>
                <b></b>
                Mention the result and date of last eGFR.
              </label>
            </div>

            <div>
              <label>eGFR Result</label>
            </div>
            <div className="row mb-3">
              <div className="col-lg-6">
                <Input
                  type="number"
                  name="egfr_result_one_report"
                  value={ckd?.egfr_result_one_report}
                  placeholder="eGFR Result"
                  onChange={(e) => handlevalue(e)}
                />
              </div>

              <div className="col-lg-6">
                <DatePicker
                  className="form-control"
                  name="egfr_date"
                  placeholder="eGFR date"
                  value={dates.egfr_date}
                  onChange={(e, datestring) =>
                    dateChange("egfr_date", datestring)
                  }
                  format={monthFormat}
                  picker="month"
                />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-lg-6">
                <label className="question-text" style={{ marginRight: "10px" }}>
                  Do you see the Nephrologist?
                </label>
                <div>
                  <Radio.Group
                    name="nephrologist_question"
                    onChange={(e) => {
                      handlevalue(e);
                    }}
                    value={ckd?.nephrologist_question}
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

            {showNephrologistNameBody === true ? (
              <>
                <div className="row">
                  <div className="col-lg-6">
                    <label> Name of the Nephrologist </label>
                    <Input
                      name="nephrologist_name"
                      value={ckd?.nephrologist_name}
                      placeholder="Nephrologist Name"
                      onChange={(e) => handlevalue(e)}
                    />
                  </div>
                </div>
              </>
            ) : null}

          </div>

          {/* <div className="mb-3">
            <div>
              <label>Second test</label>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <DatePickerComponent
                  fieldName={"egfr_result_two_start_date"}
                  value={ckd?.egfr_result_two_start_date}
                  placeHolder={"eGFR Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-lg-6">
                <Input
                  type="number"
                  name="egfr_result_two_report"
                  value={ckd?.egfr_result_two_report}
                  placeholder="eGFR Result"
                  onChange={(e) => handlevalue(e)}
                />
              </div>
            </div>
          </div> */}
        </div>

        {/* Treatment Goals */}
        <div>
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

              {/* GOAL 1 STARTS */}
              <div>
                <div className="row mb-2">
                  <div className="col-6">
                    <label>
                      <b>
                        Assess patient knowledge on CKD and its complications and educate on steps to prevent worsening of renal function.
                      </b>
                    </label>
                  </div>
                </div>
                {/* TASKS */}
                <div>
                  {/* TASK 1 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>To educate patient on CKD.</b>
                        <p>
                          Chronic kidney disease ("CKD") is when the kidneys stop working as well as they should.
                          When they are working normally, the kidneys filter the blood and remove waste and excess salt and water.
                        </p>
                        <p>
                          In people with CKD, the kidneys slowly lose the ability to filter blood.
                          In time, the kidneys can stop working completely. That is why it is so important to keep CKD from getting worse
                        </p>
                      </p>
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"educate_on_ckd_start_date"}
                        value={ckd?.educate_on_ckd_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"educate_on_ckd_end_date"}
                        value={ckd?.educate_on_ckd_end_date}
                        placeHolder={"End Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                  </div>

                  {/* TASK 2 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>To educate patient on symptoms of worsening CKD.</b>

                        <p>
                          At first, CKD causes no symptoms. As the disease gets worse, it can:
                          <ul>
                            <li>Make your feet, ankles, or legs swell (doctors call this "edema")</li>
                            <li>Give you high blood pressure</li>
                            <li>Make you very tired</li>
                            <li>Damage your bones</li>
                          </ul>
                        </p>
                      </p>
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"worsening_symptoms_start_date"}
                        value={ckd?.worsening_symptoms_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"worsening_symptoms_end_date"}
                        value={ckd?.worsening_symptoms_end_date}
                        placeHolder={"End Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                  </div>

                  {/* TASK 3 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>To understand the importance of follow up with PCP and nephrologist if needed for management of CKD</b>

                        <p>
                          Your doctor will want to see you regularly.
                          You will probably have appointments at least once a year, and you will get regular tests to check your kidneys. These include blood and urine tests.
                        </p>
                        <p>
                          If your CKD gets worse over time, you will probably need to see a "nephrologist." This is a doctor who takes care of people with kidney disease.
                        </p>
                      </p>
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"followup_importance_start_date"}
                        value={ckd?.followup_importance_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"followup_importance_end_date"}
                        value={ckd?.followup_importance_end_date}
                        placeHolder={"End Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                  </div>

                  {/* TASK 4 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>To understand what the patient can do to prevent worsening of kidney function.</b>

                        <p>
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
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"prevent_worsening_start_date"}
                        value={ckd?.prevent_worsening_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"prevent_worsening_end_date"}
                        value={ckd?.prevent_worsening_end_date}
                        placeHolder={"End Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                  </div>

                  {/* TASK 5 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>To learn about the medication that you should avoid</b>
                        <p>
                          Avoid medicines that can harm the kidneys – One example is "nonsteroidal antiinflammatory drugs," or "NSAIDs."
                          These medicines include ibuprofen (sample brand names: Advil, Motrin) and naproxen (sample brand name: Aleve).
                          There are other medicines that people with CKD need to avoid, too.
                          Check with your doctor, nurse, or kidney specialist before starting any new medicines or supplements, even those you can buy without a prescription.
                        </p>
                      </p>
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"aviod_medications_start_date"}
                        value={ckd?.aviod_medications_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"aviod_medications_end_date"}
                        value={ckd?.aviod_medications_end_date}
                        placeHolder={"End Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                  </div>

                  {/* TASK 6 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>To understand how CKD is treated and importance of treatment compliance.</b>
                        <p>
                          People in the early stages of CKD can take medicines to keep the disease from getting worse.
                          For example, many people with CKD should take medicines known as "ACE inhibitors" or "angiotensin receptor blockers."
                          If your doctor prescribes these medicines, it is very important that you take them every day as directed.
                          If they cause side effects or cost too much, tell your doctor. They might have solutions to offer.
                        </p>
                      </p>
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"ckd_treatment_start_date"}
                        value={ckd?.ckd_treatment_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-3">
                      <DatePickerComponent
                        fieldName={"ckd_treatment_end_date"}
                        value={ckd?.ckd_treatment_end_date}
                        placeHolder={"End Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* GOAL 1 ENDS */}

              {/* GOAL 2 STARTS */}
              <div>
                <div className="row mb-2">
                  <div className="col-6">
                    <label>
                      <b>
                        Assess patient knowledge on risk factors of CKD and ways to prevent developing CKD.
                      </b>
                    </label>
                  </div>
                </div>

                {/* TASK 1 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate on factors that can increase risk of developing CKD.</b>
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
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"educate_on_risk_factors_start_date"}
                      value={ckd?.educate_on_risk_factors_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"educate_on_risk_factors_end_date"}
                      value={ckd?.educate_on_risk_factors_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 2 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patient on lowering the risk of CKD development and rate of CKD progression.</b>
                      <p>
                        The first step in the treatment of CKD is to determine the underlying cause. Some causes are reversible, including use of medications that impair kidney function, blockage in the urinary tract, or decreased blood flow to the kidneys. Treatment of reversible causes may prevent CKD from worsening.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"educate_on_lowering_risk_start_date"}
                      value={ckd?.educate_on_lowering_risk_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"educate_on_lowering_risk_end_date"}
                      value={ckd?.educate_on_lowering_risk_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 3 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>Understanding effects of Hypertension on Kidneys.</b>
                      <p>
                        Hypertension, or high blood pressure, is present in 80 to 85 percent of people with CKD. Maintaining good blood pressure control is the most important goal for trying to slow the progression of CKD. Taking a medication called an angiotensin-converting enzyme (ACE) inhibitor or angiotensin receptor blocker (ARB) reduces blood pressure and levels of protein in the urine and is thought to slow the progression of CKD to a greater extent than some of the other medicines used to treat high blood pressure. Newer medications have also become available in recent years that work with ACE inhibitors or ARBs to slow the progression of CKD.
                      </p>
                      <p>
                        Sometimes, a diuretic (water pill) or other medication is also added. You may be asked to monitor your blood pressure at home to be sure that your blood pressure is well controlled
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"hypertension_effects_risk_start_date"}
                      value={ckd?.hypertension_effects_risk_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"hypertension_effects_risk_end_date"}
                      value={ckd?.hypertension_effects_risk_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 3 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To understand healthy diet for Kidneys.</b>
                      <p>
                        Changes in your diet may be recommended to control or prevent some of the complications of CKD; most important is salt restriction to help control the blood pressure.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"healthy_diet_start_date"}
                      value={ckd?.healthy_diet_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"healthy_diet_end_date"}
                      value={ckd?.healthy_diet_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 4 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To understand effect of Protein on Kidneys.</b>
                      <p>
                        Restricting protein in the diet may slow the progression of CKD, although it is not clear if the benefits of protein restriction are worth the difficulty of sticking to a low-protein diet, particularly when other medications to slow progression of CKD are used. Although a reduced-protein diet may delay dialysis for several years, the unappetizing nature of the diet is difficult for most people to tolerate. Speak to your health care provider about the advantages and disadvantages of a low-protein diet. Some people may benefit from a plant-based diet.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"protein_effects_start_date"}
                      value={ckd?.protein_effects_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"protein_effects_end_date"}
                      value={ckd?.protein_effects_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 5 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To understand health effects of elevated Cholesterol and triglycerides with CKD.</b>
                      <p>
                        High cholesterol and triglyceride levels are common in people with kidney disease. High triglycerides have been associated with an increased risk of coronary artery disease, which can lead to heart attack.
                      </p>
                      <p>
                        Treatments to reduce the risk of coronary artery disease are usually recommended, including dietary changes, medications for high triglyceride and cholesterol levels, stopping smoking, and tight blood sugar control in people with diabetes.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"elevated_cholesterol_start_date"}
                      value={ckd?.elevated_cholesterol_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"elevated_cholesterol_end_date"}
                      value={ckd?.elevated_cholesterol_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>
              </div>
              {/* GOAL 2 ENDS */}

              {/* GOAL 3 STARTS */}
              <div>
                <div className="row mb-2">
                  <div className="col-6">
                    <label>
                      <b>
                        Assess patient knowledge on Diabetic Kidney Disease.
                      </b>
                    </label>
                  </div>
                </div>

                {/* TASK 1 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patient on DKD.</b>
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
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"educate_on_dkd_start_date"}
                      value={ckd?.educate_on_dkd_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"educate_on_dkd_end_date"}
                      value={ckd?.educate_on_dkd_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 2 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patient on DKD symptoms.</b>
                      <p>
                        Diabetic kidney disease commonly causes no symptoms until at least 80 percent of your kidneys' function is lost. To detect diabetic kidney disease, health care providers rely on tests that measure protein (albumin) levels in the urine and blood tests to evaluate the level of kidney function.
                      </p>
                      <p>
                        When the kidneys are working normally, they prevent albumin from leaking into the urine, so finding albumin in the urine is a sign that the kidneys are in trouble. Often people who have diabetic kidney disease also have high blood pressure.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"dkd_symptoms_start_date"}
                      value={ckd?.dkd_symptoms_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"dkd_symptoms_end_date"}
                      value={ckd?.dkd_symptoms_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 3 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patient on risk factors of DKD.</b>
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
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"dkd_risk_factors_start_date"}
                      value={ckd?.dkd_risk_factors_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"dkd_risk_factors_end_date"}
                      value={ckd?.dkd_risk_factors_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 4 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patient on prevention of progression of DKD.</b>
                      <p>
                        People with diabetes often focus on keeping their blood sugar levels in the right ranges. And while it is important to control blood sugar, it turns out that controlling blood pressure is at least as important. That's because high blood sugar and high blood pressure work in concert to damage the blood vessels and organ systems.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"dkd_progression_start_date"}
                      value={ckd?.dkd_progression_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"dkd_progression_end_date"}
                      value={ckd?.dkd_progression_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 5 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate the effect of healthy lifestyle on DKD.</b>
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
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"healthy_lifestyle_effect_start_date"}
                      value={ckd?.healthy_lifestyle_effect_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"healthy_lifestyle_effect_end_date"}
                      value={ckd?.healthy_lifestyle_effect_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 6 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate the effect of controlling blood sugar.</b>
                      <p>
                        <ul>
                          <li>Keep your blood sugar as close to normal as possible.</li>
                        </ul>
                        Keeping blood sugars close to normal can help prevent the long-term complications of diabetes mellitus. For most people, a target for fasting blood glucose and for blood glucose levels before each meal is 80 to 120 mg/dL (4.4 to 6.6 mmol/L); however, these targets may need to be individualized.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"blood_sugar_control_start_date"}
                      value={ckd?.blood_sugar_control_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"blood_sugar_control_end_date"}
                      value={ckd?.blood_sugar_control_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 7 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate importance of HBA1C.</b>
                      <p>
                        A blood test called A1C is also used to monitor blood sugar levels; the result provides an average of blood sugar levels over the last one to three months. An A1C of 7 percent or less is usually recommended; this corresponds to an average blood glucose of 150 mg/dL (8.3 mmol/L). Even small decreases in the A1C lower the risk of diabetes-related complications to some degree.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"hba1c_importance_start_date"}
                      value={ckd?.hba1c_importance_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"hba1c_importance_end_date"}
                      value={ckd?.hba1c_importance_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 8 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate how to bring blood sugars under control.</b>
                      <p>
                        Managing your blood sugar involves lifestyle changes (eg, diet and exercise) as well as medications. Type 1 diabetes is treated with insulin. For type 2 diabetes, other medications are often used; some are not recommended for use in people with kidney problems, while others may help slow the progression of kidney disease. Your doctors will work with you to determine what combination of medications is best for you.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"control_blood_sugar_start_date"}
                      value={ckd?.control_blood_sugar_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"control_blood_sugar_end_date"}
                      value={ckd?.control_blood_sugar_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 9 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate the effect of Blood Pressure on DKD.</b>
                      <p>
                        Keep your blood pressure below 130/80, if possible
                        <p>
                          Many people with diabetes have hypertension (high blood pressure). Although high blood pressure causes few symptoms, it has two negative effects: it stresses the cardiovascular system and speeds the development of diabetic complications of the kidney and eye. A health care provider can diagnose high blood pressure by measuring blood pressure on a regular basis.
                        </p>
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"bp_effect_on_dkd_start_date"}
                      value={ckd?.bp_effect_on_dkd_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"bp_effect_on_dkd_end_date"}
                      value={ckd?.bp_effect_on_dkd_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>

                {/* TASK 10 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate about the treatment of Hypertension.</b>
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
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"hypertension_treatment_start_date"}
                      value={ckd?.hypertension_treatment_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"hypertension_treatment_end_date"}
                      value={ckd?.hypertension_treatment_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>
              </div>
              {/* GOAL 3 ENDS */}

              {/* GOAL 4 STARTS */}
              <div>
                <div className="row mb-2">
                  <div className="col-6">
                    <label>
                      <b>
                        Assess knowledge of association between CKD and Cardiovascular disease.
                      </b>
                    </label>
                  </div>
                </div>

                {/* TASK 1 */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patient on association between CKD and heart disease.</b>
                      <p>
                        There is a large body of evidence that patients with CKD have a substantial increase in cardiovascular risk that can be in part explained by an increase in traditional risk factors such as hypertension, diabetes, and the metabolic syndrome. CKD alone is also an independent risk factor for cardiovascular disease. So better management of CKD will result in lowering the risk of heart disease as well.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"ckd_heart_start_date"}
                      value={ckd?.ckd_heart_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"ckd_heart_end_date"}
                      value={ckd?.ckd_heart_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>
              </div>
              {/* GOAL 4 ENDS */}
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
      </div>
    </>
  );
};
export default CKD;
