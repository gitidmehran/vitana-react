/* eslint-disable react/jsx-key */
/* eslint-disable array-callback-return */

// import { Container } from './styles';
import moment from "moment";
import React, { useState } from "react";
import {
  Cascader,
  Collapse,
  Input,
  InputNumber,
  Modal,
  Space,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { Button } from "antd";
import { Form } from "antd";

import {
  Depression,
  CHF,
  CKD,
  obesity,
  COPD,
  DiabetesMellitus,
  hypertension,
  Hypercholesterolemia,
  Anemia,
  HYPOTHYROIDISM,
  Asthma,
  others,
} from "./../../../../Constant/constant";
import {
  addDiagnosis,
  addMedication,
  addSurgical_history,
  updateDiagnosis,
  updateFamilyHistory,
  updateMedication,
  updateSocialHistory,
  updateSurgicalHistory,
} from "../../../../actions/Patients/PatientActions";
import {
  CaretRightOutlined,
  DeleteFilled,
  EditFilled,
  SaveFilled,
} from "@ant-design/icons";
import { EditOutlined } from "@ant-design/icons";
import Item from "antd/lib/descriptions/Item";
interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "number" | "text";
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  children,
  ...restProps
}) => {
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const MedicalInfo = ({ patient }: { patient: any }) => {
  const [diagnosis, setdiagnosis] = useState({} as any);
  const [medication, setMedication] = useState({} as any);
  const [surgicalHistory, setSurghistory] = useState({} as any);
  const [diagnosismodal, setDiagnosismodal] = useState(false);
  const [loading, setloading] = useState(false);
  const [disable, setDisable] = useState(false);
  const [medicalmodal, setMedicalmodal] = useState(false);
  const [customCode, setCustomcode] = useState(false);
  const [cascade, setCascade] = useState(true);
  const [surghistorymodal, setSurghistorymodal] = useState(false);
  const [datadiag, setdatadiag] = useState<any>(patient.diagnosis);
  const [datamed, setDatamed] = useState<any>(patient.medication);
  const [dataSurg, setDataSurg] = useState<any>(patient.surgical_history);
  const [description, setDescription] = useState<any>("");
  const [family_history, setFamily_history] = useState<any>(
    patient.family_history
  );
  const [form] = Form.useForm();
  const [data, setData] = useState<any>(patient.social_history ?? []);
  const [editingKey, setEditingKey] = useState("");
  const [count, setCount] = useState(2);
  const { Panel } = Collapse;

  const handleOk = () => {
    setDiagnosismodal(false);
    /* setMedicalmodal(false);
    setSurghistorymodal(false); */
  };

  const handleCancel = () => {
    setDiagnosismodal(false);
    setMedicalmodal(false);
    setSurghistorymodal(false);
  };

  const handledngModal = () => {
    setDiagnosismodal(true);
    setDescription("");
    setdiagnosis({} as any);
    setDisable(false);
  };
  const handleMedModal = () => {
    setMedicalmodal(true);
    setDisable(false);

    setMedication({} as any);
  };
  const handleSurhisModal = () => {
    setSurghistorymodal(true);
    setSurghistory({} as any);
    setDisable(false);
  };
  const handleIDCT = (e: any, options: any) => {
    setDescription(options[1].key);
    const desc = options[1].key;
    setdiagnosis({
      ...diagnosis,
      condition: e[1],
      description: desc,
    });
  };
  const handleDiachnage = (e: any) => {
    const value = e.target.value.toUpperCase();
    setdiagnosis({
      ...diagnosis,
      [e.target.name]: value,
      display: cascade === true ? "selective" : "text",
    });
  };
  const handlemedchange = (e: any) => {
    const value = e.target.value.toUpperCase();
    setMedication({
      ...medication,
      [e.target.name]: value,
    });
  };
  const handleSurChange = (e: any) => {
    const value = e.target.value.toUpperCase();
    setSurghistory({
      ...surgicalHistory,
      [e.target.name]: value,
    });
  };

  const handleDiagnosissubmit = () => {
    setloading(true);

    if (diagnosis.id) {
      const row = {
        description: diagnosis.description,
        display: diagnosis.display,
        status: diagnosis.status,
        patient_id: patient.id,
      };
      updateDiagnosis(diagnosis.id, row).then(({ data: response }) => {
        setloading(false);
        setDiagnosismodal(false);
        setdatadiag(response.data);
        setDescription("");
      });
    } else {
      const row = {
        condition: diagnosis.condition,
        description: diagnosis.description,
        display: diagnosis.display,
        status: diagnosis.status,
        patient_id: patient.id,
      };
      addDiagnosis(row).then(({ data: response }) => {
        setloading(false);
        setDiagnosismodal(false);
        setdatadiag(response.data);
        setDescription("");
      });
    }
  };
  const handlemediaction = () => {
    setloading(true);
    if (medication.id) {
      const row = {
        dose: medication.dose,
        condition: medication.condition,
        status: medication.status,
        patient_id: patient.id,
      };

      updateMedication(medication.id, row).then(({ data: response }) => {
        setloading(false);
        setMedicalmodal(false);
        setDatamed(response.data);
      });
    } else {
      const row = { ...medication, patient_id: patient.id };

      addMedication(row).then((response: any) => {
        setloading(false);
        setMedicalmodal(false);
        setDatamed(response.data.data);
      });
    }
  };
  const handleSurgHistory = () => {
    setloading(true);

    if (surgicalHistory.id) {
      const row = {
        reason: surgicalHistory.reason,
        surgeon: surgicalHistory.surgeon,
        date: surgicalHistory.date,
        patient_id: patient.id,
      };

      updateSurgicalHistory(surgicalHistory.id, row).then(
        ({ data: response }) => {
          setloading(false);
          setSurghistorymodal(false);
          setDataSurg(response.data);
        }
      );
    } else {
      const row = { ...surgicalHistory, patient_id: patient.id };

      addSurgical_history(row).then((response: any) => {
        setloading(false);
        setSurghistorymodal(false);
        setDataSurg(response.data.data);
      });
    }
  };

  const handleCustomCode = () => {
    setCustomcode(!customCode);
    setCascade(!cascade);
    setDescription("");
  };
  const filter = (inputValue: string, path: any[]) =>
    path.some(
      (option: any) =>
        option?.value
          ?.toString()
          .toLowerCase()
          .indexOf(inputValue.toLowerCase()) > -1
    );
  const treeData = [
    {
      label: "Depression",
      value: 1,
      children: Depression.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.Depression}

                    <small className="text-danger">{items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.Depression}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.Depression,
        };
      }),
    },
    {
      label: "Congestive Heart Failure",
      value: 2,
      children: CHF.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.CHF}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.CHF}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.CHF,
        };
      }),
    },
    {
      label: "COPD",
      value: 3,
      children: COPD.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.COPD}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.COPD}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.COPD,
        };
      }),
    },
    {
      label: "CKD",
      value: 4,
      children: CKD.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.CKD}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.CKD}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.CKD,
        };
      }),
    },
    {
      label: "Diabetes Mellitus",
      value: 5,
      children: DiabetesMellitus.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.DM}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.DM}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.DM,
        };
      }),
    },
    {
      label: "Hypertension",
      value: 6,
      children: hypertension.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.hypertension}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.hypertension}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.hypertension,
        };
      }),
    },
    {
      label: "obesity",
      value: 7,
      children: obesity.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.obesity}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.obesity}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.obesity,
        };
      }),
    },
    {
      label: "Hypercholesterolemia",
      value: 8,
      children: Hypercholesterolemia.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.hypercholestro}(
                    <small className="text-danger"> {items.Raf_score}</small>)
                  </span>
                </>
              ) : (
                <>
                  <span>{items.hypercholestro}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.hypercholestro,
        };
      }),
    },
    {
      label: "Anemia",
      value: 9,
      children: Anemia.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.anemia}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.anemia}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.anemia,
        };
      }),
    },
    {
      label: "Hypothyroidism",
      value: 10,
      children: HYPOTHYROIDISM.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.HYPOTHYROIDISM}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.HYPOTHYROIDISM}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.HYPOTHYROIDISM,
        };
      }),
    },
    {
      label: "Asthma",
      value: 11,
      children: Asthma.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.Asthma}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.Asthma}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.Asthma,
        };
      }),
    },
    {
      label: "Others",
      value: 12,
      children: others.map((items: any) => {
        return {
          key: items.Description,
          label: [
            <Tooltip title={items.Description}>
              {items.Raf_score >= "1" ? (
                <>
                  <span className="text-danger">
                    {items.Others}
                    <small className="text-danger"> {items.Raf_score}</small>
                  </span>
                </>
              ) : (
                <>
                  <span>{items.Others}</span>
                  <small> {items.Raf_score}</small>
                </>
              )}
            </Tooltip>,
          ],
          value: items.Others,
        };
      }),
    },
  ];

  const handleEdit = (data: any) => {
    setDiagnosismodal(true);
    setdiagnosis(data);
    setDisable(true);
  };
  const handleMedEdit = (data: any) => {
    setMedicalmodal(true);
    setMedication(data);
    setDisable(true);
  };
  const handleSurgEdit = (data: any) => {
    setSurghistorymodal(true);
    setSurghistory(data);
    setDisable(true);
  };
  const handlefamchange = (e: any) => {
    const val = e.target.checked === true ? e.target.value : "";
    setFamily_history({ ...family_history, [e.target.name]: val });
  };
  const handleSave = () => {
    const data = { family_history: family_history };
    updateFamilyHistory(patient.id, data).then(({ data: response }) => {
      setFamily_history(response.data);
    });
  };

  const isEditing = (record: Item) => record.key === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ socialHistory: "" });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };
  const handleAdd = () => {
    const newData: any = {
      key: count,
      socialHistory: ``,
    };
    setData([...data, newData]);
    setCount(count + 1);
  };

  const columns = [
    {
      title: (<h5 className="text-uppercase text-center text-dark">Social History</h5>) as any,
      dataIndex: "socialHistory",
      width: "85%",
      editable: true,
    },

    {
      title: (
        <Button
          onClick={handleAdd}
          type="primary"

          className="mb-2 btn-info"
          size="small"
          shape="round"
        >
          Add a row
        </Button>
      ),
      dataIndex: "operation",
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <div className="text-center">
            <Space size={20}>
              <Typography.Link
                onClick={() => save(record.key)}
                style={{ marginRight: 8 }}
              >
                <SaveFilled className="text-primary" />
              </Typography.Link>
              <DeleteFilled className="text-danger" onClick={cancel} />
            </Space>
          </div>
        ) : (
          <div className="text-center">
            <Space size={20}>
              <Typography.Link
                disabled={editingKey !== ""}
                onClick={() => edit(record)}
              >
                <EditFilled className="text-primary" />
              </Typography.Link>

              <DeleteFilled
                className="text-danger"
                onClick={() => handleDelete(record.key)}
              />
            </Space>
          </div>
        );
      },
    },
  ];
  const handleDelete = (key: React.Key) => {
    const newData = data.filter((item: any) => item.key !== key);
    setData(newData);
  };

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const handleSocialHistorySave = () => {
    const list = { social_history: data };
    updateSocialHistory(patient.id, list).then(({ data: response }) => {
      setData(response.data);
    });
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className=" col-md-12 col-lg-12">
            <div className="card border-info">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-11">
                    <h5 className="card-title text-center text-uppercase mb-2">
                      Diagnosis
                    </h5>
                  </div>
                  <div className="col-lg-1  text-right">
                    <a onClick={() => handledngModal()}>
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>

                <Collapse
                  accordion
                  ghost
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                >
                  <Panel header="Active Diagnosis" key="1">
                    <table className="table text-uppercase table-striped table-bordered">
                      <tr>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          ICD10 Code
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Description
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Status
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Actions
                        </th>
                      </tr>
                      {datadiag?.map((items: any) => {
                        if (items.status === "ACTIVE") {
                          return (
                            <tbody>
                              <tr
                                className="text-dark text-center"
                                style={{ fontSize: "12px" }}
                              >
                                <td>{items.condition}</td>
                                <td>{items.description}</td>
                                <td>{items.status}</td>
                                <td>
                                  <EditOutlined
                                    onClick={() => handleEdit(items)}
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          );
                        }
                      })}
                    </table>
                  </Panel>
                  <Panel header="Resolved diagnosis" key="2">
                    <table className="table text-uppercase table-striped table-bordered">
                      <tr>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          ICD10 Code
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Description
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Status
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Action
                        </th>
                      </tr>
                      {datadiag?.map((items: any) => {
                        if (items.status === "RESOLVED") {
                          return (
                            <tbody>
                              <tr
                                className="text-dark text-center"
                                style={{ fontSize: "12px" }}
                              >
                                <td>{items.condition}</td>
                                <td>{items.description}</td>
                                <td>{items.status}</td>
                                <td>
                                  <EditOutlined
                                    onClick={() => handleEdit(items)}
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          );
                        }
                      })}
                    </table>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
          <div className=" col-md-12 col-lg-6">
            <div className="card border-info">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-7">
                    <h5 className="card-title text-right text-uppercase mb-2">
                      Medication
                    </h5>
                  </div>
                  <div className="col-lg-5  text-right">
                    <a onClick={() => handleMedModal()}>
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
                <Collapse
                  accordion
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                >
                  <Panel header="Active Medication" key="1">
                    <table className="table text-uppercase table-striped table-bordered">
                      <tr>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Name
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Dose
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Condition
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Status
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Actions
                        </th>
                      </tr>
                      {datamed?.map((items: any) => {
                        if (items.status === "ACTIVE") {
                          return (
                            <tbody>
                              <tr
                                className="text-dark text-center"
                                style={{ fontSize: "12px" }}
                              >
                                <td>{items.name}</td>
                                <td>{items.dose}</td>
                                <td>{items.condition}</td>
                                <td>{items.status}</td>
                                <td>
                                  <EditOutlined
                                    onClick={() => handleMedEdit(items)}
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          );
                        }
                      })}
                    </table>
                  </Panel>
                  <Panel header="Non Active Medication" key="2">
                    <table className="table text-uppercase table-striped table-bordered">
                      <tr>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Name
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Dose
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Condition
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          status
                        </th>
                        <th
                          className="text-center text-secondary p-0"
                          style={{ fontSize: "12px" }}
                        >
                          Actions
                        </th>
                      </tr>
                      {datamed?.map((items: any) => {
                        if (items.status === "NON ACTIVE") {
                          return (
                            <tbody>
                              <tr
                                className="text-dark text-center"
                                style={{ fontSize: "12px" }}
                              >
                                <td>{items.name}</td>
                                <td>{items.dose}</td>
                                <td>{items.condition}</td>
                                <td>{items.status}</td>
                                <td>
                                  <EditOutlined
                                    onClick={() => handleMedEdit(items)}
                                    className="text-danger"
                                    style={{ cursor: "pointer" }}
                                  />
                                </td>
                              </tr>
                            </tbody>
                          );
                        }
                      })}
                    </table>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>
          <div className=" col-md-12 col-lg-6">
            <div className="card border-info">
              <div className="card-body">
                <div className="row">
                  <div className="col-lg-8">
                    <h5 className="card-title text-right text-uppercase mb-2">
                      Surgical History
                    </h5>
                  </div>
                  <div className="col-lg-4  text-right">
                    <a onClick={() => handleSurhisModal()}>
                      <i className="fa fa-plus-circle" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
                <table className="table text-uppercase table-striped table-bordered">
                  <tr>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Procedure
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Reason
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Surgeon/Facility
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Date
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Actions
                    </th>
                  </tr>
                  {dataSurg?.map((items: any) => {
                    return (
                      <tbody>
                        <tr
                          className="text-dark text-center"
                          style={{ fontSize: "12px" }}
                        >
                          <td>{items.procedure}</td>
                          <td>{items.reason}</td>
                          <td>{items.surgeon}</td>
                          <td>
                            {items?.date != "null"
                              ? moment(items.date).format("MM/DD/YYYY")
                              : ""}
                          </td>
                          <td>
                            <EditOutlined
                              onClick={() => handleSurgEdit(items)}
                              className="text-danger"
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    );
                  })}
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12 col-lg-6">
            <div className="card border-info">
              <div className="card-body">
                <div className="row">
                  <div className=" col-md-6 col-lg-7">
                    <h5 className="text-right text-dark text-uppercase">
                      Family History
                    </h5>
                  </div>
                </div>

                <table className="table responsive text-dark">
                  <tr className="m-0 ">
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Family History
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Father
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Mother
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Children
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Siblings
                    </th>
                    <th
                      className="text-center text-secondary p-0"
                      style={{ fontSize: "12px" }}
                    >
                      Grandparents
                    </th>
                  </tr>
                  <tbody>
                    <tr>
                      <td>Cancer</td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="cancer_father"
                          value="yes"
                          checked={Boolean(
                            family_history?.cancer_father === "yes"
                          )}
                          onChange={(e) => {
                            handlefamchange(e);
                          }}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          id="cancer_mother"
                          name="cancer_mother"
                          value="yes"
                          checked={Boolean(
                            family_history?.cancer_mother === "yes"
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          id="cancer_children"
                          name="cancer_children"
                          value="yes"
                          checked={Boolean(family_history?.cancer_children)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          id="cancer_siblings"
                          name="cancer_siblings"
                          value="yes"
                          checked={Boolean(family_history?.cancer_siblings)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          id="cancer_grandparents"
                          name="cancer_grandparents"
                          value="yes"
                          checked={Boolean(family_history?.cancer_grandparents)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Diabetes</td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="diabetes_father"
                          value="yes"
                          checked={Boolean(family_history?.diabetes_father)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="diabetes_mother"
                          value="yes"
                          checked={Boolean(family_history?.diabetes_mother)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="diabetes_children"
                          value="yes"
                          checked={Boolean(family_history?.diabetes_children)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="diabetes_siblings"
                          value="yes"
                          checked={Boolean(family_history?.diabetes_siblings)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="diabetes_grandparents"
                          value="yes"
                          checked={Boolean(
                            family_history?.diabetes_grandparents
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Heart disease</td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="heart_disease_father"
                          value="yes"
                          checked={Boolean(
                            family_history?.heart_disease_father
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="heart_disease_mother"
                          value="yes"
                          checked={Boolean(
                            family_history?.heart_disease_mother
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="heart_disease_children"
                          value="yes"
                          checked={Boolean(
                            family_history?.heart_disease_children
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="heart_disease_siblings"
                          value="yes"
                          checked={Boolean(
                            family_history?.heart_disease_siblings
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="heart_disease_grandparents"
                          value="yes"
                          checked={Boolean(
                            family_history?.heart_disease_grandparents
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td>Hypertension</td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="hypertension_father"
                          value="yes"
                          checked={Boolean(family_history?.hypertension_father)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="hypertension_mother"
                          value="yes"
                          checked={Boolean(family_history?.hypertension_mother)}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="hypertension_children"
                          value="yes"
                          checked={Boolean(
                            family_history?.hypertension_children
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="hypertension_siblings"
                          value="yes"
                          checked={Boolean(
                            family_history?.hypertension_siblings
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                      <td className="text-center">
                        <Input
                          type="checkbox"
                          name="hypertension_grandparents"
                          value="yes"
                          checked={Boolean(
                            family_history?.hypertension_grandparents
                          )}
                          onChange={(e) => handlefamchange(e)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="text-right">
                  <Button
                    type="primary"
                    shape="round"
                    size="small"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className=" col-md-12 col-lg-6">
            <div className="card border-info">
              <div className="card-body">
                <div className="row">
                  {/* <div className="col-lg-8">
                    <h5 className="card-title text-right text-uppercase mb-2">
                      Social History
                    </h5>
                  </div> */}
                </div>
                <Form form={form} component={false}>
                  <Table
                    components={{
                      body: {
                        cell: EditableCell,
                      },
                    }}
                    bordered
                    dataSource={data}
                    columns={mergedColumns}
                    rowClassName="editable-row"
                    pagination={false}
                  />
                </Form>
              </div>
              <div className="text-right">
                <Button
                  onClick={handleSocialHistorySave}
                  type="primary"
                  className="m-2"
                  size="small"
                  shape="round"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* modals */}

      <Modal
        title="Add Diagnosis"
        open={diagnosismodal}
        footer={false}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form onFinish={handleDiagnosissubmit}>
          <div className="form-group">
            <div className="row">
              <div className="col-lg-12">
                <Button
                  type="primary"
                  size="small"
                  onClick={() => handleCustomCode()}
                  className="float-right"
                >
                  {cascade === true ? "Add custom code" : "Add selective code"}
                </Button>
                <label htmlFor="">
                  <small className="font-weight-bold">ICD10 CODE</small>
                </label>

                {customCode && (
                  <input
                    type="text"
                    className="form-control text-uppercase mb-3"
                    name="condition"
                    disabled={disable === true}
                    value={diagnosis.condition}
                    onChange={(e) => handleDiachnage(e)}
                  />
                )}

                {cascade && (
                  <Cascader
                    className=" text-dark"
                    style={{ width: "100%" }}
                    size="middle"
                    disabled={disable === true}
                    value={diagnosis.condition}
                    showSearch={{ filter }}
                    options={treeData}
                    onChange={(e, options) => handleIDCT(e, options)}
                    placeholder="Please select"
                  />
                )}

                {/*  <TreeSelect
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={treeData}
                  placeholder="Please Search IDC10 Code"
                  showSearch={true}
                  onSearch={(e) => handleSearch(e)}
                  onChange={(e: any, label: any, key: any) =>
                    handleIDCT(e, label, key)
                  }
                /> */}
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">DESCRIPTION</small>
                </label>
                {cascade && (
                  <input
                    type="text"
                    className="form-control text-uppercase mb-3"
                    name="description"
                    value={description ? description : diagnosis.description}
                    disabled
                  />
                )}
                {customCode && (
                  <input
                    type="text"
                    className="form-control text-uppercase mb-3"
                    name="description"
                    value={diagnosis.description}
                    onChange={(e) => handleDiachnage(e)}
                  />
                )}
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">STATUS</small>
                </label>

                <select
                  id="input"
                  className="form-control text-uppercase text-uppercase mb-4"
                  name="status"
                  value={diagnosis.status}
                  onChange={(e) => handleDiachnage(e)}
                >
                  <option value="" selected className="text-uppercase">
                    Select
                  </option>

                  <option value="ACTIVE" className="text-uppercase">
                    active
                  </option>
                  <option value="RESOLVED" className="text-uppercase">
                    resolved
                  </option>
                </select>
              </div>
              <div className="col-lg-12 ">
                <Button htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Add Medical"
        open={medicalmodal}
        footer={false}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form onFinish={() => handlemediaction()}>
          <div className="form-group">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">Medication</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="name"
                  disabled={disable === true}
                  value={medication.name}
                  onChange={(e) => handlemedchange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">Dose/Frequency</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="dose"
                  value={medication.dose}
                  onChange={(e) => handlemedchange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">CONDITION</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="condition"
                  value={medication.condition}
                  onChange={(e) => handlemedchange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">STATUS</small>
                </label>
                <select
                  id="input"
                  className="form-control text-uppercase text-uppercase mb-4"
                  name="status"
                  value={medication.status}
                  onChange={(e) => handlemedchange(e)}
                >
                  <option value="" selected className="text-uppercase">
                    Select
                  </option>

                  <option value="ACTIVE" className="text-uppercase">
                    active
                  </option>
                  <option value="NON ACTIVE" className="text-uppercase">
                    non active
                  </option>
                </select>
              </div>
              <div className="col-lg-12">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
      <Modal
        title="Add Surgical History"
        open={surghistorymodal}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        destroyOnClose={true}
      >
        <Form onFinish={() => handleSurgHistory()}>
          <div className="form-group">
            <div className="row">
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">PROCEDURE</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="procedure"
                  disabled={disable === true}
                  value={surgicalHistory.procedure}
                  onChange={(e) => handleSurChange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">REASON</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="reason"
                  value={surgicalHistory.reason}
                  onChange={(e) => handleSurChange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">SURGEON</small>
                </label>
                <input
                  type="text"
                  className="form-control text-uppercase mb-3"
                  name="surgeon"
                  value={surgicalHistory.surgeon}
                  onChange={(e) => handleSurChange(e)}
                />
              </div>
              <div className="col-lg-12">
                <label htmlFor="">
                  <small className=" font-weight-bold">DATE</small>
                </label>
                <input
                  type="date"
                  className="form-control text-uppercase mb-3"
                  name="date"
                  value={surgicalHistory.date}
                  onChange={(e) => handleSurChange(e)}
                />
              </div>
              <div className="col-lg-12">
                <Button type="primary" htmlType="submit" loading={loading}>
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default MedicalInfo;
