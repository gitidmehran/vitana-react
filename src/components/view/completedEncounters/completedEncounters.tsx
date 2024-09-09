import React, { useEffect, useState } from "react";
import { DatePicker, Table, Form, Button } from "antd";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Select } from "antd";
import { getCompletedEncounters } from "../../../actions/completedEncounter/CompletedEncounterAction";
import { OpenNotification } from "../../../Utilties/Utilties";
import moment from "moment";
import { useAppDispatch } from "../../../hooks/hooks";
import {
	setProgramId,
	setQuestionId,
} from "../../../store/reducer/QuestionairesReducer";
import { useNavigate } from "react-router-dom";
import { CCMStatus } from "../../../Constant/constant";
import { FilterData } from "../../../actions/Dashboard/Dashboard";
const XLSX = require("xlsx");

function CompletedEncounter() {
	const [encounter, setEncounters] = useState<any>([]);
	const [ccmCoordinator, setCcmCoordinator] = useState<any>([]);
	const [values, setValues] = useState<any>({});
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalRecords, setTotalRecords] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);

	const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
	const { RangePicker } = DatePicker;
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const roleId = localStorage.getItem("role_id");
	const userId = localStorage.getItem("user_id");
	useEffect(() => {
		setLoading(true);
		let data: any = {};
		data = roleId === "21" || roleId === "13"
			? { ccm_coordinator: values?.ccm_coordinator !== undefined ? Number(values?.ccm_coordinator) : Number(userId), dateRange: values?.dateRange }
			: values;

		getCompletedEncounters(data, currentPage).then(({ data: response }) => {
			if (response.success === true) {
				const { data, total_records, ccm_coordinators } = response;
				setCcmCoordinator(ccm_coordinators);
				setTotalRecords(total_records);
				setEncounters(data);
				setLoading(false);
			} else {
				OpenNotification("error", response.message);
			}
		});
	}, [values]);

	const handleTableChange = (pagination: any) => {
		setCurrentPage(pagination.current);
	};

	const startingIndex = (currentPage - 1) * 10 + 1;
	const columns = [
		{
			title: "Id",
			key: "index",
			render: (_: any, record: any, index: number) => startingIndex + index,
		},
		{
			title: "Serial No",
			dataIndex: "serial_no",
			key: "serial_no",
		},
		{
			title: "Name",
			render: (_: string, record: any) => record?.patient?.name,
		},
		{
			title: "Dob",
			render: (_: string, record: any) =>
				moment(record?.patient?.dob).format("MM/DD/YYYY"),
		},
		{
			title: "Date of service",
			dataIndex: "date_of_service",
			render: (_: string, record: any) =>
				moment(record?.date_of_service).format("MM/DD/YYYY"),
		},
		{
			title: "Status",
			dataIndex: "status",
			render: (_: string, record: any) => {
				const ccmStatus = CCMStatus.find((items: any) => items.value === record?.status)
				return (
					<>
						<span>
							{ccmStatus?.name}
						</span>
					</>
				)
			}
		},
		{
			title: "CCM Coordinator",
			dataIndex: "ccm_coordinator",
			render: (_: string, record: any) => {
				const coordinatorId = record?.coordinator_id !== null && record?.coordinator_id !== "" ? record?.coordinator_id : record?.patient?.coordinator_id;
				const filterData = ccmCoordinator?.find((items: any) => items.id === coordinatorId)
				if (FilterData !== undefined) {
					return (
						<>
							<span> {filterData?.name} </span>
						</>
					)
				}
			}
		},
	];

	const onFinish = (fieldsValue: any) => {
		const rangeValue = fieldsValue["dateRange"];
		if (!rangeValue) {
			setCurrentPage(1);
		}

		const ccm_coordinator = fieldsValue["ccm_coordinator"] ? fieldsValue["ccm_coordinator"] : "";
		const values = {
			ccm_coordinator,
			dateRange: rangeValue
				? {
					from: rangeValue[0].format("MM/DD/YYYY"),
					to: rangeValue[1].format("MM/DD/YYYY"),
				}
				: {},
		};
		setValues(values);
	};
	const handleRowClick = (record: any) => {
		dispatch(setQuestionId(record.id));
		dispatch(setProgramId("1"));
		navigate(`/awvcareplan/${record.id}`, {
			state: { questionid: record.id },
		});
	};
	const dateFormat = "MM/DD/YYYY";

	const handleClick = () => {
		const updatedData = encounter.map((record: any) => {
			const coordinatorData = ccmCoordinator?.find((items: any) => items.id === record?.patient?.coordinator_id);

			return {
				'Serial No': record?.serial_no,
				'Name': record?.patient?.name,
				'Age': record?.patient?.age,
				'Date of Birth': moment(record?.patient?.dob).format('MM/DD/YYYY'),
				'Date of Service': moment(record?.date_of_service).format('MM/DD/YYYY'),
				'Status': record?.status,
				'CCM Coordinator': coordinatorData?.name,
			};
		});
		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.json_to_sheet(updatedData);
		XLSX.utils.book_append_sheet(workbook, worksheet, "Encounters");
		XLSX.writeFile(workbook, "Encounters.xlsx");
	};

	return (
		<div className="container mt-5" style={{ margin: "", background: "white", padding: "10px", borderRadius: "7px", }} >
			<div style={{ width: "100%" }}>
				<div className="row">
					<div className="col-6 sm-12 ">
						<h2>Completed Encounters</h2>
					</div>
				</div>
				<br />
				<div className="row">
					<div className="col-10 sm-12">
						<Form layout="inline" onFinish={onFinish}>
							{roleId === "1" || roleId === String('13') ? (
								<Form.Item name="ccm_coordinator" label="Select Coordinator">
									<Select
										allowClear
										placeholder="Select"
										style={{ width: 150 }}
										options={ccmCoordinator.map((items: any) => {
											return { value: items.id, label: items.name };
										})}
									/>
								</Form.Item>
							) : null}
							<Form.Item name="dateRange" label="Select Date">
								<RangePicker format={dateFormat} />
							</Form.Item>
							<Form.Item>
								<Button
									type="primary"
									shape="circle"
									icon={<SearchOutlined />}
									htmlType="submit"
								/>
							</Form.Item>
						</Form>

					</div>
					<div className="col-2 sm-12 text-right">
						<Button
							type="primary"
							className="btn-success"
							shape="round"
							htmlType="submit"
							onClick={handleClick}
						>
							Export
						</Button>
					</div>
				</div>

				<br />
				<div className="row">
					<div className="col-12 sm-12 ">
						<Table
							pagination={{
								showSizeChanger: false,
								total: totalRecords,
								showTotal: (totalRecords, range) =>
									`${range[0]}-${range[1]} of ${totalRecords} items`,
							}}
							columns={columns}
							dataSource={encounter}
							bordered
							style={{ cursor: "pointer" }}
							onRow={(record) => {
								return {
									onClick: () => handleRowClick(record),
								};
							}}
							size="large"
							loading={{ spinning: loading, indicator: antIcon }}
							{...encounter.length > 10 ? { onChange: handleTableChange } : {}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CompletedEncounter;
