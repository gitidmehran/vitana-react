import React from "react";
import { Button, Radio, Space } from "antd";
import { OpenNotification } from "./../../../Utilties/Utilties";
import {
  HyperCholestrolemiaType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import DatePickerComponent from "../../../components/DatePickerComponent/DatePickerComponent";

const Hypercholesterolemia = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) => {
  const {
    question: { cholesterol_assessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [hyper, setHyper] =
    React.useState<HyperCholestrolemiaType>(cholesterol_assessment as HyperCholestrolemiaType);

  const options = ["Yes", "No"];
  const dateFormat = "MM/DD/YYYY";

  /* FLU VACCINE STATE CONST */
  const [showStatinAndLdlQuestion, setShowStatinAndLdlQuestion] =
    React.useState<boolean>(Boolean(hyper?.assesment_done === "No") ?? false);

  React.useEffect(() => {
    const assessmentDone = hyper?.assesment_done;

    if (assessmentDone === "Yes") {
      setHyper({
        ...hyper,
        statin_intensity: "",
        ldl_goal: "",
      });
    }
    setShowStatinAndLdlQuestion(Boolean(assessmentDone === "No"));
  }, [hyper?.assesment_done]);

  function valueChange(e: any) {
    const value = e.target.value;
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
      alert("some thing went wrong");
    }
  };
  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Hypercholesterolemia</h2>

        <div className="mb-5">
          {/* Assessment done in last 1 year */}
          <div className="mb-3">
            <div>
              <label className="question-text">
                Has Hypercholesterolemia assessment done in this calendar year
                or in last 1 year?
              </label>
            </div>
            <Radio.Group
              name="assesment_done"
              value={hyper?.assesment_done}
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

          {showStatinAndLdlQuestion && (
            <>
              {/* Statin Question */}
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    Is this Patient on Moderate to High Intensity statin?
                  </label>
                </div>
                <Radio.Group
                  name="statin_intensity"
                  value={hyper?.statin_intensity}
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

              {/* Patients LDL at GOAL */}
              <div className="mb-3">
                <div>
                  <label className="question-text">
                    Is this patient’s LDL at Goal?
                  </label>
                </div>
                <Radio.Group
                  name="ldl_goal"
                  value={hyper?.ldl_goal}
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
            </>
          )}
        </div>

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
              <b>Causes of hyperlipidemia</b> <br />
              Patient needs to be understood various causes of hyperlipidemia
              like Smoking. Drinking a lot of alcohol. Eating foods that have a
              lot of saturated fats or trans fats. Sitting too much instead of
              being active. Being stressed. Inheriting genes that make your
              cholesterol levels unhealthy. Being overweight.
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
              <b>Lab values done every year or two,</b> <br />
              It should be mandatory to do labs like levels of triglycerides,
              cholesterol levels, BMI every year or every two years according to
              the requirement of specific patient.
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
              <b>Monitor comorbid conditions,</b> <br />
              Are your conditions going worse, also try to monitor Comorbidities
              of high cholesterol include obesity, diabetes, hypertension, and
              heart disease. It can also coexist with arthritis, sleep apnea,
              and atrial fibrillation. In many cases, managing high cholesterol
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
              <b>To understand the effect of Lipids on Cardiovascular System</b>
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
              <b>To understand etiology.</b>
              <br />
              If you have an excess amount of LDL/HDL(LIPIDS) in your
              bloodstream, waxy plaques can build up along your artery walls,
              causing arteries to narrow. Over time, arteries may become damaged
              with these plaques and susceptible to blood clots. This is called
              cardiovascular disease.A blood clot in the heart can cause a heart
              attack.
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
              <b>Calculate ASCVD score.</b> <br />
              The ASCVD (atherosclerotic cardiovascular disease) risk score is a
              national guideline developed by the American College of
              Cardiology. It is a calculation of your 10-year risk of having a
              cardiovascular problem, such as a heart attack or stroke. This
              risk estimate considers age, sex, race, cholesterol levels, blood
              pressure, medication use, diabetic status, and smoking status.
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
              <b>Are you taking healthy diet {""}</b>
              <br />
              Dietary factors that influence lipid levels include modification
              of nutritional components, consumption of specific foods, use of
              food additives and supplements, and major dietary approaches. The
              most beneficial changes result from reducing intake of saturated
              and trans fats; increasing intake of polyunsaturated and
              monounsaturated fats; fortifying foods with plant.
              low-carbohydrate, or low-fat diet also has beneficial effects
              result from reducing intake of dietary cholesterol, increasing
              intake of soluble fiber and soy protein, and eating fatty marine
              fish or taking marine-derived omega-3 fatty acid supplements.
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
              <b>Visiting to nutritionist for proper diet plan {""}</b>
              <br />
              Your nutritionist will guide you toward healthy food choices while
              helping you enjoy the foods you are eating. Nutritionists can also
              teach you about healthy food habits and behaviors that encourage
              weight loss. Healthy habits may include eating at the dining
              table, weighing your food or avoiding late night snacks. The goal
              of this education is to help you develop healthy habits for the
              rest of your life.
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

        {/* <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <label>
              <b>To understand the effect of Exercise on Lipids</b>
            </label>
          </div>
          <div className="col-lg-3 md-3 sm-6">
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
          </div>
        </div> */}

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
export default Hypercholesterolemia;
