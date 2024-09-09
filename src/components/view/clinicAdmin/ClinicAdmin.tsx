/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Popconfirm, Table, Pagination, Input /* Input */ } from "antd";
import ClinicType from "@/Types/ClinicAdmin";
import {
  getClinicList,
  addNewClinic,
  updateClinic,
  deleteClinic,
  searchclinicAdmins,
} from /*   searchClinic,
 */ "../../../actions/Clinic/ClinicActions";
import ClinicForm from "./ClinicForm/Clinicform";
import { OpenNotification } from "../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";

function ClinicAdmin() {
  const [user, setUser] = useState<ClinicType>({} as ClinicType);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showDegree, setShowDegree] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, settLoading] = useState<boolean>(false);
  const [Newdata, setNewdata] = React.useState<any[]>([]);
  const [roles, setRoles] = React.useState<any>([]);
  const [Clinics, setClinics] = React.useState<any>([]);
  const [programs, setPrograms] = React.useState<any>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [show, setShow] = useState<any>({
    showelement: true,
    showelement2: true,
  });
  const { Search } = Input;
  const [showPasswordField, setShowPasswordField] = useState<boolean>(true)

  /* Added clinicId as constant to call the api on clinic switch */
  const { clinicId } = useAppSelector(
    (state: RootState) => state.clinicReducer
  );

  const handleChange = (e: any) => {
    const { value } = e.target;

    if (value === '21' || value === '13') {
      setShowDegree(true);
    }

    setUser({
      ...user,
      [e.target.name]: value,
    });
  };
  const handleClinicChange = (e: any) => {
    setUser({
      ...user,
      ["clinic_id"]: e,
    });
  };

  const handleProgramChange = (e: any) => {
    setUser({
      ...user,
      ["program_id"]: e,
    });
  };

  const handleContact = (e: any) => {
    const x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    e.target.value = !x[2]
      ? x[1]
      : +x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    const value = e.target.value;

    setUser({
      ...user,
      [e.target.name]: value,
    });
  };

  useEffect(() => {
    settLoading(true);
    getClinicList(currentPage)
      .then(({ data: response }) => {
        settLoading(false);

        if (response.success) {
          setData(response.data);
          setClinics(response.clinics);
          setPrograms(response.programs);
          setRoles(response.roles_data);
          setTotalRecords(response.total_records);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        OpenNotification("error", err);
        settLoading(false);
      });
  }, [currentPage, Newdata, clinicId]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // settLoading(true);
    const isEmailExist = data.find((items: { email: string }) => items.email === user?.email);
    if (user?.clinic_id && user?.clinic_id.length > 0) {
      if (isEmailExist?.email === undefined) {
        if (user.id) {
          updateClinic(user.id, user)
            .then(({ data: response }) => {
              settLoading(false);

              const newdata = [...data];
              const index = data.findIndex((item) => item.id === user.id);

              newdata[index] = response.data;
              setNewdata(newdata);

              if (response.success) {
                OpenNotification("success", response.message);
                setShowDegree(false);
                setIsOpen(false);
              } else {
                OpenNotification("error", "Please Fill all the required fields");

                alert("Please fill all input data");
              }
            })
            .catch((err) => {
              OpenNotification("error", err.message);
            });
        } else {
          addNewClinic(user).then(({ data: response }) => {
            settLoading(false);

            if (response.success) {
              setNewdata([...data, response.data]);
              setIsOpen(false);
              setShowDegree(false);
              OpenNotification("success", response.message);
            } else {
              OpenNotification("error", response?.errors);
            }
          });
        }
      }
      else {
        settLoading(false);
        OpenNotification("error", "Email Address is Already Registered!");
      }
    }
    else {
      settLoading(false);
      OpenNotification("error", "Clinic Id Is Required!");
    }


  };

  const deleteUserRecord = (id: any) => {
    settLoading(true);
    deleteClinic(id)
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          const list = data.filter((item) => item.id !== id);
          setData(list);
          OpenNotification("success", response.message);
        } else {
          settLoading(false);
          OpenNotification("error", response.message);
          alert("error deleting record");
        }
      })
      .catch((err) => {
        OpenNotification("error", err);
      });
  };

  const columns = [
    {
      title: "Sr",
      render: (text: string, record: any, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Clinic",
      dataIndex: "clinic_name",
      render: (_: any, record: any) => {
        return record.clinic_name.length > 1 ? (
          <li>
            {record.clinic_name[0]}{" "}
            <Tooltip title={record.clinic_name.slice(0 + 1) + ","}>
              (+{record.clinic_name.length - 1})
            </Tooltip>
          </li>
        ) : (
          <span>{record.clinic_name}</span>
        );
      },
    },
    {
      title: "Role",
      dataIndex: "role_name",
    },
    {
      title: "Action",
      dataIndex: "btn",
      render: (_: any, record: { id: any }) =>
        data.length >= 1 ? (
          <>
            <div
              className="mr-3 btn btn-info btn-sm cursor-pointer"
              onClick={() => handleEdit(record)}
            >
              Edit
            </div>
            <Popconfirm
              title="Sure to delete?"
              className="btn btn-danger btn-sm"
              onConfirm={() => deleteUserRecord(record.id)}
            >
              Delete
            </Popconfirm>
          </>
        ) : null,
    },
  ];

  const handleCloseModel = () => {
    setIsOpen(false);
    setShowDegree(false);
  };

  const handleFormOpen = () => {
    setTitle("Add Clinic User");
    setShowPasswordField(true);
    setIsOpen(true);
    setUser({
      id: "",
      first_name: "",
      mid_name: "",
      last_name: "",
      contact_no: "",
      role: "",
      degree: "",
      clinic_id: [],
      program_id: [],
      gender: "",
      email: "",
      password: "",
    });
  };

  const handleEdit = (data: any) => {
    data = { ...data };

    console.log(data);


    const clinics = Clinics.filter((items: any) =>
      data.clinic_id.includes(items.id.toString())
    );
    const programList = programs.filter((items: any) =>
      data.program_id.includes(items.id.toString())
    );
    const ids = clinics.map((items: any) => items.id);
    const programIds = programList.map((items: any) => items.id);

    const showDegreeField = data?.role === 13 || data?.role === 21 ? true : false;

    setShowDegree(showDegreeField);

    Object.assign(data, { ["clinic_id"]: ids, ["program_id"]: programIds });

    setUser(data);
    setShow({
      ...show,
      showelement: false,
    });
    setTitle("Update Clinic User");
    setShowPasswordField(false);
    setIsOpen(true);
  };
  const onSearch = (value: any) => {
    settLoading(true);
    searchclinicAdmins(value).then(({ data: response }) => {
      settLoading(false);

      setData(response.data);
      setTotalRecords(response.total_recordsx);
    });
  };
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  return (
    <>
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
            <div className="col-6 sm-12 ">
              <h2>Clinic Users</h2>
            </div>
            <div className="col-6 sm-12 ">
              <button
                className="btn btn-info float-right "
                style={{ fontSize: "12px" }}
                onClick={() => handleFormOpen()}
              >
                Add New
              </button>
              <Search
                placeholder="Search"
                className="float-right mr-2"
                onSearch={onSearch}
                enterButton
                style={{ width: "auto" }}
              />
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
            onChange={(page: number) => setCurrentPage(page)}
          />
          <br />
        </div>
      </div>
      <ClinicForm
        isOpen={isOpen}
        handleCloseModel={handleCloseModel}
        handleContact={handleContact}
        handleClinicChange={handleClinicChange}
        handleProgramChange={handleProgramChange}
        title={title}
        showPasswordField={showPasswordField}
        loading={loading}
        user={user}
        roles={roles}
        clinic={Clinics}
        programs={programs}
        show={show}
        handleChange={handleChange}
        showDegree={showDegree}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default ClinicAdmin;
