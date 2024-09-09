import { LoadingOutlined } from "@ant-design/icons";
import { OpenNotification } from "../../../Utilties/Utilties";
import { getBillableClaims } from "../../../actions/BillableClaimsAction/BillableClaimAction";
import { Button, Col, DatePicker, Row, Table, Tag, Typography } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
const XLSX = require("xlsx");

export const BillableClaimsList = () => {
  const [data, setData] = useState<any>([]);
  const [dates, setDates] = useState<any>({});
  const [loader, setLoader] = useState<boolean>(false);
  const { Title } = Typography;
  const { RangePicker } = DatePicker;

  useEffect(() => {
    setLoader(true);
    getBillableClaims(dates)
      .then(({ data: response }) => {
        if (response.success === true) {
          setLoader(false);
          setData(response.data);
        } else {
          OpenNotification("error", "Error encountered");
        }
      })
      .catch((e) => {
        OpenNotification("error", e);
      });
  }, [dates]);

  const handleClick = () => {
    const newdata = data.map((record: { diagnosis: any[] }) => {
      return record.diagnosis.map((items: any) =>
        items.toString()
      )
        .join(", ");
    });

    const updatedData = data.map((record: any, index: string | number) => {

      const total_time = moment(record.total_time, "HH:mm:ss");
      const durationInMinutes = total_time.hours() * 60 + total_time.minutes();


      let cptCodes = "";
      if (durationInMinutes >= 20 && durationInMinutes < 40) {
        cptCodes = "99490";
      }
      if (durationInMinutes >= 40 && durationInMinutes < 60) {
        cptCodes = "99490 + 99439";
      }
      if (durationInMinutes >= 60) {
        cptCodes = `99490 + 99439 X 2`;
      }
      return {
        'Serial No': record?.serial_no,
        'Name': record?.patient_name,
        'Age': record?.patient_age,
        'Date of Birth': moment(record?.patient_dob).format('MM/DD/YYYY'),
        'Date of Service': moment(record.date_of_service).format('MM/DD/YYYY'),
        'Total Time': record?.total_time,
        'Cpt Codes': cptCodes,
        'Diagnosis': newdata[index],
      };
    });
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(updatedData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Encounters");
    XLSX.writeFile(workbook, "Encounters.xlsx");
  };

  const columns = [
    {
      title: "Id",
      width: 50,
      render: (text: string, record: any, index: number) => index + 1,
    },
    {
      title: "Serial No",
      dataIndex: "serial_no",
      key: "serial_no",
      width: 100,
    },
    {
      title: "Name",
      render: (_: string, record: any) => {
        return <span>{record?.patient_name}</span>;
      },
    },
    {
      title: "Age",
      render: (_: string, record: any) => record?.patient_age,
    },
    {
      title: "DOB",
      render: (_: string, record: any) =>
        moment(record?.patient_dob).format("MM/DD/YYYY"),
    },
    {
      title: "Date of service",
      dataIndex: "date_of_service",
      render: (_: string, record: any) =>
        moment(record?.date_of_service).format("MM/DD/YYYY"),
    },
    {
      title: "Total time",
      dataIndex: "total_time",
    },
    {
      title: "Diagnosis",
      dataIndex: "diagnosis",
      render: (_: string, record: any) =>
        record?.diagnosis?.map((items: any) => {
          return (
            <>
              <Tag
                style={{ borderRadius: 20, fontSize: 10, lineHeight: "15px" }}
                color="#108ee9"
              >
                {items}
              </Tag>
            </>
          );
        }),
    },
    {
      title: "CPT Codes",
      render: (_: string, record: any) => {
        const total_time = moment(record.total_time, "HH:mm:ss");
        const durationInMinutes =
          total_time.hours() * 60 + total_time.minutes();
        let cptCodes = "";
        if (durationInMinutes >= 20 && durationInMinutes < 40) {
          cptCodes = "99490";
        }
        if (durationInMinutes >= 40 && durationInMinutes < 60) {
          cptCodes = "99490 + 99439";
        }
        if (durationInMinutes >= 60) {
          cptCodes = `99490 + 99439 X 2`;
        }
        return cptCodes;
      },
    },
  ];

  const handleRange = (value: any) => {
    console.log(value);

    if (value !== null) {
      const Object = {
        startDate: value ? value[0].format("MM/DD/YYYY") : "",
        endDate: value ? value[1].format("MM/DD/YYYY") : "",
      };
      setDates(Object);
    } else {
      setDates({});
    }
  };

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
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Title level={2}>Billable Encounters</Title>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={12} className="text-right">
          <RangePicker
            onChange={(val) => handleRange(val)}
            className="mr-3"
            allowClear
            format={"MM/DD/YYYY"}
          />
          <Button
            type="primary"
            className="btn-success"
            shape="round"
            htmlType="submit"
            onClick={handleClick}
          >
            Export
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <Table
            columns={columns}
            dataSource={data}
            loading={{
              spinning: loader,
              indicator: <LoadingOutlined style={{ fontSize: 34 }} spin />,
            }}
          />
        </Col>
      </Row>
    </div>
  );
};
