import React from "react";
import { Button, Radio, Space } from "antd";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";
import {
  CongestiveHeartFailureType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import DatePickerComponent from "../../DatePickerComponent/DatePickerComponent";

const CongestiveHeartFailure = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) => {
  const {
    question: { cong_heart_failure },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [congestiveheartfaliure, setCongestiveHeartFaliure] =
    React.useState<CongestiveHeartFailureType>(cong_heart_failure);

  const defaultOptions = ["Yes", "No"];

  const dateFormat = "MM/DD/YYYY";

  const [showFollowUpFrequency, setShowFollowUpFrequency] =
    React.useState<boolean>(
      Boolean(congestiveheartfaliure?.follow_up_cardio === "Yes") ?? false
    );
  const [showNotSeeingCardiologist, setShowNotSeeingCardiologist] =
    React.useState<boolean>(
      Boolean(congestiveheartfaliure?.follow_up_cardio === "No") ?? false
    );
  const [showEchoDiagramAdviseBody, setShowEchoDiagramAdviseBody] =
    React.useState<boolean>(
      Boolean(congestiveheartfaliure?.echocardiogram === "No") ?? false
    );

  /* SHOW CARDIOLOGIST QUESTIONS BODY */
  React.useEffect(() => {
    const followUpCardiologist = congestiveheartfaliure?.follow_up_cardio;
    if (followUpCardiologist === "Yes") {
      setCongestiveHeartFaliure({
        ...congestiveheartfaliure,
        not_following_cardio: "",
      });
    } else {
      setCongestiveHeartFaliure({
        ...congestiveheartfaliure,
        freq_recom_cardio: "",
      });
    }

    setShowFollowUpFrequency(Boolean(followUpCardiologist === "Yes"));
    setShowNotSeeingCardiologist(Boolean(followUpCardiologist === "No"));
  }, [congestiveheartfaliure?.follow_up_cardio]);

  /* SHOW ECHODIAGRAM ADSVISE BODY */
  React.useEffect(() => {
    const haveEchoDiagram = congestiveheartfaliure?.echocardiogram;
    if (haveEchoDiagram === "Yes") {
      setCongestiveHeartFaliure({
        ...congestiveheartfaliure,
        no_echocardiogram: "",
      });
    }
    setShowEchoDiagramAdviseBody(Boolean(haveEchoDiagram === "No"));
  }, [congestiveheartfaliure?.echocardiogram]);

  /* Handle values for the questions */
  function valueChange(e: any) {
    const value = e.target.value;
    setCongestiveHeartFaliure({
      ...congestiveheartfaliure,
      [e.target.name]: value,
    });
  }

  /* Handle Dates Fields for Treatment Goals */
  function dateChange(key: string, value: any) {
    setCongestiveHeartFaliure({
      ...congestiveheartfaliure,
      [key]: value,
    });
  }

  /* Assessment not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const chfAssessment = { ...congestiveheartfaliure };
    Object.assign(chfAssessment, completed);
    const response = await saveQuestionairsData(
      "cong_heart_failure",
      chfAssessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Assessment cmompleted */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const chfAssessment = { ...congestiveheartfaliure };
    Object.assign(chfAssessment, completed);

    const response = await saveQuestionairsData(
      "cong_heart_failure",
      chfAssessment
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      alert("some thing went wrong");
    }
  };

  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Congestive Heart Failure</h2>

        {/* QUESTIONS */}
        <div className="mb-5">
          <div className="mb-3">
            <label>Do you follow up with a Cardiologist for your CHF?</label>
            <br />
            <Radio.Group
              name="follow_up_cardio"
              value={congestiveheartfaliure?.follow_up_cardio}
              onChange={(e) => valueChange(e)}
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

          <div className="mb-3">
            {/* FREQUENCY TO FOLLOWUP CARDIOLOGIST */}
            {showFollowUpFrequency && (
              <div>
                <div>
                  <label>
                    How frequently were you recommended to follow up with
                    cardiology?
                  </label>
                </div>
                <Radio.Group
                  name="freq_recom_cardio"
                  value={congestiveheartfaliure?.freq_recom_cardio}
                  onChange={(e) => valueChange(e)}
                >
                  <Space direction="horizontal">
                    <Radio value="following_up">
                      Patient is following up as recommended by cardiologist
                    </Radio>
                    <Radio value="not_following_up">
                      Patient is not following up per recommendation, advised to
                      set up and appointment with cardiologist
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            )}

            {/* REASON FOR NOT SEEING CARDIOLOGIST */}
            {showNotSeeingCardiologist && (
              <div>
                <label>Why are you not seeing a Cardiologist?</label> <br />
                <Radio.Group
                  name="not_following_cardio"
                  value={congestiveheartfaliure?.not_following_cardio}
                  onChange={(e) => valueChange(e)}
                >
                  <Space direction="horizontal">
                    <Radio value="chf_is_controlled">
                      CHF is controlled and cardiology wants patient to follow
                      up as needed
                    </Radio>
                    <Radio value="patient_does_not_have_cardiologist">
                      Patient does not have a cardiologist as of now, will set
                      up with cardiology
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            )}
          </div>

          <div className="mb-3">
            <div>
              <label>
                Did you have an echocardiogram within the last 1-2 years?
              </label>
            </div>
            <Radio.Group
              name="echocardiogram"
              value={congestiveheartfaliure?.echocardiogram}
              onChange={(e) => valueChange(e)}
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

          {/* ADVISE ON IMPORTANCE OF ECHODIAGRAM BODY */}
          {showEchoDiagramAdviseBody && (
            <div className="mb-3">
              <Radio.Group
                name="no_echocardiogram"
                value={congestiveheartfaliure?.no_echocardiogram}
                onChange={(e) => valueChange(e)}
              >
                <Space direction="horizontal">
                  <Radio value="patient_adviced">
                    Patient advised on importance of echocardiograms done every
                    1-2 years to evaluate heart function in patients with CHF.
                    Patient agrees to get echocardiogram done.
                  </Radio>
                  <Radio value="patient_refused">
                    Patient refused to get echocardiogram at this time. Patient
                    advised in detail on the possible complications of not
                    following up regularly to evaluate heart function.
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          )}
        </div>

        {/* TREATMENT GOALS */}
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
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <label>
                <b>
                  To acquire knowledge about congestive heart failure and how it
                  can affect you
                </b>
              </label>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>
                  Assess the patient's current knowledge and understanding
                  regarding disease
                </b>
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"understanding_regarding_disease_start_date"}
                value={
                  congestiveheartfaliure?.understanding_regarding_disease_start_date
                }
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"understanding_regarding_disease_end_date"}
                value={
                  congestiveheartfaliure?.understanding_regarding_disease_end_date
                }
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
                <b>Monitor blood pressure levels of patients</b>
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"monitor_blood_pressure_start_date"}
                value={
                  congestiveheartfaliure?.monitor_blood_pressure_start_date
                }
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"monitor_blood_pressure_end_date"}
                value={congestiveheartfaliure?.monitor_blood_pressure_end_date}
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
                <b>Monitor ECG levels of patients</b>
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"monitor_ECG_levels_start_date"}
                value={congestiveheartfaliure?.monitor_ECG_levels_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"monitor_ECG_levels_end_date"}
                value={congestiveheartfaliure?.monitor_ECG_levels_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-6">
              <label>
                <b>
                  To closely monitor the signs and symptoms to mitigate the
                  chances or relapse.
                </b>
              </label>
            </div>
            <div className="row mb-2">
              <div className="col-lg-6 md-6 sm-12">
                <p className="question-text mt-2 pl-5">
                  <b>
                    Patient will demonstrate adequate cardiac output as
                    evidenced by vital signs within acceptable limits,
                    dysrhythmias absent/controlled, and no symptoms of failure
                    (e.g., hemodynamic parameters within acceptable limits,
                    urinary output adequate)
                  </b>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"adequate_cardiac_start_date"}
                  value={congestiveheartfaliure?.adequate_cardiac_start_date}
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"adequate_cardiac_end_date"}
                  value={congestiveheartfaliure?.adequate_cardiac_end_date}
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
                    MONITOR Symptoms like Cerebral hypoperfusion occurs because
                    of hypoxia to the brain from the decreased cardiac output.
                    The patient may report this as confusion, forgetfulness,
                    restlessness. Through assessment is necessary to evaluate
                    for possible related conditions, including psychologic
                    disorders. Depression is common among patients with heart
                    failure and can lead to poor adherence to treatment plans.
                  </b>
                </p>
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"cerebral_hypoperfusion_start_date"}
                  value={
                    congestiveheartfaliure?.cerebral_hypoperfusion_start_date
                  }
                  placeHolder={"Start Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
              <div className="col-3">
                <DatePickerComponent
                  fieldName={"cerebral_hypoperfusion_end_date"}
                  value={
                    congestiveheartfaliure?.cerebral_hypoperfusion_end_date
                  }
                  placeHolder={"End Date"}
                  dateFormat={dateFormat}
                  handleChange={(key: string, value: string) =>
                    dateChange(key, value)
                  }
                />
              </div>
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label>
                <b>To assess the signs of respiratory distress</b>
              </label>{" "}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>
                  Give awareness to patient regarding pulmonary hygiene as
                  needed
                </b>
                <br />
                Pulmonary hygiene, refers to exercises and procedures that help
                to clear your airways of mucus and other secretions. This
                ensures that your lungs get enough oxygen, and your respiratory
                system works efficiently. There are several pulmonary hygiene
                methods and approaches. Some can be done on your own at home,
                while others require a visit to your healthcare provider like
                breathing exercise, relaxed breathing, Huffing=This exercise
                requires you to “huff” by breathing hard out of your mouth, as
                though you were creating fog on a mirror. Spirometry, This
                method of strengthening and controlling your breathing uses a
                device called an incentive spirometer.
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"pulmonary_hygiene_start_date"}
                value={congestiveheartfaliure?.pulmonary_hygiene_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"pulmonary_hygiene_end_date"}
                value={congestiveheartfaliure?.pulmonary_hygiene_end_date}
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
                  Keep the head of the bed elevated in case of respiratory
                  distress
                </b>
                <br />
                Head-end elevation is known to improve oxygenation and
                respiratory mechanics. In poor lung compliance limits positive
                pressure ventilation causing delivery of inadequate minute
                ventilation (MVe). We observed that, in moderate-to-severe
                cases, the respiratory system compliance reduces upon elevating
                the head-end of the bed, and vice-versa, which can be utilized
                to improve ventilation and avoid respiratory distress.
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"respiratory_distress_start_date"}
                value={congestiveheartfaliure?.respiratory_distress_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"respiratory_distress_end_date"}
                value={congestiveheartfaliure?.respiratory_distress_end_date}
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
                <b>Monitor ABG levels of patients</b>
                <br />
                Your lungs and your kidneys do much of the work to keep your
                acid-base balance normal. So, the acid-base measurement from an
                ABG test can help diagnose and monitor conditions that affect
                your lungs and kidneys as well as many other conditions that may
                upset your acid-base balance.
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"monitor_ABG_levels_start_date"}
                value={congestiveheartfaliure?.monitor_ABG_levels_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"monitor_ABG_levels_end_date"}
                value={congestiveheartfaliure?.monitor_ABG_levels_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label>
                <b>
                  To understand the importance of Monitoring signs of altered
                  cardiac output, including
                </b>
              </label>{" "}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                <b>Monitoring of Pulmonary edemas</b>
                <br />
                Pulmonary edema is a condition caused by too much fluid in the
                lungs. This fluid collects in the many air sacs in the lungs,
                making it difficult to breathe. It needs to be monitor by
                feeling any difficulty in respiration.
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"pulmonary_edemas_start_date"}
                value={congestiveheartfaliure?.pulmonary_edemas_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"pulmonary_edemas_end_date"}
                value={congestiveheartfaliure?.pulmonary_edemas_end_date}
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
                  Assess conditions of Arrhythmias, including extreme
                  tachycardia and bradycardia
                </b>
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"conditions_of_Arrhythmias_start_date"}
                value={
                  congestiveheartfaliure?.conditions_of_Arrhythmias_start_date
                }
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"conditions_of_Arrhythmias_end_date"}
                value={
                  congestiveheartfaliure?.conditions_of_Arrhythmias_end_date
                }
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
                  Check ECG and heart sound changes in every cardiologist visit.
                </b>
                <br />
                The electrocardiogram (ECG) at rest is a non-invasive
                investigation that is recommended in the initial evaluation of
                patients with heart failure (HF). This is because the ECG is
                crucial in the detection of many abnormalities that may either
                cause or worsen HF. Therefore it is important to evaluate any
                changes in your heart sound by ECG (ELECTRO CARDIO GRAM).
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"cardiologist_visit_start_date"}
                value={congestiveheartfaliure?.cardiologist_visit_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"cardiologist_visit_end_date"}
                value={congestiveheartfaliure?.cardiologist_visit_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label>
                <b>
                  Demonstrate stabilized fluid volume with balanced intake and
                  output, breath sounds clear/clearing, vital signs within
                  acceptable range, stable weight, and absence of edema.
                </b>
              </label>{" "}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                Evaluate fluid status by Monitor daily weights Assess for edema
                and severe diaphoresis Monitor electrolyte values and hematocrit
                level Verbalize understanding of individual dietary/fluid
                restrictions.
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"fluid_status_start_date"}
                value={congestiveheartfaliure?.fluid_status_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"fluid_status_end_date"}
                value={congestiveheartfaliure?.fluid_status_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>

          <div className="row mb-2">
            <div className="col-6">
              <label>
                <b>
                  Identify relationship of ongoing therapies (treatment program)
                  to reduction of recurrent episodes and prevention of
                  complications.
                </b>
              </label>{" "}
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <p className="question-text mt-2 pl-5">
                Antiarrhythmias to increase cardiac performance Diuretics, to
                reduce venous and systemic congestion Iron and folic acid
                supplements to improve nutritional status Angiotensin-converting
                enzyme (ACE) inhibitors.These drugs relax blood vessels to lower
                blood pressure, improve blood flow and decrease the strain on
                the heart. Beta blockers.These drugs slow your heart rate and
                reduce blood pressure. Beta blockers may reduce signs and
                symptoms of heart failure, improve heart function. Digoxin
                (Lanoxin).This drug, also called digitalis, increases the
                strength of your heart muscle contractions
              </p>
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"antiarrhythmias_start_date"}
                value={congestiveheartfaliure?.antiarrhythmias_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"antiarrhythmias_end_date"}
                value={congestiveheartfaliure?.antiarrhythmias_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label>
                <b>
                  To understand the importance of regular follow-up with PCP and
                  cardiologist.
                </b>
              </label>{" "}
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"followup_pcp_start_date"}
                value={congestiveheartfaliure?.followup_pcp_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"followup_pcp_end_date"}
                value={congestiveheartfaliure?.followup_pcp_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
          </div>
          <div className="row mb-2">
            <div className="col-6">
              <label>
                <b>
                  To recognize the importance of discipline in taking all
                  medications as prescribed.
                </b>
              </label>{" "}
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"importance_medication_start_date"}
                value={congestiveheartfaliure?.importance_medication_start_date}
                placeHolder={"Start Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
            </div>
            <div className="col-3">
              <DatePickerComponent
                fieldName={"importance_medication_end_date"}
                value={congestiveheartfaliure?.importance_medication_end_date}
                placeHolder={"End Date"}
                dateFormat={dateFormat}
                handleChange={(key: string, value: string) =>
                  dateChange(key, value)
                }
              />
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
export default CongestiveHeartFailure;
