import { insuranceType, providerList } from "./../../../../Constant/constant";
import { Input, Button } from "antd";
import React from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import InsuranceType from "@/Types/Insurance";

interface Props {
  isOpen: boolean;
  title: string;
  loading: any;
  clinicList: any;
  insurance: InsuranceType;
  handleChange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
}
const InsuranceForm: React.FC<Props> = ({
  isOpen,
  title,
  insurance,
  clinicList,
  loading,
  handleChange,
  handleCloseModel,
  handleSubmit,
}) => {
  const handleClose = () => console.log("close");
  const roleId = localStorage.getItem("role_id");

  return (
    <Modal
      show={isOpen}
      onHide={() => handleClose()}
      style={{ zIndex: "1050" }}
    >
      <Modal.Header className="pt-0 bg-info" style={{ color: "white" }}>
        <Modal.Title style={{ fontSize: "18px" }} className="mt-2 mb-2">
          {title}
        </Modal.Title>
        <i
          className="fa fa-times float-right mt-3 cursor-pointer"
          aria-hidden="true"
          onClick={() => handleCloseModel()}
        ></i>
      </Modal.Header>
      <Modal.Body style={{ lineHeight: "1.9rem" }}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <Form.Group>
            <Form.Label className="required-field">Full Name:</Form.Label>
            <Input
              placeholder="Full Name"
              name="name"
              value={insurance.name}
              type="text"
              required
              maxLength={60}
              className="float-right"
              onChange={(e: any) => handleChange(e)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label className="required-field">Short Name:</Form.Label>
            <Input
              placeholder="Short Name"
              name="short_name"
              value={insurance.short_name}
              type="text"
              required
              maxLength={4}
              className="float-right"
              onChange={(e: any) => handleChange(e)}
            />
            <span style={{ color: "gray", fontSize: "12px" }}>
              Note: Max character length is 4.
            </span>
          </Form.Group>
          <Form.Group>
            {(roleId === "1" || roleId === "13") ? (
              <>
                <label htmlFor="" className="required-field">
                  Clinic
                </label>
                <select
                  style={{ width: "100%" }}
                  name="clinic_id"
                  className="form-control"
                  value={insurance?.clinic_id}
                  required
                  onChange={(e) => handleChange(e)}
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
              </>
            ) : null}
          </Form.Group>

          <Row>
            <Col col={6}>
              <Form.Group>
                <label className="required-field">
                  Insurance Type
                </label>
                <select
                  style={{ width: "100%" }}
                  name="type_id"
                  required
                  className="form-control text-uppercase"
                  value={insurance?.type_id}
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
                  {insuranceType?.map((item) => {
                    return (
                      <option
                        value={item.id}
                        key={item.id}
                        className="text-uppercase"
                      >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </Form.Group>
            </Col>

            <Col col={6}>
              <Form.Group>
                <label className="required-field">
                  Insurance Provider
                </label>
                <select
                  style={{ width: "100%" }}
                  name="provider"
                  required
                  className="form-control text-uppercase"
                  value={insurance?.provider}
                  onChange={(e: any) => handleChange(e)}
                >
                  <option value="" disabled selected className="text-uppercase" >
                    Select
                  </option>
                  {providerList?.map((item) => {
                    return (
                      <option value={item.id} key={item.id} className="text-uppercase" >
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </Form.Group>
            </Col>
          </Row>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="rounded-pill float-right"
            style={{ fontSize: "12px", marginTop: "6px" }}
          >
            Save
          </Button>
          <Button
            onClick={() => handleCloseModel()}
            className="rounded-pill"
            style={{ fontSize: "12px", marginTop: "6px" }}
          >
            Cancel
          </Button>
        </form>
      </Modal.Body>
    </Modal >
  );
};
export default InsuranceForm;
