/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { setFilterData, setResetFilterData } from "../../store/reducer/DashboardReducer";
import "../../assets/css/index.css";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { DashboardData } from "../../actions/Dashboard/Dashboard";
import { Drawer, Dropdown, Form, Menu, message, Space, Spin } from "antd";
import { DownOutlined, EditOutlined, LogoutOutlined } from "@ant-design/icons";
import { SubmitLogout } from "../../actions/Login/LoginActions";
import { OpenNotification } from "./../../Utilties/Utilties";
import { editUser, updateUser } from "../../actions/Users/UserActions";
import { Col, Row } from "react-bootstrap";
import { Input } from "antd";
import { Button } from "antd";
import UserType from "@/Types/User";
import { LoadingOutlined } from "@ant-design/icons";
import { setClinicData, setResetClinicData } from "../../store/reducer/ClinicReducer";
import { RootState } from "../../store/store";
import IdleLogout from "../../Utilties/IdleLogout";
import { addPatientList, addPatientProfileList } from "../../store/reducer/PatientReducer";
import { setResetQuestionnaire } from "../../store/reducer/QuestionairesReducer";

const defaultData: UserType = {
  id: "",
  first_name: "",
  mid_name: "",
  last_name: "",
  contact_no: "",
  role: "",
  role_id: "",
  gender: "",
  email: "",
  password: "",
};

function Header() {
  // const [doctor, setDoctor] = useState([] as any);
  // const [insurance, setInsurance] = useState([] as any);

  const [clinic, setClinic] = useState([] as any);
  const [loading, settLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserType>(defaultData);
  const [program, setProgram] = useState([] as any);
  const [messageApi, contextHolder] = message.useMessage();
  const roleId = localStorage.getItem("role_id");
  const [open, setOpen] = useState(false);
  const userId = localStorage.getItem("user_id");
  const name = localStorage.getItem("user_name");

  const clinicIds =
    typeof localStorage.getItem("clinic_ids") !== "undefined"
      ? JSON.parse(localStorage.getItem("clinic_ids") as any)
      : [""];

  const { clinicName } = useAppSelector(
    (state: RootState) => state.clinicReducer
  );

  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    Object.assign(values, {
      name: values.first_name + " " + values.mid_name + " " + values.last_name,
    });
    const data = Object.assign(user, values);
    settLoading(true);
    if (user.id !== "") {
      updateUser(user.id, data)
        .then(({ data: response }) => {
          if (response.success) {
            OpenNotification("success", response.message);
            setUser(defaultData);
            settLoading(false);
            setOpen(false);
          } else {
            OpenNotification("error", "Please fill all the required fields");
            settLoading(false);
          }
        })
        .catch((err) => {
          OpenNotification("error", err.message);
          settLoading(false);
        });
    }
  };

  const showDrawer = () => {
    setOpen(true);
    settLoading(true);
    editUser(userId).then(({ data: response }) => {
      settLoading(false);
      form.setFieldsValue(response.data);
      setUser(response.data);
    });
  };
  const onClose = () => {
    setOpen(false);
  };

  const dispatch = useAppDispatch();
  const key = "updatable";

  function logoutfunction() {
    messageApi.open({
      key,
      type: "loading",
      content: "Logging out..",
      duration: 0,
      style: { marginTop: "40px" },
    });

    SubmitLogout().then(({ data: response }) => {
      if (response.success) {
        dispatch(setResetFilterData());
        dispatch(setResetClinicData());
        dispatch(setClinicData({ clinicId: null, clinicName: "" }));
        dispatch(addPatientProfileList({}))
        dispatch(addPatientList({}))
        dispatch(setResetQuestionnaire())
        localStorage.removeItem("token");
        localStorage.removeItem("role_id");
        localStorage.removeItem("insurance_id");
        OpenNotification("success", response.message);

        setTimeout(() => {
          messageApi.open({
            key,
            type: "success",
            content: "Logged Out..",
            duration: 2,
            style: { marginTop: "40px" },
          });
        }, 1000);

        window.location.href = "/login";
      }
    });
  }

  function handleClinicChange(clinic: any) {
    dispatch(setFilterData({ key: "clinic_id", value: clinic.id }));

    const clinicData = {
      clinicId: clinic.id,
      clinicName: clinic.name,
    };

    dispatch(setClinicData(clinicData));
  }

  // const doctorMenu = (
  //   <Menu>
  //     {doctor?.map((items: any, index: any) => {
  //       return (
  //         <Menu.Item
  //           onClick={() =>
  //             dispatch(setFilterData({ key: "doctor_id", value: items.id }))
  //           }
  //           key={index}
  //         >
  //           {items.first_name} {items.Last_name}
  //         </Menu.Item>
  //       );
  //     })}
  //   </Menu>
  // );

  const clinicMenu = (
    <Menu>
      {clinic?.map((items: any, index: any) => {
        return (
          <Menu.Item
            onClick={
              () => handleClinicChange(items)
            }
            key={index}
          >
            {items.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const adminClinicsMenu = (
    <Menu>
      {clinic?.map((items: any, index: any) => {
        return (
          <Menu.Item
            onClick={() =>
              // dispatch(setFilterData({ key: "clinic_id", value: items.id }))
              handleClinicChange(items)
            }
            key={index}
          >
            {clinicIds?.includes(JSON.stringify(items.id)) ? items.name : ""}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  // const insuranceMenu = (
  //   <Menu>
  //     {insurance?.map((items: any, index: any) => {
  //       return (
  //         <Menu.Item
  //           onClick={() =>
  //             dispatch(setFilterData({ key: "insurance_id", value: items.id }))
  //           }
  //           key={index}
  //         >
  //           {items.name}
  //         </Menu.Item>
  //       );
  //     })}
  //   </Menu>
  // );

  const programMenu = (
    <Menu>
      {program?.map((items: any, index: any) => {
        return (
          <Menu.Item
            onClick={() =>
              dispatch(setFilterData({ key: "program_id", value: items.id }))
            }
            key={index}
          >
            {items.name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  const settingMenu = (
    <Menu>
      {/* {roleId !== "11" ? (
        <Menu.Item key={1}>
          <Link style={{ fontSize: "0.75rem" }} to="/users">
            Users
          </Link>
        </Menu.Item>
      ) : null} */}

      <Menu.Item key={7}>
        <Link style={{ fontSize: "0.75rem" }} to="/ClinicAdmin">
          Users
        </Link>
      </Menu.Item>

      {/* <Menu.Item key={2}>
        <Link style={{ fontSize: "0.75rem" }} to="/specialists">
          Specialties
        </Link>
      </Menu.Item> */}
      <Menu.Item key={3}>
        <Link style={{ fontSize: "0.75rem" }} to="/insurances">
          Insurances
        </Link>
      </Menu.Item>
      <Menu.Item key={4}>
        <Link style={{ fontSize: "0.75rem" }} to="/program">
          Programs
        </Link>
      </Menu.Item>
      {/* <Menu.Item key={5}>
        <Link style={{ fontSize: "0.75rem" }} to="/physician">
          Physician
        </Link>
      </Menu.Item> */}
      {roleId === "1" || roleId === "13" ? (
        <Menu.Item key={6}>
          <Link style={{ fontSize: "0.75rem" }} to="/Clinic">
            Clinic
          </Link>
        </Menu.Item>
      ) : null}
    </Menu>
  );
  const profileDropdown = (
    <Menu>
      <Menu.Item key={1} onClick={showDrawer}>
        <Space>
          <EditOutlined style={{ fontSize: "0.85rem" }} />
          <small className="text-nowrap"> Edit Profile</small>
        </Space>
      </Menu.Item>
      <Menu.Item key={2} onClick={logoutfunction}>
        <Space>
          <LogoutOutlined style={{ fontSize: "0.80rem" }} />

          <small>Logout</small>
        </Space>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    DashboardData().then(({ data: response }) => {
      // const doctor = response.doctor_data;
      // const insurance = response.insurance_data;
      const clinic = response.clinic_data;
      const program = response.program_data;
      setClinic(clinic);
      setProgram(program);
      // setDoctor(doctor);
      // setInsurance(insurance);

      if (clinic.length === 1) {
        const singleClinic = clinic[0];
        const clinicData = {
          clinicId: singleClinic.id,
          clinicName: singleClinic.name,
        };

        dispatch(setClinicData(clinicData));
      } else if (clinic.length > 1 && roleId !== "1") {
        const filter = clinic?.filter((items: any) =>
          clinicIds.includes(items.id.toString())
        );
        const ids = filter?.map((items: any) => items.id);

        const names = clinic?.map((items: any) => items.name);
        const clinicData = {
          clinicId: ids,
          clinicName: names,
        };
        dispatch(setClinicData(clinicData));
      }
    });
  }, []);

  const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;

  const [isOpened, setIsOpened] = useState(false);
  function toggle() {
    setIsOpened(!isOpened);
  }

  return (
    <>
      <IdleLogout idleTime={60 * 60 * 1000} onLogout={logoutfunction} />
      <Drawer
        zIndex={10000000}
        title="Edit Profile"
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Spin spinning={loading} indicator={antIcon}>
          <Form
            form={form}
            layout="vertical"
            name="register"
            onFinish={onFinish}
            scrollToFirstError
          >
            <Form.Item
              name="first_name"
              label="First Name:"
              className="mb-2"
              rules={[
                {
                  required: true,
                  message: "Please input your first name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mb-2"
              name="mid_name"
              label="Middle Name:"
              rules={[
                {
                  required: true,
                  message: "Please input your middle name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              className="mb-2"
              name="last_name"
              label="Last Name:"
              rules={[
                {
                  required: true,
                  message: "Please input your last name",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="gender"
              label="Gender"
              className="mb-2"
              rules={[{ required: true, message: "Please select gender!" }]}
            >
              <select
                className="form-control"
                placeholder="Select a option and change input text above"
              >
                <option value="" selected disabled>
                  Select
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </Form.Item>
            <Form.Item
              className="mb-2"
              name="contact_no"
              label="Contact No:"
              rules={[
                {
                  required: true,
                  message: "Please input your contact no",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              className="mb-2"
              name="email"
              label="Email:"
              rules={[
                {
                  type: "email",
                  message: "Please input correct E-mail",
                },
                {
                  required: true,
                  message: "Please input your E-mail",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <div className="mt-3">
              <Row>
                <Col col={6}>
                  <Link
                    className="mt-3 text-dark"
                    style={{ fontSize: "0.85rem" }}
                    to=""
                    onClick={toggle}
                  >
                    Update Password
                  </Link>
                </Col>
              </Row>
            </div>

            {isOpened && (
              <>
                <Form.Item
                  className="mb-2"
                  name="new_password"
                  label="Password"
                  rules={[
                    {
                      required: true,
                      message: "Please input your password!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item
                  className="mb-2"
                  name="confirm_new_password"
                  label="Confirm Password"
                  dependencies={["new_password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("new_password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error(
                            "The two passwords that you entered do not match!"
                          )
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password />
                </Form.Item>
              </>
            )}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Drawer>
      <nav
        className="navbar navbar-expand-md    sticky-top m-0 p-0"
        style={{
          borderBottom: "1px solid grey",
          backgroundColor: "#343434",
          zIndex: 1000,
        }}
      >
        <div className="navbar-toggler-right">
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        </div>

        <div className="collapse navbar-collapse flex-column " id="navbar">
          <ul className="navbar-nav  w-100 justify-content-end px-3 ">
            <Space>
              <>
                {/*<li className="nav-item">
                  <Dropdown
                    overlay={doctorMenu}
                    trigger={["click"]}
                    overlayStyle={{ overflowY: "scroll", maxHeight: "400px" }}
                  >
                    <a
                      onClick={(e) => e.preventDefault()}
                      style={{ fontSize: "12px", color: "#888888" }}
                    >
                      <Space>
                        Doctors
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </li>
                <li className="nav-item dropdown text-secondary ">
                  <Dropdown
                    overlay={insuranceMenu}
                    trigger={["click"]}
                    overlayStyle={{
                      overflowY: "scroll",
                      maxHeight: "400px",
                    }}
                  >
                    <a
                      onClick={(e) => e.preventDefault()}
                      style={{ fontSize: "12px", color: "#888888" }}
                    >
                      <Space>
                        Insurance
                        <DownOutlined />
                      </Space>
                    </a>
                  </Dropdown>
                </li> */}
                <div className="vr text-white" style={{ height: "64px" }} />

                <li className="nav-item dropdown text-secondary">
                  {clinicIds?.length > "1" || roleId === "1" ? (
                    <Dropdown
                      overlay={roleId === "1" ? clinicMenu : adminClinicsMenu}
                      trigger={["click"]}
                      overlayStyle={{
                        overflowY: "scroll",
                        maxHeight: "400px",
                      }}
                    >
                      <a
                        onClick={(e) => e.preventDefault()}
                        style={{ fontSize: "12px", color: "#888888" }}
                      >
                        <Space>
                          {clinicName != "" ? clinicName : "Clinics"}
                          <DownOutlined />
                        </Space>
                      </a>
                    </Dropdown>
                  ) : (
                    <a style={{ fontSize: "12px", color: "#888888" }}>
                      <Space>{clinicName}</Space>
                    </a>
                  )}
                </li>

                {roleId === "11" || roleId === "1" || roleId === "13" ? (
                  <>
                    <div className="vr text-white" style={{ height: "64px" }} />
                    <li className="nav-item dropdown text-secondary ">
                      <Dropdown
                        overlay={programMenu}
                        trigger={["click"]}
                        overlayStyle={{
                          overflowY: "scroll",
                          maxHeight: "400px",
                        }}
                      >
                        <a onClick={(e) => e.preventDefault()} style={{ fontSize: "12px", color: "#888888" }} >
                          <Space>
                            Program
                            <DownOutlined />
                          </Space>
                        </a>
                      </Dropdown>
                    </li>
                    <div className="vr text-white" style={{ height: "64px" }} />
                    {roleId === "11" ? (
                      <li className="nav-item dropdown text-secondary">
                        <Dropdown overlay={settingMenu} trigger={["click"]}>
                          <a
                            onClick={(e) => e.preventDefault()}
                            style={{ fontSize: "12px", color: "#888888" }}
                          >
                            <Space>
                              Settings
                              <DownOutlined />
                            </Space>
                          </a>
                        </Dropdown>
                      </li>
                    ) : null}
                    <div className="vr text-white" style={{ height: "64px" }} />
                  </>
                ) : null}
              </>

              <li className="nav-item dropdown text-secondary">
                <Dropdown overlay={profileDropdown} trigger={["click"]}>
                  <a
                    onClick={(e) => e.preventDefault()}
                    style={{ fontSize: "12px", color: "#888888" }}
                  >
                    <Space>
                      {name}
                      <DownOutlined />
                    </Space>
                  </a>
                </Dropdown>
              </li>
            </Space>
            <div className="vr text-white" style={{ height: "64px" }} />
          </ul>
        </div>
      </nav>
      {contextHolder}
    </>
  );
}

export default Header;
