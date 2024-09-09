import React, { useEffect } from "react";
import { Button, Radio, Space, Input } from "antd";
import {
  DepressionType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";
import DatePickerComponent from "../../../components/DatePickerComponent/DatePickerComponent";

const { TextArea } = Input;

function Depression({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { depression_phq9 },
    programmId,
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [depressionPhq, setDepressionPhq] =
    React.useState<DepressionType>(depression_phq9 as DepressionType);

  const defaultOptions = ["Yes", "No"];

  const AlmostOption = {
    "Almost all of the time": 3,
    "Most of the time": 2,
    "Some of the time": 1,
    "Almost never": 0,
  };

  const dateFormat = "MM/DD/YYYY";

  function valueChange(e: any) {
    const { value } = e.target;
    setDepressionPhq({
      ...depressionPhq,
      [e.target.name]: value,
    });
  }

  function dateChange(name: string, value: string) {
    setDepressionPhq({
      ...depressionPhq,
      [name]: value,
    });
  }

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const depressionPHQ9 = { ...depressionPhq };
    Object.assign(depressionPHQ9, completed);

    const response = await saveQuestionairsData(
      "depression_phq9",
      depressionPHQ9
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const depressionPHQ9 = { ...depressionPhq };
    Object.assign(depressionPHQ9, completed);
    const response = await saveQuestionairsData(
      "depression_phq9",
      depressionPHQ9
    );
    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification('error', response.errors)
    }
  };

  let sum = 0;
  if (depressionPhq && Object.keys(depressionPhq).length > 0) {
    const AllValues = Object.values(depressionPhq);

    const onlyNumbers = AllValues.filter(
      (element) => typeof element === "number"
    );

    sum = onlyNumbers.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
  }

  const [showAdditionalQuestion, setShowAdditionalQuestion] =
    React.useState<boolean>(Boolean(sum > 9) ?? false);

  useEffect(() => {
    if (sum <= 9) {
      setDepressionPhq({
        ...depressionPhq,
        referred_to_mh_professional: "",
        enroll_in_bhi: "",
      });
    }
    setShowAdditionalQuestion(Boolean(sum > 9));
  }, [sum]);

  return (
    <>
      <div className="question-card">
        <div className="mb-2">
          <h2 className="stepsheading d-inline">Depression PHQ-9</h2>
          <h5 className="d-inline pl-2" style={{ fontSize: 18 }}>
            <b>Score: {sum}/27</b>
          </h5>
        </div>

        {/* Label */}
        <div className="mb-3">
          <b>
            <label className="question-text"> In the past two weeks </label>
          </b>
        </div>

        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <div className="mb-3">
              <div>
                <label className="question-text">
                  How often have you felt down, depressed, or hopeless?
                </label>
              </div>
              <div>
                <Radio.Group
                  name="feltdown_depressed_hopeless"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.feltdown_depressed_hopeless}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="mb-3">
              <div>
                <label className="question-text">
                  How often have you felt little interest or pleasure in doing
                  things?
                </label>
              </div>
              <div>
                <Radio.Group
                  name="little_interest_pleasure"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.little_interest_pleasure}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="mb-3">
              <div>
                <label className="question-text">
                  How often have you trouble falling or staying asleep, or
                  sleeping too much?
                </label>
              </div>

              <div>
                <Radio.Group
                  name="trouble_sleep"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.trouble_sleep}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="mb-3">
              <div>
                <label className="question-text">
                  Feeling tired or having little energy?
                </label>
              </div>
              <div>
                <Radio.Group
                  name="tired_little_energy"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.tired_little_energy}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="mb-6">
              <div>
                <label className="question-text">
                  Poor appetite or overeating?
                </label>
              </div>

              <div>
                <Radio.Group
                  name="poor_over_appetite"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.poor_over_appetite}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>

          <div className="col-lg-6 md-6 sm-12">
            <div className="mb-3">
              <div>
                <label className="question-text">
                  How often have you felt bad about yourself that you are a
                  failure or have let yourself or your family down?
                </label>
              </div>
              <div>
                <Radio.Group
                  name="feeling_bad_failure"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.feeling_bad_failure}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="mb-3">
              <div>
                <label className="question-text">
                  Trouble concentrating on things, such as reading the newspaper
                  or watching television?
                </label>
              </div>
              <div>
                <Radio.Group
                  name="trouble_concentrating"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.trouble_concentrating}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="mb-3">
              <div>
                <label className="question-text">
                  How often have you moved or spoken so slowly that other people
                  could have noticed, or How often have you been so fidgety or
                  restless that you have been moving around a lot more than usual?
                </label>
              </div>

              <div>
                <Radio.Group
                  name="slow_fidgety"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.slow_fidgety}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="mb-3">
              <div>
                <label className="question-text">
                  How often have you thought you would be better off dead, or
                  hurting yourself somehow?
                </label>
              </div>
              <div>
                <Radio.Group
                  name="suicidal_thoughts"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.suicidal_thoughts}
                >
                  <Space direction="vertical">
                    {Object.entries(AlmostOption).map(([key, value]) => (
                      <Radio value={value} key={key}>
                        {key}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </div>
            </div>

            <div className="mb-3">
              <div>
                <label className="question-text">
                  How often have you checked off problems that made it difficult
                  for you to do your work, take care of things at home, or get
                  along with other people?
                </label>
              </div>
              <div>
                <Radio.Group
                  name="problem_difficulty"
                  onChange={(e) => valueChange(e)}
                  value={depressionPhq?.problem_difficulty}
                >
                  <Space direction="vertical">
                    <Radio value="Extremely difficult">Extremely difficult</Radio>
                    <Radio value="Very difficult">Very difficult</Radio>
                    <Radio value="Somewhat difficult">Somewhat difficult</Radio>
                    <Radio value="Not difficult at all">
                      Not difficult at all
                    </Radio>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Show Additional Question */}
        {showAdditionalQuestion && (
          <div className="row mb-2">
            <div className="col-lg-6 md-6 sm-12">
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    Would you like to get referred to a Mental health
                    professional?
                  </label>
                </div>
                <div>
                  <Radio.Group
                    name="referred_to_mh_professional"
                    onChange={(e) => valueChange(e)}
                    value={depressionPhq?.referred_to_mh_professional}
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

            <div className="col-lg-6 md-6 sm-12">
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    Would you like to get enrolled in BHI program ?
                  </label>
                </div>
                <div>
                  <Radio.Group
                    name="enroll_in_bhi"
                    onChange={(e) => valueChange(e)}
                    value={depressionPhq?.enroll_in_bhi}
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

        <div className="row mb-5">
          <div className="col-lg-6 md-6 sm-12">
            <label className="question-text">Comments</label>
            <TextArea
              name="comments"
              value={depressionPhq?.comments}
              onChange={(e) => valueChange(e)}
              placeholder="Comments"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </div>
        </div>

        {/* Treatment GOALS */}
        {programmId === String(2) ? (
          <>
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

              {/* GOAL 1 */}
              <div>
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <label className=" mt-2">
                      <b>
                        To acquire knowledge about depression and how it can affect you.
                      </b>
                    </label>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  {/* TASK1 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>Assess the patient’s current knowledge and understanding regarding disease</b>
                        <p>
                          Depression (major depressive disorder) is a common and serious medical illness that negatively affects how you feel, the way you think and how you act.
                          Fortunately, it is also treatable. Depression causes feelings of sadness and/or a loss of interest in activities you once enjoyed.
                          It can lead to a variety of emotional and physical problems and can decrease your ability to function at work and at home.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"understand_about_disease_start_date"}
                        value={depressionPhq?.understand_about_disease_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"understand_about_disease_end_date"}
                        value={depressionPhq?.understand_about_disease_end_date}
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
                        <b>Monitor PHQ-9 levels of patients</b>
                        <p>
                          The PHQ-9 can function as a screening tool, an aid in diagnosis,
                          and as a symptom tracking tool that can help track a patient's overall depression severity as well as track the improvement of specific symptoms with treatment.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"monitor_phq9_start_date"}
                        value={depressionPhq?.monitor_phq9_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"monitor_phq9_end_date"}
                        value={depressionPhq?.monitor_phq9_end_date}
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
                        <b>ADVANTAGES OF THE PHQ-9</b>
                        <p>
                          Shorter than other depression rating scales. Can be administered in person by a clinician, by telephone, or self-administered by the patient.
                          Facilitates diagnosis of major depression. Provides assessment of symptom severity. Is well validated and documented in a variety of populations.
                          Can be used in adolescents as young as 12 years of age.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"advantages_of_phq9_start_date"}
                        value={depressionPhq?.advantages_of_phq9_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"advantages_of_phq9_end_date"}
                        value={depressionPhq?.advantages_of_phq9_end_date}
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

              {/* GOAL 2 */}
              <div>
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <label className=" mt-2">
                      <b>
                        To understand the effect of depression on overall health.
                      </b>
                    </label>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  {/* TASK1 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>Understanding depression relationship with other medical problems</b>
                        <p>
                          Depression can co-occur with other medical problems, such as diabetes, heart disease, cancer, and many others.
                          The relationship between depression and medical comorbidities is complicated. Depression can worsen in the face of medical problems and,
                          at the same time, cause the medical conditions themselves to worsen.
                          In part that's because depression makes it hard for people to take care of their medical conditions.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"effect_with_other_problems_start_date"}
                        value={depressionPhq?.effect_with_other_problems_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"effect_with_other_problems_end_date"}
                        value={depressionPhq?.effect_with_other_problems_end_date}
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

              {/* GOAL 3 */}
              <div>
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <label className=" mt-2">
                      <b>
                        To understand the importance of different approaches that are used to treat depression.
                      </b>
                    </label>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  {/* TASK 1 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>Understanding Counseling (with a psychiatrist, psychologist, nurse, or social worker) & medicines that relieve depression</b>
                        <p>
                          People with depression that is not too severe can get better by taking medicines or talking with a counselor.
                          People with severe depression usually need medicines to get better, and might also need to see a counselor.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"relieve_depression_start_date"}
                        value={depressionPhq?.relieve_depression_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"relieve_depression_end_date"}
                        value={depressionPhq?.relieve_depression_end_date}
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
                        <b>Understanding CBT</b>
                        <p>
                          CBT (Cognitive Behavioral therapy) teaches you to become aware of and adjust negative patterns,
                          which can help you reframe your thinking during moments of heightened anxiety or panic.
                          It can also provide new coping skills, like meditation or journaling, for those struggling with a substance use disorder or depression.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"understand_cbt_start_date"}
                        value={depressionPhq?.understand_cbt_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"understand_cbt_end_date"}
                        value={depressionPhq?.understand_cbt_end_date}
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
                        <b>Importance of Physical activity</b>
                        <p>
                          In addition to treatment, getting regular physical activity can also help you feel better.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"physical_activity_importance_start_date"}
                        value={depressionPhq?.physical_activity_importance_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"physical_activity_importance_end_date"}
                        value={depressionPhq?.physical_activity_importance_end_date}
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
                        <b>Understanding treatments that pass magnetic waves or electricity into the brain</b>
                        <p>
                          Another treatment involves placing a device against the scalp to pass magnetic waves into the brain.
                          This is called "transcranial magnetic stimulation" ("TMS"). Doctors might suggest TMS if medicines and counseling have not helped.
                        </p>
                        <p>
                          Some people with severe depression might need a treatment called "electroconvulsive therapy" ("ECT").
                          During ECT, doctors pass an electric current through a person's brain in a safe way.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"waves_treatment_start_date"}
                        value={depressionPhq?.waves_treatment_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"waves_treatment_end_date"}
                        value={depressionPhq?.waves_treatment_end_date}
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

              {/* GOAL 4 */}
              <div>
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <label className=" mt-2">
                      <b>
                        To understand the importance of changes to your habits and lifestyle to treat depression.
                      </b>
                    </label>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  {/* TASK 1 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>Exercise a specific number of days per week</b>
                        <p>
                          To set a goal to walk around your neighborhood for 30 minutes a day every weekday or go to the gym three times a week.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"exercise_start_date"}
                        value={depressionPhq?.exercise_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"exercise_end_date"}
                        value={depressionPhq?.exercise_end_date}
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

              {/* GOAL 5 */}
              <div>
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <label className=" mt-2">
                      <b>
                        To understand the importance of regular follow-ups
                      </b>
                    </label>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  {/* TASK 1 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <p>
                          It is very important to regularly follow up with your PCP or Psychiatrist to be evaluated for your depression.
                          It is also very important to understand if for any reason you feel your depression is worsening or medications
                          have stopped working you should let your PCP know and walk in to have your treatment adjusted.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"regular_follow_ups_start_date"}
                        value={depressionPhq?.regular_follow_ups_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"regular_follow_ups_end_date"}
                        value={depressionPhq?.regular_follow_ups_end_date}
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

              {/* GOAL 6 */}
              <div>
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <label className=" mt-2">
                      <b>
                        To understand what to do if you are having thoughts of harming yourself.
                      </b>
                    </label>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  {/* TASK 1 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <p>
                          If you ever feel like you might hurt yourself or someone else, help is available:
                          <ul>
                            <li>In the US, contact the 988 Suicide & Crisis Lifeline:</li>
                            <ul>
                              <li>To speak to someone, call or text 988.</li>
                              <li>Call your doctor or nurse, and tell them it is urgent.</li>
                              <li>Call for an ambulance (in the US and Canada, call 9-1-1).</li>
                              <li>Go to the emergency department at the nearest hospital.</li>
                            </ul>
                          </ul>
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"helping_guides_start_date"}
                        value={depressionPhq?.helping_guides_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"helping_guides_end_date"}
                        value={depressionPhq?.helping_guides_end_date}
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

              {/* GOAL 7 */}
              <div>
                <div className="row mb-2">
                  <div className="col-lg-6 md-6 sm-12">
                    <label className=" mt-2">
                      <b>
                        To utilize counseling/group support
                      </b>
                    </label>
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  {/* TASK 1 */}
                  <div className="row mb-2">
                    <div className="col-lg-6 md-6 sm-12">
                      <p className="question-text mt-2 pl-5">
                        <b>To improve your relationships with other people can help to lower your risk of being affected by depression.</b>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"improve_relations_start_date"}
                        value={depressionPhq?.improve_relations_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"improve_relations_end_date"}
                        value={depressionPhq?.improve_relations_end_date}
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
                        <b>To take part in therapy on a regular basis not only lets you receive the mental health benefits of psychotherapy,
                          but it can also help create a routine in your life.</b>
                        <p>
                          Simple but effective short-term goal for treating depression could be to make a note of at least one positive event that happens every day for a certain period of time, such as a whole month.
                        </p>
                      </p>
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"psychotherapy_start_date"}
                        value={depressionPhq?.psychotherapy_start_date}
                        placeHolder={"Start Date"}
                        dateFormat={dateFormat}
                        handleChange={(key: string, value: string) =>
                          dateChange(key, value)
                        }
                      />
                    </div>
                    <div className="col-lg-3 md-3 sm-6">
                      <DatePickerComponent
                        fieldName={"psychotherapy_end_date"}
                        value={depressionPhq?.psychotherapy_end_date}
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
            </div>
          </>
        ) : null}

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
export default Depression;
