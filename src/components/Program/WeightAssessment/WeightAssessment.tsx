import React from "react";
import { Button, Radio, Space } from "antd";
import {
  WeightAssessmentType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

function WeightAssessment({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { weight_assessment: storeWeightAssessment },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [weightAssessment, setWeightAssessment] =
    React.useState<WeightAssessmentType>(storeWeightAssessment as WeightAssessmentType);

  function valueChange(e: any) {
    const { value } = e.target;
    setWeightAssessment({
      ...weightAssessment,
      [e.target.name]: value,
    });
  }

  const options = ["Yes", "No"];

  /* CONST TO SHOW THE INHIBITORS BODY */
  const [showNutritionsitBody, setShowNutritionsitBody] =
    React.useState<boolean>(
      Boolean(weightAssessment?.bmi_value > "30") ?? false
    );

  React.useEffect(() => {
    const bmiValue = weightAssessment?.bmi_value;

    setShowNutritionsitBody(Boolean(bmiValue > "30"));
  }, [weightAssessment?.bmi_value]);

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const weightScreening = { ...weightAssessment };
    Object.assign(weightScreening, completed);

    const response = await saveQuestionairsData(
      "weight_assessment",
      weightScreening
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
    const weightScreening = { ...weightAssessment };
    Object.assign(weightScreening, completed);

    const response = await saveQuestionairsData(
      "weight_assessment",
      weightScreening
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification('error', response.errors)
    }
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Weight Assessment</h2>
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">BMI ?</label>
          <input
            onChange={valueChange}
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            name="bmi_value"
            placeholder="BMI"
            value={weightAssessment?.bmi_value}
          />
        </div>
        {showNutritionsitBody && (
          <div className="col-lg-6 md-6 sm-12">
            <div id="" className={"d-block"} style={{ marginBottom: "10px" }}>
              <div>
                <label className="question-text">
                  Would you like to follow up with the Nutritionist ?
                </label>
              </div>

              <Radio.Group
                name="followup_withnutritionist"
                value={weightAssessment?.followup_withnutritionist}
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
          </div>
        )}
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
export default WeightAssessment;
