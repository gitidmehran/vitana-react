import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";
import { Button, Checkbox, Input, Radio, Space } from "antd";
import React from "react";
import { QuestionaireStepProps } from "../../../Types/QuestionaireTypes";
import { COPDType } from "./../../../Types/QuestionaireTypes";
import { OpenNotification } from "./../../../Utilties/Utilties";
import DatePickerComponent from "../../../components/DatePickerComponent/DatePickerComponent";

const ChronicObstructivePulmonaryDisease: React.FC<QuestionaireStepProps> = ({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}) => {
  const {
    question: { copd_assessment, tobacco_use },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [copd, setCopd] = React.useState<COPDType>(copd_assessment as COPDType );
  const dateFormat = "MM/DD/YYYY";

  const defaultOptions = ["Yes", "No"];

  const [showDoctorNameBody, setShowDoctorNameBody] = React.useState<boolean>(Boolean(copd?.lung_doctor === "Yes") ?? false);
  const [showAmountDurationBody, setShowAmountDurationBody] = React.useState<boolean>(Boolean(copd?.currently_smoking === "Yes") ?? false);
  const [showSmokingQuitBody, setShowSmokingQuitBody] = React.useState<boolean>(Boolean(copd?.currently_smoking === "No") ?? false);
  const [showSmokingCessationBody, setShowSmokingCessationBody] = React.useState<boolean>(Boolean(copd?.currently_smoking === "Yes") ?? false);
  const [showNeverSmokedBody, setShowNeverSmokedBody] = React.useState<boolean>(Boolean(copd?.never_smoked !== "1") ?? false);
  const [showNeverCtScanBody, setShowNeverCtScanBody] = React.useState<boolean>(Boolean(copd?.never_ct_scan !== "1") ?? false);


  /* USE Effect on Lung Doctor Question  */
  React.useEffect(() => {
    const haveLungDoctor = copd?.lung_doctor;

    if (haveLungDoctor === "No") {
      setCopd({
        ...copd,
        lung_doctor_name: "",
      });
    }

    setShowDoctorNameBody(Boolean(haveLungDoctor === "Yes"));

  }, [copd?.lung_doctor])

  React.useEffect(() => {
    const currentlySmoking = copd?.currently_smoking ?? tobacco_use?.smoked_in_thirty_days;

    if (currentlySmoking === "No") {
      setCopd({
        ...copd,
        smoking_duration: "",
        cigarettes_amount: "",
        smoking_cessation_start_date: "",
        smoking_cessation_end_date: "",
      });
    } else {
      setCopd({
        ...copd,
        smoking_quit_duration: "",
      });
    }

    setShowAmountDurationBody(Boolean(currentlySmoking === "Yes"))
    setShowSmokingCessationBody(Boolean(currentlySmoking === "Yes"))
    setShowSmokingQuitBody(Boolean(currentlySmoking === "No"))

  }, [copd?.currently_smoking])

  /* Calculate total CAT score */
  React.useEffect(() => {
    const totalSysmptomsScore =
      copd?.Cough +
      copd?.breathless +
      copd?.energy_level +
      copd?.limited_activities +
      copd?.lung_condition +
      copd?.phlegum_in_chest +
      copd?.sound_sleep +
      copd?.tight_chest;
    setCopd({
      ...copd,
      total_assessment_score: totalSysmptomsScore ? totalSysmptomsScore : "",
    });
  }, [
    copd?.Cough,
    copd?.breathless,
    copd?.energy_level,
    copd?.limited_activities,
    copd?.lung_condition,
    copd?.phlegum_in_chest,
    copd?.sound_sleep,
    copd?.tight_chest,
  ]);

  /* Effect Quit Smoking fields when checked */
  React.useEffect(() => {
    const neverSmoked = copd?.never_smoked;
    if (neverSmoked === "1") {
      setCopd({
        ...copd,
        smoking_quit_duration: "",
      })
    }

    setShowNeverSmokedBody(Boolean(copd?.never_smoked !== "1"));

  }, [copd?.never_smoked])

  /* Effect Chest CT Scan fields when checked */
  React.useEffect(() => {
    const neverHadCtScan = copd?.never_ct_scan;
    if (neverHadCtScan === "1") {
      setCopd({
        ...copd,
        last_ct_scan: "",
      })
    }

    setShowNeverCtScanBody(Boolean(copd?.never_ct_scan !== "1"))
  }, [copd?.never_ct_scan])

  /* Assessment Not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const copdAssessment = { ...copd };
    Object.assign(copdAssessment, completed);

    const response = await saveQuestionairsData(
      "copd_assessment",
      copdAssessment
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
    const copdAssessment = { ...copd };
    Object.assign(copdAssessment, completed);

    await saveQuestionairsData("copd_assessment", copdAssessment);
    handleNextStep && handleNextStep();
  };

  /* Handle Value for Fields */
  function handlevalue(e: any) {
    const value = e.target.value;

    setCopd({
      ...copd,
      [e.target.name]: value,
      total_assessment_score: copd?.total_assessment_score,
    });
  }

  /* Handle Date Change */
  function dateChange(name: string, value: string) {
    setCopd({
      ...copd,
      [name]: value,
    });
  }

  /* Handle Symptoms Score */
  function handleSymptomsScore(e: any) {
    const value = e.target.value;
    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }

  /* Handle Checkbox Fields */
  function handleNeverCheckbox(e: any) {
    const value = e.target.checked === true ? e.target.value : "";

    setCopd({
      ...copd,
      [e.target.name]: value,
    });
  }

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Chronic Obstructive Pulmonary Disease</h2>

        <div className="mb-3">
          <label> Do you have a Lung Doctor? </label>
          <div>
            <Radio.Group
              name="lung_doctor"
              value={copd?.lung_doctor}
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

        {/* Asking Lung doctor name if Yes to above question */}
        {showDoctorNameBody && (
          <div className="mb-3">
            <label>Please mention name of the doctor</label>
            <div className="row">
              <div className="col-4">
                <Input
                  type="text"
                  placeholder="Doctor Name"
                  name="lung_doctor_name"
                  size="middle"
                  value={copd?.lung_doctor_name}
                  onChange={(e) => handlevalue(e)}
                />
              </div>
            </div>
          </div>
        )}


        {/* Spirometry Test Performed */}
        <div className="mb-3">
          <label> When was your last Spirometry test performed? </label>
          <div className="row">
            <div className="col-4">
              <DatePickerComponent
                fieldName={"spirometry_test_date"}
                value={copd?.spirometry_test_date}
                placeHolder={"Estimated Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
        </div>

        {/* Smoking section */}
        <div className="mb-3">
          <label> Do you currently smoke? </label>
          <div>
            <Radio.Group
              name="currently_smoking"
              value={copd?.currently_smoking ?? tobacco_use?.smoked_in_thirty_days}
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

        {showAmountDurationBody && (
          <div className="mb-3">
            <div className="row">
              <div className="col-6">
                <label>Duration of smoking</label>
                <Input
                  type="text"
                  placeholder="Smoking Duration"
                  name="smoking_duration"
                  size="middle"
                  value={copd?.smoking_duration ?? tobacco_use?.average_smoking_years}
                  onChange={(e) => handlevalue(e)}
                />
              </div>

              <div className="col-6">
                <label>Amount of cigarettes in a day?</label>
                <Input
                  type="text"
                  placeholder="Cigarettes Amount"
                  name="cigarettes_amount"
                  size="middle"
                  value={copd?.cigarettes_amount ?? tobacco_use?.average_packs_per_day}
                  onChange={(e) => handlevalue(e)}
                />
              </div>
            </div>
          </div>
        )}


        {showSmokingQuitBody && (
          <div className="mb-3">
            <div className="row">
              <div className="col-12">
                <label>When did you quit?</label>
                <div className="row">
                  {showNeverSmokedBody && (
                    <div className="col-6">
                      <>
                        <Input
                          type="text"
                          placeholder="Smoking Quit Duration"
                          name="smoking_quit_duration"
                          size="middle"
                          value={copd?.smoking_quit_duration}
                          onChange={(e) => handlevalue(e)}
                        />
                      </>
                    </div>
                  )}

                  <div className="col-6">
                    <Checkbox
                      className="mr-2"
                      name="never_smoked"
                      value="1"
                      checked={copd?.never_smoked === "1"}
                      onChange={handleNeverCheckbox}
                    />
                    <label className="question-text"> Never Smoked </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-3">
          <div className="row">
            <div className="col-12">
              <label>When did you have your last Chest CT scan?</label>
              <div className="row">
                {showNeverCtScanBody && (
                  <div className="col-6">
                    <DatePickerComponent
                      fieldName={"last_ct_scan"}
                      value={copd?.last_ct_scan}
                      placeHolder={"Last Chest CT Scan"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                )}
                <div className="col-6">
                  <Checkbox
                    className="mr-2 mt-1"
                    name="never_ct_scan"
                    value="1"
                    checked={copd?.never_ct_scan === "1"}
                    onChange={handleNeverCheckbox}
                  />
                  <label className="question-text"> Never </label>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mb-5">
          <label>Are you currently on Supplemental O2 therapy?</label>
          <div>
            <Radio.Group
              name="supplimental_o2_therapy"
              value={copd?.supplimental_o2_therapy}
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



        <div className="mb-3">
          <table className="table">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="">I never Cough</label>
                </td>
                <td>
                  <Radio.Group
                    onChange={(e) => handleSymptomsScore(e)}
                    name={"Cough"}
                    value={copd?.Cough}
                  >
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                    <Radio value={5}>5</Radio>
                  </Radio.Group>
                </td>
                <td>
                  <label htmlFor="">I cough all the time</label>
                </td>
                <td>
                  <Input
                    type="text"
                    value={copd?.Cough}
                    className="dateHeight"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="">
                    I have no phlegum (mucus) in my chest at all
                  </label>
                </td>
                <td>
                  <Radio.Group
                    onChange={(e) => handleSymptomsScore(e)}
                    name={"phlegum_in_chest"}
                    value={copd?.phlegum_in_chest}
                  >
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                    <Radio value={5}>5</Radio>
                  </Radio.Group>
                </td>
                <td>
                  <label htmlFor="">
                    My chest is completely full of phlegum (mucus)
                  </label>
                </td>
                <td>
                  <Input
                    value={copd?.phlegum_in_chest}
                    type="text"
                    className="dateHeight"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="">My chest does not feel tight at all </label>
                </td>
                <td>
                  <Radio.Group
                    onChange={(e) => handleSymptomsScore(e)}
                    name={"tight_chest"}
                    value={copd?.tight_chest}
                  >
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                    <Radio value={5}>5</Radio>
                  </Radio.Group>
                </td>
                <td>
                  <label htmlFor="">My chest feels very tight</label>
                </td>
                <td>
                  <Input
                    value={copd?.tight_chest}
                    type="text"
                    className="dateHeight"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="">
                    When i walk upto a hill or one flight of stairs i am not
                    breathless
                  </label>{" "}
                </td>
                <td>
                  <Radio.Group
                    onChange={(e) => handleSymptomsScore(e)}
                    name={"breathless"}
                    value={copd?.breathless}
                  >
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                    <Radio value={5}>5</Radio>
                  </Radio.Group>
                </td>
                <td>
                  <label htmlFor="">
                    When i walk upto a hill or one flight of stairs i am very
                    breathless
                  </label>{" "}
                </td>
                <td>
                  <Input
                    value={copd?.breathless}
                    type="text"
                    className="dateHeight"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="">
                    I am not limited doing any activities at home
                  </label>{" "}
                </td>
                <td>
                  <Radio.Group
                    onChange={(e) => handleSymptomsScore(e)}
                    name={"limited_activities"}
                    value={copd?.limited_activities}
                  >
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                    <Radio value={5}>5</Radio>
                  </Radio.Group>
                </td>
                <td>
                  <label htmlFor="">
                    I am very limited doing activities at home
                  </label>{" "}
                </td>
                <td>
                  <Input
                    value={copd?.limited_activities}
                    type="text"
                    className="dateHeight"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="">
                    I am confident leaving my home despite my lung condition
                  </label>{" "}
                </td>
                <td>
                  <Radio.Group
                    onChange={(e) => handleSymptomsScore(e)}
                    name={"lung_condition"}
                    value={copd?.lung_condition}
                  >
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                    <Radio value={5}>5</Radio>
                  </Radio.Group>
                </td>
                <td>
                  <label htmlFor="">
                    I am not at all confident leaving my home because of my lung
                    condition
                  </label>{" "}
                </td>
                <td>
                  <Input
                    value={copd?.lung_condition}
                    type="text"
                    className="dateHeight"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="">I sleep soundly</label>
                </td>
                <td>
                  <Radio.Group
                    onChange={(e) => handleSymptomsScore(e)}
                    name={"sound_sleep"}
                    value={copd?.sound_sleep}
                  >
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                    <Radio value={5}>5</Radio>
                  </Radio.Group>
                </td>
                <td>
                  <label htmlFor="">
                    I don't sleep soundly because of my lung condition
                  </label>{" "}
                </td>
                <td>
                  <Input
                    value={copd?.sound_sleep}
                    type="text"
                    className="dateHeight"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="">I have lots of energy</label>
                </td>
                <td>
                  <Radio.Group
                    onChange={(e) => handleSymptomsScore(e)}
                    name={"energy_level"}
                    value={copd?.energy_level}
                  >
                    <Radio value={0}>0</Radio>
                    <Radio value={1}>1</Radio>
                    <Radio value={2}>2</Radio>
                    <Radio value={3}>3</Radio>
                    <Radio value={4}>4</Radio>
                    <Radio value={5}>5</Radio>
                  </Radio.Group>
                </td>
                <td>
                  <label htmlFor="">I have no energy at all</label>
                </td>
                <td>
                  <Input
                    value={copd?.energy_level}
                    type="text"
                    className="dateHeight"
                    readOnly
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td>
                  <label htmlFor="">Final Score</label>
                </td>
                <td>
                  <Input
                    value={copd?.total_assessment_score}
                    type="text"
                    name="total_assessment_score"
                    className="dateHeight"
                    onChange={(e) => {
                      handlevalue(e);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

            {/* Goal 1 */}
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b> Provide education on COPD.</b>
                </label>
              </div>
            </div>
            {/* Task  */}
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
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
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_on_disease_start_date"}
                  value={copd?.educate_on_disease_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_on_disease_end_date"}
                  value={copd?.educate_on_disease_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            {/* Goal 1 Ends */}

            {/* Goal 2 */}
            {showSmokingCessationBody && (
              <>
                <div className="row mb-2">
                  <div className="col-6">
                    <label htmlFor="">
                      <b> Smoking Cessation </b>
                    </label>
                  </div>
                </div>
                {/* Task */}
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <p className="question-text mt-2 pl-5">
                      <b>To educate patients on the importance of smoking cessation (if applicable) for better COPD management.</b>
                      <p>
                        The most common cause of COPD is smoking. Smoke can damage the lungs forever and cause COPD.
                        If you continue to smoke the damage to the lungs will continue and your COPD will continue to worsen.
                        Quitting smoking might not repair the damage already done but will significantly reduce the progression of COPD,
                        in addition, it will also lower the chances that you'll have a heart attack or stroke, and it will help you feel better and live longer.
                        Quitting smoking is the most important thing that you can do for your health.
                        This is true no matter how long you have smoked or how much you smoke. If you are having trouble quitting, your doctor can help as many options are available to assist you.
                      </p>
                    </p>
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"smoking_cessation_start_date"}
                      value={copd?.smoking_cessation_start_date}
                      placeHolder={"Start Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                  <div className="col-3">
                    <DatePickerComponent
                      fieldName={"smoking_cessation_end_date"}
                      value={copd?.smoking_cessation_end_date}
                      placeHolder={"End Date"}
                      dateFormat={dateFormat}
                      handleChange={(key: string, value: string) =>
                        dateChange(key, value)
                      }
                    />
                  </div>
                </div>
              </>
            )}
            {/* Goal 2 Ends */}

            {/* Goal 3  */}
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>Lowering Risk of Infection</b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>To educate the patient on lowering the risk of infections.</b>
                  <p>
                    Certain infections can be very hard on your lungs and can cause COPD symptoms to flare up. You can lower your risk by getting certain vaccines.
                    These include the flu shot every year, the pneumonia vaccine at least once, and the COVID-19 vaccine and boosters.
                  </p>
                  <p>
                    In addition, wash your hands often and stay away from people who are sick. Wearing a face mask in crowded places can also help lower your risk of infection.
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"lowering_infection_risk_start_date"}
                  value={copd?.lowering_infection_risk_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"lowering_infection_risk_end_date"}
                  value={copd?.lowering_infection_risk_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            {/* Goal 3 Ends */}

            {/* Goal 4 */}
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>Lifestyle changes that can help with COPD.</b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>To educate the patient on lifestyle changes.</b>
                  <p>
                    If things like fumes, pollution, or dust make your breathing worse, try to avoid these triggers. Eating a healthy diet can help improve your health.
                    You can also improve your health by following your pulmonary rehab plan if you have one or finding other ways to move your body.
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_on_lifestyle_start_date"}
                  value={copd?.educate_on_lifestyle_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_on_lifestyle_end_date"}
                  value={copd?.educate_on_lifestyle_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            {/* Goal 4 Ends */}

            {/* Goal 5 */}
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>Know when it is an emergency.</b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
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
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_on_emergency_start_date"}
                  value={copd?.educate_on_emergency_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"educate_on_emergency_end_date"}
                  value={copd?.educate_on_emergency_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            {/* Goal 5 Ends */}

            {/* Goal 6 */}
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>Know when you are having a COPD flare.</b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>To educate patients on COPD flare.</b>
                  <p>
                    A COPD flare is when symptoms suddenly get worse. Doctors sometimes call flares "exacerbations."
                    If you have a flare, you might need some new medicines until your symptoms improve.
                    Or you might need to take medicine in a different way than through an inhaler for a while. Please contact your PCP right away in case of a flare-up.
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"having_copd_flare_start_date"}
                  value={copd?.having_copd_flare_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"having_copd_flare_end_date"}
                  value={copd?.having_copd_flare_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            {/* Goal 6 Ends */}

            {/* Goal 7 */}
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>Prevention of COPD flare.</b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
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
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"prevention_copd_flare_start_date"}
                  value={copd?.prevention_copd_flare_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"prevention_copd_flare_end_date"}
                  value={copd?.prevention_copd_flare_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            {/* Goal 7 Ends */}

            {/* Goal 8 */}
            <div className="row mb-2">
              <div className="col-6">
                <label htmlFor="">
                  <b>Understand the importance of treatment adherence and regular follow-ups.</b>
                </label>
              </div>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>To educate the patient on the importance of treatment adherence and regular follow-ups with PCP and Pulmonologist.</b>
                  <p>
                    It is very important that you understand the risks COPD poses to your health and to get better outcomes we need to manage COPD as best as we can.
                    What you can do is regularly take your medications for COPD, quit smoking (if applicable), and schedule regular follow up with your Pulmonologist/PCP to be evaluated.
                  </p>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"followup_imp_start_date"}
                  value={copd?.followup_imp_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"followup_imp_end_date"}
                  value={copd?.followup_imp_end_date}
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
            {/* Goal 8 Ends */}
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
export default ChronicObstructivePulmonaryDisease;
