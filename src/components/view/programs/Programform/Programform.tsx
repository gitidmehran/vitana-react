import { Input, Button, Select } from "antd";
import React from "react";
import { Col, Row, Modal, Form } from "react-bootstrap";
import ProgramType from "../../../../Types/ProgramType";

interface Props {
  isOpen: boolean;
  title: string;
  loading: any;
  clinicList: any;
  program: ProgramType;
  handleChange: (e: any) => void;
  handleClinicChange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
}
const ProgramFrom: React.FC<Props> = ({
  isOpen,
  title,
  program,
  loading,
  clinicList,
  handleChange,
  handleClinicChange,
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
          <Row>
            <Col col={12}>
              <Form.Group>
                <Form.Label className="required-field">Name:</Form.Label>
                <Input
                  placeholder="Name"
                  name="name"
                  value={program.name}
                  type="text"
                  required
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col col={12}>
              <Form.Group>
                <Form.Label className="required-field">Short Name:</Form.Label>
                <Input
                  placeholder="Short Name"
                  name="short_name"
                  value={program.short_name}
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
            </Col>
          </Row>
          {roleId === "1" || roleId === "13" ? (
            <Row>
              <Col col={6}>
                <Form.Group>
                  <Form.Label className="required-field">
                    Clinic Name:
                  </Form.Label>

                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select Clinic"
                    value={program?.clinic_id ? program?.clinic_id : undefined}
                    onChange={(e) => handleClinicChange(e)}
                  >
                    {clinicList.map((key: { id: any; name: any }) => (
                      <option value={key.id} key={key.id}>
                        {key.name}
                      </option>
                    ))}
                  </Select>
                </Form.Group>
              </Col>
            </Row>
          ) : null}
          <br />
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="rounded-pill float-right "
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
    </Modal>
  );
};
export default ProgramFrom;
