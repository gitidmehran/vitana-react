import { Input, Form, DatePicker, Spin } from "antd";
import React from "react";
import { Col, Row } from "react-bootstrap";
import { Coordinator, Doctors, PatientType } from "../../../Types/PatientType";
import { Button } from "antd";
import "../../../assets/css/profile.css";
import moment from "moment";

import { Modal } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { patientGroups, patientStatus } from "../../../Constant/constant";

interface Props {
  isOpen: boolean;
  title: string;
  patient: PatientType;
  loading: any;
  insurances: any;
  loadingClc: any;
  doctorsClinic: any;
  doctors: any;
  coordinators: any;
  insurancesCLinic: any;
  clinicList: any;
  disable: any;
  handleChange: (e: any) => void;
  handleClinicChange: (e: any, fromBulk: boolean) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
  handleaddress: (e: any) => void;
  handlezipChange: (e: any) => void;
  handlepatientInfo: (e: any) => void;
  handleMemberId: (e: any) => void;
  handlecellChange: (e: any) => void;
  handledateChanges: (e: any, dateString: any) => void;
}

const PatientForm: React.FC<Props> = ({
  isOpen,
  title,
  patient,
  insurances,
  insurancesCLinic,
  loadingClc,
  doctors,
  coordinators,
  loading,
  clinicList,
  doctorsClinic,
  handleChange,
  handleCloseModel,
  handleSubmit,
  handleClinicChange,
  handlepatientInfo,
  handleMemberId,
  handledateChanges,
  handlezipChange,
  handleaddress,
  handlecellChange,
}) => {
  const dates = { dob: patient?.dob ? moment(patient?.dob) : undefined };
  const years = moment().diff(dates.dob, "years");

  const roleId = localStorage.getItem("role_id");

  const antIcon = <LoadingOutlined style={{ fontSize: 20 }} spin />;

  const clinicIds = JSON.parse(localStorage.getItem("clinic_ids") as any);
  const preferredContact = ["CELL PHONE", "TEXT MESSAGE/ SMS", "EMAIL", "WORK PHONE", "LAND LINE"];

  return (
    <Modal
      width={800}
      closable
      maskClosable={false}
      title={title}
      open={isOpen}
      onCancel={() => handleCloseModel()}
      style={{ zIndex: "1050" }}
      footer={false}
      destroyOnClose
    >
      <form onSubmit={(e) => handleSubmit(e)}>
        <Row>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                First Name
              </label>

              <Input
                type="text"
                className="float-right text-uppercase"
                autoComplete="none"
                placeholder="First Name"
                maxLength={60}
                required
                name="first_name"
                value={patient.first_name}
                style={{ textTransform: "uppercase" }}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Last Name
              </label>
              <Input
                type="text"
                className="float-right text-uppercase"
                autoComplete="none"
                placeholder="Last Name"
                maxLength={60}
                required
                name="last_name"
                value={patient.last_name}
                style={{ textTransform: "uppercase" }}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="">Middle Name</label>
              <Input
                type="text"
                className="float-right text-uppercase"
                autoComplete="none"
                placeholder="Middle Name"
                maxLength={60}
                name="mid_name"
                value={patient.mid_name}
                style={{ textTransform: "uppercase" }}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                DOB
              </label>

              <DatePicker
                onChange={(e, dateString) =>
                  handledateChanges("dob", dateString)
                }
                className="form-control"
                style={{ height: "32px" }}
                value={dates.dob}
                format={"MM/DD/YYYY"}
                placeholder={"MM/DD/YYYY"}
                name="urine_microalbumin_date"
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="">Age</label>
              <Input
                type="text"
                placeholder="Age"
                maxLength={60}
                name="age"
                disabled
                value={years}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Gender
              </label>
              <select
                className="form-control form-control-sm text-uppercase"
                style={{ height: "32px" }}
                name="gender"
                required
                value={patient?.gender?.toUpperCase()}
                onChange={(e: any) => handleChange(e)}
              >
                <option value="" selected disabled className="text-uppercase">
                  Select
                </option>
                <option value="MALE" className="text-uppercase">
                  Male
                </option>
                <option value="FEMALE" className="text-uppercase">
                  Female
                </option>
              </select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col col={12}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Address Line 1
              </label>
              <Input
                type="text"
                className="text-uppercase"
                autoComplete="none"
                placeholder="Address Line 1"
                maxLength={60}
                name="address"
                required
                value={patient.address}
                onChange={(e: any) => handleaddress(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col col={12}>
            <Form.Item>
              <label htmlFor="" className="">
                Address Line 2
              </label>
              <Input
                className="text-uppercase"
                type="text"
                autoComplete="none"
                placeholder="Address Line 2"
                maxLength={60}
                name="address_2"
                value={patient.address_2}
                onChange={(e: any) => handleaddress(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                City
              </label>
              <Input
                type="text"
                className="text-uppercase"
                autoComplete="none"
                placeholder="City"
                maxLength={60}
                name="city"
                value={patient.city}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                State
              </label>
              <Input
                type="text"
                className=" text-uppercase"
                autoComplete="none"
                maxLength={2}
                placeholder="State (2 alpha characters only)"
                name="state"
                required
                value={patient.state}
                onChange={(e: any) => handlepatientInfo(e)}
              />
            </Form.Item>
          </Col>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Zip Code
              </label>
              <Input
                type="tel"
                autoComplete="none"
                name="zipCode"
                maxLength={5}
                pattern="[0-9]{5}"
                placeholder="Five digit zip code"
                required
                value={patient.zipCode}
                onChange={(e: any) => handlezipChange(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col col={6}>
            <Form.Item>
              <label htmlFor="">
                Preferred contact
              </label>
              <select
                className="form-control form-control-sm text-uppercase"
                style={{ height: "32px" }}
                name="preferred_contact"
                defaultValue={patient?.preferred_contact?.toUpperCase()}
                onChange={(e: any) => handleChange(e)}
              >
                <option
                  value=""
                  disabled
                  selected
                  className="text-uppercase"
                >
                  Select
                </option>
                {preferredContact?.map((value: string) => {
                  return (
                    <option key={value}>{value}</option>
                  );
                })}

              </select>
            </Form.Item>
          </Col>
          <Col col={6}>
            <Form.Item>
              <label htmlFor="" className="required-field">
                Phone
              </label>
              <Input
                type="tel"
                autoComplete="none"
                maxLength={12}
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="301-123-4567"
                required
                name="contact_no"
                value={patient.contact_no?.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                onChange={(e: any) => handlecellChange(e)}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col col={6}>
            <Form.Item>
              <label htmlFor="">Cell</label>
              <Input
                type="tel"
                placeholder="301-123-4567"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                autoComplete="none"
                maxLength={12}
                name="cell"
                value={patient.cell?.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3')}
                onChange={(e: any) => handlecellChange(e)}
              />
            </Form.Item>
          </Col>
          <Col col={6}>
            <Form.Item>
              <label htmlFor="">Email</label>
              <Input
                type="email"
                autoComplete="none"
                placeholder="Email"
                maxLength={60}
                name="email"
                className=""
                value={patient?.email}
                onChange={(e: any) => handleChange(e)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          {roleId === "1" || roleId === "13" || clinicIds.length > "1" ? (
            <Col col={4}>
              <Form.Item>
                <label htmlFor="" className="required-field">
                  Clinic
                </label>
                <select
                  style={{ width: "100%" }}
                  name="clinic_id"
                  className="form-control"
                  value={patient?.clinic_id}
                  required
                  onChange={(e) => handleClinicChange(e, false)}
                >
                  <option value="" selected disabled>
                    Select
                  </option>
                  {clinicList?.map((key: { id: any; name: any }) => (
                    <option value={key.id} key={key.id}>
                      {key.name}
                    </option>
                  ))}
                </select>
              </Form.Item>
            </Col>
          ) : null}
          {roleId === "1" || roleId === "13" || clinicIds.length > "1" ? (
            <Col col={4}>
              <Form.Item>
                <label htmlFor="" className="required-field">
                  Primary Care Physician
                </label>
                <Spin spinning={loadingClc} indicator={antIcon}>
                  <select
                    style={{ width: "100%" }}
                    name="doctor_id"
                    required
                    className="form-control text-uppercase"
                    value={patient?.doctor_id}
                    onChange={(e: any) => handleChange(e)}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      className="text-uppercase"
                    >
                      Select
                    </option>
                    {doctorsClinic?.map((doctor: Doctors) => {
                      return (
                        <option
                          value={doctor.id}
                          key={doctor.id}
                          className="text-uppercase"
                        >
                          {doctor.name}
                        </option>
                      );
                    })}
                  </select>
                </Spin>
              </Form.Item>
            </Col>
          ) : (
            <Col col={4}>
              <Form.Item>
                <label htmlFor="" className="required-field">
                  Primary Care Physician
                </label>
                <select
                  style={{ width: "100%" }}
                  name="doctor_id"
                  required
                  className="form-control text-uppercase"
                  value={patient.doctor_id}
                  onChange={(e: any) => handleChange(e)}
                >
                  <option value="" disabled selected className="text-uppercase">
                    Select
                  </option>
                  {doctors?.map((doctor: Doctors) => {
                    return (
                      <option
                        value={doctor.id}
                        key={doctor.id}
                        className="text-uppercase"
                      >
                        {doctor.name}
                      </option>
                    );
                  })}
                </select>
              </Form.Item>
            </Col>
          )}
          {roleId === "1" || clinicIds.length > "1" ? (
            <Col col={4}>
              <Form.Item>
                <label htmlFor="" className="required-field">
                  Insurance
                </label>
                <Spin spinning={loadingClc} indicator={antIcon}>
                  <select
                    style={{ width: "100%" }}
                    name="insurance_id"
                    required
                    className="form-control text-uppercase"
                    value={patient.insurance_id}
                    onChange={(e: any) => handleChange(e)}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      className="text-uppercase"
                    >
                      Select
                    </option>
                    {insurancesCLinic?.map((items: any) => (
                      <option
                        value={items.id}
                        key={items}
                        className="text-uppercase"
                      >
                        {items.name}
                      </option>
                    ))}
                  </select>
                </Spin>
              </Form.Item>
            </Col>
          ) : (
            <Col col={4}>
              <Form.Item>
                <label htmlFor="" className="required-field">
                  Insurance
                </label>
                <select
                  style={{ width: "100%" }}
                  name="insurance_id"
                  required
                  className="form-control text-uppercase"
                  value={patient.insurance_id}
                  onChange={(e: any) => handleChange(e)}
                >
                  <option value="" disabled selected className="text-uppercase">
                    Select
                  </option>
                  {Object.keys(insurances).map((key, i) => (
                    <option value={key} key={i} className="text-uppercase">
                      {insurances[key]}
                    </option>
                  ))}
                </select>
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row>
          <Col col={6}>
            <Form.Item>
              <label>Group</label>
              <select
                name="group"
                className="form-control text-uppercase"
                value={patient?.group}
                onChange={(e: any) => handleChange(e)}
              >
                <option value="" selected className="text-uppercase">
                  Select
                </option>
                {patientGroups?.map((items: any, i) => (
                  <option value={items.id} key={i} className="text-uppercase">
                    {items.label}
                  </option>
                ))}

              </select>
            </Form.Item>
          </Col>

          <Col col={6}>
            <Form.Item>
              <label>Status</label>
              <select
                name="status"
                className="form-control text-uppercase"
                value={patient?.status}
                onChange={(e: any) => handleChange(e)}
              >
                <option value="" selected className="text-uppercase">
                  Select
                </option>
                {patientStatus?.map((items: any, i) => (
                  <option value={items.id} key={i} className="text-uppercase">
                    {items.label}
                  </option>
                ))}

              </select>
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col col={4}>
            <Form.Item>
              <label htmlFor="">
                Member ID
              </label>

              <Input
                type="text"
                className="float-right text-uppercase"
                autoComplete="none"
                placeholder="Member ID"
                maxLength={60}
                name="member_id"
                value={patient.member_id}
                style={{ textTransform: "uppercase" }}
                onChange={(e: any) => handleMemberId(e)}
              />
            </Form.Item>
          </Col>

          <Col col={4}>
            <Form.Item>
              <label htmlFor=""> CCM Coordinator </label>
              <select
                style={{ width: "100%" }}
                name="coordinator_id"
                className="form-control text-uppercase"
                value={patient?.coordinator_id}
                onChange={(e: any) => handleChange(e)}
              >
                <option value="" disabled selected className="text-uppercase">
                  Select
                </option>
                {coordinators?.map((coordinator: Coordinator) => {
                  return (
                    <option
                      value={coordinator.id}
                      key={coordinator.id}
                      className="text-uppercase"
                    >
                      {coordinator.name}
                    </option>
                  );
                })}
              </select>
            </Form.Item>
          </Col>
        </Row>

        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="rounded-pill float-right text-uppercase"
          style={{ fontSize: "12px", marginTop: "6px" }}
        >
          Save
        </Button>
        <Button
          onClick={() => handleCloseModel()}
          className="rounded-pill "
          style={{ fontSize: "12px", marginTop: "6px" }}
        >
          Cancel
        </Button>
      </form>
    </Modal>
  );
};
export default PatientForm;
