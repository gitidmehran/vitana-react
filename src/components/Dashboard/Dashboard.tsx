/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import "./Dashboard.css";
import { Card, Modal, Table, Row, Col, Switch, Select, Typography } from "antd";
import { FilterData, findAllCompliantPatients, findFilterCompliantPatients, findPatientsByStatus } from "../../actions/Dashboard/Dashboard";
import { useAppSelector } from "../../hooks/hooks";
import { RootState } from "../../store/store";
import Password from "./Password/Password";
import { insuranceType } from "../../Constant/constant";
import { OpenNotification } from "../../Utilties/Utilties";
import { dashboardData, CareGapsTypes, DashboardFitlerType } from "@/Types/Dashboard";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setFilterData } from "../../store/reducer/DashboardReducer";
import CareGapBarGraph from "../Graphs/CareGapBarGraph";
import CareGapsTable from "./CareGapsTable/CareGapsTable";

function Dashboard() {
  const [data, setdata] = useState<dashboardData>({} as dashboardData);
  const [loading, setloading] = useState<boolean>(false);
  const [careGapStatus, setCareGapStatus] = useState<string>("Care Gaps As Per Current Status");
  const [careGapStatusDate, setCareGapStatusDate] = useState<string>("");
  const [filterYear, setFilterYear] = useState<string>(moment().year().toString());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [careGapsData, setCareGapsData] = useState<CareGapsTypes[]>([]);
  const [insuranceData, setInsuranceData] = useState<any>({});
  const [filteredInsurance, setFilteredInsurance] = useState<any>({});
  const [doctorsData, setDoctorsData] = useState<any>({});
  const [selectedInsurance, setSelectedInsurance] = useState<number | undefined>(undefined);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string | undefined>(undefined);
  const [selectedPcp, setSelectedPcp] = useState<number | undefined>(undefined);
  const [careGapId, setCareGapId] = useState<number>(0);
  const [filterItems, setFilterItems] = useState<DashboardFitlerType>({} as DashboardFitlerType);
  const [insuranceProvider, setInsuranceProvider] = useState<string>("");
  const navigate = useNavigate();
  const { doctor_id, program_id, clinic_id, insurance_id, assigned } = useAppSelector(
    (state: RootState) => state.DashboardFilters
  );

  const [assignedTitle, setAssignedTitle] = useState<string>(assigned !== false ? 'Assigned Patients' : 'Assignable patients');
  const dispatch = useDispatch();
  const { Text } = Typography;
  const lastInsuranceType = localStorage.getItem("insurance_type");

  useEffect(() => {
    setloading(true);
    const insuranceId = insurance_id ? insurance_id : (selectedInsurance !== undefined ? selectedInsurance : "");
    const doctorId = doctor_id != "" ? doctor_id : filterItems.doctorId !== undefined ? filterItems.doctorId : "";
    const filter_year = filterYear;

    FilterData(doctorId, program_id, clinic_id, insuranceId, careGapId, assigned, filter_year).then(
      ({ data: response }) => {
        if (response.success) {
          const { data } = response;

          setdata(data);
          setloading(false);
          setInsuranceData(response.insurance_data);
          setDoctorsData(response.doctor_data);

          const filterData = response.insurance_data.filter((item: { id: number }) => item.id === response.insurance_id);
          const filterInsData = response.insurance_data.filter((item: { type_id: number }) => item.type_id === response.insurance_type_id);

          setInsuranceProvider(filterData[0]?.provider);
          if (filterData[0].provider === "hcpw-001") {
            setCareGapsData(response.healthChoicePathway);
          } else if (filterData[0].provider === "hum-001") {
            setCareGapsData(response.humana);
          } else if (filterData[0].provider === "med-arz-001") {
            setCareGapsData(response?.medicareArizona);
          } else if (filterData[0].provider === "aet-001") {
            setCareGapsData(response?.aetnaMedicare);
          } else if (filterData[0].provider === "hcarz-001") {
            setCareGapsData(response?.healthChoiceArizona);
          } else if (filterData[0].provider === "allwell-001") {
            setCareGapsData(response?.allwellMedicare);
          } else if (filterData[0].provider === "uhc-001") {
            setCareGapsData(response?.unitedHealthcare);
          }
          else {
            setCareGapsData([]);
          }
          setFilteredInsurance(filterInsData);
          setSelectedInsuranceType(response?.insurance_type_id);
          setSelectedInsurance(response?.insurance_id);


        } else {
          OpenNotification("error", response.message);
          setloading(false);
        }
      }
    ).catch((response) => {
      OpenNotification("error", response.message);
      setloading(false);
    });
  }, [doctor_id, program_id, careGapId, assigned, filterItems, selectedInsurance, filterYear]);


  const roleId = localStorage.getItem("role_id");
  const UpdatePassword = localStorage.getItem("password_update");
  const insProvider = [
    'hum-001',
    'hcpw-001',
    'med-arz-001',
    'aet-001',
    'allwell-001',
    'hcarz-001',
    "uhc-001",
  ];


  useEffect(() => {
    if (UpdatePassword === "0") {
      setIsModalOpen(true);
    }
  }, [UpdatePassword]);

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const handleSwitchCareGap = () => {
    if (careGapId === 0) {
      setCareGapId(1);
      setCareGapStatus("Care Gaps As Per Insurance Status");
      setCareGapStatusDate("Updated as of: " + data?.date);
    } else {
      setCareGapId(0);
      setCareGapStatus("Care Gaps As Per Current Status");
      setCareGapStatusDate("");

    }
  }

  const handleShowAllCompliant = (title: string, name: string, value: any) => {
    const newName = title;
    // When fetching data as per current status


    const payload = {
      ["col_name"]: name,
      ["col_value"]: value,
      ["insurance_id"]: insurance_id !== "" ? insurance_id : selectedInsurance?.toString(),
      ["doctor_id"]: doctor_id,
      ["filterYear"]: filterYear,
    }


    findAllCompliantPatients(payload).then(
      ({ data: response }) => {
        if (response.success) {
          const data = response.data;
          if (response?.totalRecord !== 0) {
            navigate(`/patients`, { state: { data, name, newName, value, careGapId, filterYear } });
          }
          else {
            OpenNotification("error", "Record not Found!");
          }
        } else {
          OpenNotification("error", response.message);
          setloading(false);
        }
      }
    ).catch((response) => {
      OpenNotification("error", response.message);
      setloading(false);
    });
  }

  const handleShowCompliantFilter = (title: string, name: string, value: any) => {
    const newName = title;


    const payload = {
      ["col_name"]: name,
      ["col_value"]: value,
      ["insurance_id"]: insurance_id !== "" ? insurance_id : selectedInsurance?.toString(),
      ["doctor_id"]: doctor_id,
      ["care_gaps_as_per"]: careGapId === 0 ? "" : "_insurance",
      ["filterYear"]: filterYear
    }

    findFilterCompliantPatients(payload).then(
      ({ data: response }) => {
        if (response.success) {
          const data = response.data;
          if (response?.totalRecord !== "") {

            navigate(`/patients`, { state: { data, name, newName, value, careGapId, filterYear } });
          } else {
            OpenNotification("error", "Record Not Found!");
          }

        } else {
          OpenNotification("error", response.message);
          setloading(false);
        }
      }
    ).catch((response) => {
      OpenNotification("error", response.message);
      setloading(false);
    });
  }


  function handleInsuranceType(value: string) {
    setFilteredInsurance({});
    const filter = insuranceData.filter((item: { type_id: number | null; }) => item.type_id === Number(value));
    setFilteredInsurance(filter);

    const lastType = insuranceType.filter((item: { id: string | null; }) => item.id === value);
    setSelectedInsuranceType(lastType.length > 0 ? lastType[0].id : undefined);

    if (value === undefined) {
      localStorage.removeItem("insurance_type");
    } else {
      localStorage.setItem("insurance_type", value.toString());
    }

  }

  function handleinsuranceChange(value: number) {
    setFilterItems({
      ...filterItems,
      insuranceId: value,
    });

    const filter = insuranceData.filter((item: { id: number; }) => item.id === value);
    setSelectedInsurance(data?.insurance_id);
    // if (value === undefined) {
    //   localStorage.removeItem("insurance_id");
    // } else {
    //   localStorage.setItem("insurance_id", value.toString());
    // }


    const in_id = (value !== undefined) ? String(value) : "";
    dispatch(
      setFilterData({ key: "insurance_id", value: in_id })
    )
  }

  function handlePcpChange(value: number) {

    setFilterItems({
      ...filterItems,
      doctorId: value,
    });
    const filter = doctorsData.filter((item: { id: number; }) => item.id === value);
    setSelectedPcp(filter.length > 0 ? filter[0].id : undefined);
    // if (value === undefined) {
    //   localStorage.removeItem("doctor_id");
    // } else {
    //   localStorage.setItem("doctor_id", value.toString());
    // }

    const doc_id = value !== undefined ? String(value) : "";
    dispatch(
      setFilterData({ key: "doctor_id", value: doc_id })
    )
  }

  function handleStatusSwitch(event: boolean) {

    if (event === false) {
      setAssignedTitle('Assignable patients')
    } else {
      setAssignedTitle('Assigned patients')
    }

    dispatch(
      setFilterData({ key: "assigned", value: event })
    )
  }

  function filterPatient(name: string) {
    const payload = {
      ["status_type"]: name,
      ["assignedTitle"]: assignedTitle,
      ["insurance_id"]: insurance_id !== "" ? insurance_id : selectedInsurance?.toString(),
      ["doctor_id"]: doctor_id,
      ["filter_year"]: filterYear,
    }

    findPatientsByStatus(payload).then(
      ({ data: response }) => {
        if (response.success) {
          const data = response.data;
          const filterStatus = true;
          navigate(`/patients`, { state: { data, filterStatus } });
        } else {
          OpenNotification("error", response.message);
          setloading(false);
        }
      }
    ).catch((response) => {
      OpenNotification("error", response.message);
      setloading(false);
    });
  }

  function handleFilterYear(val: string) {
    setFilterYear(val);
  }

  return (
    <Container fluid className="mt-4">
      <Modal
        title="Change Password"
        maskClosable={false}
        closable={false}
        open={isModalOpen}
        footer={false}
      >
        <Password setIsOpenModal={setIsModalOpen} />
      </Modal>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 col-xl-12">
            <Card
              loading={loading}
              className="cards mb-4 totalPopulationClass"
            >
              <div className="row align-items-center">
                <div className="col-2 text-left ">
                  <div className="card-block p-0">
                    <h5 className=" m-0  text-center mt-3">Total Population</h5>
                  </div>
                </div>
                <div className="col-1 text-left">
                  <div className="card-block p-0">
                    <i className="fa fa-users foricon text-success  mt-3" />
                  </div>
                </div>
                <div className="col-1">
                  <div className="card-block p-0">
                    <h5 className="m-0  text-left  mt-3">
                      <a className="text-secondary link ml-4  ">
                        {data?.totalPopulation}
                      </a>
                    </h5>
                  </div>
                </div>

                <div className="col-2">
                  <Select
                    className="selectInsPcp"
                    showSearch
                    optionFilterProp="children"
                    filterOption={filterOption}
                    placeholder="Insurance Type"
                    value={lastInsuranceType === null ? String(selectedInsuranceType) : String(lastInsuranceType)}
                    onChange={(value: string) => handleInsuranceType(value)}
                    options={insuranceType?.map((items: any) => ({
                      value: items.id,
                      label: items.name,
                    }))}
                  />
                </div>


                {insuranceData.length > 0 ? (
                  <div className="col-2">
                    {selectedInsuranceType !== undefined && selectedInsuranceType !== "" ? (
                      <Select
                        className="selectInsPcp"
                        showSearch
                        optionFilterProp="children"
                        filterOption={filterOption}
                        allowClear
                        placeholder="Select Insurance"
                        onChange={(value) => handleinsuranceChange(value)}
                        value={insurance_id === "" ? selectedInsurance : Number(insurance_id)}
                        options={filteredInsurance?.map((items: any) => ({
                          value: items.id,
                          label: items.name,
                        }))}
                      />
                    ) : (
                      <Select
                        className="selectInsPcp"
                        showSearch
                        optionFilterProp="children"
                        filterOption={filterOption}
                        allowClear
                        placeholder="Select Insurance"
                        onChange={(value) => handleinsuranceChange(value)}
                        value={insurance_id === "" ? selectedInsurance : Number(insurance_id)}
                        options={insuranceData?.map((items: any) => ({
                          value: items.id,
                          label: items.name,
                        }))}
                      />
                    )
                    }
                  </div>
                ) : null}

                {doctorsData.length > 0 ? (
                  <div className="col-2">
                    <Select
                      className="selectInsPcp"
                      showSearch
                      optionFilterProp="children"
                      filterOption={filterOption}
                      allowClear
                      placeholder="Select PCP"
                      onChange={(value) => handlePcpChange(value)}
                      value={doctor_id === "" ? selectedPcp : Number(doctor_id)}
                      options={doctorsData?.map((items: any) => ({
                        value: items.id,
                        label: items.name,
                      }))}
                    />
                  </div>
                ) : null}

                <div className="col-2">
                  <Text className="mr-3" strong>{assignedTitle}</Text>
                  <Switch style={{ backgroundColor: assigned ? '#28a745' : '' }} checked={assigned} onChange={handleStatusSwitch} />
                </div>
              </div>
            </Card>
          </div>

        </div>
        <div className="row">
          <div className="col-lg-3 col-md-6 ">
            <Card
              loading={loading}
              className=" mb-0 card bg-c-green foruse order-card mb-3 cardClass"
            >
              <div className="row">
                <div className="col-4 text-left">
                  <div className="card-block ">
                    <h5 className="m-0 text-nowrap">Active Patients</h5>
                  </div>
                </div>
                <div className="col-4 text-center">
                  <div className="card-block">
                    <i className="fa fa-user fa-lg foricon text-primary ml-4 pl-4 " aria-hidden="true" />
                  </div>
                </div>

                <div className="col-4 ">
                  <div className="card-block">
                    <h5 className="m-0 text-nowrap text-right ">
                      <span className="statusClass" onClick={() => filterPatient('active')}>
                        {data?.activeUsers}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
              <div className="row ">
                <div className="col-6">
                  <div className="">
                    <h6 className="mr-0 mb-0 mt-0 ml-3 text-nowrap ">
                      <b className="">Group A1</b>
                      <span className="font-weight-bold ml-2">
                        {data?.group_a1}
                      </span>
                    </h6>
                  </div>
                </div>
                <div className="col-6 ">
                  <div className="">
                    <h6 className="m-0 text-nowrap">
                      <b>Group A2</b>
                      <span className="font-weight-bold ml-2">
                        {data?.group_a2}
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 ">
                  <div className="">
                    <h6 className=" text-nowrap  ml-3 mt-1">
                      <b>Active</b>
                      <span className="font-weight-bold mr-2 ml-2">
                        {data?.activePercentage}%
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-lg-3 col-md-6">
            <Card loading={loading} className="card mb-3 cardClass" >
              <div className="row">
                <div className="col-5 text-center">
                  <div className="card-block">
                    <h5 className="text-left m-0 text-nowrap">Group B</h5>
                  </div>
                </div>
                <div className="col-2 ">
                  <i
                    className="fa fa-user-times text-info ml-2 mt-2 iconClass"
                    aria-hidden="true"
                  />
                </div>
                <div className="col-5 text-center">
                  <div className="card-block">
                    <h5 className="f-right">
                      <span className="statusClass" onClick={() => filterPatient('inactive')}>
                        {data?.group_b}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>

              <div className="row active-group-class">
                <div className="col-12 ">
                  <div className="card-block">
                    <h6 className="m-0 text-nowrap">
                      <b className="">Group B</b>
                      <span className="font-weight-bold ml-4 ">
                        {data?.group_b_percentage}%
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <div className="col-lg-3 col-md-6">
            <Card
              loading={loading}
              className="card mb-3 cardClass"

            >
              <div className="row">
                <div className="col-5 text-center">
                  <div className="card-block">
                    <h5 className="text-left m-0 text-nowrap">Group C</h5>
                  </div>
                </div>
                <div className="col-2 ">
                  <i
                    className="fa fa-user-minus text-danger ml-2 mt-2 iconClass"
                    aria-hidden="true"
                  />
                </div>
                <div className="col-5 text-center">
                  <div className="card-block">
                    <h5 className="f-right">
                      <span className="statusClass" onClick={() => filterPatient('lost')}>
                        {data?.group_c}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>

              <div className="row active-group-class">
                <div className="col-12 ">
                  <div className="card-block">
                    <h6 className="m-0 text-nowrap">
                      <b className="">Group C</b>
                      <span className="font-weight-bold ml-4 ">
                        {data?.group_c_percentage}%
                      </span>
                    </h6>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <div className="col-lg-3 col-md-6">
            <Card
              loading={loading}
              className="card mb-3 cardClass"

            >
              <div className="row">
                <div className="col-6 text-center">
                  <div className="card-block">
                    <h5 className="text-left m-0 text-nowrap">Uncategorized</h5>

                  </div>
                </div>
                <div className="col-3 ">
                  <i
                    className="fa fa-user-plus text-warning ml-2  mt-2 iconClass"
                    aria-hidden="true"
                  />
                </div>
                <div className="col-3 text-center">
                  <div className="card-block">
                    <h5 className="f-right">
                      <span className="statusClass" onClick={() => filterPatient('uncategorized')}>
                        {data?.uncategorized}
                      </span>
                    </h5>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      {insProvider.includes(insuranceProvider) ? (<>
        {roleId === "1" || roleId === "11" || roleId === "13" || roleId === "21" ? (
          <>
            <div className="container-fluid pt-4">
              <Card>
                <CareGapBarGraph
                  careGapsData={careGapsData}
                />
              </Card>
              <Card>
                <Row>
                  <Col span={24}>
                    <CareGapsTable
                      careGapsData={careGapsData}
                      careGapStatus={careGapStatus}
                      careGapStatusDate={careGapStatusDate}
                      handleSwitchCareGap={handleSwitchCareGap}
                      handleShowAllCompliant={handleShowAllCompliant}
                      handleShowCompliantFilter={handleShowCompliantFilter}
                      insuranceProvider={insuranceProvider}
                      handleFilterYear={handleFilterYear}
                      filterYear={filterYear}
                    />
                  </Col>
                </Row>
              </Card>
            </div>
          </>) : null}
      </>) : null}

    </Container >
  );
}

export default Dashboard;
