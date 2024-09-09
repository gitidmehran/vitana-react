import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/img/logo.png";
import "../../assets/css/scrollbar.css";
import { Nav } from "react-bootstrap";
import '../../components/Sidebar/Sidebar.css';
const packageJson = require('../../../package.json');
import {
  ContainerFilled,
  HomeFilled,
  ProfileFilled,
  QuestionCircleOutlined,
  ReconciliationFilled,
} from "@ant-design/icons";

interface Props {
  color: string;
}

const Sidebar: React.FC<Props> = ({ color }) => {
  const roleId = localStorage.getItem("role_id");
  const serverVersion = localStorage.getItem("server_version");
  const { version } = packageJson;

  return (
    <div className="sidebar" style={{ backgroundColor: "#272727" }} data-color={color} >
      <div className="sidebar-wrapper ">
        <div className="p-0 logo d-flex align-items-center justify-content-center  border-0">
          <Link to={"/"}>
            <img
              src={logo}
              className="mt-2"
              alt="logo"
              width={70}
              height={70}
            />
          </Link>
        </div>
        <Nav>
          <li className="text-center mt-3">
            <NavLink to="/" className="text-decoration-none">
              <h4>
                <HomeFilled className="text-light mb-1" />
                <br />
                <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                  Home
                </h6>
              </h4>
            </NavLink>
          </li>
          <li className="text-center mt-3">
            <NavLink to="/patients" className="text-decoration-none">
              <h4>
                <ReconciliationFilled className="text-light mb-1" />
                <br />
                <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                  Patients
                </h6>
              </h4>
            </NavLink>
          </li>
          <li className="text-center mt-3">
            <NavLink to="/Questionnaires" className="text-decoration-none">
              <h4>
                <ContainerFilled className="text-light mb-1" />
                <br />
                <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                  Questionnaire
                </h6>
              </h4>
            </NavLink>
          </li>
          {roleId === "1" || roleId === "13" ? (
            <>
              <li className="text-center mt-3">
                <NavLink to="/Program" className="text-decoration-none">
                  <h4>
                    <i className="fas fa-notes-medical  text-light mb-1  "></i>
                    <br />
                    <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                      Programs
                    </h6>
                  </h4>
                </NavLink>
              </li>
              <li className="text-center mt-3">
                <NavLink to="/insurances" className="text-decoration-none">
                  <h4>
                    <i className="fas fa-hand-holding-heart  text-light mb-1  "></i>
                    <br />
                    <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                      Insurances
                    </h6>
                  </h4>
                </NavLink>
              </li>
              <li className="text-center mt-3">
                <NavLink to="/clinics" className="text-decoration-none">
                  <h4>
                    <i className="fas fa-hospital-user text-light mb-1"></i>
                    <br />
                    <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                      Clinics
                    </h6>
                  </h4>
                </NavLink>
              </li>
              <li className="text-center mt-3">
                <NavLink to="/ClinicAdmin" className="text-decoration-none">
                  <h4>
                    <i
                      className="fa fa-user text-light mb-1"
                      aria-hidden="true"
                    ></i>
                    <br />
                    <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                      Users
                    </h6>
                  </h4>
                </NavLink>
              </li>
            </>
          ) : null}
          {roleId === "1" || roleId === "21" || roleId === "13" ? (
            <li className="text-center mt-3">
              <NavLink
                to="/unsignedencounters"
                className="text-decoration-none"
              >
                <h4>
                  <i className="fas fa-file-signature  text-light mb-1  "></i>
                  <br />
                  <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                    Unsigned Encounters
                  </h6>
                </h4>
              </NavLink>
            </li>
          ) : null}

          {roleId === "1" || roleId === "21" || roleId === "13" ? (
            <li className="text-center mt-3">
              <NavLink
                to="/completedencounters"
                className="text-decoration-none"
              >
                <h4>
                  <i className="fas fa-clipboard-check  text-light mb-1  "></i>
                  <br />
                  <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                    Completed Encounters
                  </h6>
                </h4>
              </NavLink>
            </li>
          ) : null}

          <li className="text-center mt-3">
            <NavLink
              to="/billableclaims"
              className="text-decoration-none"
            >
              <h4>
                <ProfileFilled className="text-light mb-1" />
                <br />
                <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                  Billable Claims
                </h6>
              </h4>
            </NavLink>
          </li>

          {/* {roleId === "1" || roleId === "21" || roleId === "13" ? (
            <li className="text-center mt-3">
              <NavLink
                to="/cclfData"
                className="text-decoration-none"
              >
                <h4>
                  <i className="fas fa-file-alt text-light mb-1  "></i>
                  <br />
                  <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                    CCLF Data
                  </h6>
                </h4>
              </NavLink>
            </li>
          ) : null} */}
          {roleId === "1" || roleId === "13" || roleId === "21" ? (
            <li className="text-center mt-3">
              <NavLink
                to="/caregaps"
                className="text-decoration-none"
              >
                <h4>
                  <i className="fas fa-file-alt text-light mb-1  "></i>
                  <br />
                  <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                    Care Gaps
                  </h6>
                </h4>
              </NavLink>
            </li>
          ) : null}
          {roleId === "1" || roleId === "13" || roleId === "21" ? (
            <li className="text-center mt-3">
              <NavLink
                to="/preprocessor"
                className="text-decoration-none"
              >
                <h4>
                  <i className="fas fa-file-alt text-light mb-1  "></i>
                  <br />
                  <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                    Pre-Processor
                  </h6>
                </h4>
              </NavLink>
            </li>
          ) : null}
          <li className="text-center mt-3">
            <NavLink
              to="/help"
              className="text-decoration-none"
            >
              <h4>
                <QuestionCircleOutlined className="text-light" />
                <br />
                <h6 className=" text-light" style={{ fontSize: "0.6rem" }}>
                  Help
                </h6>
              </h4>
            </NavLink>
          </li>
        </Nav>
      </div>
      <div className="versionClass">
        <span>LV: {serverVersion ?? "-"}</span>
      </div>
      <div className="versionClass">
        <span>RV: {version ?? "-"}</span>
      </div>

    </div>
  );
};

export default Sidebar;
