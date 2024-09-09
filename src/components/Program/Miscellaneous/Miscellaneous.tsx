import React, { useState } from "react";
import { Button, Radio, Space, Tooltip } from "antd";
import {
  MiscellaneousType,
  QuestionaireStepProps,
} from "../../../Types/QuestionaireTypes";
import { RootState } from "@/store/store";
import { useAppSelector } from "../../../hooks/hooks";
import { OpenNotification } from "./../../../Utilties/Utilties";

function Miscellaneous({
  handleNextStep,
  handlePreviousStep,
  saveQuestionairsData,
}: QuestionaireStepProps) {
  const {
    question: { misc: storeMiscellaneous },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);

  const [miscellaneous, setMiscellaneous] =
    React.useState<MiscellaneousType>(storeMiscellaneous as MiscellaneousType);
  const [suppliers, setSuppliers] = useState<any[]>(
    storeMiscellaneous
      ? storeMiscellaneous.Suppliers === undefined
        ? []
        : storeMiscellaneous.Suppliers
      : []
  );
  const [pharmacist, setPharmacist] = useState<any[]>(
    storeMiscellaneous
      ? storeMiscellaneous.Pharmacy === undefined
        ? []
        : storeMiscellaneous.Pharmacy
      : []
  );
  const [count, setCount] = useState(1);

  const options = ["Yes", "No"];

  /* Screening Not Completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const miscScreening = { ...miscellaneous };
    Object.assign(miscScreening, completed);
    Object.assign(miscScreening, { Suppliers: suppliers });
    Object.assign(miscScreening, { Pharmacy: pharmacist });

    const response = await saveQuestionairsData("misc", miscScreening);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  /* Screening Completed */
  const handleSave = async () => {
    const completed = { completed: "1" };
    const miscScreening = { ...miscellaneous };
    Object.assign(miscScreening, completed);
    Object.assign(miscScreening, { Suppliers: suppliers });
    Object.assign(miscScreening, { Pharmacy: pharmacist });

    const response = await saveQuestionairsData("misc", miscScreening);

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification('error', response.errors)
    }
  };

  function valueChange(e: any) {
    const { value } = e.target;
    setMiscellaneous({
      ...miscellaneous,
      [e.target.name]: value,
    });
  }
  function valueChanges(e: any) {
    const value = e.target.checked === true ? e.target.value : "";
    setMiscellaneous({
      ...miscellaneous,
      [e.target.name]: value,
    });
  }

  const [state, setState] = React.useState<any>({
    showElement: false,
  });

  const handleChange = (value: any) => {
    if (value.target.value >= 30) {
      setState({ state, showElement: true });
    } else {
      setState({ state, showElement: false });
    }
  };
  const handleAddSuppliers = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newBpRow = {
      key: count,
      name: "",
      status: "",
    };
    const data = [...suppliers, newBpRow];
    setSuppliers(data);
    setCount(count + 1);
  };
  const handleDeleteSuppliers = (index: any) => {
    const newData = suppliers.filter((item) => item.key !== index);
    setSuppliers(newData);
  };
  const handleSuppliers = (e: any, index: any) => {
    const bloodPressure = [...suppliers];
    let item = suppliers[index];
    item = { ...item, [e.target.name]: e.target.value };
    bloodPressure[index] = item;
    setSuppliers(bloodPressure);
  };
  const handleAddPharmacist = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newBpRow = {
      key: count,
      name: "",
      status: "",
    };
    const data = [...pharmacist, newBpRow];
    setPharmacist(data);
    setCount(count + 1);
  };
  const handleDeletePharmacist = (index: any) => {
    const newData = pharmacist.filter((item) => item.key !== index);
    setPharmacist(newData);
  };
  const handlePharmacist = (e: any, index: any) => {
    const bloodPressure = [...pharmacist];
    let item = pharmacist[index];
    item = { ...item, [e.target.name]: e.target.value };
    bloodPressure[index] = item;
    setPharmacist(bloodPressure);
  };

  return (
    <div className="question-card">
      <h2 className="stepsheading">Miscellaneous</h2>
      <h6>Vitals</h6>
      <br />
      <div className="row mb-3">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">Height ?</label>
          <input
            type="text"
            min="0"
            step="0.01"
            className="form-control"
            name="height"
            onChange={(e) => {
              handleChange(e);

              valueChange(e);
            }}
            placeholder="Height (ft,inches)"
            value={miscellaneous?.height}
          />
        </div>
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">Weight ?</label>
          <br />
          <input
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            name="weight"
            onChange={valueChange}
            placeholder="Weight (lbs)"
            value={miscellaneous?.weight}
          />
        </div>
      </div>

      <h6>Advance Care Planning</h6>
      <br />
      <div className="row mb-2">
        <div className="col-lg-6 md-6 sm-12">
          <p>
            Advanced Care planning was discussed with the patient. A packet is
            given to the patient. The patient shows understanding. The patient
            was by himself during the discussion
          </p>
        </div>
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">Time spent</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className="form-control"
            name="time_spent"
            onChange={valueChange}
            placeholder="Time spent in minutes"
            value={miscellaneous?.time_spent}
          />
        </div>
      </div>

      <h6>Intensive behavioral therapy for cardiovascular disease (CVD)</h6>
      <br />
      <div className="row mb-3 ml-3">
        <div className="col-lg-6 md-6 sm-12">
          <input
            className="form-check-input"
            type="checkbox"
            value="check"
            name="asprin_use"
            onChange={valueChanges}
            checked={miscellaneous?.asprin_use === "check"}
          />
          <label className="form-check-label">
            Encouraged aspirin use for primary prevention a cardiovascular
            disease when the benefits outweigh the risks for men age 45-79 and
            women 55-79.
          </label>
          <br />
          <input
            className="form-check-input"
            type="checkbox"
            value="check"
            name="high_blood_pressure"
            onChange={valueChanges}
            checked={miscellaneous?.high_blood_pressure === "check"}
          />
          <label className="form-check-label">
            Screened for high blood pressure.
          </label>
          <br />
        </div>
        <div className="col-lg-6 md-6 sm-12">
          <input
            className="form-check-input "
            type="checkbox"
            value="check"
            onChange={valueChanges}
            name="behavioral_counselling"
            checked={miscellaneous?.behavioral_counselling === "check"}
          />
          <label className="form-check-label">
            Intensive behavioral counseling provided to promote a healthy diet
            for adults who already have hyperlipidemia, hypertension, advancing
            age, and other known risk factors for cardiovascular and diet
            related chronic diseases.
          </label>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">Is patient on Aspirin ?</label>

          <div>
            <Radio.Group
              name="patient_on_asprin"
              value={miscellaneous?.patient_on_asprin}
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
      </div>
      <div className="row">
        <div className="col-lg-6">
          <Button
            onClick={handleAddSuppliers}
            className="float-left mb-3"
            type="primary"
            size="small"
          >
            Add Suppliers
          </Button>
          <table className="table">
            <tbody>
              <tr>
                <th>Suppliers Name</th>
                <th>Status</th>
              </tr>
              {suppliers?.map((items: any, index: any) => {
                return (
                  <>
                    <tr key={index}>
                      <td style={{ paddingLeft: "3px" }}>
                        <input
                          type="text"
                          value={items?.name}
                          name="name"
                          className="form-control"
                          placeholder="Suppliers Name"
                          onChange={(e) => handleSuppliers(e, index)}
                        />
                      </td>
                      <td style={{ paddingLeft: "3px" }}>
                        <select
                          name="status"
                          id="input"
                          className="form-control"
                          value={items?.status}
                          placeholder="Status"
                          onChange={(e) => handleSuppliers(e, index)}
                        >
                          <option value="" selected disabled>
                            Select status
                          </option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </td>
                      <td style={{ paddingLeft: "3px" }}>
                        <Tooltip title={"Delete"}>
                          <i
                            className="fas fa-times text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeleteSuppliers(items.key)}
                          ></i>
                        </Tooltip>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="col-lg-6">
          <Button
            onClick={handleAddPharmacist}
            className="float-right mb-3"
            type="primary"
            size="small"
          >
            Add Pharmacy
          </Button>
          <table className="table">
            <tbody>
              <tr>
                <th>Pharmacy Name</th>
                <th>Status</th>
              </tr>
              {pharmacist?.map((items: any, index: any) => {
                return (
                  <>
                    <tr key={index}>
                      <td style={{ paddingLeft: "3px" }}>
                        <input
                          className="form-control"
                          type="text"
                          value={items?.name}
                          name="name"
                          placeholder="Pharmacy Name"
                          onChange={(e) => handlePharmacist(e, index)}
                        />
                      </td>
                      <td style={{ paddingLeft: "3px" }}>
                        <select
                          name="status"
                          id="input"
                          className="form-control"
                          value={items?.status}
                          placeholder="Status"
                          onChange={(e) => handlePharmacist(e, index)}
                        >
                          <option value="" selected disabled>
                            Select status
                          </option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>

                        {/* <Input
                          type="text"
                          value={items?.status}
                          name="status"
                          placeholder="Status"
                          onChange={(e) => handlePharmacist(e, index)}
                        /> */}
                      </td>
                      <td style={{ paddingLeft: "3px" }}>
                        <Tooltip title={"Delete"}>
                          <i
                            className="fas fa-times text-danger"
                            style={{ cursor: "pointer" }}
                            onClick={() => handleDeletePharmacist(items.key)}
                          ></i>
                        </Tooltip>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-lg-6 md-6 sm-12">
          <label className="question-text">Comments</label>
          <textarea
            className="form-control"
            name="comments"
            value={miscellaneous?.comments ?? ""}
            defaultValue={miscellaneous?.comments ?? ""}
            spellCheck="false"
            onChange={valueChange}
          ></textarea>
        </div>
      </div>

      <Space>
        <Button type="primary" onClick={() => handlePreviousStep?.()}>
          Back
        </Button>
        <Button loading={loading} onClick={async () => await SaveAndNext()}>
          Save
        </Button>
        <Button
          type="primary"
          loading={loading}
          onClick={async () => await handleSave()}
        >
          Finish
        </Button>
      </Space>
      {/* <Link to="#" className="btn_grad" onClick={() => handlePreviousStep()}>
          Back
        </Link>
        <Link to="#" className="btn_grad " onClick={(e) => handleSave(e)}>
          Save And Next
        </Link> */}
    </div>
  );
}
export default Miscellaneous;
