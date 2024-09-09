import React from "react";
import { Modal, Form, Row, Col } from "react-bootstrap";
import SpecialistType from "@/Types/Specialist";
import { Input, Button } from "antd";
import "../../../../assets/css/profile.css";

interface Props {
  isOpen: boolean;
  title: string;
  loading: any;
  specialist: SpecialistType;
  clinicList: any;
  handleChange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
}
const SpecialistForm: React.FC<Props> = ({
  isOpen,
  title,
  specialist,
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
          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label className="required-field">Name:</Form.Label>
                <Input
                  placeholder="Name"
                  name="name"
                  value={specialist.name}
                  type="text"
                  required
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col>
              <Form.Group>
                <Form.Label className="required-field">Short Name:</Form.Label>
                <Input
                  placeholder="Short Name"
                  name="short_name"
                  value={specialist.short_name}
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

          {roleId === "1" || roleId === "13" && (
            <Row>
              <Col col={12}>
                <Form.Group>
                  <>
                    <label htmlFor="" className="required-field">
                      Clinic
                    </label>
                    <select
                      style={{ width: "100%" }}
                      name="clinic_id"
                      className="form-control"
                      value={specialist?.clinic_id}
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
                </Form.Group>
              </Col>
            </Row>
          )}
          <br />
          <br />
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
            className="rounded-pill "
            style={{ fontSize: "12px", marginTop: "6px" }}
          >
            Cancel
          </Button>
        </form>
      </Modal.Body>
    </Modal>
  );
};
export default SpecialistForm;
