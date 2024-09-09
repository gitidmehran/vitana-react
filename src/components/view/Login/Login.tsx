import React, { useState } from "react";
import "assets/css/loginform.css";
import "assets/css/questions_answers.css";
import { Input, Button } from "antd";
import { SubmitLogin } from "../../../actions/Login/LoginActions";
import { OpenNotification } from "../../../Utilties/Utilties";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setAllowedProgram } from "../../../store/reducer/ClinicReducer";
import "./style.css";
import Logo from "../../../assets/img/logo.png";
function Login() {
  const token = localStorage.getItem("token");
  if (typeof token === "undefined" && token === "" && token === null) {
    window.location.href = "/";
  }
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, settLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const handleChange = (e: { target: { value: any; name: any } }) => {
    const { value } = e.target;
    setCredentials({
      ...credentials,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    settLoading(true);
    SubmitLogin(credentials)
      .then(({ data: response }) => {
        settLoading(false);
        if (response.success) {
          localStorage.setItem("role_id", response.loggedIn_user_role);
          localStorage.setItem("token", response.token);
          localStorage.setItem("user_id", response.user_id);
          localStorage.setItem("user_name", response.user_name);
          localStorage.setItem("password_update", response.password_update);
          localStorage.setItem(
            "clinic_ids",
            JSON.stringify(response.clinic_ids)
          );
          // localStorage.setItem(
          //   "allowed_program",

          // );
          dispatch(setAllowedProgram(response.program_id));
          localStorage.setItem("server_version", response.server_version);
          OpenNotification("success", response.message);
          window.location.href = "/";
        }
      })
      .catch(() => {
        settLoading(false);
      });
  };

  return (
    <div
      style={{
        height: "800px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="containers"
        id="containers"
        style={{ height: "550px", width: "50%" }}
      >
        <div className="form-container sign-in-container">
          <form id="form" onSubmit={handleSubmit}>
            <img src={Logo} alt="logo" width={80} height={80} />
            <br />
            <h1 className="texted">Login Account</h1>
            <br />
            <Input
              type="email"
              placeholder="Email"
              required
              value={credentials.email}
              name="email"
              onChange={(e: any) => handleChange(e)}
              allowClear
              style={{
                border: "2px solid #ccc",
                borderRadius: "5px",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
              }}
            />
            <Input.Password
              type="password"
              required
              name="password"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
              placeholder="Password"
              onChange={(e: any) => handleChange(e)}
              allowClear
              style={{
                border: "2px solid #ccc",
                borderRadius: "5px",
                padding: "12px 15px",
                margin: "8px 0",
                width: "100%",
              }}
            />
            <br />
            <Button
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                borderRadius: "20px",
                border: "1px solid #1B8B00",
                backgroundColor: "#1B8B00",

                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "10px 45px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                transition: "transform 80ms ease-in",
              }}
            >
              Login
            </Button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-right">
              <h1 className="texted text-light">Welcome to <br /> Vital Health Services</h1>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="signup-form">
        <form className="container" onSubmit={handleSubmit}>
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <h2>Login</h2>
              <p className="hint-text">You can login here.</p>

              <div className="form-group">
                <Input
                  type="email"
                  required
                  value={credentials.email}
                  name="email"
                  placeholder="Email"
                  onChange={(e: any) => handleChange(e)}
                  allowClear
                />
              </div>
              <div className="form-group">
                <Input.Password
                  type="password"
                  required
                  name="password"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  placeholder="Password"
                  onChange={(e: any) => handleChange(e)}
                  allowClear
                />
              </div>
              <Button
                shape="round"
                type="primary"
                className="float-right"
                htmlType="submit"
                loading={loading}
              >
                Login
              </Button>
            </div>
          </div>
        </form>
      </div> */}
    </div>
  );
}

export default Login;
