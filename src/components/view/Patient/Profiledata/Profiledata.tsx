import { DownloadOutlined } from "@ant-design/icons";
import { Card, Col, Descriptions, Row } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import jsPDF from "jspdf";
import moment from "moment";
import React from "react";

// import { Container } from './styles';
interface props {
  patient: any;
  coordinators: any;
}

const Profiledata: React.FC<props> = ({ patient, coordinators }) => {
  const cordName = coordinators?.filter(
    (item: any) => item.id === patient?.consent_data?.coordinator
  );
  const dateFormat = "MM/DD/YYYY";
  const handleDownload = () => {
    const domElement = document.getElementById("consent");

    const pdf = new jsPDF("l", "px", "a1");
    pdf.html(domElement as HTMLElement, {
      html2canvas: { scale: 1 },
      x: 30,
      y: 10,
      callback: function (pdf) {
        pdf.save("PatientConsent");
      },
    });
  };

  return (
    <>
      <div className="container-fluid">
        <Row gutter={[16, 16]}>
          <Col sm={24} md={24} lg={24}>
            <Card
              className="border-info"
              title={
                <div className="text-center text-dark fa-lg">
                  <span className="">Patient Information</span>
                </div>
              }
            >
              <Descriptions labelStyle={{ fontWeight: "bold" }}>
                <Descriptions.Item label="First Name">
                  {patient?.first_name}
                </Descriptions.Item>
                <Descriptions.Item label="Mid Name">
                  {patient?.mid_name}
                </Descriptions.Item>
                <Descriptions.Item label="Last Name">
                  {patient?.last_name}
                </Descriptions.Item>
                <Descriptions.Item label="Gender">
                  {patient?.gender}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {patient?.contact_no}
                </Descriptions.Item>
                <Descriptions.Item label="Age">
                  {patient?.age}
                </Descriptions.Item>
                <Descriptions.Item label="DOB">
                  {moment(patient?.dob).format(dateFormat)}
                </Descriptions.Item>
                <Descriptions.Item label="Email">
                  {patient?.email}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {patient?.city}
                </Descriptions.Item>
                <Descriptions.Item label="State">
                  {patient?.state}
                </Descriptions.Item>
                <Descriptions.Item label="Identity">
                  {patient?.identity}
                </Descriptions.Item>
                <Descriptions.Item label="ZipCode">
                  {patient?.zipCode}
                </Descriptions.Item>
                <Descriptions.Item label="Doctor name">
                  {patient?.doctor_name}
                </Descriptions.Item>
                <Descriptions.Item label="Address">
                  {patient?.address}
                </Descriptions.Item>
                <Descriptions.Item label="Address 2">
                  {patient?.address_2}
                </Descriptions.Item>
                <Descriptions.Item label="Insurance name">
                  {patient?.insurance_name}
                </Descriptions.Item>
                <Descriptions.Item label="Covered Amount">
                  ${patient?.covered_amount != "" ? patient?.covered_amount : '0.00'}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {patient.patient_consent && (
            <Col sm={24} md={24} lg={24}>
              <Card
                id="consent"
                className="border-info"
                title={
                  <div className="text-center text-dark fa-lg">
                    <span>Patient Consent</span>
                  </div>
                }
                extra={
                  <DownloadOutlined
                    style={{ cursor: "pointer" }}
                    onClick={handleDownload}
                  />
                }
              >
                <Descriptions>
                  <Descriptions.Item
                    className="pl-2"
                    label="Id"
                    labelStyle={{ fontWeight: "bold" }}
                    style={{ fontWeight: "bold" }}
                  >
                    {patient?.identity}
                  </Descriptions.Item>
                  <Descriptions.Item
                    className="pl-2"
                    label="Name"
                    labelStyle={{ fontWeight: "bold" }}
                    style={{ fontWeight: "bold" }}
                  >
                    {patient?.name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    className="pl-2"
                    label="Date of Birth"
                    labelStyle={{ fontWeight: "bold" }}
                    style={{ fontWeight: "bold" }}
                  >
                    {moment(patient?.dob).format("MM/DD/YYYY")}
                  </Descriptions.Item>
                </Descriptions>
                <Paragraph className="p-0 m-0 pl-2 ">
                  Patient informed and consented to the following:
                </Paragraph>
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

                <Descriptions column={{ md: 1, sm: 1, xs: 1 }}>
                  <Descriptions.Item
                    className="pl-2"
                    labelStyle={{ fontWeight: "bold" }}
                    style={{ fontWeight: "bold" }}
                    label="Patient agree to participate in the Chronic Care Management Program"
                  >
                    {patient?.consent_data?.consent_given}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ fontWeight: "bold" }}
                    style={{ fontWeight: "bold" }}
                    className="pl-2"
                    label="Coordinator Name"
                  >
                    {cordName[0]?.name}
                  </Descriptions.Item>
                  <Descriptions.Item
                    labelStyle={{ fontWeight: "bold" }}
                    style={{ fontWeight: "bold" }}
                    className="pl-2"
                    label="Date"
                  >
                    {patient?.consent_data?.on_date}
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </>
  );
};

export default Profiledata;
