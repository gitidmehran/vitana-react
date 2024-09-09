import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Table, Pagination, Modal, Input, message, Form, Switch } from "antd";
/* import saveAs from 'file-saver';
 */
import fileDownload from "js-file-download";

import "../../../assets/css/antd.css";

import {
  getquesList,
  deleteQues,
  searchquestions,
  downloadcareplan,
  downloadsuperBill,
  statusChange,
  downloadMonthlycareplan,
  downloadCcmCareplan,
} from "../../../actions/Questionnaire/questionnaire";
import { useNavigate } from "react-router-dom";
import { OpenNotification } from "./../../../Utilties/Utilties";
import {
  setDateofService,
  setdiagnosis,
  setMonthlyAssessmentId,
  setParentId,
  setProgramId,
  setQuestionId,
} from "../../../store/reducer/QuestionairesReducer";
import { useAppDispatch, useAppSelector } from "./../../../hooks/hooks";
import { Dropdown } from "react-bootstrap";
import Viewquestions from "../PDF/Viewquestion";
import { LoadingOutlined } from "@ant-design/icons";
import { RootState } from "../../../store/store";
import { AWVStatus, CCMStatus } from "../../../Constant/constant";
import CcmMonthlyQuestionnaireDownload from "../PDF/CcmMonthlyQuestionnaireDownload";
import CcmAnnualQuestionnaireDownload from "../PDF/CcmAnnualQuestionnaireDownload";

const Questionaires = () => {
  const [data, setData] = React.useState<any[]>([]);

  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, settLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [opens, setOpens] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [myPatients, setMyPatients] = useState<any>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { Search } = Input;
  const key = "updatable";
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
  const handlestatuschange = (
    e: any,
    record: { id: string; program_id: string; monthly_assessment: string }
  ) => {
    const { value } = e.target;
    const data = {
      selected: value,
      programId: record?.program_id,
      monthlyAssessment: record?.monthly_assessment,
    };
    statusChange(record.id, data).then(({ data: response }) => {
      OpenNotification("success", response.message);
    });
  };

  /* Added clinicId as constant to call the api on clinic switch */
  const { clinicId } = useAppSelector(
    (state: RootState) => state.clinicReducer
  );
  const { monthly_assessment_id, programmId } = useAppSelector(
    (state: RootState) => state.questionairesReduer
  );

  const roleId = localStorage.getItem("role_id");

  useEffect(() => {
    settLoading(true);
    getquesList(search, currentPage, myPatients)
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          const data = response.data;
          setData(
            data?.map(
              (row: {
                dob: any;
                contact_no: any;
                program_name: any;
                patient_id: any;
                id: any;
                patient_name: any;
                serial_no: any;
                date_of_service: any;
                diagnosis: any;
                patient_age: any;
                program_id: any;
                patient_gender: any;
                insurance_name: string;
                signed_date: any;
                status: any;
                monthly_assessment: any;
                parent_id: any;
              }) => ({
                id: row.id,
                patient_name: row.patient_name.toUpperCase(),
                serial_no: row.serial_no,
                patient_age: row.patient_age,
                dob: row.dob,
                patient_gender: row.patient_gender,
                diagnosis: row.diagnosis,
                contact_no: row.contact_no,
                program_name: row.program_name,
                program_id: row.program_id,
                date_of_service: row.date_of_service,
                insurance_name: row.insurance_name,
                signed_date: row.signed_date,
                monthly_assessment: row.monthly_assessment,
                parent_id: row.parent_id,
                status: row.status,
                patient_id: row.patient_id,
              })
            )
          );

          setTotalRecords(response.total_records);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        settLoading(false);
        OpenNotification("error", err);
      });
  }, [currentPage, search, clinicId, myPatients]);

  const showcareplan = (id: string, programmId: string, data: any) => {
    dispatch(setQuestionId(id));
    dispatch(setProgramId(programmId));
    dispatch(setdiagnosis(data.diagnosis));

    if (programmId == "2") {
      navigate(`/ccm-general-careplan/${id}`, {
        state: { questionid: id },
      });
    } else if (programmId == "1") {
      navigate(`/awvcareplan/${id}`, {
        state: { questionid: id },
      });
    }
  };
  const showQuestions = (record: any, programmId: number) => {
    if (programmId === 1) {
      dispatch(setQuestionId(record.id));
      dispatch(setProgramId(String(programmId)));
      navigate(`/view_questions/${record.id}`);
    }

    if (programmId === 2 && record.parent_id === undefined) {
      dispatch(setQuestionId(record.id));
      dispatch(setProgramId(String(programmId)));
      dispatch(setdiagnosis(record.diagnosis));
      navigate(`/view_ccm_annual_questionnaire/${record.id}`);
    }

    if (programmId === 2 && record.parent_id !== undefined) {
      dispatch(setQuestionId(record.id));
      dispatch(setProgramId(String(programmId)));
      dispatch(setdiagnosis(record.diagnosis));
      dispatch(setDateofService(record.date_of_service));
      dispatch(setParentId(record.parent_id));
      navigate(`/view_ccm_monthly_questionnaire/${record.parent_id}`);
    }
  };

  const showMonthlyCareplan = (id: string, programmId: string, data: any) => {
    const assessmentId = data?.parent_id !== undefined ? data.parent_id : id;
    dispatch(setQuestionId(assessmentId));
    dispatch(setProgramId(programmId));
    dispatch(setdiagnosis(data.diagnosis));
    navigate(`/ccm-monthly-careplan/${assessmentId}`, {
      state: {
        questionid: assessmentId,
        monthly_assessment_id: data.monthly_assessment === 1 ? data.id : "",
        dateOfService: data.date_of_service,
      },
    });
  };

  const handleedit = (data: any) => {
    dispatch(setdiagnosis(data.diagnosis));
    dispatch(setDateofService(data.date_of_service));
    dispatch(
      setMonthlyAssessmentId(data.monthly_assessment === 1 ? data.id : "")
    );
    navigate(
      `/questionaire/edit/${data?.parent_id !== undefined ? data.parent_id : data.id
      }`,
      {
        state: {
          id: data?.parent_id !== undefined ? data.parent_id : data.id,
          monthly_assessment_id: data.monthly_assessment === 1 ? data.id : "",
          age: data.patient_age,
          name: data.patient_name,
          dob: data.dob,
          gender: data.patient_gender,
          patientData: data.patient_id,
          insurance_name: data.insurance_name,
          monthly_assessment: data.monthly_assessment,
          disableFirstSeven: Boolean(data.monthly_assessment === 1),
          disableAfterSeven: Boolean(data.monthly_assessment !== 1),
        },
      }
    );
  };

  const handleBill = (id: any) => {
    navigate(`/questionaire/superbill/${id}`, {
      state: { id: id },
    });
  };

  const deleteUserRecord = (record: any) => {
    settLoading(true);

    const isMonthlyAssessment =
      record?.monthly_assessment !== undefined ? record.monthly_assessment : "";
    const payloadData = {
      monthly_assessment: isMonthlyAssessment,
    };

    deleteQues(record.id, payloadData)
      .then(({ data: response }) => {
        if (response.success) {
          const list = data.filter((item) => item.id !== record.id);
          setData(list);
          settLoading(false);
          OpenNotification("success", response.message);
        } else {
          alert("error deleting record");
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        OpenNotification("error", err);
      });
  };

  const error = (id: any) => {
    Modal.error({
      title: "Are you sure to delete",
      closable: true,
      okText: "Yes",
      onOk() {
        deleteUserRecord(id);
      },
    });
  };

  const columns = [
    {
      title: "Id",
      key: "index",
      render: (text: any, record: any, index: any) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Serial No",
      dataIndex: "serial_no",
    },
    {
      title: "Name",
      dataIndex: "patient_name",
      /*       sorter: (a: any, b: any) => a.patient_name.length - b.patient_name.length,
       */
    },
    {
      title: "Age",
      dataIndex: "patient_age",
    },
    {
      title: "DOB",
      dataIndex: "dob",
    },
    {
      title: "Contact",
      dataIndex: "contact_no",
    },
    {
      title: "Program",
      dataIndex: "program_name",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_: any, record: any) => {
        if (record.program_id === 1) {
          return record.signed_date ? (
            <span className="ml-4" style={{ fontSize: "15px" }}>
              Signed
            </span>
          ) : (
            <select
              title={record.status}
              name=""
              id="input"
              className="form-control h-25"
              onChange={(e) => handlestatuschange(e, record)}
            >
              {AWVStatus?.map((items: any) => {
                return (
                  <>
                    <option
                      key={items.id}
                      value={items.value}
                      selected={Boolean(record.status === items.value)}
                    >
                      {items.name}
                    </option>
                  </>
                );
              })}
            </select>
          );
        } else {
          return (
            <select
              title={record?.status != "" ? record?.status : "Partially Completed"}
              name=""
              id="input"
              className="form-control h-25"
              onChange={(e) => handlestatuschange(e, record)}
            >
              {CCMStatus?.map((items: any) => {
                return (
                  <>
                    <option
                      key={items.id}
                      value={items.value}
                      selected={Boolean(record.status === items.value)}
                    >
                      {items.name}
                    </option>
                  </>
                );
              })}
            </select>
          );
        }
      },
    },
    {
      title: "Date of Service",
      dataIndex: "date_of_service",
    },
    {
      title: "Action",
      dataIndex: "btn",
      render: (_: any, record: any) =>
        data.length >= 1 ? (
          <>
            <Dropdown>
              <Dropdown.Toggle size="sm" variant="info" id="dropdown-basic">
                Actions
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleedit(record)}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item className="m-0" onClick={() => error(record)}>
                  Delete
                </Dropdown.Item>
                <hr className="p-0 m-0" />

                {record?.program_id === 1 ? (
                  <>
                    <Dropdown.Item onClick={() => handleBill(record.id)}>
                      Super Bill
                    </Dropdown.Item>

                    <Dropdown.Item onClick={() => downloadSuperBillpdf(record.id)}>
                      Download Super Bill
                    </Dropdown.Item>
                  </>
                ) : null}
                <hr className="p-0 m-0" />

                {record.program_id === "1" ||
                  (record.monthly_assessment === undefined && (
                    <>
                      <Dropdown.Item
                        onClick={() =>
                          showcareplan(record.id, record.program_id, record)
                        }
                      >
                        View {record.program} Care Plan
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() =>
                          downloadpdf(record.id, record.program_id)
                        }
                      >
                        Download Care Plan
                      </Dropdown.Item>
                    </>
                  ))}

                {record.program_id == "2" &&
                  record?.monthly_assessment == 1 && (
                    <>
                      <hr className="p-0 m-0" />
                      <Dropdown.Item
                        onClick={() =>
                          showMonthlyCareplan(
                            record.id,
                            record.program_id,
                            record
                          )
                        }
                      >
                        View {record.program} Monthly Care Plan
                      </Dropdown.Item>

                      <Dropdown.Item
                        onClick={() => downloadMonthlyCareplanPdf(record)}
                      >
                        Download Monthly Care Plan
                      </Dropdown.Item>
                    </>
                  )}

                <hr className="p-0 m-0" />
                <Dropdown.Item
                  onClick={() => showQuestions(record, record.program_id)}
                >
                  {Number(record.program_id) === Number("2") &&
                    Number(record?.monthly_assessment) === Number("1")
                    ? "View Monthly Questions"
                    : Number(record.program_id) === Number("2")
                      ? "View Annaual Questions"
                      : "View AWV Questions"}
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => showQuestionPdf(record, record.program_id)}
                >
                  {Number(record.program_id) === Number("2") &&
                    Number(record?.monthly_assessment) === Number("1")
                    ? "Download Monthly Questions"
                    : Number(record.program_id) === Number("2")
                      ? "Download Annaual Questions"
                      : "Download AWV Questions"}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </>
        ) : null,
    },
  ];

  const downloadpdf = (id: string, programId: any) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Downloading is in progress..",
      duration: 0,
      style: { marginTop: "40px" },
    });
    if (programId === 2) {
      downloadCcmCareplan(id)
        .then((res) => {

          setTimeout(() => {
            messageApi.open({
              key,
              type: "success",
              content: "Downloaded Successfully!",
              duration: 2,
              style: { marginTop: "40px" },
            });
          }, 1000);
          fileDownload(res.data, "CCMCarePlan.pdf");
        })
        .catch(function (e) {
          OpenNotification("error", e);
        });
    } else {
      downloadcareplan(id)
        .then((res) => {
          setTimeout(() => {
            messageApi.open({
              key,
              type: "success",
              content: "Downloaded Successfully!",
              duration: 2,
              style: { marginTop: "40px" },
            });
          }, 1000);
          fileDownload(res.data, "AwvCarePlan.pdf");
        })
        .catch(function (e) {
          OpenNotification("error", e);
        });
    }
  };

  /* MOnthly Careplan Download */
  const downloadMonthlyCareplanPdf = (record: any) => {
    const id = record?.parent_id !== undefined ? record?.parent_id : record?.id;
    const monthly_assessment_id =
      record?.monthly_assessment === 1 ? record?.id : "";
    const payloadData = {
      monthly_assessment_id: monthly_assessment_id,
      date_of_service: record?.date_of_service,
      monthly_careplan: 1,
    };
    messageApi.open({
      key,
      type: "loading",
      content: "Downloading is in progress..",
      duration: 0,
      style: { marginTop: "40px" },
    });
    downloadMonthlycareplan(id, payloadData)
      .then((res) => {
        setTimeout(() => {
          messageApi.open({
            key,
            type: "success",
            content: "Downloaded Successfully!",
            duration: 2,
            style: { marginTop: "40px" },
          });
        }, 1000);
        fileDownload(res.data, "MonthlyCarePlan.pdf");
      })
      .catch(function (e) {
        OpenNotification("error", e);
      });
  };

  const downloadSuperBillpdf = (id: string) => {
    messageApi.open({
      key,
      type: "loading",
      content: "Downloading is in progress..",
      duration: 0,
      style: { marginTop: "40px" },
    });
    downloadsuperBill(id)
      .then((res) => {
        setTimeout(() => {
          messageApi.open({
            key,
            type: "success",
            content: "Downloaded Successfully!",
            duration: 2,
            style: { marginTop: "40px" },
          });
        }, 1000);
        fileDownload(res.data, "SuperBill.pdf");
      })
      .catch(function (e) {
        OpenNotification("error", e);
      });
  };

  const showQuestionPdf = (record: any, programid: any) => {
    dispatch(setProgramId(programid));
    dispatch(setQuestionId(record.id));
    dispatch(setMonthlyAssessmentId(record.monthly_assessment));
    dispatch(setdiagnosis(record.diagnosis));
    dispatch(setDateofService(record.date_of_service));
    dispatch(setParentId(record.parent_id));
    setOpens(true);
  };

  const onSearch = (value: any) => {
    setSearch(value);
    settLoading(true);
    setCurrentPage(1);
    searchquestions(value).then(({ data: response }) => {
      settLoading(false);
      setData(response.data);
      setTotalRecords(response.total_records);
    });
  };

  function handleRowSelectionChange(e: any) {
    setMyPatients(e === true ? 1 : 0);
  }

  return (
    <>
      {contextHolder}
      <Modal
        open={opens}
        onCancel={() => {
          setOpens(false);
        }}
        footer={false}
        width={2000}
      >
        {Number(programmId) === Number("2") &&
          monthly_assessment_id !== undefined ? (
          <CcmMonthlyQuestionnaireDownload />
        ) : Number(programmId) === Number("2") &&
          monthly_assessment_id === undefined ? (
          <CcmAnnualQuestionnaireDownload />
        ) : (
          <Viewquestions />
        )}
      </Modal>
      <div
        className="container mt-5"
        style={{
          margin: "",
          background: "white",
          padding: "10px",
          borderRadius: "7px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div className="row">
            <div className="col-4 sm-12">
              <h2>Patient Questionnaires</h2>
            </div>
            <div className="col-8 sm-12">
              <Search
                placeholder="Search"
                className="float-right mr-2"
                onSearch={onSearch}
                enterButton
                style={{ width: "auto" }}
              />
              {roleId === "23" ? (
                <Form>
                  <Form.Item label="My patients" className="float-right mr-2">
                    <Switch onChange={(e) => handleRowSelectionChange(e)} />
                  </Form.Item>
                </Form>
              ) : null}
            </div>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            bordered
            pagination={false}
            loading={{ spinning: loading, indicator: antIcon }}
          />
          <br />
          <Pagination
            total={totalRecords}
            current={currentPage}
            pageSize={10}
            showSizeChanger={false}
            onChange={(page: number) => setCurrentPage(page)}
          />
          <br />
        </div>
      </div>
    </>
  );
};
export default Questionaires;
