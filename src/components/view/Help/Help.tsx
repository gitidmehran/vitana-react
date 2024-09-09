import { Button, Col, Row } from "antd";
import Title from "antd/lib/typography/Title";
import React from "react";
import Pdf from "../../../assets/Module Guide.pdf";
import PatientPdf from "../../../assets/Patient Module Guide.pdf";
import LoginPdf from "../../../assets/LoginandDashboardGuide.pdf";
import DoctorPdf from "../../../assets/Doctor Module Guide.pdf";
import CCMCORPdf from "../../../assets/CCM Coordinator  Module Guide.pdf";
import ClinicAdminPdf from "../../../assets/Clinic Admin Module Guide.pdf";
import PharmacistPdf from "../../../assets/Pharmacist Module Guide.pdf";
import SuperAdmin from "../../../assets/Super Admin Module Guide.pdf";
import AWVPdf from "../../../assets/AWV Guide.pdf";
import CCMPdf from "../../../assets/CCM Guide.pdf";
import "./help.scss";


const Help = () => {
  const onResumeClick = () => {
    window.open(Pdf);
  };
  const onPatientClick = () => {
    window.open(PatientPdf);
  };
  const onLoginClick = () => {
    window.open(LoginPdf);
  };
  const onAWVPdfClick = () => {
    window.open(AWVPdf);
  };
  const onCCMPdfClick = () => {
    window.open(CCMPdf);
  };
  const DoctorPdfClick = () => {
    window.open(DoctorPdf);
  };
  const CCMCORPdfClick = () => {
    window.open(CCMCORPdf);
  };
  const ClinicAdminPdfClick = () => {
    window.open(ClinicAdminPdf);
  };
  const PharmacistPdfClick = () => {
    window.open(PharmacistPdf);
  };
  const SuperAdminClick = () => {
    window.open(SuperAdmin);
  };
  return (
    <div className="jumbotron bg-white rounded-lg  m-5 p-3">
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={24} md={24} lg={24} xl={12}>
          <Title level={2}>Help Section</Title>
        </Col>
      </Row>
      <br />
      <Row gutter={[20, 80]} className="text-center">
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <h6>Patient Module Guide</h6>
          <Button type="primary" className="rounded" onClick={onPatientClick}>
            {" "}
            Patient Module
          </Button>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <h6>Login and Dashboard Module Guide</h6>
          <Button type="primary" className="rounded" onClick={onLoginClick}>
            {" "}
            Login and Dashboard Module
          </Button>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <h6>Other Modules Guide</h6>
          <Button type="primary" className="rounded" onClick={onResumeClick}>
            {" "}
            Other Modules
          </Button>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <div className="tree">
            <ul>
              <li>
                <a href="#">User Module Guide</a>
                <ul>
                  <li>
                    <a href="#" onClick={SuperAdminClick}>
                      Super Admin
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={ClinicAdminPdfClick}>
                      Clinic Admin
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={CCMCORPdfClick}>
                      CCM Coordinator
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={PharmacistPdfClick}>
                      Pharmacist
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={DoctorPdfClick}>
                      Doctor
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={12} xl={12}>
          <div className="tree">
            <ul>
              <li>
                <a href="#">Programs Module Guide</a>
                <ul>
                  <li>
                    <a href="#" onClick={onAWVPdfClick}>
                      Annual Wellness Visit
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={onCCMPdfClick}>
                      Chronic Care Management
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Help;
