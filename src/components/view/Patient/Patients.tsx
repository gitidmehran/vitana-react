/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prefer-const */
import React, { useState, useEffect } from "react";
import moment from "moment";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/questions_answers.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Input, Form, Switch, Button, Select, Row, Col, DatePicker, Typography, Tooltip, Spin, Menu, Dropdown as AntDropdown } from "antd";
import { Dropdown } from "react-bootstrap";
import { PatientType, familyprops, Doctors, PatientCareGap } from "@/Types/PatientType";
import {
  getPatientList,
  addNewPatient,
  updatePatient,
  deletePatient,
  searchPatient,
  roleFilter,
  patientBulkAdd,
  patientBulkAssign,
  addCareGapComments,
  updateSingleComment,
  updatePatientCareGap,
  updatePatientGroup,
} from "../../../actions/Patients/PatientActions";
import PatientForm from "./PatientForm";
import { OpenNotification } from "../../../Utilties/Utilties";
import { Modal } from "antd";
import { CloudUploadOutlined, EditOutlined, FileSearchOutlined, LoadingOutlined, MessageOutlined } from "@ant-design/icons";
import { RootState } from "../../../store/store";
import { useAppSelector } from "../../../hooks/hooks";
import AddBulkPatient from "./AddBulkPatient/AddBulkPatient";
import * as XLSX from "xlsx";
import { message } from "antd";
import AssignBulkPatient from "./AssignBulkPatient/AssignBulkPatient";
import { useLocation } from "react-router-dom";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ReactHtmlParser from 'react-html-parser';
import { Option } from "antd/lib/mentions";
import TextArea from "antd/lib/input/TextArea";
import { patientGroups } from "../../../Constant/constant";
import "./Patients.css";
const { Text } = Typography;

function Patients({ openTab }: { openTab: any }) {
  const token = localStorage.getItem("token");
  const { Search } = Input;
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
  const htmlToReact = (html: any) => {
    return ReactHtmlParser(html);
  };
  const { clinicId } = useAppSelector(
    (state: RootState) => state.clinicReducer
  );
  const roleId = localStorage.getItem("role_id");
  const location = useLocation();
  let patientId = location.state?.data;
  let compliantName = location.state?.name;
  const navigateData = location.state?.data;
  let navigateName = location.state?.name;
  const gapName = location.state?.newName;
  const gapValue = location.state?.value;
  const filterStatus = location.state?.filterStatus;
  const careGapId = location.state?.careGapId !== undefined ? location.state?.careGapId : 0;
  const filterYear = location.state?.filterYear !== undefined ? location.state?.filterYear : "";
  const urll = process.env.REACT_APP_API_URL;

  let patientIdProfile = location.state?.patientId !== undefined ? location?.state?.patientId : [];

  if (patientId === undefined) {
    patientId = patientId ?? [];
    compliantName = compliantName ?? '';
  } else {
    if (patientId.length === 0) {
      patientId = undefined;
      compliantName = undefined;
    }
  }

  let findPatientById = patientId?.length > 0 ? patientId : patientIdProfile;
  const [patient, setPatient] = useState<PatientType>({} as PatientType);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isBulkAssign, setIsBulkAssign] = useState<boolean>(false);
  const [getAssigned, setGetAssigned] = useState<boolean>(false);
  const [isBulkOpen, setIsBulkOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [program, setProgram] = React.useState<any[]>([]);
  const [Newdata, setNewdata] = React.useState<any[]>([]);
  const [coordinators, setCoordinators] = React.useState<any[]>([]);
  const [insurances, setInsurances] = React.useState<any>([]);
  const [insurancesCLinic, setInsurancesClinic] = React.useState<any>([]);
  const [doctors, setDoctors] = React.useState<Doctors[]>([]);
  const [doctorsClinic, setDoctorsClinic] = React.useState<Doctors[]>([]);
  // eslint-disable-next-line
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  // eslint-disable-next-line
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [myPatients, setMyPatients] = useState<any>(null);
  const [bulkAssign, setBulkAssign] = useState<any>(null);
  const [loadingClc, setloadingclc] = useState<any>(false);
  const [disable, setdisable] = useState<any>(false);
  const [clinics, setClinics] = useState<any>([]);
  const [family_history, setFamily_history] = useState<familyprops[]>([]);
  const [bulkData, setBulkData] = useState<any>([]);
  const [clinicIds, setClinicIds] = useState<any>(null);
  const [insuranceIds, setInsuranceIds] = useState<any>(null);
  const [errors, setError] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<any>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [isEditComment, setIsEditComment] = useState<boolean>(false);
  const [loaderModalButton, setloaderModalButton] = useState(false);
  const [commentDetails, setCommentDetails] = useState<any[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [editPatientId, setEditPatientId] = useState<number>();
  const [editGapId, setEditGapId] = useState<number>();
  const [isEditSingleComment, setIsEditSingleComment] = useState<boolean>(false);
  const [singleCommentInput, setSingleCommentInput] = useState<string>("");
  const [singleCommentId, setSingleCommentId] = useState<string>("");

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [careGap, setCareGap] = useState<any[]>([]);
  const [isEditBpModal, setIsEditBpModal] = useState<boolean>(false);
  const [isEditBCSModal, setIsEditBCSModal] = useState<boolean>(false);
  const [isEditCCSModal, setIsEditCCSModal] = useState<boolean>(false);
  const [isEditCBPModal, setIsEditCBPModal] = useState<boolean>(false);
  const [isEditHbA1cModal, setIsEditHbA1cModal] = useState<boolean>(false);
  const [isEditHbA1cPoorModal, setIsEditHbA1cPoorModal] = useState<boolean>(false);
  const [isEditScheduleModal, setIsEditScheduleModal] = useState<boolean>(false);
  const [patientDetails, setPatientDetails] = useState<any>({});
  const [payload, setPayload] = useState<any>({});
  const [gapFile, setGapFile] = useState<any>(null);
  const [ccsChangeValue, setCcsChangeValue] = useState<string>("");
  const [ccsStartValue, setCcsStartValue] = useState<string>("");
  const [ccsEndValue, setCcsEndValue] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [editCommentName, setEditCommentName] = useState<string>("");
  const [gapsAsPer, setGapsAsPer] = useState<number>(0);
  const [specificFindPatient, setSpecificFindPatient] = useState<string>(findPatientById);
  const startYear = (moment().startOf("year").format('MM/DD/YYYY') as any);
  const endYear = (moment().endOf("year").format('MM/DD/YYYY') as any);
  const formattedDate = payload?.date ? moment(payload.date, "MM/DD/YYYY") : null;

  useEffect(() => {
    setLoading(true);
    fetchAllPatients();
    setGapsAsPer(careGapId);
  }, [currentPage, Newdata, clinicId, myPatients, bulkAssign, getAssigned]);

  const fetchAllPatients = () => {
    getPatientList(search, currentPage, myPatients, bulkAssign, getAssigned, specificFindPatient, compliantName, careGapId, filterYear)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.success) {
          setCoordinators(response.coordinators);
          setData(response.data);
          setInsurances(response.insurances);
          setDoctors(response.doctors);
          setTotalRecords(response.total_records);
          setClinics(response.clinic_list);
          setProgram(response.programs_list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };


  const reversedDataSource = [...commentDetails].reverse();

  const handleChange = (e: any) => {
    const value = e.target.value.toUpperCase();

    setPatient({
      ...patient,
      [e.target.name]: value,
    });
  };

  const handleCoordinatorChange = (e: any) => {
    const value = e;
    setPatient({
      ...patient,
      ["coordinator_id"]: value,
    });
  };

  const handleClinicChange = (e: any, fromBulk: boolean) => {
    const value = fromBulk ? e : e.target.value.toUpperCase();
    const fieldName = fromBulk ? 'clinic_id' : e.target.name;

    setloadingclc(true);

    roleFilter(value).then(({ data: response }) => {
      setloadingclc(false);

      setDoctorsClinic(response.doctors);
      setInsurancesClinic(response.insurances);
      setClinicIds(value);

      setPatient({
        ...patient,
        [fieldName]: value,
      });
    });
  };

  const handlecellChange = (e: any) => {
    const x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : +x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    const value = e.target.value;
    setPatient({
      ...patient,
      [e.target.name]: value,
    });
  };

  const handlepatientInfo = (e: any) => {
    const value = e.target.value.toUpperCase();
    const re = /^[A-Za-z ]+$/;
    if (value === "" || re.test(value)) {
      setPatient({
        ...patient,
        [e.target.name]: value,
      });
    }
  };

  const handleMemberId = (e: any) => {
    const value = e.target.value.toUpperCase();
    setPatient({
      ...patient,
      [e.target.name]: value,
    });
  }

  const handlezipChange = (e: any) => {
    const value = e.target.value;
    const re = /^[0-9 ]+$/;
    if (value === "" || re.test(value)) {
      setPatient({
        ...patient,
        [e.target.name]: value,
      });
    }
  };

  const handleaddress = (e: any) => {
    const value = e.target.value.toUpperCase();
    const re = /^[A-Za-z0-9 ]+$/;
    if (value === "" || re.test(value)) {
      setPatient({
        ...patient,
        [e.target.name]: value,
      });
    }
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    setLoading(true);

    e.preventDefault();
    if (patient.id) {
      const row = {
        ...patient,
        family_history,
      };
      setLoading(true);

      updatePatient(patient.id, row)
        .then(({ data: response }) => {
          setLoading(false);
          const newdata = [...data];
          const index = data.findIndex((item) => item.id === patient.id);

          newdata[index] = response.data;
          setNewdata(newdata);

          if (response.success) {
            OpenNotification("success", response.message);

            setIsOpen(false);
            setFamily_history([]);
          } else {
            setLoading(false);
            OpenNotification("error", "Please fill all the required fields");

            alert("Please fill all input data");
          }
        })
        .catch((err) => {
          OpenNotification("error", err.message);
        });
    } else {
      const row = {
        ...patient,
        family_history,
      };

      addNewPatient(row).then(({ data: response }) => {
        setLoading(false);

        if (response.success) {
          setNewdata([...data, response.data]);
          setIsOpen(false);
          OpenNotification("success", response.message);
          setFamily_history([]);
        } else {
          OpenNotification("error", "Please fill all the required fields");
          alert("Please fill all input data");
        }
      });
    }
  };

  const deletepatientRecord = (id: any) => {
    setLoading(true);
    deletePatient(id)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.success) {
          const list = data.filter((item) => item.id !== id);
          setData(list);
          OpenNotification("success", response.message);
        } else {
          setLoading(false);
          OpenNotification("error", response.message);
          alert("error deleting record");
        }
      })
      .catch((response) => {
        OpenNotification("error", response.message);
      });
  };


  const handleGroupChange = (value: any, patientobj: any) => {

    const payload = {
      'patient_id': patientobj?.id,
      'group': value,
    }

    updatePatientGroup(payload)
      .then(({ data: response }) => {
        setLoading(false);
        const newdata = [...data];
        const index = data.findIndex((item) => item.id === patientobj.id);


        newdata[index] = response.data;
        setNewdata(newdata);

        if (response.success) {
          OpenNotification("success", response.message);

          setIsOpen(false);
          setFamily_history([]);
        } else {
          setLoading(false);
          OpenNotification("error", "Please fill all the required fields");

          alert("Please fill all input data");
        }
      })
      .catch((err) => {
        OpenNotification("error", err.message);
      });
  };

  const error = (id: any) => {
    Modal.error({
      title: "Are you sure to delete",
      closable: true,
      okText: "Yes",
      onOk() {
        deletepatientRecord(id);
      },
    });
  };

  const handleCommentSave = () => {
    setLoading(true);
    let gap_id = "";

    if (editGapId) {
      gap_id = editGapId.toString();
    } else {
      gap_id = "0";
    }
    if (commentInput !== "" && commentInput !== "<div><br></div>") {
      const payload = {
        ["patient_id"]: editPatientId,
        ["caregap_id"]: gap_id,
        ["caregap_name"]: navigateName,
        ["comment"]: commentInput,
      }
      addCareGapComments(payload).then(({ data: response }) => {
        if (response.success === true) {
          setLoading(false);
          OpenNotification("success", response.message);
          setCommentInput("");
          setCommentDetails([...commentDetails, response?.CommentsData]);
          const item = data.find((i: { id: number }) => i.id === editPatientId);
          const updatedCareGaps = item?.care_gaps_array.map((record: PatientCareGap) => {
            if (record.db_column === navigateName) {
              const updatedComments = [response.CommentsData, ...record.comments];
              return {
                ...record,
                comments: updatedComments,
              };
            }
            return record;
          });
          const newData = [...data];
          const itemIndex = newData.findIndex((i: { id: number }) => i.id === editPatientId);
          if (itemIndex !== -1) {
            newData[itemIndex].care_gaps_array = updatedCareGaps;
          }
        }
      }).catch((response) => {
        OpenNotification("error", response.message);
        setLoading(false);
      });
    } else {
      OpenNotification("error", "No Comment to add");
      setLoading(false);
    }

  };

  const handleCancel = () => {
    setIsEditBpModal(false);
    setIsEditBCSModal(false);
    setIsEditCCSModal(false);
    setIsEditCBPModal(false);
    setIsEditHbA1cModal(false);
    setIsEditHbA1cPoorModal(false);
    setIsEditScheduleModal(false);
    setIsEditComment(false);
    setCommentInput("");
    setPayload({});
    setGapFile(null);
    setFileName("");
  };

  const onChangeCareGap = (careGapId: any, patientid: any, value: any, name: string, insuranceId: number, doctorId: number, clinicId: number, insurance_name: string) => {

    setLoading(true);
    setPayload([]);
    const newPatientDetails = {
      ...patientDetails,
      ["gap_id"]: careGapId,
      ["patient_id"]: patientid,
      ["col_name"]: name,
      ["col_value"]: value,
      ["insurance_id"]: insuranceId,
      ["doctor_id"]: doctorId,
      ["clinic_id"]: clinicId,
      ["insurance_name"]: insurance_name
    }

    setPatientDetails(newPatientDetails);

    const ignoreGaps = [
      'adults_func_gap',
      'post_disc_gap',
      'adults_medic_gap',
      'after_inp_disc_gap',
      'pain_screening_gap',
      'eye_exam_gap',
      'statin_therapy_gap',
      'osteoporosis_mgmt_gap',
    ];

    if ((value === "Compliant" || value === "Pending Visit" && name === "awv_gap") && !ignoreGaps.includes(name)) {
      setLoading(false);
      if (name === "bp_control_gap" && value !== "Scheduled") {
        setIsEditBpModal(true);
      }
      if (name === "breast_cancer_gap" && value !== "Scheduled") {
        setIsEditBCSModal(true);
      }
      if (name === "colorectal_cancer_gap" && value !== "Scheduled") {
        setIsEditCCSModal(true);
      }
      if (name === "high_bp_gap" && value !== "Scheduled") {
        setIsEditCBPModal(true);
      }
      if (name === "hba1c_gap" && value !== "Scheduled") {
        setIsEditHbA1cModal(true);
      }
      if (name === "hba1c_poor_gap" && value !== "Scheduled") {
        setIsEditHbA1cPoorModal(true);
      }
      if (value === "Pending Visit" && name === "awv_gap") {
        setIsEditScheduleModal(true);
      }
    }
    else {
      if (value === "Pending Visit" && name === "awv_gap") {
        setIsEditScheduleModal(true);
        setLoading(false);
      }
      else {
        const datas = {
          ["patient_id"]: patientid,
          ["col_name"]: name,
          ["col_value"]: value,
          ["insurance_id"]: insuranceId,
          ["doctor_id"]: doctorId,
          ["clinic_id"]: clinicId
        }

        let gap_id = "";
        if (careGapId) {
          gap_id = careGapId;
        } else {
          gap_id = "0";
        }
        const newInsName = insurance_name.split(" ");

        updatePatientCareGap(newInsName[0] === "Medicare" || newInsName[1] === "Medicare" || newInsName[0] === "United" || newInsName[0] === "Aetna" ? newInsName[0].toLowerCase() + newInsName[1].toLowerCase() : newInsName[0].toLowerCase(), gap_id, datas).then(({ data: response }) => {
          if (response.success === true) {
            setLoading(false);

            const item = data.find((i: { id: number }) => i.id === patientid);
            const updatedCareGaps = item?.care_gaps_array.map((record: PatientCareGap) => {
              if (record.db_column === navigateName) {
                const updatedDetails = [response?.CareGapsDetailsData, ...record.details];
                let updatedGapStatus = response?.CareGapsDetailsData?.status;
                return {
                  ...record,
                  details: updatedDetails,
                  gap_status: updatedGapStatus,
                };
              }
              return record;
            });
            const newData = [...data];
            const itemIndex = newData.findIndex((i: { id: number }) => i.id === patientid);
            if (itemIndex !== -1) {
              newData[itemIndex].care_gaps_array = updatedCareGaps;
            }
            setData(newData);
            OpenNotification("success", response.message);
          }
        }).catch((response: { message: string; }) => {
          OpenNotification("error", response.message);
          setLoading(false);
        });
      }
    }
  };

  const handleGapFileChange = (e: any) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setGapFile(e.target.files[0]);
    }
    else {
      setFileName("");
      setGapFile(null);
    }
  };

  const disabledDate = (current: any) => {
    const currentDate = moment();
    if (ccsChangeValue === "FOBT/FIT") {
      const startOfYear = (currentDate.clone().startOf('year').format('MM/DD/YYYY') as any);
      const endOfYear = (currentDate.clone().endOf('year').format('MM/DD/YYYY') as any);
      setCcsStartValue(startOfYear);
      setCcsEndValue(endOfYear);
      return current.isBefore(startOfYear) || current.isAfter(endOfYear);
    }
    if (ccsChangeValue === "Colonoscopy") {
      const endOfYear = (currentDate.clone().endOf('year').format('MM/DD/YYYY') as any);
      const tenYearsAgo = (currentDate.clone().subtract(9, 'years').startOf('year').format('MM/DD/YYYY') as any);
      setCcsStartValue(tenYearsAgo);
      setCcsEndValue(endOfYear);
      return current.isBefore(tenYearsAgo) || current.isAfter(currentDate);
    }
    if (ccsChangeValue === "Cologuard") {
      const endOfYear = (currentDate.clone().endOf('year').format('MM/DD/YYYY') as any);
      const threeYearsAgo = (currentDate.clone().subtract(2, 'years').startOf('year').format('MM/DD/YYYY') as any);
      setCcsStartValue(threeYearsAgo);
      setCcsEndValue(endOfYear);
      return current.isBefore(threeYearsAgo) || current.isAfter(currentDate);
    }
  }

  const onChangeDate = (date: any, dateString: any) => {
    const data = {
      ...payload,
      date: dateString
    };
    setPayload(data);
  };

  const handleEditCareGap = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    const data = {
      ...payload,
      [name]: value
    };
    setPayload(data);
  }

  const handleOk = () => {
    setLoading(true);
    let gap_id = "";
    if (patientDetails?.gap_id) {
      gap_id = patientDetails?.gap_id;
    }
    else {
      gap_id = "0";
    }

    const insurance_name = patientDetails?.insurance_name;
    const newInsName = insurance_name.split(" ");
    const newUrl = newInsName[0] === "Medicare" || newInsName[1] === "Medicare" || newInsName[0] === "United" || newInsName[0] === "Healthchoice" && newInsName[1] === "Arizona" ?
      newInsName[0].toLowerCase() + newInsName[1].toLowerCase() :
      newInsName[0].toLowerCase();
    const xhr = new XMLHttpRequest();
    const frmData = new FormData();
    frmData.append("patient_id", patientDetails?.patient_id);
    frmData.append("clinic_id", patientDetails?.clinic_id);
    frmData.append("doctor_id", patientDetails?.doctor_id);
    frmData.append("insurance_id", patientDetails?.insurance_id);
    frmData.append("col_name", patientDetails?.col_name);
    frmData.append("col_value", patientDetails?.col_value);
    frmData.append("caregap_details", JSON.stringify(payload));
    frmData.append("folder_name", "caregaps");
    frmData.append("file", gapFile);
    xhr.responseType = "json";
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && this.status === 200) {
        OpenNotification("success", "Record added successfully");
      }
    });
    const url = `${urll}/${newUrl}/update/${gap_id}`;
    xhr.responseType = "json";
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4 && this.status === 200) {
        setLoading(false);
        setPayload({});
        const item = data.find((i: { id: number }) => i.id === patientDetails?.patient_id);
        const updatedCareGaps = item?.care_gaps_array?.map((record: PatientCareGap) => {
          if (record.db_column === patientDetails?.col_name) {
            const updatedDetails = [this.response.CareGapsDetailsData, ...record.details];
            let updatedGapStatus = [...record.gap_status];
            updatedGapStatus = this.response.CareGapsDetailsData.status;
            return {
              ...record,
              details: updatedDetails,
              gap_status: updatedGapStatus,
            };
          }
          return record;
        });
        const newData = [...data];
        const itemIndex = newData.findIndex((i: { id: number }) => i.id === patientDetails?.patient_id);
        if (itemIndex !== -1) {
          newData[itemIndex].care_gaps_array = updatedCareGaps;
        }

        setData(newData);
        if (this.response.success === true) {
          handleCancel();
          OpenNotification("success", this.response.message);
        } else {
          handleCancel();
          OpenNotification("error", this.response.message);
        }
      }
    });
    xhr.open("POST", url);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("Access-Control-Allow-Origin", `*`);
    xhr.setRequestHeader(
      "access-control-allow-methods",
      `GET, PUT, POST, DELETE, HEAD, OPTIONS`
    );
    if (frmData) {
      xhr.send(frmData);
    }
  };

  const onChangeCCS = (e: any) => {
    const value = e.target.value;
    const data = {
      ...payload,
      ["testType"]: value
    };
    setPayload(data);
    setCcsChangeValue(value);
    const currentDate = moment();
    if (value === "FOBT/FIT") {
      const startOfYear = (moment().startOf("year").format('MM/DD/YYYY') as any);
      const endOfYear = (moment().endOf("year").format('MM/DD/YYYY') as any);
      setCcsStartValue(startOfYear);
      setCcsEndValue(endOfYear);
    }
    if (value === "Colonoscopy") {
      const endOfYear = (moment().endOf("year").format('MM/DD/YYYY') as any);
      const tenYearsAgo = (currentDate.clone().subtract(9, 'years').startOf('year').format('MM/DD/YYYY') as any);
      setCcsStartValue(tenYearsAgo);
      setCcsEndValue(endOfYear);
    }
    if (value === "Cologuard") {
      const endOfYear = (currentDate.clone().endOf('year').format('MM/DD/YYYY') as any);
      const threeYearsAgo = (currentDate.clone().subtract(2, 'years').startOf('year').format('MM/DD/YYYY') as any);
      setCcsStartValue(threeYearsAgo);
      setCcsEndValue(endOfYear);
    }
  }

  const handleEditComments = (comments: any, caregap_column: string, patientId: number, caregapId: number) => {
    setEditPatientId(patientId);
    setEditGapId(caregapId)
    setEditCommentName(caregap_column);
    const tempCommentDetails = comments?.map((item: { caregap_name: string, comment: string, created_user: number, id: number, userinfo: { name: string } }) => {
      return {
        caregap_name: item?.caregap_name,
        comment: item?.comment,
        created_user: item?.created_user,
        id: item?.id,
        userinfo: item?.userinfo
      };
    });
    setCommentDetails(tempCommentDetails);
    setIsEditComment(true);

  }

  const handleCancelComment = () => {
    setIsEditSingleComment(false);
    setSingleCommentInput("");
  };

  // Edit Comment
  const handleSingleCommentSave = () => {
    setLoading(true);
    const payload = {
      ["comment"]: singleCommentInput,
    }

    if (singleCommentInput !== "<div><br></div>") {
      updateSingleComment(singleCommentId, payload).then(({ data: response }) => {
        if (response.success === true) {
          setLoading(false);
          OpenNotification("success", response.message);
          setSingleCommentInput("");
          const item = data.find((i: { id: number }) => i.id === editPatientId);
          const updatedCareGaps = item?.care_gaps_array?.map((record: PatientCareGap) => {
            if (record.db_column === editCommentName) {
              const commentIndex = record.comments.findIndex(comment => comment.id === response.CommentsData.id);

              if (commentIndex !== -1) {
                const updatedComments = [...record.comments];
                updatedComments[commentIndex] = response.CommentsData;
                setCommentDetails(updatedComments);

                return {
                  ...record,
                  comments: updatedComments,
                };
              }
            }
            return record;
          });
          const newData = [...data];
          const itemIndex = newData.findIndex((i: { id: number }) => i.id === editPatientId);
          if (itemIndex !== -1) {
            newData[itemIndex].care_gaps_array = updatedCareGaps;
          }
          setData(newData);
          setIsEditSingleComment(false);
        }
      }).catch((response) => {
        setLoading(false);
        OpenNotification("error", response.message);
      });
    } else {
      OpenNotification("error", "No Comment to add");
      setLoading(false);
    }
  }

  const handleEditSingleComment = (id: string, comment: string) => {
    setSingleCommentInput(comment);
    setSingleCommentId(id);
    setIsEditSingleComment(true);
  }

  const commentColumns = [
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (_: any, record: any) =>
        record ? (
          <>
            <div>{htmlToReact(record?.comment)}
            </div>
            <strong className="float-left" style={{ fontSize: '12px' }}>{record?.userinfo?.name}</strong><strong className="float-right" style={{ fontSize: '12px' }}>{moment(record?.created_at).format('MM/DD/YYYY HH:mm:ss')}</strong>
          </>
        ) : null
    },
    {
      title: 'Action',
      dataIndex: 'id',
      key: 'id',
      width: 70,
      render: (id: string, record: { comment: string }) => {
        return <Button type="ghost" onClick={() => handleEditSingleComment(id, record?.comment)}><EditOutlined /></Button>;
      }
    },
  ];

  function getClassNameForOption(option: any) {
    switch (option) {
      case 'Compliant':
      case 'Completed':
      case 'completed':
        return 'green-option';

      case 'Non-Compliant':
        return 'pink-option';

      case 'Scheduled':
      case 'Pending Visit':
        return 'yellow-option';

      case 'Refusal Reviewed':
      case 'Unable to reach':
      case 'Unable to Reach':
      case 'Changed PCP':
      case 'Deceased':
      case 'need to schedule':
      case 'Left Practice':
      case 'Not In Service':
      case 'Not an Established patient':
        return 'pink-option';

      case 'Patient Refused':
      case 'Refused':
      case 'refused':
        return 'orange-option';

      case 'N/A':
        return 'gray-option';
      default:
        return '';
    }
  }

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
  };

  const startingIndex = (currentPage - 1) * 10 + 1;
  const columns = [
    {
      title: "Id",
      key: "index",
      render: (_: any, record: any, index: number) => startingIndex + index,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: any, index: number) => (
        <>
          <a onClick={() => openTab(record, program, coordinators)}>
            <span className="text-uppercase" id={`${startingIndex + index}`}>{record.name}</span>
          </a>
        </>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact_no",
      render: (text: string) =>
        text?.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
    },

    {
      title: "DOB",
      dataIndex: "dob",
      render: (_: any, record: any) =>
        moment(record.dob).format("MM/DD/YYYY"),
    },
    {
      title: "Age",
      dataIndex: "age",
    },
    {
      title: "Insurance",
      dataIndex: "insurance_name",
    },
    {
      title: "PCP",
      dataIndex: "doctor_name",
      ...(navigateName !== undefined ? {
        sorter: (a: any, b: any) => a?.doctor_name.localeCompare(b?.doctor_name),
      } : {}),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      className: navigateData !== undefined && filterStatus === undefined ? '' : 'hide',
      render: (text: any, record: any) => {
        const getData = record?.care_gaps_array?.find((gap: PatientCareGap) => gap?.db_column === navigateName);
        const selectedValue = getData?.gap_status;
        return (
          <Select
            onChange={(value: any) => onChangeCareGap(getData?.caregap_id, record?.id, value, navigateName, record?.insurance_id, record?.doctor_id, record?.clinic_id, record?.insurance_name)}
            className={`custom-select-class ${getClassNameForOption(selectedValue)}`}
            value={selectedValue}
            disabled={getData?.db_column === "pc_readmissions_gap" ? true : false || (gapsAsPer === 1 ? true : false)}
          >
            {getData?.options?.map((option: string, index: number) => (
              <Option
                key={index.toString()}
                value={option}
                className={`custom-select-option ${getClassNameForOption(option)} ${option === selectedValue ? 'selected-option' : ''}`}
              >
                {option}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      className: navigateData !== undefined && filterStatus === undefined ? '' : 'hide',
      render: (text: any, record: PatientCareGap) => {
        const getData = record?.care_gaps_array?.find((gap: PatientCareGap) => gap?.db_column === navigateName)
        let customClass = "blusComment";
        let lastComment = "";

        if (getData !== undefined && getData !== null) {
          if (getData.comments.length > 0) {
            const dateString = getData.comments[0]?.updated_at;
            const providedDate = moment(dateString);
            const currentDate = moment();
            const weekDiff = Math.round(currentDate.diff(providedDate, "week", true));
            if (weekDiff <= 4) {
              customClass = 'pinkComment';
            } else if (weekDiff > 4 && weekDiff <= 12) {
              customClass = 'yellowComment';
            } else if (weekDiff > 12) {
              customClass = 'greenComment';
            }
            lastComment = getData.comments[0]?.comment !== undefined ? getData.comments[0]?.comment : "";
          }
        }

        return (
          navigateData && !filterStatus ? (
            <Button type="link"
              onClick={() => handleEditComments(getData?.comments, getData?.db_column, record?.id, getData?.caregap_id)}
            >
              <Tooltip placement="topLeft" title={lastComment !== "" ? htmlToReact(lastComment) : ""}>
                <MessageOutlined className={customClass} style={{ fontSize: '16px' }} />
              </Tooltip>
            </Button>
          ) : ""
        )
      },
    },
    {
      title: "Group Status",
      dataIndex: "group",
      render: (text: any, record: any) => {
        return (
          <Select
            onChange={(e: any) => handleGroupChange(e, record)}
            value={record?.group}
            className="groupStatus"
          >
            {patientGroups?.map((items: any, i) => (
              <Option
                key={i.toString()}
                value={items?.id}
                className=''
              >
                {items?.label}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "btn",
      render: (_: any, record: { id: React.SetStateAction<null> }) =>
        data.length >= 1 ? (
          <Dropdown>
            <Dropdown.Toggle variant="info" size="sm" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ margin: 0 }}>
              {/*  <Dropdown.Item>
                <Popconfirm
                  title="Sure to delete?"

                  onConfirm={() => deletepatientRecord(record.id)}
                >
                  Delete
                </Popconfirm>
              </Dropdown.Item> */}
              <Dropdown.Item
                className="m-0"
                onClick={
                  () =>
                    error(record.id) /* () => deletepatientRecord(record.id) */
                }
              >
                Delete
              </Dropdown.Item>
              <Dropdown.Item
                className="mr-3 cursor-pointer"
                onClick={() => handleEdit(record.id, record)}
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                className="mr-3 cursor-pointer"
                onClick={() => openTab(record, program, coordinators)}
              >
                Open Profile
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : null,
    },
  ];

  const handleCloseModel = () => {
    setIsOpen(false);
    setFamily_history([]);
  };

  const handleFormOpen = () => {
    setTitle("Add patient");
    setIsOpen(true);
    setPatient({} as PatientType);
  };
  const handleBulkAssign = () => {
    setTitle("Assign Bulk patient");
    setBulkAssign(1);
    setIsBulkAssign(true);
    setSearch("");
    setSelectedRowKeys([]);
    patient.coordinator_id = "";
  };
  const handleBulkOpen = () => {
    setTitle("Add Bulk patient");
    setBulkData([]);
    setClinicIds(null);
    setIsBulkOpen(true);
    setSearch("");
    setError(false);
    setloaderModalButton(false);
  };
  const setBulkOpen = () => {
    setTitle("Add Bulk patient");
    setIsBulkOpen(false);
  };
  const setAssignBulkOpen = () => {
    setTitle("Add Bulk patient");
    setBulkAssign(null);
    setIsBulkAssign(false);
    setGetAssigned(false);
    setSelectedRowData([]);
    setSelectedRowKeys([]);
    setSearch("");
  };
  const handleOkBulkAssign = () => {
    setTitle("Add Bulk patient");
    const payload = {
      patient_ids: selectedRowData,
      coordinator_id: patient.coordinator_id,
    };
    patientBulkAssign(payload).then(({ data: response }) => {
      if (response.success) {
        setBulkAssign(null);
        setBulkAssign(1);
        fetchAllPatients();
        OpenNotification("success", response.message);
      }
    });
  };

  const handleEdit = (id: any, data: any) => {
    if (data.clinic_id) {
      setloadingclc(true);
      roleFilter(data.clinic_id).then(({ data: response }) => {
        setloadingclc(false);
        setDoctorsClinic(response.doctors);
        setInsurancesClinic(response.insurances);
      });
    }
    const insurance = Object.keys(insurances).find(
      (key) => insurances[key] === data.insurance_name
    );
    setTitle("Update patient");
    setIsOpen(true);
    data = { ...data, insurance };
    setdisable(true);
    setPatient(data);
    setFamily_history(data.family_history);
  };

  /* Calculating patients age from date */
  const onChange = (name: any, value: any) => {
    const years = moment().diff(value, "years");
    setPatient({
      ...patient,
      [name]: value,
      age: years,
    });
  };

  /* Search Patient */
  const onSearch = (value: any) => {
    setLoading(true);
    setSearch(value);
    if (isBulkAssign) {
      setBulkAssign(1);
      searchPatient(value, bulkAssign, getAssigned).then(({ data: response }) => {
        setLoading(false);
        setData(response.data);
        setTotalRecords(response.total_records);
      });
    } else {
      searchPatient(value).then(({ data: response }) => {
        setLoading(false);
        setData(response.data);
        setTotalRecords(response.total_records);
      });
    }
  };

  const handleFileChange = (info: any) => {
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      try {
        const { result } = e.target as any;
        const data = new Uint8Array(result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assuming the first sheet is the one to convert
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false });
        const headers = jsonData[0] as string[];
        const rows = jsonData.slice(1);
        const headerMappings: { [key: string]: string } = {
          member_id: "member_id",
          middle_name: "mid_name",
          patient_full_name: "name",
          address_line_1: "address",
          zip_code: "zipCode",
          phone: "contact_no",
          clinic: "clinic_id",
          primary_care_physician: "doctor_id",
          insurance: "insurance_id",
          dob: "dob", // Assuming "dob" column header
          groups_status: "groups",
          status: "status",
        };
        const jsonDataWithHeaders = rows.map((row: any) => {
          const obj: { [key: string]: any } = {};
          headers.forEach((header, index) => {
            let customHeader = header.replace(/\s/g, "_").toLowerCase();
            // eslint-disable-next-line no-prototype-builtins
            if (headerMappings.hasOwnProperty(customHeader)) {
              customHeader = headerMappings[customHeader];
            }
            if (customHeader === "dob") {
              const serialDate = row[index];
              const dateValue = XLSX.SSF.parse_date_code(serialDate);
              const dob = new Date(
                Date.UTC(dateValue.y, dateValue.m - 1, dateValue.d)
              );
              const formattedDate = dob.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              });
              obj[customHeader] = formattedDate;
            } else {
              obj[customHeader] = row[index];
            }
          });
          return obj;
        });
        setBulkData(jsonDataWithHeaders);
      } catch (error) {
        message.error("Please upload a valid excel file");
      }
    };

    const fileList = info.fileList.slice(-1);

    if (fileList.length > 0) {
      fileReader.readAsArrayBuffer(fileList[0].originFileObj);
    } else {
      setBulkData([]);
    }
  };

  const handleInsuranceBulk = (value: string) => {
    setInsuranceIds(value);
  };

  const handleBulkSubmit = () => {
    setloaderModalButton(true);
    if (!clinicIds) {
      setError(true);
      setloaderModalButton(false);
      return false;
    }
    if (clinicIds) {
      setError(false);
      const payload = {
        clinicIds,
        insuranceIds,
        data: bulkData,
      };
      patientBulkAdd(payload).then(({ data: response }) => {
        if (response.success === true) {
          fetchAllPatients();
          setloaderModalButton(false);
          setIsBulkOpen(false);
          OpenNotification("success", "Bulk patient added successfully");
        }
        else {
          OpenNotification("error", response?.errors);
          setloaderModalButton(false);
        }
      });
    }
  };

  function handleRowSelectionChange(e: any) {
    setMyPatients(e === true ? 1 : 0);
  }

  const handleViewAllPatients = () => {
    setSpecificFindPatient('');
    setSearch("");
    const newsearch = "";
    const newspecificFindPatient = "";
    getPatientList(newsearch, currentPage, myPatients, bulkAssign, getAssigned, newspecificFindPatient, compliantName, careGapId, filterYear)
      .then(({ data: response }) => {
        setLoading(false);
        if (response.success) {
          setCoordinators(response.coordinators);
          setData(response.data);
          setInsurances(response.insurances);
          setDoctors(response.doctors);
          setTotalRecords(response.total_records);
          setClinics(response.clinic_list);
          setProgram(response.programs_list);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }
  const clearSearch = () => {
    // Clear the search value
    setSearch('');
  };

  const handleExportPatients = () => {
    const updatedData = data?.map((record: any) => {
      return {
        'Id': record?.id,
        'Account': record?.identity,
        'Name': record?.name,
        'Contact': record?.contact_no,
        'Date of Birth': moment(record?.dob).format('MM/DD/YYYY'),
        'Age': record?.age,
        'Insurance': record?.insurance_name,
        'Address': record?.address,
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    XLSX.writeFile(workbook, "Patients.xlsx");
  };
  const antMenu = (
    <Menu>
      <Menu.Item key="1">{roleId === "1" || roleId === "13" || roleId === "11" ? (
        <Text
          strong
          style={{ fontSize: "12px" }}
          onClick={() => handleExportPatients()}
        >
          Export
        </Text>
      ) : null}</Menu.Item>
      <Menu.Item key="2">
        {roleId === "1" || roleId === "13" || roleId === "11" ? (
          <Text
            strong
            style={{ fontSize: "12px" }}
            onClick={() => handleBulkAssign()}
          >
            Bulk Assign
          </Text>
        ) : null}
      </Menu.Item>
      <Menu.Item key="3">
        {roleId === "1" || roleId === "13" || roleId === "11" ? (
          <Text
            strong
            style={{ fontSize: "12px" }}
            onClick={() => handleBulkOpen()}
          >
            Add Bulk patient
          </Text>
        ) : null}
      </Menu.Item>
      <Menu.Item key="3"></Menu.Item>
    </Menu>
  );


  return (
    <>
      <div
        className="container "
        style={{
          margin: "",
          background: "white",
          padding: "10px",
          borderRadius: "7px",
        }}
      >
        <div style={{ width: "100%" }}>
          <div className="row">
            <div className="col-5 sm-12 ">
              {
                navigateData && !filterStatus ? (
                  <span style={{ display: 'inline' }}>{gapName !== undefined && ' ' + gapName + ' ' +
                    (gapValue === "ClosedPatients" ? "(Compliant Patients)" : gapValue === "OpenPatients" ? "(Non Compliant Patients)" : gapValue === "ActiveNonComp" ? "(Active Non Compliant)" : gapValue)}
                  </span>
                ) : <h2 style={{ display: 'inline' }}>Patients</h2>
              }
            </div>
            <div className="col-7 sm-12 ">
              <AntDropdown overlay={antMenu} placement="bottomLeft" className="float-right">
                <Button type="primary">Actions</Button>
              </AntDropdown>
              <button
                className="btn btn-info float-right mr-2"
                style={{ fontSize: "12px" }}
                onClick={() => handleFormOpen()}
              >
                Add New
              </button>
              <Search
                placeholder="Search"
                className="float-right mr-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onSearch={onSearch}
                onClick={clearSearch}
                enterButton
                style={{ width: "auto", display: 'inline' }}
              />
              {roleId === "23" ? (
                <Form>
                  <Form.Item label="My patients" className="float-right mr-2">
                    <Switch onChange={(e) => handleRowSelectionChange(e)} />
                  </Form.Item>
                </Form>
              ) : null}
              {roleId !== undefined && (<>
                <Text

                  className=" float-right mr-2"
                  style={{ fontSize: "14px", marginTop: '0.4rem', color: 'blue', cursor: 'pointer' }}
                  onClick={() => handleViewAllPatients()}
                >
                  <FileSearchOutlined style={{ marginTop: '-5px' }} /> View All Patients
                </Text>
              </>)}

            </div>
          </div>
          <Table className={navigateName !== undefined ? "tableHeader" : ""}
            pagination={{
              showSizeChanger: false,
              total: totalRecords,
              showTotal: (totalRecords, range) =>
                `${range[0]}-${range[1]} of ${totalRecords} items`,
            }}
            columns={columns}
            dataSource={data}
            bordered
            loading={{ spinning: loading, indicator: antIcon }}
            {...data.length <= 10 ? { onChange: handleTableChange } : {}}

          />
          {/* <div className="mt-3">
            <Pagination
              total={totalRecords}
              current={currentPage}
              pageSize={10}
              showSizeChanger={false}
              showTotal={_totalRecords => `Total ${_totalRecords} Patients`}
              onChange={(page: number) => setCurrentPage(page)}
            />
          </div> */}
        </div>
      </div>

      <Modal width={800} title="Edit Gap" open={isEditComment} onCancel={handleCancel} onOk={() => handleCommentSave()}>
        <Spin spinning={loading} indicator={antIcon}>
          <Table
            dataSource={reversedDataSource}
            columns={commentColumns}
            pagination={false}
            size="small"
            scroll={{ y: 350, }}
          />
          <SunEditor
            setDefaultStyle="font-family: Arial; font-size: 14px;"
            setContents={commentInput}
            onChange={setCommentInput}
            lang="en"
            height="100"
            setOptions={{
              buttonList: [
                ["font", "fontSize"],
                ["bold", "underline", "italic"],
                ["undo", "redo"],
              ],
              defaultTag: "div",
              minHeight: "100px",
              showPathLabel: false,
            }}
          />
        </Spin>
      </Modal>

      <Modal width={800} title="Edit Comment" open={isEditSingleComment} onCancel={handleCancelComment} onOk={() => handleSingleCommentSave()}>
        <Spin spinning={loading} indicator={antIcon}>
          <SunEditor
            setDefaultStyle="font-family: Arial; font-size: 14px;"
            setContents={singleCommentInput}
            onChange={setSingleCommentInput}
            lang="en"
            height="100"
            setOptions={{
              buttonList: [
                ["font", "fontSize"],
                ["bold", "underline", "italic"],
                ["undo", "redo"],
              ],
              defaultTag: "div",
              minHeight: "100px",
              showPathLabel: false,
            }}
          />
        </Spin>
      </Modal>

      <Modal width={600} title="Complete Blood Pressure Controlled" open={isEditBpModal} onCancel={handleCancel} onOk={() => handleOk()}>
        <Spin spinning={loading} indicator={antIcon}>
          <Row className="mb-2">
            <Col span={24}><Text strong>Date must be after most recent hypertension diagnosis. <br />To close this gap, the screening date must be in the range {startYear} - {endYear}</Text></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Date of BP Measurement:</Col>
            <Col span={6}>
              <DatePicker
                value={formattedDate}
                name="date"
                format="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                onChange={(date, dateString) => onChangeDate("date", dateString)}
                disabledDate={(current) => {
                  const startOfYear = moment().startOf("year");
                  const endOfYear = moment().endOf("year");
                  return current.isBefore(startOfYear) || current.isAfter(endOfYear);
                }}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Systolic BP</Col>
            <Col span={6}>
              <Input type="number" min={1} value={payload?.systolicBp ?? ''} name="systolicBp" onChange={(e: any) => handleEditCareGap(e)} />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Diastolic BP</Col>
            <Col span={6}>
              <Input type="number" min={1} value={payload?.diastolicBp ?? ''} name="diastolicBp" onChange={(e: any) => handleEditCareGap(e)} />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Attatchment (Optional)</Col>
            <Col span={6}><Input type="file" className="InputFileClass" onChange={(e: any) => handleGapFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
          </Row>
        </Spin>
      </Modal>

      <Modal width={600} title="Complete Breast Cancer Screening" open={isEditBCSModal} onCancel={handleCancel} onOk={() => handleOk()}>
        <Spin spinning={loading} indicator={antIcon}>
          <Row className="mb-2">
            <Col span={24}><Text strong>To close this gap, the screening date must be in the range 10-01-2021 - 08-29-2023</Text></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Date of Mammography</Col>
            <Col span={6}>
              <DatePicker
                value={formattedDate}
                name="date"
                format="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                onChange={(date, dateString) => onChangeDate("date", dateString)}
                disabledDate={(current) => {
                  const currentDate = moment();
                  const decemberOfCurrentYear = moment().month(11).endOf('month');
                  const startDate = decemberOfCurrentYear.clone().subtract(27, 'months');
                  return current.isBefore(startDate) || current.isAfter(currentDate);
                }}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Result</Col>
            <Col span={6}>
              <select
                className="form-control form-control-sm"
                placeholder="Select a Status"
                name="result"
                value={payload?.result ?? ''}
                onChange={(e: any) => handleEditCareGap(e)}
              >
                <option value="" disabled>None</option>
                <option value="Abnormal">Abnormal</option>
                <option value="Normal">Normal</option>
              </select>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Attatchment (Optional)</Col>
            <Col span={6}><Input type="file" className="InputFileClass" onChange={(e: any) => handleGapFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
          </Row>
          <Row className="mb-2">
            <Col span={24}>
              <label htmlFor="">Notes (Optional)</label>
              <TextArea value={payload?.notes} name="notes" maxLength={100} onChange={(e: any) => handleEditCareGap(e)} />
            </Col>
          </Row>
        </Spin>
      </Modal>

      <Modal width={600} title="Complete Colorectal Cancer Screening" open={isEditCCSModal} onCancel={handleCancel} onOk={() => handleOk()}>
        <Spin spinning={loading} indicator={antIcon}>
          <Row className="mb-2">
            <Col span={18}>
              <Text >Test Type</Text> <br />
              <Text strong>FOBT/FIT Test: During current calendar year <br />
                Colonoscopy: During current calendar year or 9 years older <br />
                Cologuard: During current calendar year or 2 years older <br />
                To close this gap, the screening date must be in the range {ccsStartValue} - {ccsEndValue}</Text>

            </Col>
            <Col span={6}>
              <select
                className="form-control form-control-sm"
                placeholder="Select a Status"
                name="kidney_health_gap"
                onChange={(e: any) => onChangeCCS(e)}
              >
                <option value="" disabled selected>None</option>
                <option value="FOBT/FIT">FOBT/FIT</option>
                <option value="Colonoscopy">Colonoscopy</option>
                <option value="Cologuard">Cologuard</option>
              </select>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Date of Screening (Select test type to enable date)</Col>
            <Col span={6}>
              <DatePicker
                value={formattedDate}
                name="date"
                format="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                onChange={(date, dateString) => onChangeDate("date5 ", dateString)}
                disabledDate={disabledDate}
                disabled={ccsChangeValue === "" ? true : false}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Test Result</Col>
            <Col span={6}>
              <select
                className="form-control form-control-sm"
                placeholder="Select a Status"
                name="result"
                value={payload?.result ?? ''}
                onChange={(e: any) => handleEditCareGap(e)}
              >
                <option value="" disabled>None</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Attatchment (Optional)</Col>
            <Col span={6}><Input type="file" className="InputFileClass" onChange={(e: any) => handleGapFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
          </Row>
          <Row className="mb-2">
            <Col span={24}>
              <label htmlFor="">Notes (Optional)</label>
              <TextArea value={payload?.notes} name="notes" maxLength={100} onChange={(e: any) => handleEditCareGap(e)} />
            </Col>
          </Row>
        </Spin>
      </Modal>

      <Modal width={600} title="Controlling High Blood Pressure" open={isEditCBPModal} onCancel={handleCancel} onOk={() => handleOk()}>
        <Spin spinning={loading} indicator={antIcon}>
          <Row className="mb-2">
            <Col span={24}><Text strong>Date must be after most recent hypertension diagnosis. <br />To close this gap, the screening date must be in the range {startYear} - {endYear}</Text></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Date of BP Measurement:</Col>
            <Col span={6}>
              <DatePicker
                value={formattedDate}
                name="date"
                format="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                onChange={(date, dateString) => onChangeDate("date", dateString)}
                disabledDate={(current) => {
                  const startOfYear = moment().startOf("year");
                  const endOfYear = moment().endOf("year");
                  return current.isBefore(startOfYear) || current.isAfter(endOfYear);
                }}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Systolic BP</Col>
            <Col span={6}><Input type="number" value={payload?.systolicBp ?? ''} name="systolicBp" onChange={(e: any) => handleEditCareGap(e)} /></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Diastolic BP</Col>
            <Col span={6}><Input type="number" value={payload?.diastolicBp ?? ''} name="diastolicBp" onChange={(e: any) => handleEditCareGap(e)} /></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Attatchment (Optional)</Col>
            <Col span={6}><Input type="file" className="InputFileClass" onChange={(e: any) => handleGapFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
          </Row>
        </Spin>
      </Modal>

      <Modal width={600} title="Complete Diabetic HbA1c < 8%" open={isEditHbA1cModal} onCancel={handleCancel} onOk={() => handleOk()}>
        <Spin spinning={loading} indicator={antIcon}>
          <Row className="mb-2">
            <Col span={24}><Text strong>To close this gap, the screening date must be in the range {startYear} - {endYear}</Text></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Date of HbA1C Test:</Col>
            <Col span={6}>
              <DatePicker
                value={formattedDate}
                name="date"
                format="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                onChange={(date, dateString) => onChangeDate("date", dateString)}
                disabledDate={(current) => {
                  const startOfYear = moment().startOf("year");
                  const endOfYear = moment().endOf("year");
                  return current.isBefore(startOfYear) || current.isAfter(endOfYear);
                }}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Exam Result</Col>
            <Col span={6}><Input type="text" value={payload?.examResult ?? ''} name="examResult" onChange={(e: any) => handleEditCareGap(e)} /></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Attatchment (Optional)</Col>
            <Col span={6}><Input type="file" className="InputFileClass" onChange={(e: any) => handleGapFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
          </Row>
        </Spin>
      </Modal>

      <Modal width={600} title="Complete Diabetic HbA1c Poor > 9%" open={isEditHbA1cPoorModal} onCancel={handleCancel} onOk={() => handleOk()}>
        <Spin spinning={loading} indicator={antIcon}>
          <Row className="mb-2">
            <Col span={24}><Text strong>To close this gap, the screening date must be in the range {startYear} - {endYear}</Text></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Date of HbA1C Test:</Col>
            <Col span={6}>
              <DatePicker
                value={formattedDate}
                name="date"
                format="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                onChange={(date, dateString) => onChangeDate("date", dateString)}
                disabledDate={(current) => {
                  const startOfYear = moment().startOf("year");
                  const endOfYear = moment().endOf("year");
                  return current.isBefore(startOfYear) || current.isAfter(endOfYear);
                }}
              />
            </Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Exam Result</Col>
            <Col span={6}><Input type="text" value={payload?.examResult ?? ''} name="examResult" onChange={(e: any) => handleEditCareGap(e)} /></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Attatchment (Optional)</Col>
            <Col span={6}><Input type="file" className="InputFileClass" onChange={(e: any) => handleFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
          </Row>
        </Spin>
      </Modal>

      <Modal width={600} title="Set Patient Scheduled Date" open={isEditScheduleModal} onCancel={handleCancel} onOk={() => handleOk()}>
        <Spin spinning={loading} indicator={antIcon}>
          <Row className="mb-2">
            <Col span={24}><Text strong>Select a Date for Schedule:</Text></Col>
          </Row>
          <Row className="mb-2">
            <Col span={18}>Date:</Col>
            <Col span={6}>
              <DatePicker
                value={formattedDate}
                name="date"
                format="MM/DD/YYYY"
                placeholder="MM/DD/YYYY"
                onChange={(date, dateString) => onChangeDate("date", dateString)}
                defaultValue={undefined}
                disabledDate={(current) => {
                  const currentDate = moment();
                  return current.isBefore(currentDate);
                }}
              />
            </Col>
          </Row>
        </Spin>
      </Modal>

      <PatientForm
        isOpen={isOpen}
        handleCloseModel={handleCloseModel}
        title={title}
        patient={patient}
        loading={loading}
        doctors={doctors}
        coordinators={coordinators}
        handlepatientInfo={handlepatientInfo}
        handleMemberId={handleMemberId}
        handledateChanges={onChange}
        handlecellChange={handlecellChange}
        handleaddress={handleaddress}
        handlezipChange={handlezipChange}
        insurances={insurances}
        doctorsClinic={doctorsClinic}
        insurancesCLinic={insurancesCLinic}
        handleChange={handleChange}
        handleClinicChange={handleClinicChange}
        handleSubmit={handleSubmit}
        clinicList={clinics}
        disable={disable}
        loadingClc={loadingClc}
      />
      <AddBulkPatient
        title={title}
        bulkData={bulkData}
        clinics={clinics}
        IsOpenBulk={isBulkOpen}
        loader={loaderModalButton}
        handleFileChange={handleFileChange}
        setBulkOpen={setBulkOpen}
        handleBulkSubmit={handleBulkSubmit}
        handleInsuranceBulk={handleInsuranceBulk}
        handleClinicChange={handleClinicChange}
        insurancesCLinic={insurancesCLinic}
        errors={errors}
      />
      <AssignBulkPatient
        title={title}
        isBulkAssign={isBulkAssign}
        getAssigned={getAssigned}
        handleGetAssigned={() => setGetAssigned(!getAssigned)}
        handleBulkAssign={handleBulkAssign}
        setAssignBulkOpen={setAssignBulkOpen}
        handleOkBulkAssign={handleOkBulkAssign}
        data={data}
        loading={loading}
        onSearch={onSearch}
        coordinators={coordinators}
        errors={errors}
        handleCoordinatorChange={handleCoordinatorChange}
        setSelectedRowData={setSelectedRowData}
        setSelectedRowKeys={setSelectedRowKeys}
        selectedRowKeys={selectedRowKeys}
        patient={patient}
      />
    </>
  );
}

export default Patients;
