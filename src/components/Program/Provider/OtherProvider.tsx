import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "@/store/store";
import { Button, Input, Radio, Space, Tooltip } from "antd";
import {
  OtherProviderType,
  QuestionaireStepProps,
} from "@/Types/QuestionaireTypes";
import React, { useState } from "react";
import { OpenNotification } from "./../../../Utilties/Utilties";

const OtherProvider = ({
  handlePreviousStep,
  handleNextStep,
  saveQuestionairsData,
}: QuestionaireStepProps) => {
  const {
    question: { other_Provider },
    loading,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [provider, setProvider] =
    React.useState<OtherProviderType>(other_Provider as OtherProviderType);

  const [showPorviderBody, setShowPorviderBody] = React.useState<boolean>(
    Boolean(provider?.other_provider_beside_pcp === "Yes") ?? false
  );

  const [bpRows, setBpRows] = useState<OtherProviderType[]>(other_Provider ? other_Provider.provider === undefined ? [] : other_Provider.provider : []);
  const [count, setCount] = useState(1);


  React.useEffect(() => {
    const otherprovider = provider?.other_provider_beside_pcp;

    if (otherprovider === "No") {
      setProvider({
        ...provider,
        full_name: "",
        speciality: "",
      });
      setBpRows([])
    }

    setShowPorviderBody(Boolean(otherprovider === "Yes"));
  }, [provider?.other_provider_beside_pcp]);

  const options = ["Yes", "No"];

  const handleAdd = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const newBpRow = {
      key: count,
      full_name: "",
      speciality: "",
    };
    const data = [...bpRows, newBpRow];
    setBpRows(data);
    setCount(count + 1);
  }

  function valueChange(e: any) {
    const value = e.target.value;

    setProvider({
      ...provider,
      [e.target.name]: value,
    });
  }

  /* Screening not completed */
  const SaveAndNext = async () => {
    const completed = { completed: "0" };
    const otherProvider = { ...provider };
    Object.assign(otherProvider, completed);
    Object.assign(otherProvider, { 'provider': bpRows });

    const response = await saveQuestionairsData(
      "other_Provider",
      otherProvider
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification("error", "Something went Wrong");
    }
  };

  const handleSave = async () => {
    const completed = { completed: "1" };
    const otherProvider = { ...provider };
    Object.assign(otherProvider, completed);
    Object.assign(otherProvider, { 'provider': bpRows });

    const response = await saveQuestionairsData(
      "other_Provider",
      otherProvider
    );

    if (response.success === true) {
      handleNextStep && handleNextStep();
    } else {
      OpenNotification('error', response.errors)
    }
  };
  const handleDelete = (index: any) => {
    const newData = bpRows.filter((item) => item.key !== index);
    setBpRows(newData);
  };
  const handlebpMonitor = (e: any, index: any) => {
    const bloodPressure = [...bpRows];
    let item = bpRows[index];
    item = { ...item, [e.target.name]: e.target.value };
    bloodPressure[index] = item;
    setBpRows(bloodPressure);
  };


  return (
    <>
      <div className="question-card">
        <h2 className="stepsheading">Other Providers</h2>
        <div className="row mb-2">
          <div className="col-lg-6 md-6 sm-12">
            <label className="question-text">
              Do you see any other Provider beside PCP?
            </label>
            <br />
            <Radio.Group
              name="other_provider_beside_pcp"
              value={provider?.other_provider_beside_pcp}
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
        <div>
          {showPorviderBody && (
            <Button onClick={handleAdd} className="float-right" type="primary">
              Add a row
            </Button>
          )}
          <table className="table">
            <tbody>
              {showPorviderBody && (

                bpRows?.map((items: any, index: any) => {
                  return (

                    <>

                      <tr key={index}>
                        <td style={{ paddingLeft: "3px" }}>
                          <Input
                            type="text"
                            value={items?.full_name}
                            name="full_name"
                            size="middle"
                            placeholder="Full Name"
                            onChange={(e) => handlebpMonitor(e, index)}
                          />
                        </td>
                        <td style={{ paddingLeft: "3px" }}>
                          <Input
                            type="text"
                            value={items?.speciality}
                            name="speciality"
                            placeholder="Speciality"
                            onChange={(e) => handlebpMonitor(e, index)}
                          />
                        </td>
                        <td style={{ paddingLeft: "3px" }}>
                          <Tooltip title={"Delete"}>
                            <Button danger size="small">
                              <i
                                className="fas fa-times"
                                onClick={() => handleDelete(items.key)}
                              ></i>
                            </Button>
                          </Tooltip>
                        </td>
                      </tr>
                    </>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="row"></div>
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
export default OtherProvider;
