import React, { useState, useEffect } from "react";
import "react-dyn-tabs/style/react-dyn-tabs.min.css";
import "react-dyn-tabs/themes/react-dyn-tabs-card.min.css";
import "assets/css/style.css";
import "assets/css/questions_answers.css";
import { Table, Pagination, Input } from "antd";
import ProgramType from "@/Types/ProgramType";
import {
  getProgramList,
  addProgram,
  updateprogram,
  searchprograms,
} from "../../../actions/Program/ProgramActions";
import ProgramFrom from "./Programform/Programform";
import { OpenNotification } from "../../../Utilties/Utilties";
import { LoadingOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../../hooks/hooks";
import { RootState } from "../../../store/store";

function Program() {
  const [program, setProgram] = useState<ProgramType>({} as ProgramType);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [data, setData] = React.useState<any[]>([]);
  const [loading, settLoading] = useState<boolean>(false);
  const [clinics, setClinics] = useState<any>([]);

  const [Newdata, setNewData] = React.useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { Search } = Input;
  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const handleChange = (e: any) => {
    const { value } = e.target;

    setProgram({
      ...program,
      [e.target.name]: value,
    });
  };

  const handleClinicChange = (e: any) => {
    setProgram({
      ...program,
      ["clinic_id"]: e,
    });
  };

  /* Added clinicId as constant to call the api on clinic switch */
  const { clinicId } = useAppSelector(
    (state: RootState) => state.clinicReducer
  );

  useEffect(() => {
    settLoading(true);
    getProgramList(currentPage)
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          setData(response.data);
          setClinics(response.clinic_list);

          setTotalRecords(response.total);
        } else {
          OpenNotification("error", response.message);
        }
      })
      .catch((err) => {
        settLoading(false);

        console.log("error", err);
      });
  }, [currentPage, Newdata, clinicId]);

  const handleSubmit = (e: React.SyntheticEvent) => {
    settLoading(true);

    e.preventDefault();
    if (program.id) {
      updateprogram(program.id, program)
        .then(({ data: response }) => {
          settLoading(false);

          const newdata = [...data];
          const index = data.findIndex((item) => item.id === program.id);
          newdata[index] = response.data;
          setNewData(newdata);
          if (response.success) {
            OpenNotification("success", response.message);

            setIsOpen(false);
          } else {
            OpenNotification("error", response.message);

            alert("Please fill all input data");
          }
        })
        .catch((err) => {
          OpenNotification("error", err.message);
        });
    } else {
      addProgram(program).then(({ data: response }) => {
        settLoading(false);

        setNewData([...data, response.data]);
        if (response.success) {
          setIsOpen(false);
          OpenNotification("success", response.message);
        } else {
          OpenNotification("error", response.message);

          alert("Please fill all input data");
        }
      });
    }
  };

  /* const deleteUserRecord = (id: any) => {
    settLoading(true);
    deleteprogram(id)
      .then(({ data: response }) => {
        if (response.success) {
          settLoading(false);
          OpenNotification("success", response.message);

          const list = data.filter((item) => item.id !== id);
          setData(list);
        } else {
          settLoading(false);
          OpenNotification("error", response.message);

          alert("error deleting record");
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  }; */

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
      title: "Short Name",
      dataIndex: "short_name",
    },

    {
      title: "Action",
      dataIndex: "btn",
      render: (_: any, record: { id: React.SetStateAction<null> }) =>
        data.length >= 1 ? (
          <>
            <div
              className="mr-3 btn btn-info btn-sm cursor-pointer"
              onClick={() => handleEdit(record)}
            >
              Edit
            </div>
            {/* <Popconfirm
              title="Sure to delete?"
              className="btn btn-danger btn-sm"
              onConfirm={() => deleteUserRecord(record.id)}
            >
              Delete
            </Popconfirm> */}
          </>
        ) : null,
    },
  ];

  const handleCloseModel = () => {
    setIsOpen(false);
  };

  const handleFormOpen = () => {
    setProgram({
      id: "",
      name: "",
      short_name: "",
    });
    setTitle("Add Program");
    setIsOpen(true);
  };

  const handleEdit = (data: any) => {
    data = { ...data };
    const clinic = clinics.filter((items: any) =>
      data.clinic_id?.includes(items.id.toString())
    );
    const ids = clinic.map((items: any) => items.id);
    Object.assign(data, { ["clinic_id"]: ids });
    setProgram(data);
    setTitle("Update Program");
    setIsOpen(true);
  };

  const onSearch = (value: any) => {
    settLoading(true);
    searchprograms(value).then(({ data: response }) => {
      settLoading(false);

      setData(response.data);
      setTotalRecords(response.total_records);
    });
  };
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
              <h2>Program</h2>
            </div>
            <div className="col-6 sm-12 ">
              <button
                className="btn btn-info float-right"
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
      <ProgramFrom
        isOpen={isOpen}
        handleCloseModel={handleCloseModel}
        title={title}
        program={program}
        loading={loading}
        clinicList={clinics}
        handleChange={handleChange}
        handleClinicChange={handleClinicChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default Program;
