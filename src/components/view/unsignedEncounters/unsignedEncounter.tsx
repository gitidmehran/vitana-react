import React, { useEffect, useState } from "react";
import { DatePicker, Table, Form, Button, Pagination } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { getUnsignedEncounters } from "../../../actions/unsignedEncounter/UnsignedEncounterAction";
import { OpenNotification } from "../../../Utilties/Utilties";
import moment from "moment";

import { useAppDispatch } from "../../../hooks/hooks";
import {
  setProgramId,
  setQuestionId,
} from "../../../store/reducer/QuestionairesReducer";
import { useNavigate } from "react-router-dom";

function UnsignedEncounter() {
  const [encounter, setEncounters] = useState<any>([]);
  const [provider, setProviders] = useState<any>([]);
  const [values, setValues] = useState<any>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
  const { RangePicker } = DatePicker;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const roleId = localStorage.getItem("role_id");
  const userId = localStorage.getItem("user_id");
  useEffect(() => {
    setLoading(true);
    let data: any = {};
    data = roleId === "21" || roleId === "13"
      ? { provider: values?.provider !== undefined ? Number(values?.provider) : Number(userId), dateRange: values?.dateRange }
      : values;

    data.page_size = pageSize;
    console.log(data);

    getUnsignedEncounters(data, currentPage).then(({ data: response }) => {
      if (response.success === true) {
        const { data, total_records, providers } = response;
        setProviders(providers);
        setTotalRecords(total_records);
        setEncounters(data);
        setLoading(false);
      } else {
        OpenNotification("error", response.message);
      }
    });
  }, [currentPage, values, pageSize]);

  const columns = [
    {
      title: "Id",
      dataIndex: "index",
      render: (text: string, record: any, index: number) =>
        (currentPage - 1) * 10 + index + 1,
    },
    {
      title: "Serial No",
      dataIndex: "serial_no",
      key: "serial_no",
    },
    {
      title: "Name",
      render: (_: string, record: any) => record?.patient.name,
    },
    {
      title: "Dob",
      render: (_: string, record: any) =>
        moment(record?.patient.dob).format("MM/DD/YYYY"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Date of service",
      dataIndex: "date_of_service",
      key: "date_of_service",
      render: (_: string, record: any) =>
        moment(record?.date_of_service).format("MM/DD/YYYY"),
    },
  ];

  const onFinish = (fieldsValue: any) => {
    const rangeValue = fieldsValue["dateRange"];
    const provider = fieldsValue["provider"] ? fieldsValue["provider"] : "";
    const values = {
      provider,
      dateRange: rangeValue
        ? {
          from: rangeValue[0].format("MM/DD/YYYY"),
          to: rangeValue[1].format("MM/DD/YYYY"),
        }
        : {},
    };
    console.log(values);

    setValues(values);
  };
  const handleRowClick = (record: any) => {
    dispatch(setQuestionId(record.id));
    dispatch(setProgramId("1"));
    navigate(`/awvcareplan/${record.id}`, {
      state: { questionid: record.id },
    });
  };
  const dateFormat = "MM/DD/YYYY";

  function handleSizeChange(_: number, size: number) {
    setPageSize(size);
  }

  return (
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
            <h2>Unsigned Encounters</h2>
          </div>
        </div>
        <br />
        <div className="row">
          <div className="col-8 sm-12 ">
            <Form layout="inline" onFinish={onFinish}>
              {roleId === "1" || roleId === String('13') ? (
                <Form.Item name="provider" label="Select Provider">
                  <Select
                    allowClear
                    placeholder="Select"
                    style={{ width: 150 }}
                    options={provider.map((items: any) => {
                      return { value: items.id, label: items.name };
                    })}
                  />
                </Form.Item>
              ) : null}
              <Form.Item name="dateRange" label="Select Date">
                <RangePicker format={dateFormat} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  shape="circle"
                  icon={<SearchOutlined />}
                  htmlType="submit"
                />
              </Form.Item>
            </Form>
          </div>
          {/* <div className="col-4 sm-12 text-right">
            <Button
              type="primary"
              className="btn-success"
              shape="round"
              htmlType="submit"
              onClick={handleClick}
            >
              Export
            </Button>
          </div> */}
        </div>

        <br />
        <div className="row">
          <div className="col-12 sm-12 ">
            <Table
              columns={columns}
              dataSource={encounter}
              bordered
              style={{ cursor: "pointer" }}
              onRow={(record) => {
                return {
                  onClick: () => handleRowClick(record),
                };
              }}
              size="large"
              pagination={false}
              loading={{ spinning: loading, indicator: antIcon }}
            />
            <Pagination
              total={totalRecords}
              current={currentPage}
              pageSize={pageSize}
              onChange={(page: number) => setCurrentPage(page)}
              onShowSizeChange={handleSizeChange}
              hideOnSinglePage
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UnsignedEncounter;
