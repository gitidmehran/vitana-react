import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "assets/css/profile.css";

import { PatientType } from "@/Types/PatientType";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import {
  addPatientProfileData,
  setAllQuestion,
  setDateofService,
  setdiagnosis,
  setMonthlyAssessmentId,
  setPatientId,
  setProgramId,
  setQuestionId,
} from "../../../store/reducer/QuestionairesReducer";
import MedicalInfo from "./MedicalInfo/Medicalinfo";
import {
  encounters,
  getprogram,
  patientConsentSubmit,
} from "../../../actions/Patients/PatientActions";
import { OpenNotification } from "./../../../Utilties/Utilties";
import {
  Form,
  Modal,
  Spin,
  Tabs,
  Radio,
  Dropdown,
  Button,
  DatePicker,
  Row,
  Col,
  Select,
  Badge,
} from "antd";
import moment from "moment";
import Profiledata from "./Profiledata/Profiledata";
import { LoadingOutlined, PhoneFilled } from "@ant-design/icons";
import EncounterCareplan from "./encounter/EncounterCareplan";
import CcmMonthlyCarePlan from "./encounter/CcmMonthlyCarePlan";
import CCMEncounterCarePlan from "./encounter/CcmEncounterCareplan";
import { RootState } from "@/store/store";
import PatientCareGaps from "./PatientsCareGaps/PatientCareGaps";
import HistoricalProfile from "./HistoricalProfile/HistoricalProfile";

function Profile({ Patient, program, coordinators }: { Patient: PatientType; program: any, coordinators: any }) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any>([]);
  const [coordinator, setCoordinators] = useState<any>([]);
  const [diagnosis, setDiagnosis] = useState<any>({});
  const [form] = Form.useForm();
  const [openSelection, setOpenSelection] = useState(false);
  const [ccmId, setCcmId] = useState("");
  const [patientConsent, setPatientConsent] = useState<boolean>(false);
  const [showConcent, setShowConcent] = useState<boolean>(false);
  const [disabled, setdisabled] = useState<boolean>(false);
  const [showFields, setShowFields] = useState<boolean>(false);
  const [buttonTitle, setButtonTitle] = useState<boolean>(false);

  // const allowedProgram = JSON.parse(localStorage?.getItem("allowed_program") as any);
  const roleId = localStorage.getItem("role_id");

  let awvGapColor = "";
  let awvGapStatus = "";

  let patientStatus = "";
  let statusColor = "";

  if (Patient.awvGap === "performed") {
    awvGapColor = "green";
    awvGapStatus = "Awv Performed";
  } else if (Patient.awvGap === "scheduled") {
    awvGapColor = "#faad14";
    awvGapStatus = "Awv Scheduled";
  } else if (Patient.awvGap === "not-performed") {
    awvGapColor = "red";
    awvGapStatus = "Awv not Performed";
  }

  if (Patient?.status === 1) {
    patientStatus = "Assigned";
    statusColor = "green";
  } else if (Patient?.status === 2) {
    patientStatus = "Assignable";
    statusColor = "#faad14";
  }



  const { allowedProgram } = useAppSelector(
    (state: RootState) => state.clinicReducer
  );

  const onCreate = (values: any, patient: any) => {
    dispatch(setMonthlyAssessmentId(""))
    const valuess = {
      ...values,
      on_date: values["on_date"]
        ? values["on_date"].format("MM/DD/YYYY")
        : undefined,
    };

    if (patientConsent === false && valuess.modifier === "Annual") {
      const payload = {
        on_date: values["on_date"]
          ? values["on_date"].format("MM/DD/YYYY")
          : undefined,
        coordinator: values["coordinator"] ? values["coordinator"] : "",
        consent_given: values["consent_given"] ? values["consent_given"] : "",
      };
      setLoading(true);
      patientConsentSubmit(patient.id, payload).then(({ data: response }) => {
        if (response.success === true) {
          form.resetFields();
          setLoading(false);
          dispatch(setDateofService(""));
          setOpen(false);
          dispatch(setPatientId(patient.id));
          dispatch(setProgramId("2"));
          if (valuess.modifier === "Annual" && ccmId === "") {
            navigate("/questionaires/create", {
              state: {
                data: patient,
                age: patient.age,
                diagnosis: diagnosis.diagnosis,
                name: patient.name,
                dob: patient.dob,
                gender: patient.gender,
                disableAfterSeven: true,
                insurance_name: patient.insurance_name,
              },
            });
          }
          if (valuess.modifier === "Monthly" && ccmId === "") {
            dispatch(setMonthlyAssessmentId(""))
            navigate("/questionaires/create", {
              state: {
                data: patient,
                age: patient.age,
                diagnosis: diagnosis.diagnosis,
                name: patient.name,
                dob: patient.dob,
                gender: patient.gender,
                disableFirstSeven: true,
                insurance_name: patient.insurance_name,
                monthly_assessment: "1",
              },
            });
          }
          if (valuess.modifier === "Annual" && ccmId !== "") {
            navigate(`/questionaire/edit/${ccmId}`, {
              state: {
                id: ccmId,
                data: patient,
                age: patient.age,
                name: patient.name,
                dob: patient.dob,
                gender: patient.gender,
                disableAfterSeven: true,
                diagnosis: diagnosis.diagnosis,
                insurance_name: patient.insurance_name,
              },
            });
          }
          if (valuess.modifier === "Monthly" && ccmId !== "") {
            navigate(`/questionaire/edit/${ccmId}`, {
              state: {
                id: ccmId,
                data: patient,
                age: patient.age,
                name: patient.name,
                dob: patient.dob,
                gender: patient.gender,
                disableFirstSeven: true,
                diagnosis: diagnosis.diagnosis,
                insurance_name: patient.insurance_name,
                monthly_assessment: "1",
              },
            });
          }
        } else {
          OpenNotification("error", response.message);
        }
      });
    } else {
      dispatch(setDateofService(""));
      setOpen(false);
      dispatch(setPatientId(patient.id));
      dispatch(setProgramId("2"));
      if (valuess.modifier === "Annual" && ccmId === "") {
        navigate("/questionaires/create", {
          state: {
            data: patient,
            age: patient.age,
            diagnosis: diagnosis.diagnosis,
            name: patient.name,
            dob: patient.dob,
            gender: patient.gender,
            disableAfterSeven: true,
            insurance_name: patient.insurance_name,
          },
        });
      }
      if (valuess.modifier === "Monthly" && ccmId === "") {
        navigate("/questionaires/create", {
          state: {
            data: patient,
            age: patient.age,
            diagnosis: diagnosis.diagnosis,
            name: patient.name,
            dob: patient.dob,
            gender: patient.gender,
            disableFirstSeven: true,
            insurance_name: patient.insurance_name,
            monthly_assessment: "1",
          },
        });
      }
      if (valuess.modifier === "Annual" && ccmId !== "") {
        navigate(`/questionaire/edit/${ccmId}`, {
          state: {
            id: ccmId,
            data: patient,
            age: patient.age,
            name: patient.name,
            dob: patient.dob,
            gender: patient.gender,
            disableAfterSeven: true,
            diagnosis: diagnosis.diagnosis,
            insurance_name: patient.insurance_name,
          },
        });
      }
      if (valuess.modifier === "Monthly" && ccmId !== "") {
        navigate(`/questionaire/edit/${ccmId}`, {
          state: {
            id: ccmId,
            data: patient,
            age: patient.age,
            name: patient.name,
            dob: patient.dob,
            gender: patient.gender,
            disableFirstSeven: true,
            diagnosis: diagnosis.diagnosis,
            insurance_name: patient.insurance_name,
            monthly_assessment: "1",
          },
        });
      }
    }
  };

  const handleProgramSelection = (
    programmId: string,
    patient: PatientType,
    index: any
  ) => {
    dispatch(setAllQuestion([] as any));
    if (index === 0) {
      setLoading(true);
      const obj = { program_id: programmId, patient_id: patient.id };
      getprogram(obj).then(({ data: response }) => {
        setLoading(false);
        dispatch(setdiagnosis(response.diagnosis));
        if (response.success === false) {
          OpenNotification("error", response.errors);
        } else {
          setLoading(false);
          const data = { programmId, patient };
          localStorage.setItem("gender", data.patient.gender);
          dispatch(addPatientProfileData(data));
          setDiagnosis(response.diagnosis);

          if (programmId === "1" && response.ccm_id === "") {
            dispatch(setAllQuestion(response.awv_data));
            dispatch(setDateofService(""));
            const last_dos = response.last_awv_dos;

            navigate("/questionaires/create", {
              state: {
                data: patient,
                age: patient.age,
                name: patient.name,
                dob: patient.dob,
                gender: patient.gender,
                insurance_name: patient.insurance_name,
                insurance_provider: patient?.insurance_provider,
                last_dateofService: last_dos,
              },
            });
          }
          if (programmId === "2" && response.ccm_id === "") {
            dispatch(setAllQuestion(response.awv_data));
            dispatch(setDateofService(""));
            navigate("/questionaires/create", {
              state: {
                data: patient,
                age: patient.age,
                diagnosis: response.diagnosis,
                name: patient.name,
                dob: patient.dob,
                gender: patient.gender,
              },
            });
          }
          if (programmId === "2" && response.ccm_id !== "") {
            navigate(`/questionaire/edit/${response.ccm_id}`, {
              state: {
                id: response.ccm_id,
                data: patient,
                age: patient.age,
                name: patient.name,
                dob: patient.dob,
                gender: patient.gender,
                diagnosis: response.diagnosis,
              },
            });
          }
        }
      });
    } else if (index === 1) {
      setLoading(true);
      const obj = { program_id: "2", patient_id: patient.id };
      getprogram(obj).then(({ data: response }) => {
        setLoading(false);
        setCcmId(response.ccm_id);
        dispatch(setProgramId("2"));
        dispatch(setdiagnosis(response.diagnosis));
        dispatch(setAllQuestion(response.awv_data));
        if (response.success === false) {
          OpenNotification("error", response.errors);
        }
        if (response.success === true) {
          setCoordinators(response.coordinator);
          setPatientConsent(response.patient_consent);
          form.resetFields();
          setdisabled(false);
          setShowFields(false);
          setShowConcent(false);
          setOpenSelection(true);
          setButtonTitle(false);
        }
      });
    }
  };

  const handleModal = () => {
    setLoading(true);
    encounters(Patient.id).then(({ data: response }) => {
      setLoading(false);
      setData(response.data);
    });
    setOpen(true);
  };

  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

  const handleOpenEncounter = (
    id: any,
    programmId: any,
    questionId: any,
    date_of_Service: any,
    parent_id: any
  ) => {
    dispatch(setQuestionId(id));
    dispatch(setProgramId(programmId));

    const assessment_id = parent_id !== "" ? parent_id : id;
    const monthly_assessment_id = parent_id !== "" ? id : "";

    if (programmId === 2 && questionId !== undefined) {
      navigate(`/ccm-monthly-careplan/${assessment_id}`, {
        state: {
          questionid: assessment_id,
          dateOfService: date_of_Service,
          monthly_assessment_id: monthly_assessment_id,
        },
      });
    } else if (programmId === 2) {
      navigate(`/ccm-general-careplan/${id}`, {
        state: { questionid: id },
      });
    }
    if (programmId === 1) {
      navigate(`/awvcareplan/${id}`, {
        state: { questionid: id },
      });
    }
  };

  const onCancel = () => {
    setOpenSelection(false);
  };

  const items: any = program.map((items: any, index: any) => {
    const idIndex = Object.values(allowedProgram
    ).indexOf(String(items.id));

    if (idIndex > -1) {
      return {
        label: (
          <span
            onClick={
              items.id === 1 || items.id === 2
                ? () =>
                  handleProgramSelection(
                    items.name === "Chronic Care Management" ? "2" : "1",
                    Patient,
                    index
                  )
                : undefined
            }
          >
            {items.name}
          </span>
        ),
      };
    } else if (roleId === "1" || roleId === "13") {
      return {
        label: (
          <span
            onClick={
              items.id === 1 || items.id === 2
                ? () =>
                  handleProgramSelection(
                    items.name === "Chronic Care Management" ? "2" : "1",
                    Patient,
                    index
                  )
                : undefined
            }
          >
            {items.name}
          </span>
        ),
      };

    }

  });

  const handleValueChange = (e: any) => {
    const { value } = e.target;
    setShowConcent(value === "Annual" && patientConsent === false);
    setdisabled(value === "Annual" && patientConsent === false);
    if (value === "Monthly") {
      setShowFields(false);
      setButtonTitle(false);
      form.setFieldsValue({
        on_date: undefined,
        coordinator: null,
        consent_given: "",
      });
    }
  };

  const handleConcentChange = (e: any) => {
    const { value } = e.target;
    if (value === "Yes") {
      setShowFields(true);
      setdisabled(false);
      setButtonTitle(false);
    }
    if (value === "No") {
      form.setFieldsValue({ on_date: undefined, coordinator: null });
      setdisabled(false);
      setShowFields(false);
      setButtonTitle(true);
    }
  };

  const CustomTab = (
    <span>
      {"Care Gaps"} {<Badge color={Patient.care_gap_status} className={"customBadge"} />}
    </span>
  );

  return (
    <>
      <Modal
        open={openSelection}
        title="Select the CCM Program"
        okText={buttonTitle === true ? "Quit" : "Create"}
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              buttonTitle === true
                ? setOpenSelection(false)
                : onCreate(values, Patient)
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
        okButtonProps={{ disabled: disabled, loading: loading }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{ modifier: "public" }}
        >
          <Form.Item name="modifier">
            <Radio.Group onChange={handleValueChange}>
              <Radio value="Annual">Annual CCM</Radio>
              <Radio value="Monthly">Monthly CCM</Radio>
            </Radio.Group>
          </Form.Item>
          {showConcent === true ? (
            <>
              <Form.Item
                label="Patient informed and consented to the following:"
                labelCol={{ span: 24 }}
              >
                <ul>
                  <li>
                    The eligibility for a new Medicare Program that enables us
                    to oversee chronic conditions and improve overall wellness.
                  </li>
                  <li>
                    Medicare will allow us to bill approximately $62 for these
                    services during any month that we have provided at least 20
                    minutes of non-face-to-face chronic care management
                    services.
                  </li>
                  <li>
                    Medicare will reimburse us approximately $49 and requires
                    you to pay approximately $12 (your Medicare co-insurance
                    amount, mostly covered by your secondary insurance).
                  </li>
                  <li>
                    Only 1 practitioner can furnish and bill CCM services during
                    a calendar month.
                  </li>
                  <li>
                    Patient can stop the CCM services at any time (effective the
                    end of calendar month).
                  </li>
                </ul>
              </Form.Item>

              <Form.Item
                label="Patient agree to participate in the Chronic Care Management Program"
                name="consent_given"
                rules={[
                  { required: true, message: "Please indicate your agreement" },
                ]}
              >
                <Radio.Group onChange={handleConcentChange}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </>
          ) : null}
          {showFields === true ? (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="on_date" label="On">
                    <DatePicker
                      style={{ width: "100%" }}
                      format={"MM/DD/YYYY"}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="coordinator" label="By">
                    <Select placeholder="Select CCM Co-ordinator name">
                      {coordinator &&
                        coordinator.map((items: { id: any; name: string }) => {
                          return (
                            <>
                              <Select.Option value={items.id}>
                                {items.name}
                              </Select.Option>
                            </>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </>
          ) : null}
        </Form>
      </Modal>
      <Modal
        title="Recent Encounters"
        open={open}
        onCancel={() => setOpen(false)}
        width={1500}
        footer={false}
        maskClosable={false}
      >
        <Spin spinning={loading} indicator={antIcon}>
          <Tabs
            defaultActiveKey="0"
            id="tabs_id"
            tabPosition={"left"}
            style={{ height: 500 }}
            items={data?.map((i: any, index: any) => {
              return {
                label: [
                  <>
                    <p className="p-0 m-0" style={{ fontSize: "12px" }}>
                      {i.program_id === 1
                        ? "AWV Annual"
                        : i.questionnaire_id
                          ? "CCM Monthly"
                          : "CCM Annual"}
                      {i.signed_date ? (
                        <i className="fa fa-lock" aria-hidden="true"></i>
                      ) : (
                        ""
                      )}
                    </p>
                    <small>
                      {moment(i.date_of_service).format("MM/DD/YYYY")}
                    </small>
                  </>,
                ],
                key: index,
                children: (
                  <div style={{ height: 500, overflow: "scroll" }}>
                    <Button
                      size="middle"
                      type="primary"
                      onClick={() =>
                        handleOpenEncounter(
                          i.id,
                          i.program_id,
                          i.questionnaire_id,
                          i.date_of_service,
                          i.parent_id
                        )
                      }
                    >
                      Open this encounter
                    </Button>
                    {i.program_id === 1 ? (
                      <EncounterCareplan questionId={i.id} />
                    ) : i.questionnaire_id ? (
                      <CcmMonthlyCarePlan questionIds={i.questionnaire_id} />
                    ) : (
                      <CCMEncounterCarePlan questionIds={i.id} />
                    )}
                  </div>
                ),
              };
            })}
          />
        </Spin>
      </Modal>
      <ul className="nav nav-bar" id="navId">
        <li className="nav-item mt-2">
          <h3 className="m-0 mr-5">
            <i className="fa fa-user-circle fa-2x  " aria-hidden="true" />
          </h3>
        </li>
        <li className="nav-item">
          <p className="nav-link text-dark text-uppercase   mt-3">
            <b>{Patient.name}</b>
          </p>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase  m-0 ">
            S. No.
            <span className="ml-2">
              {Patient.identity}
            </span>
          </span>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase m-0">
            <PhoneFilled className="customIcon" />
            <span>
              {Patient.contact_no.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
            </span>
          </span>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase m-0">
            DOB:
            <span className="ml-2">
              {moment(Patient.dob).format("MM/DD/YYYY")}
            </span>
          </span>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase m-0">
            Age:
            <span className="ml-2">
              {Patient.age}
            </span>
          </span>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase m-0">
            Sex:
            <span className="ml-2">
              {Patient.gender.charAt(0)}
            </span>
          </span>
        </li>
        <li className="nav-item mt-3">
          <span className="nav-link text-dark text-uppercase m-0">
            Insurance:
            <span className="ml-2">
              {Patient.insurance_name}
            </span>
          </span>
        </li>
        <li className="nav-item mt-3">
          <span
            className="nav-link text-dark text-uppercase m-0"
            style={{ cursor: "pointer" }}
            onClick={handleModal}
          >
            <i className="fa fa-history" aria-hidden="true"></i>
          </span>
        </li>
        <li className="nav-item mt-3 ml-3">
          <Spin spinning={loading} indicator={antIcon} className="text-info">
            <Dropdown
              menu={{ items }}
              placement="bottomLeft"
              arrow
              trigger={["click"]}
            >
              <Button size="middle" type="primary">
                Actions
              </Button>
            </Dropdown>
          </Spin>
        </li>
      </ul>

      <div className="container-fluid">
        <div className="row">
          <div className=" col-lg-12 col-xl-12">
            <div className="card-container">
              {patientStatus !== "" ? (
                <>
                  <Badge.Ribbon text={patientStatus} color={statusColor} style={{ marginTop: "-20px", marginRight: "25px" }}>
                  </Badge.Ribbon>
                </>
              ) : null}
              <Badge.Ribbon text={awvGapStatus} color={awvGapColor} style={{ marginTop: "8px", marginRight: "25px" }}>
              </Badge.Ribbon>
              <Tabs size="large" type="line" tabBarGutter={170} defaultActiveKey="item-1">

                <Tabs.TabPane tab={CustomTab} key="item-1" active>
                  <PatientCareGaps patients={Patient} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Medical Information" key="item-2" active>
                  <MedicalInfo patient={Patient} />
                </Tabs.TabPane>

                {/* <Tabs.TabPane tab="Utilization" key="item-3">
                  Content 3
                </Tabs.TabPane> */}

                <Tabs.TabPane tab="Profile" key="item-4" active>
                  <Profiledata patient={Patient} coordinators={coordinators} />
                </Tabs.TabPane>

                <Tabs.TabPane tab="Historical Profile" key="item-5">
                  <HistoricalProfile patients={Patient} />
                </Tabs.TabPane>
              </Tabs>
            </div>
            {/* <Tabs defaultActiveKey="home" className="mb-3 text-info" justify>
              <Tab eventKey="home" title="Medical Informantion">
                <MedicalInfo patient={Patient} />
              </Tab>
              <Tab eventKey="profile" title="Care Gap">
                <h3>hello 2</h3>
              </Tab>
              <Tab eventKey="contact" title="Utilization">
                <h3>hello 3</h3>
              </Tab>
            </Tabs> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
