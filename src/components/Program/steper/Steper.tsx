import React from "react";
import "./steps.css";
export interface StepperType {
  id: number;
  label: string;
  show: boolean;
  color?: string;
}
interface Props {
  steps: StepperType[];
  activeStep: number;
  setActiveStep: (e: number) => void;
  disableAfterSeven?: any;
  disableFirstSeven?: any;
}
const Steper: React.FC<Props> = ({
  steps,
  activeStep,
  setActiveStep,
  disableAfterSeven,
  disableFirstSeven,
}) => {
  const activeSteps = steps.filter((step) => step.show);
  return (
    <div
      className="arrow-steps clearfix"
      id="aho"
      style={{ marginTop: "10px", marginBottom: "20px" }}
    >
      {activeSteps &&
        activeSteps.map((item, index) => (
          <div
            key={index}
            className={`step ${
              item.id === activeStep
                ? "current"
                : item.id < activeStep
                ? item.color //complete
                : item.color
            }`}
            onClick={() => setActiveStep(item.id)}
            style={{
              opacity:
                disableAfterSeven === true && index > 6
                  ? 0.4
                  : disableFirstSeven === true && index <= 5
                  ? 0.4
                  : 1,
              pointerEvents:
                disableAfterSeven === true && index > 6
                  ? "none"
                  : disableFirstSeven === true && index <= 5
                  ? "none"
                  : "initial",
            }}
          >
            <span>
              Step {++index}: {item.label}
            </span>
          </div>
        ))}
    </div>
  );
};
export default Steper;
