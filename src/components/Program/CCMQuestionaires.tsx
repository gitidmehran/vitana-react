import React, { useEffect, useState } from "react";
import Steper, { StepperType } from "./steper/Steper";

import { Container } from "react-bootstrap";
import FallScreening from "./FallScreening/FallScreening";
import Depression from "./Depression/Depression";
import CognitiveAssesment from "./CognitiveAssesment/CognitiveAssesment";
import ChronicObstructivePulmonaryDisease from "./COPD/ChronicObstructivePulmonaryDisease";
import Obesity from "./Obesity/Obesity";
import CKD from "./CKD/Ckd";

import CongestiveHeartFailure from "./CongestiveHeartFailure/CongestiveHeartFailure";
import CaregiverAssessment from "./Caregiver/CaregiverAssessment";
/* import Hypercholesterolemia from "./Hypercholesterolemia/Hypercholesterolemia";
 */ import Immunization from "./Immunization/Immunization";
import Screening from "./Screening/Screening";
import GeneralAssesment from "./GeneralAssesment/GeneralAssesment";
import OtherProvider from "./Provider/OtherProvider";
import Hypertensions from "./Hypertension/Hypertention";
import DiabetesMellitus from "./DiabetesMellitus/DiabetesMellitus";
import MonthlyAssessment from "./MonthlyAssessment/MonthlyAssessment";
import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import {
  DatePicker,
  Modal,
  Space,
  Spin,
  Table,
  TimePicker,
  Tooltip,
} from "antd";
import { useAppDispatch } from "./../../hooks/hooks";
import {
  setBpRows,
  setProgramId,
  setQuestionId,
} from "../../store/reducer/QuestionairesReducer";
import moment from "moment";
import { setDateofService } from "../../store/reducer/QuestionairesReducer";
import Cholesterol from "./Cholesterol/Cholesterol";
import { Button, Col, Drawer, Form, Row, Select } from "antd";
import { taskType } from "../../Constant/constant";
import "../../assets/css/TimerStyle.scss";
import {
  deletetask,
  getCoordinators,
  getLogs,
  storeTask,
  updateTask,
} from "../../actions/CcmTasks/CcmTasksAction";
import { OpenNotification } from "../../Utilties/Utilties";
import { DeleteTwoTone, EditTwoTone, LoadingOutlined } from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
const { Option } = Select;

interface Props {
  saveQuestionairsData: (key: string, data: any) => void;
  patient: any;
  diagnosis: any;
  id: any;
  name: any;
  dob: any;
  patientData: any;
  gender: any;
  status: any;
  disableAfterSeven: any;
  disableFirstSeven: any;
  insurance_name: string;
}
const CCM: React.FC<Props> = ({
  saveQuestionairsData,
  patient,
  diagnosis,
  patientData,
  id,
  name,
  dob,
  status,
  gender,
  disableAfterSeven,
  disableFirstSeven,
  insurance_name,
}) => {
  const {
    question: questionData,
    date_of_service,
    monthly_assessment_id,
    question: {
      fall_screening,
      depression_phq9,
      cognitive_assessment,
      caregiver_assessment,
      other_Provider,
      immunization,
      screening,
      general_assessment,
      monthly_assessment,
      obesity,
      copd_assessment,
      ckd_assessment,
      cong_heart_failure,
      // hypercholestrolemia,
      cholesterol_assessment,
      hypertension,
      diabetes_mellitus,
    },
    programmId,
    questionId,
    // patientProfile,
  } = useAppSelector((state: RootState) => state.questionairesReduer);
  const [steps, setSteps] = useState<StepperType[]>([]);
  const [coordinator, setCoordinator] = useState<any>([]);
  const [logs, setLogs] = useState<any>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [totalTime, setTotalTime] = useState("00:00:00");
  const [disablePicker, setDisablePicker] = useState<boolean>(false);
  const [disableTimer, setDisableTimer] = useState<boolean>(false);
  const [logLoader, setLogLoader] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);
  const [taskRow, setTaskRow] = useState({} as any);
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  // const userRole = localStorage.getItem("role_id");
  const userName = localStorage.getItem("user_name") !== undefined ? localStorage.getItem("user_name") : "";
  const ccmCoordinatorId = localStorage.getItem("user_id") !== undefined ? localStorage.getItem("user_id") : "";
  const coordinatorRules = ccmCoordinatorId === undefined || ccmCoordinatorId === null ? [{ required: true, message: "Co-ordinator Name is required" }] : [];


  const [form] = Form.useForm();
  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (isRunning) {
      intervalId = setInterval(() => {
        setElapsedTime((prevElapsedTime) => prevElapsedTime + 10);
      }, 10);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isRunning]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    //const milliseconds = Math.floor((time % 1000) / 10);
    const hours = Math.floor(time / 3600000);

    return `${padTime(hours)}:${padTime(minutes)}:${padTime(seconds)}`;
  };

  const padTime = (value: number) => {
    return value.toString().padStart(2, "0");
  };

  const start = (): void => {
    setDisablePicker(true);
    setIsRunning(true);
  };

  const stop = (): void => {
    setDisablePicker(true);
    setIsRunning(false);
  };

  const reset = (): void => {
    setElapsedTime(0);
    setIsRunning(false);
    setDisablePicker(false);
  };

  const onClose = () => {
    setOpen(false);
    setLoader(false);
  };

  const closeModal = () => {
    setEditTaskModal(false);
    setLoader(false);
  };
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    setSteps([
      {
        id: 1,
        label: "Fall Screening",
        show: true,
        color: fall_screening?.completed === "1" ? "complete" : "",
      },
      {
        id: 2,
        label: "Cognitive Assesment",
        show: true,
        color: cognitive_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 3,
        label: "Caregiver Assesment",
        show: true,
        color: caregiver_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 4,
        label: "Other Provider",
        show: true,
        color: other_Provider?.completed === "1" ? "complete" : "",
      },
      {
        id: 5,
        label: "Immunization",
        show: true,
        color: immunization?.completed === "1" ? "complete" : "",
      },
      {
        id: 6,
        label: "Screening",
        show: true,
        color: screening?.completed === "1" ? "complete" : "",
      },
      {
        id: 7,
        label: "General Assessment",
        show: true,
        color: general_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 8,
        label: "Monthly Assessment",
        show: true,
        color: monthly_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 9,
        label: "Depression PHQ-9",
        show: Boolean(diagnosis?.Depression === "true"),
        color: depression_phq9?.completed === "1" ? "complete" : "",
      },
      {
        id: 10,
        label: "Obesity",
        show: Boolean(diagnosis?.Obesity === "true"),
        color: obesity?.completed === "1" ? "complete" : "",
      },
      {
        id: 11,
        label: "Chronic Obstructive Pulmonary Disease",
        show: Boolean(diagnosis?.ChronicObstructivePulmonaryDisease === "true"),
        color: copd_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 12,
        label: "Chronic Kidney Disease",
        show: Boolean(diagnosis?.CKD === "true"),
        color: ckd_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 13,
        label: "Congestive Heart Faliure",
        show: Boolean(diagnosis?.CongestiveHeartFailure === "true"),
        color: cong_heart_failure?.completed === "1" ? "complete" : "",
      },
      {
        id: 14,
        label: "Hypercholestrolemia",
        show: Boolean(diagnosis?.Hypercholesterolemia === "true"),
        color: cholesterol_assessment?.completed === "1" ? "complete" : "",
      },
      {
        id: 15,
        label: "Hypertension",
        show: Boolean(diagnosis?.Hypertensions === "true"),
        color: hypertension?.completed === "1" ? "complete" : "",
      },
      {
        id: 16,
        label: "Diabetes",
        show: Boolean(diagnosis?.DiabetesMellitus === "true"),
        color: diabetes_mellitus?.completed === "1" ? "complete" : "",
      },
    ]);
  }, [questionData]);

  const handleNextStep = () => {
    document.getElementById("aho")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    if (
      activeStep === steps.length || disableAfterSeven === true
        ? activeStep === 8
        : null
    ) {
      navigate(`/ccm-general-careplan/${questionId}`, {
        state: { questionid: questionId },
      });
      return;
    }
    const filterSteps = steps.filter(
      (step) => step.id > activeStep && step.show
    );

    const newActiveStep: StepperType =
      filterSteps.length > 0 ? filterSteps[0] : steps[0];
    setActiveStep(newActiveStep.id);
  };
  const handlePreviousStep = () => {
    document.getElementById("aho")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    const filterSteps = steps.filter(
      (step) => step.id < activeStep && step.show
    );

    const newActiveStep: StepperType =
      filterSteps.length > 0 ? filterSteps[filterSteps.length - 1] : steps[0];
    setActiveStep(newActiveStep.id);
  };

  const handlecareplancion = () => {
    dispatch(setBpRows([]));
    navigate(`/ccm-general-careplan/${questionId}`, {
      state: { questionid: questionId },
    });
  };

  const showMonthlyCareplan = (id: string, programmId: string) => {
    dispatch(setBpRows([]));
    dispatch(setQuestionId(id));
    dispatch(setProgramId(programmId));
    navigate(`/ccm-monthly-careplan/${id}`, {
      state: {
        questionid: id,
        dateOfService: dateofService,
        monthly_assessment_id: monthly_assessment_id,
      },
    });
  };
  const format = "MM/DD/YYYY";
  const handledate = (date: any, dateString: any) => {
    dispatch(setDateofService(dateString));
  };



  const dateofService = moment(date_of_service).format(format);

  const handleName = () => {
    navigate("/patients", { state: { patientId: patientData } });
  };

  const showTimerModal = () => {
    setLoader(true);
    const payload = {
      encounter_id: monthly_assessment_id != "" ? monthly_assessment_id : questionId,
      monthly_encounter: monthly_assessment_id !== "" ? 1 : 0,
    };
    getCoordinators(payload)
      .then(({ data: response }) => {
        if (response.success === true) {
          setTotalTime(response.total_task_time);
          setLoader(false);
          form.resetFields();
          setOpen(true);
          setElapsedTime(0);
          setDisableTimer(false);
          setDisablePicker(false);
          setCoordinator(response.data);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((e) => {
        OpenNotification("error", e);
      });
  };

  const onFinish = (fieldsValue: any) => {

    setLoader(true);
    const values = {
      monthly_encounter: monthly_assessment_id !== "" ? 1 : 0,
      monthly_encounter_id: monthly_assessment_id,
      annual_encounter_id: questionId,
      date_of_service: date_of_service,
      ccm_cordinator_id: fieldsValue["Coordinator"] !== undefined ? fieldsValue['Coordinator'] : Number(ccmCoordinatorId),
      task_type: fieldsValue["taskType"] !== undefined ? fieldsValue["taskType"] : "Telephone call with patient",
      task_date: fieldsValue["taskDate"]?.format("MM/DD/YYYY"),
      task_time:
        fieldsValue["taskMin"]?.format("HH:mm:ss") ?? formatTime(elapsedTime),
    };

    storeTask(values)
      .then(({ data: response }) => {
        if (response.success === true) {
          setTotalTime(response.total_task_time);
          setLoader(false);
        } else {
          setLoader(false);
          OpenNotification("error", response.errors);
        }
      })
      .catch((e) => {
        OpenNotification("error", e);
      });
  };

  const handleModal = () => {
    setLogLoader(true);
    const annualEncounter = monthly_assessment_id === "" ? 1 : 0;
    const annualEncounterId = questionId;
    const payload = {
      monthly_encounter_id: monthly_assessment_id,
      annual_encounter: annualEncounter,
      annual_encounter_id: annualEncounterId,
    };
    getLogs(payload)
      .then(({ data: response }) => {
        if (response.success === true) {
          setLogLoader(false);
          setLogs(response.data);
          setIsModalOpen(true);
        } else {
          setLogLoader(false);
          OpenNotification("error", response.message);
        }
      })
      .catch((e) => {
        setLogLoader(false);
        OpenNotification("error", e);
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Task",
      dataIndex: "task_type",
    },
    {
      title: "Date",
      dataIndex: "task_date",
    },
    {
      title: "Time",
      dataIndex: "task_time",
    },
    {
      title: "Coordinator",
      dataIndex: "coordinators",
      render: (_: string, record: any) => record?.coordinators?.name,
    },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <EditTwoTone onClick={() => handleEdit(record)} />
          <DeleteTwoTone twoToneColor={"red"} onClick={() => handleDelete(record)} />
        </Space>
      ),
    }
  ];


  function handleEdit(record: { id: number; task_type: string; coordinators: { id: number; }; task_date: moment.MomentInput; task_time: moment.MomentInput; }) {
    setTaskRow(record.id)
    form.setFieldsValue({
      ...record,
      taskType: record.task_type,
      Coordinator: record.coordinators.id,
      taskDate: moment(record.task_date),
      taskMin: moment(record.task_time, "HH:mm:ss"),
    })
    setEditTaskModal(true);
  }



  function handleDelete(record: { id: number; }) {
    setLoader(true);
    deletetask(record?.id)
      .then(({ data: response }) => {
        setLoader(false);
        if (response.success) {
          const list = logs.filter((item: any) => item.id !== record.id);
          setLogs(list);
          OpenNotification("success", response.message);
        } else {
          setLoader(false);
          OpenNotification("error", response.message);
          alert("error deleting record");
        }
      })
      .catch((response) => {
        OpenNotification("error", response.message);
      });
  }
  function handleTaskSubmit(values: { Coordinator: number; taskType: string; taskDate: { format: (arg0: string) => any; }; taskMin: { format: (arg0: string) => any; }; }) {
    const annualEncounter = monthly_assessment_id === "" ? 1 : 0;
    const payload = {
      ccm_cordinator_id: Number(values.Coordinator),
      task_type: values.taskType,
      task_date: values.taskDate.format("MM/DD/YYYY"),
      task_time: values.taskMin.format("HH:mm:ss"),
      monthly_encounter: monthly_assessment_id !== "" ? 1 : 0,
      monthly_encounter_id: monthly_assessment_id,
      annual_encounter: annualEncounter,
      annual_encounter_id: questionId,
    }
    updateTask(taskRow, payload).then(({ data: response }) => {
      if (response.success === true) {
        setEditTaskModal(false);
        setTotalTime(response.total_task_time);
        setLogs(response.data);
      }
    }).then((error) => {
      console.log(error)
    })
  }

  // const onSearch = (value: any) => {
  //   setLogLoader(true);
  //   const payload = {
  //     monthly_encounter_id: monthly_assessment_id,
  //     search: value,
  //   };
  //   getLogs(payload)
  //     .then(({ data: response }) => {  
  //       if (response.success === true) {
  //         setLogLoader(false);
  //         setLogs(response.data);
  //         setIsModalOpen(true);
  //       } else {
  //         setLogLoader(false);
  //         OpenNotification("error", response.message);
  //       }
  //     })
  //     .catch((e) => {
  //       setLogLoader(false);
  //       OpenNotification("error", e);
  //     });
  // };



  return (
    <>
      <Container fluid id="hello">
        <Steper
          steps={steps}
          activeStep={activeStep}
          setActiveStep={(e) => setActiveStep(e)}
          disableAfterSeven={disableAfterSeven}
          disableFirstSeven={disableFirstSeven}
        />
        <div className="container-fluid  pl-5 mb-2 ">
          <div className="row">
            <div className="col-md-6 col-lg-10 col-xl-10">
              <DatePicker
                className="mr-2"
                format={format}
                status={status}
                placeholder="date of service"
                onChange={(date, dateString) =>
                  handledate("date_of_service", dateString)
                }
                value={
                  date_of_service ? moment(dateofService, format) : undefined
                }
              />
              <small
                className="d-inline text-nowrap text-uppercase text-dark font-weight-bolder"
                style={{ cursor: "pointer" }}
                onClick={handleName}
              >
                patient name: <span className="text-primary">{name}</span>
              </small>
              <small className="d-inline text-nowrap text-uppercase text-dark ml-4 font-weight-bolder">
                Date of birth: {moment(dob).format("MM/DD/YYYY")}
              </small>
              <small className="d-inline text-nowrap text-uppercase text-dark ml-4 font-weight-bolder">
                Age: {id}
              </small>
              <small className="d-inline text-nowrap text-uppercase text-dark ml-4 font-weight-bolder">
                Gender: {gender}
              </small>
              <small className="d-inline  text-uppercase text-dark ml-4 font-weight-bolder">
                Insurance: {insurance_name}
              </small>
            </div>

            <div className="col-md-6 col-lg-4 col-xl-2">
              <Space size={"large"}>
                <h6 className="d-inline ">
                  <Tooltip title="Careplan">
                    <a onClick={() => handlecareplancion()}>
                      <i className="fas fa-laptop-medical"></i>
                    </a>
                  </Tooltip>
                </h6>
                {programmId === "2" && (
                  <>
                    <h6 className="d-inline ">
                      <Tooltip title="View CCM Monthly Care Plan">
                        <a
                          onClick={() =>
                            showMonthlyCareplan(questionId, programmId)
                          }
                        >
                          <i className="fas fa-notes-medical"></i>
                        </a>
                      </Tooltip>
                    </h6>
                    <h6 className="d-inline ">
                      <Tooltip title={"Timer"}>
                        <Spin
                          spinning={loader}
                          indicator={<LoadingOutlined />}
                        >
                          <a
                            onClick={() => showTimerModal()}
                            style={{
                              opacity: 1,
                            }}
                          >
                            <i className="fas fa-clock"></i>
                          </a>
                        </Spin>
                      </Tooltip>
                    </h6>
                    {/* {disableFirstSeven === true ? (
                    ): null} */}
                  </>
                )}
              </Space>
            </div>
          </div>
        </div>
        <div
          style={{
            opacity: disableFirstSeven === true ? 0.4 : 1,
            pointerEvents: disableFirstSeven === true ? "none" : "initial",
          }}
        >
          {activeStep === 1 && (
            <FallScreening
              handleNextStep={handleNextStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}

          {activeStep === 2 && (
            <CognitiveAssesment
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 3 && (
            <CaregiverAssessment
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 4 && (
            <OtherProvider
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 5 && (
            <Immunization
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 6 && (
            <Screening
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
              gender={gender}
            />
          )}
        </div>
        {activeStep === 7 && (
          <GeneralAssesment
            handleNextStep={handleNextStep}
            handlePreviousStep={handlePreviousStep}
            saveQuestionairsData={saveQuestionairsData}
            patientdata={patient}
            disableFirstSeven={disableFirstSeven}
          />
        )}

        <div
          style={{
            opacity: disableAfterSeven === true ? 0.4 : 1,
            pointerEvents: disableAfterSeven === true ? "none" : "initial",
          }}
        >
          {activeStep === 8 && (
            <MonthlyAssessment
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
              patientdata={patient}
            />
          )}
          {activeStep === 9 && (
            <Depression
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 10 && (
            <Obesity
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 11 && (
            <ChronicObstructivePulmonaryDisease
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 12 && (
            <CKD
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 13 && (
            <CongestiveHeartFailure
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}

          {activeStep === 14 && (
            <Cholesterol
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
              programmId={programmId}
            />
          )}
          {activeStep === 15 && (
            <Hypertensions
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
          {activeStep === 16 && (
            <DiabetesMellitus
              handleNextStep={handleNextStep}
              handlePreviousStep={handlePreviousStep}
              saveQuestionairsData={saveQuestionairsData}
            />
          )}
        </div>
        <Drawer
          title="Task Timer"
          width={500}
          onClose={onClose}
          open={open}
          maskClosable={false}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="taskType"
                  label="Task Type :"
                // rules={[{ required: true, message: "Task Type is required" }]}
                >
                  <Select placeholder="Select your Task" defaultValue={"Telephone call with patient"}>
                    {taskType?.map((items: any) => {
                      return (
                        <>
                          <Option value={items.name} key={items.id}>
                            {items.name}
                          </Option>
                        </>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="Coordinator"
                  label="Co-ordinator :"
                  rules={coordinatorRules}
                >
                  <Select placeholder="Select your Co-ordinator name" defaultValue={userName}>
                    {coordinator?.map((items: any) => {
                      return (
                        <>
                          <Option value={items.id} key={items.id}>
                            {items.name}
                          </Option>
                        </>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="taskDate"
                  label="Date :"
                  rules={[{ required: true, message: "Date is required" }]}
                >
                  <DatePicker style={{ width: "100%" }} format={"MM/DD/YYYY"} />
                </Form.Item>
                <Form.Item
                  name="taskMin"
                  label="Manual :"
                  rules={[
                    {
                      required: !disablePicker,
                      message: "Manual time is required",
                    },
                  ]}
                >
                  <TimePicker
                    disabled={disablePicker}
                    onOk={() => setDisableTimer(true)}
                    onChange={(e) => {
                      if (e === null) {
                        setDisableTimer(false);
                      }
                    }}
                    style={{ width: "100%" }}
                    format="HH:mm:ss"
                    showNow={false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="taskTimer"
                  label="Timer Watch:"
                  style={{
                    pointerEvents: `${disableTimer === true ? "none" : "visible"
                      }`,
                    opacity: `${disableTimer === true ? "0.5" : "1"}`,
                  }}
                >
                  <div className="stopwatch">
                    <div className="timer">{formatTime(elapsedTime)}</div>
                    <div className="buttons">
                      {isRunning ? null : (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            start();
                          }}
                        >
                          <i className="bx bx-right-arrow"></i> Start
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          stop();
                        }}
                        className={isRunning ? "stop" : ""}
                      >
                        <i className="bx bx-square-rounded"></i> Stop
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          reset();
                        }}
                      >
                        <i className="bx bx-revision"></i> Reset
                      </button>
                    </div>
                  </div>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className="text-right">
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      className="btn-danger"
                      shape="round"
                      onClick={onClose}
                    >
                      Cancel
                    </Button>
                    <Button
                      loading={loader}
                      htmlType="submit"
                      type="primary"
                      className="btn-success text-light"
                      shape="round"
                    >
                      Submit
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Row>
            <Col span={12}>
              <Title level={4}>Total Time: {totalTime}</Title>
            </Col>
            <Col span={12} className="text-right">
              <Title
                level={5}
                className="text-primary"
                underline
                style={{ cursor: "pointer" }}
                italic
                onClick={handleModal}
              >
                {logLoader === true ? "Loading..." : "View Logs"}
              </Title>
            </Col>
          </Row>
        </Drawer>
        <Modal
          title={[
            <>
              <Row>
                <Col span={12}>
                  <Title level={5}>Tasks</Title>
                </Col>
              </Row>
            </>,
          ]}
          open={isModalOpen}
          okButtonProps={{ hidden: true }}
          cancelText={"Close"}
          cancelButtonProps={{ type: "primary" }}
          width={800}
          onCancel={handleCancel}
          closable={false}
          maskClosable={false}
        >
          <Table
            columns={columns}
            loading={{ spinning: logLoader, indicator: antIcon }}
            dataSource={logs}
          />
        </Modal>

        <Modal
          title={[
            <>
              <Row>
                <Col span={12}>
                  <Title level={5}>Update Task</Title>
                </Col>
              </Row>
            </>,
          ]}
          open={editTaskModal}
          okButtonProps={{ hidden: true }}
          width={800}
          closable={false}
          maskClosable={false}
          footer={null}
        >
          <Form layout="vertical" onFinish={handleTaskSubmit} form={form}>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="taskType"
                  label="Task Type :"
                >
                  <Select placeholder="Select your Task">
                    {taskType?.map((items: any) => {
                      return (
                        <>
                          <Option value={items.name} key={items.id} >
                            {items.name}
                          </Option>
                        </>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="Coordinator"
                  label="Co-ordinator :"
                  rules={coordinatorRules}
                >
                  <Select placeholder="Select your Co-ordinator name" >
                    {coordinator?.map((items: any) => {
                      return (
                        <>
                          <Option value={items.id} key={items.id}>
                            {items.name}
                          </Option>
                        </>
                      );
                    })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  name="taskDate"
                  label="Date :"
                  rules={[{ required: true, message: "Date is required" }]}
                >
                  <DatePicker style={{ width: "100%" }} format={"MM/DD/YYYY"} />
                </Form.Item>
                <Form.Item
                  name="taskMin"
                  label="Manual :"
                  rules={[
                    {
                      required: !disablePicker,
                      message: "Manual time is required",
                    },
                  ]}
                >
                  <TimePicker
                    disabled={disablePicker}
                    onOk={() => setDisableTimer(true)}
                    onChange={(e) => {
                      if (e === null) {
                        setDisableTimer(false);
                      }
                    }}
                    style={{ width: "100%" }}
                    format="HH:mm:ss"
                    showNow={false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24} className="text-right">
                <Form.Item>
                  <Space>
                    <Button
                      type="primary"
                      className="btn-danger"
                      shape="round"
                      onClick={closeModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      loading={loader}
                      htmlType="submit"
                      type="primary"
                      className="btn-success text-light"
                      shape="round"
                    >
                      Submit
                    </Button>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>
      </Container>
    </>
  );
};
export default CCM;
