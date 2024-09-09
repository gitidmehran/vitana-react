import React from "react";
import { Col, Row, Modal, Form } from "react-bootstrap";
import ClinicType from "../../../../Types/ClinicAdmin";
import { Input, Button, Select } from "antd";

interface Props {
  isOpen: boolean;
  title: string;
  user: ClinicType;
  show: any;
  handleChange: (e: any) => void;
  handleCloseModel: () => void;
  handleSubmit: (e: any) => void;
  handleContact: (e: any) => void;
  handleClinicChange: (e: any) => void;
  handleProgramChange: (e: any) => void;
  roles: any;
  loading: any;
  clinic: any;
  programs: any;
  showPasswordField: boolean;
  showDegree: boolean;
}
const ClinicForm: React.FC<Props> = ({
  isOpen,
  title,
  user,
  loading,
  handleChange,
  handleCloseModel,
  handleSubmit,
  handleContact,
  handleClinicChange,
  handleProgramChange,
  roles,
  show,
  clinic,
  programs,
  showPasswordField,
  showDegree,
}) => {
  const handleClose = () => console.log("close");

  const roleId = localStorage.getItem("role_id");

  console.log(showDegree, 'showDegree');



  if (roleId !== String(1)) {
    delete roles["1"];
  }
  delete roles["13"];

  return (
    <Modal
      show={isOpen}
      animation={false}
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
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">First Name:</Form.Label>
                <Input
                  placeholder="First Name"
                  name="first_name"
                  value={user?.first_name}
                  type="text"
                  maxLength={60}
                  required
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">last Name:</Form.Label>
                <Input
                  placeholder="Last Name"
                  name="last_name"
                  required
                  value={user?.last_name}
                  type="text"
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Phone </Form.Label>
                <Input
                  placeholder="301-123-4567"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  name="contact_no"
                  value={user?.contact_no}
                  type="text"
                  maxLength={12}
                  className="float-right"
                  required
                  onChange={(e: any) => handleContact(e)}
                />
              </Form.Group>
            </Col>
          </Row>
          {/* //// */}
          <Row>
            <Col col={6}>
              <Form.Group>
                <Form.Label className="required-field">Designation:</Form.Label>
                <select
                  style={{ width: "100%" }}
                  name="role"
                  className="form-control"
                  required
                  onChange={(e) => handleChange(e)}
                  value={user?.role}
                >
                  <option value="" disabled selected>
                    Select
                  </option>
                  {Object.keys(roles).map((key, i) => (
                    <option value={key} key={i}>
                      {roles[key]}
                    </option>
                  ))}
                </select>
              </Form.Group>
            </Col>

            {showDegree === true ? (
              <>
                <Col col={6}>
                  <Form.Group>
                    <Form.Label className="required-field">Degree:</Form.Label>
                    <select
                      style={{ width: "100%" }}
                      name="degree"
                      className="form-control"
                      required
                      onChange={(e) => handleChange(e)}
                      value={user?.degree}
                    >
                      <option value="" disabled selected>
                        Select
                      </option>
                      <option value="MD">MD</option>
                      <option value="PA">PA</option>
                      <option value="DO">DO</option>
                    </select>
                  </Form.Group>
                </Col>
              </>
            ) : null}


          </Row>

          <Row>
            {(roleId === "1" || roleId === "13" || roleId === "11") && (
              <Col col={6}>
                <Form.Group>
                  <Form.Label>
                    Program:
                  </Form.Label>

                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: "100%" }}
                    placeholder="Please select Program"
                    value={user?.program_id ? user?.program_id : undefined}
                    onChange={(e) => handleProgramChange(e)}
                  >
                    {programs?.map((key: { id: any; name: any }) => (
                      <option value={key.id} key={key.id}>
                        {key.name}
                      </option>
                    ))}
                  </Select>
                </Form.Group>
              </Col>
            )}
            {(roleId === "1" || roleId === "13" || (roleId === "11" && clinic.length > "1")) && (
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
                    value={user?.clinic_id ? user?.clinic_id : undefined}
                    onChange={(e) => handleClinicChange(e)}
                  >
                    {clinic.map((key: { id: any; name: any }) => (
                      <option value={key.id} key={key.id}>
                        {key.name}
                      </option>
                    ))}
                  </Select>
                </Form.Group>
              </Col>
            )}
          </Row>

          <Row>
            <Col col={6} className={show}>
              <Form.Group>
                <Form.Label className="required-field">Email:</Form.Label>
                <Input
                  placeholder="abcd@gmail.com"
                  name="email"
                  value={user?.email}
                  type="text"
                  required
                  maxLength={60}
                  className="float-right"
                  onChange={(e: any) => handleChange(e)}
                />
              </Form.Group>
            </Col>
            {showPasswordField === true ? (
              <>
                <Col col={6} className={show}>
                  <Form.Group>
                    <Form.Label className="required-field">Password:</Form.Label>
                    <Input
                      placeholder="Password"
                      name="password"
                      value={user?.password}
                      type="text"
                      required
                      maxLength={60}
                      className="float-right"
                      onChange={(e: any) => handleChange(e)}
                    />
                  </Form.Group>
                </Col>
              </>
            ) :
              (
                <>
                  <Col col={6} className={show}>
                    <Form.Group>
                      <Form.Label>Password:</Form.Label>
                      <Input
                        placeholder="Password"
                        name="password"
                        value={user?.password}
                        type="text"
                        maxLength={60}
                        className="float-right"
                        onChange={(e: any) => handleChange(e)}
                      />
                    </Form.Group>
                  </Col>
                </>
              )}
          </Row>

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
export default ClinicForm;

