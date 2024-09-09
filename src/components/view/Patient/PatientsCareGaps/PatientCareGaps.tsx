
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Col, DatePicker, Input, Modal, Row, Select, Spin, Table, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { updatePatientCareGap, addCareGapComments, updateSingleComment, downloadFile, fetchCurrentYearGaps } from "../../../../actions/Patients/PatientActions";
import "./PatientCareGaps.css";
import { OpenNotification } from "../../../../Utilties/Utilties";
import { CloudUploadOutlined, EditOutlined, EyeOutlined, FileOutlined, LoadingOutlined, MessageOutlined } from "@ant-design/icons";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { Option } from "antd/lib/mentions";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ReactHtmlParser from 'react-html-parser';
import { PatientCareGap } from "@/Types/PatientType";


const { Text } = Typography;
interface Props {
	patients: any,
}
const PatientCareGaps: React.FC<Props> = ({
	patients,
}) => {
	const [careGap, setCareGap] = useState<any>({});
	const [isEditBpModal, setIsEditBpModal] = useState<boolean>(false);
	const [isEditBCSModal, setIsEditBCSModal] = useState<boolean>(false);
	const [isEditCCSModal, setIsEditCCSModal] = useState<boolean>(false);
	const [isEditCBPModal, setIsEditCBPModal] = useState<boolean>(false);
	const [isEditHbA1cModal, setIsEditHbA1cModal] = useState<boolean>(false);
	const [isEditScheduleModal, setIsEditScheduleModal] = useState<boolean>(false);
	const [isEditHbA1cPoorModal, setIsEditHbA1cPoorModal] = useState<boolean>(false);
	const [isEditComment, setIsEditComment] = useState<boolean>(false);
	const [isEditSingleComment, setIsEditSingleComment] = useState<boolean>(false);
	const [ccsChangeValue, setCcsChangeValue] = useState<string>("");
	const [ccsStartValue, setCcsStartValue] = useState<string>("");
	const [ccsEndValue, setCcsEndValue] = useState<string>("");
	const [payload, setPayload] = useState<any>({});
	const [patientDetails, setPatientDetails] = useState<any>({});
	const [gapTitle, setGapTitle] = useState<string>("");
	const [commentInput, setCommentInput] = useState<string>("");
	const [singleCommentInput, setSingleCommentInput] = useState<string>("");
	const [singleCommentId, setSingleCommentId] = useState<string>("");
	const [editCommentName, setEditCommentName] = useState<string>("");
	const [commentDetails, setCommentDetails] = useState<any[]>([]);
	const [careGapComments, setCareGapComments] = useState<any[]>([]);
	const [file, setFile] = useState<any>(null);
	const [fileName, setFileName] = useState<string>("");
	const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
	const [loading, setLoading] = useState<boolean>(false);
	const [careGapSource, setCareGapSource] = useState<any[]>([]);
	const [isEditViewGapDetails, setIsEditViewGapDetails] = useState<boolean>(false);
	const [viewGapDetails, setViewGapDetails] = useState<any[]>([]);
	const [filterYear, setFilterYear] = useState<string>(moment().year().toString());

	const token = localStorage.getItem("token");
	const formattedDate = payload?.date ? moment(payload.date, "MM/DD/YYYY") : null;
	const selectedYear = filterYear !== "" ? moment(filterYear, 'YYYY') : undefined;


	useEffect(() => {
		fetchAllData();
	}, [patients?.care_gaps,]);
	const fetchAllData = () => {
		setCareGap(patients?.care_gaps);
		setCareGapComments(patients?.CareGapsComments);
		setCareGapSource(patients?.care_gaps_array);
	}

	const reversedDataSource = [...commentDetails].reverse();

	const htmlToReact = (html: any) => {
		return ReactHtmlParser(html);
	};

	const urll = process.env.REACT_APP_API_URL;
	const startYear = (moment().startOf("year").format('MM/DD/YYYY') as any);
	const endYear = (moment().endOf("year").format('MM/DD/YYYY') as any);

	const onChange = (value: any, name: any) => {

		setLoading(true);
		setPayload([]);
		const id = careGap?.id;
		const data = {
			...patientDetails,
			["patient_id"]: id,
			["col_name"]: name,
			["col_value"]: value,
		}
		setPatientDetails(data);
		const ignoreGaps = [
			'adults_func_gap',
			'post_disc_gap',
			'adults_medic_gap',
			'after_inp_disc_gap',
			'pain_screening_gap',
			'eye_exam_gap',
			'statin_therapy_gap',
			'osteoporosis_mgmt_gap',
		];


		if ((value === "Compliant" || value === "Pending Visit" && name === "awv_gap") && !ignoreGaps.includes(name)) {
			setLoading(false);

			if (name === "bp_control_gap" && value !== "Scheduled") {
				setIsEditBpModal(true);
			}
			if (name === "breast_cancer_gap" && value !== "Scheduled") {
				setIsEditBCSModal(true);
			}
			if (name === "colorectal_cancer_gap" && value !== "Scheduled") {
				setIsEditCCSModal(true);
			}
			if (name === "high_bp_gap" && value !== "Scheduled") {
				setIsEditCBPModal(true);
			}
			if (name === "hba1c_gap" && value !== "Scheduled") {
				setIsEditHbA1cModal(true);
			}
			if (name === "hba1c_poor_gap" && value !== "Scheduled") {
				setIsEditHbA1cPoorModal(true);
			}
			if (value === "Pending Visit" && name === "awv_gap") {
				setIsEditScheduleModal(true);
			}

		} else {
			if (value === "Pending Visit" && name === "awv_gap") {
				setIsEditScheduleModal(true);
				setLoading(false);
			} else {
				setLoading(true);

				const datas = {
					["patient_id"]: patients?.id,
					["col_name"]: name,
					["col_value"]: value,
					["insurance_id"]: patients?.insurance_id,
					["doctor_id"]: patients?.doctor_id,
					["clinic_id"]: patients?.clinic_id,
					["filter_year"]: filterYear,
				}

				let gap_id = "";
				if (patients?.care_gaps?.id) {
					gap_id = patients?.care_gaps?.id;
				} else {
					gap_id = "0";
				}

				const ins_name = patients?.insurance_name;
				const newInsName = ins_name.split(' ');
				const newUrl = newInsName[0] === "Medicare" || newInsName[1] === "Medicare" || newInsName[0] === "United" || newInsName[0] === "Healthchoice" && newInsName[1] === "Arizona" ?
					newInsName[0].toLowerCase() + newInsName[1].toLowerCase() :
					newInsName[0].toLowerCase();
				updatePatientCareGap(newUrl, gap_id, datas).then(({ data: response }) => {
					if (response.success === true) {
						setLoading(false);
						const updatedCareGaps = careGapSource.map((record: PatientCareGap) => {
							if (record.db_column === name) {
								const updatedDetails = [response?.CareGapsDetailsData, ...record.details];
								let updatedGapStatus = [...record.gap_status];
								updatedGapStatus = response?.CareGapsDetailsData?.status;
								return {
									...record,
									details: updatedDetails,
									gap_status: updatedGapStatus,
								};
							}
							return record;
						});
						setCareGapSource(updatedCareGaps);
						OpenNotification("success", response.message);
					}
				}).catch((response) => {
					OpenNotification("error", response.message);
				});
			}
		}
	};

	const onChangeCCS = (e: any) => {
		const value = e.target.value;
		const data = {
			...payload,
			["testType"]: value
		};
		setPayload(data);
		setCcsChangeValue(value);
		const currentDate = moment();
		if (value === "FOBT/FIT") {
			const startOfYear = (moment().startOf("year").format('MM/DD/YYYY') as any);
			const endOfYear = (moment().endOf("year").format('MM/DD/YYYY') as any);
			setCcsStartValue(startOfYear);
			setCcsEndValue(endOfYear);
		}
		if (value === "Colonoscopy") {
			const endOfYear = (moment().endOf("year").format('MM/DD/YYYY') as any);
			const tenYearsAgo = (currentDate.clone().subtract(9, 'years').startOf('year').format('MM/DD/YYYY') as any);
			setCcsStartValue(tenYearsAgo);
			setCcsEndValue(endOfYear);
		}
		if (value === "Cologuard") {
			const endOfYear = (currentDate.clone().endOf('year').format('MM/DD/YYYY') as any);
			const threeYearsAgo = (currentDate.clone().subtract(2, 'years').startOf('year').format('MM/DD/YYYY') as any);
			setCcsStartValue(threeYearsAgo);
			setCcsEndValue(endOfYear);
		}
	}

	const handleFileChange = (e: any) => {
		if (e.target.files[0]) {
			setFileName(e.target.files[0].name);
			setFile(e.target.files[0]);
		}
		else {
			setFileName("");
			setFile(null);
		}
	};

	const handleOk = () => {
		setLoading(true);
		let gap_id = "";
		if (patients?.care_gaps?.id) {
			gap_id = patients?.care_gaps?.id;
		}
		else {
			gap_id = "0";
		}

		const insurance_name = patients?.insurance_name;
		const newInsName = insurance_name.split(" ");
		const newUrl = newInsName[0] === "Medicare" || newInsName[1] === "Medicare" || newInsName[0] === "United" || newInsName[0] === "Healthchoice" && newInsName[1] === "Arizona" ?
			newInsName[0].toLowerCase() + newInsName[1].toLowerCase() :
			newInsName[0].toLowerCase();

		const xhr = new XMLHttpRequest();
		const frmData = new FormData();
		frmData.append("patient_id", patients?.id);
		frmData.append("clinic_id", patients?.clinic_id);
		frmData.append("doctor_id", patients?.doctor_id);
		frmData.append("insurance_id", patients?.insurance_id);
		frmData.append("col_name", patientDetails?.col_name);
		frmData.append("col_value", patientDetails?.col_value);
		frmData.append("filter_year", filterYear);
		frmData.append("caregap_details", JSON.stringify(payload));
		frmData.append("file", file);
		xhr.responseType = "json";
		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4 && this.status === 200) {
				OpenNotification("success", "Record added successfully");
			}
		});
		const url = `${urll}/${newUrl}/update/${gap_id}`;
		xhr.responseType = "json";
		xhr.addEventListener("readystatechange", function () {
			if (this.readyState === 4 && this.status === 200) {
				setLoading(false);
				setPayload({});

				const updatedCareGaps = careGapSource.map((record: PatientCareGap) => {
					if (record.db_column === patientDetails?.col_name) {
						const updatedDetails = [this.response.CareGapsDetailsData, ...record.details];
						let updatedGapStatus = [...record.gap_status];
						updatedGapStatus = this.response.CareGapsDetailsData.status;
						return {
							...record,
							details: updatedDetails,
							gap_status: updatedGapStatus,
						};
					}
					return record;
				});
				setCareGapSource(updatedCareGaps);

				if (this.response.success === true) {
					handleCancel();
					OpenNotification("success", this.response.message);
				} else {
					handleCancel();
					OpenNotification("error", this.response.message);
				}
			}
		});
		xhr.open("POST", url);
		xhr.setRequestHeader("Authorization", `Bearer ${token}`);
		xhr.setRequestHeader("Access-Control-Allow-Origin", `*`);
		xhr.setRequestHeader(
			"access-control-allow-methods",
			`GET, PUT, POST, DELETE, HEAD, OPTIONS`
		);
		if (frmData) {
			xhr.send(frmData);
		}
	};

	const handleCancel = () => {
		setIsEditBpModal(false);
		setIsEditBCSModal(false);
		setIsEditCCSModal(false);
		setIsEditCBPModal(false);
		setIsEditHbA1cModal(false);
		setIsEditHbA1cPoorModal(false);
		setIsEditScheduleModal(false);
		setIsEditComment(false);
		setCommentInput("");
		setPayload({});
		setFile(null);
		setFileName("");
		setIsEditViewGapDetails(false);
	};

	const handleCancelComment = () => {
		setIsEditSingleComment(false);
		setSingleCommentInput("");
	};

	const disabledDate = (current: any) => {
		const currentDate = moment();
		if (ccsChangeValue === "FOBT/FIT") {
			const startOfYear = (currentDate.clone().startOf('year').format('MM/DD/YYYY') as any);
			const endOfYear = (currentDate.clone().endOf('year').format('MM/DD/YYYY') as any);
			setCcsStartValue(startOfYear);
			setCcsEndValue(endOfYear);
			return current.isBefore(startOfYear) || current.isAfter(endOfYear);
		}
		if (ccsChangeValue === "Colonoscopy") {
			const endOfYear = (currentDate.clone().endOf('year').format('MM/DD/YYYY') as any);
			const tenYearsAgo = (currentDate.clone().subtract(9, 'years').startOf('year').format('MM/DD/YYYY') as any);
			setCcsStartValue(tenYearsAgo);
			setCcsEndValue(endOfYear);
			return current.isBefore(tenYearsAgo) || current.isAfter(currentDate);
		}
		if (ccsChangeValue === "Cologuard") {
			const endOfYear = (currentDate.clone().endOf('year').format('MM/DD/YYYY') as any);
			const threeYearsAgo = (currentDate.clone().subtract(2, 'years').startOf('year').format('MM/DD/YYYY') as any);
			setCcsStartValue(threeYearsAgo);
			setCcsEndValue(endOfYear);
			return current.isBefore(threeYearsAgo) || current.isAfter(currentDate);
		}
	}

	const handleEditCareGap = (e: any) => {
		const name = e.target.name;
		const value = e.target.value;
		const data = {
			...payload,
			[name]: value
		};
		setPayload(data);
	}

	const onChangeDate = (date: any, dateString: any) => {
		const data = {
			...payload,
			date: dateString
		};
		setPayload(data);
	};

	function getClassNameForOption(option: any) {
		switch (option) {
			case 'Compliant':
			case 'Completed':
			case 'completed':
				return 'green-option';

			case 'Non-Compliant':
				return 'pink-option';

			case 'Scheduled':
			case 'Pending Visit':
				return 'yellow-option';

			case 'Refusal Reviewed':
			case 'Unable to reach':
			case 'Unable to Reach':
			case 'Changed PCP':
			case 'Deceased':
			case 'need to schedule':
			case 'Left Practice':
			case 'Not In Service':
			case 'Not an Established patient':
				return 'pink-option';

			case 'Patient Refused':
			case 'Refused':
			case 'refused':
				return 'orange-option';

			case 'N/A':
				return 'gray-option';
			default:
				return '';
		}
	}

	const handleEditComment = (comments: any, caregap_column: string) => {
		setEditCommentName(caregap_column);
		const tempCommentDetails = comments?.map((item: { caregap_name: string, comment: string, created_at: string, id: number, userinfo: { name: string } }) => {
			return {
				caregap_name: item?.caregap_name,
				comment: item?.comment,
				created_at: item?.created_at,
				id: item?.id,
				userinfo: item?.userinfo
			};
		});

		setCommentDetails(tempCommentDetails);
		setIsEditComment(true);
	}

	const handleCommentSave = () => {
		setLoading(true);
		let gap_id = "";
		if (patients?.care_gaps?.id) {
			gap_id = patients?.care_gaps?.id;
		}
		else {
			gap_id = "0";
		}
		if (commentInput !== "" && commentInput !== "<div><br></div>") {
			const payload = {
				["patient_id"]: patients?.id,
				["caregap_id"]: gap_id,
				["caregap_name"]: editCommentName,
				["comment"]: commentInput,
			}
			addCareGapComments(payload).then(({ data: response }) => {
				if (response.success === true) {
					setLoading(false);
					OpenNotification("success", response.message);
					setCommentInput("");
					const updatedCareGaps = careGapSource.map((record: PatientCareGap) => {
						if (record.db_column === editCommentName) {
							const updatedComments = [response.CommentsData, ...record.comments];
							return {
								...record,
								comments: updatedComments,
							};
						}
						return record;
					});
					setCareGapSource(updatedCareGaps);
					setIsEditComment(false);
				}



			}).catch((response) => {
				OpenNotification("error", response.message);
			});
		} else {
			OpenNotification("error", "No Comment to add");
			setLoading(false);
		}
	}

	const handleSingleCommentSave = () => {
		setLoading(true);
		const payload = {
			["comment"]: singleCommentInput,
		}
		if (singleCommentInput !== "<div><br></div>") {
			updateSingleComment(singleCommentId, payload).then(({ data: response }) => {
				if (response.success === true) {
					setLoading(false);
					OpenNotification("success", response.message);
					setSingleCommentInput("");
					const updatedCareGaps = careGapSource.map((record: PatientCareGap) => {
						if (record.db_column === editCommentName) {
							const commentIndex = record.comments.findIndex(comment => comment.id === response.CommentsData.id);
							if (commentIndex !== -1) {
								const updatedComments = [...record.comments];
								updatedComments[commentIndex] = response.CommentsData;

								setCommentDetails(updatedComments);
								return {
									...record,
									comments: updatedComments,
								};
							}
						}
						return record;
					});
					setCareGapSource(updatedCareGaps);
					setIsEditSingleComment(false);
				}
			}).catch((response) => {
				OpenNotification("error", response.message);
			});
		} else {
			OpenNotification("error", "No Comment to add");
			setLoading(false);
		}
	}

	const handleEditSingleComment = (id: string, comment: string) => {
		setSingleCommentInput(comment);
		setSingleCommentId(id);
		setIsEditSingleComment(true);
	}

	const handleFileClick = (file: string) => {
		setLoading(true);
		OpenNotification('success', 'File Downloading in Process!');
		const payload = {
			filename: file,
		};
		downloadFile(payload)
			.then(({ data: response }) => {
				setLoading(false);
				const url = window.URL.createObjectURL(new Blob([response]));
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute('download', `${file}`);
				document.body.appendChild(link);
				link.click();
				OpenNotification('success', 'File Download Successfully!');
			})
			.catch((error) => {
				OpenNotification('error', error.message);
			});
	};

	const handleviewDetails = (record: PatientCareGap) => {
		setIsEditViewGapDetails(true);
		const detailsArray = record.details?.map((item: { caregap_details: string, status: string, created_at: string, userinfo: { name: string } }) => ({
			gap_details: JSON.parse(item?.caregap_details),
			status: item?.status,
			created_at: item?.created_at,
			name: item?.userinfo.name,
		})) || [];
		setViewGapDetails(detailsArray);
	}

	function handleFilterYear(val: string) {
		setFilterYear(val)

		const payload = {
			'patient_id': patients?.id,
			'filter_year': val,
		}

		fetchCurrentYearGaps(payload)
			.then((response: any) => {
				if (response.data.success) {
					setCareGapSource(response.data.data);
				} else {
					OpenNotification("error", response.data.message);
				}
			})
			.catch(function (e) {
				console.log(e);
			})
	}

	const gapColumns = [
		{
			title: 'Gap Results',
			dataIndex: 'details',
			key: 'details',
			// width: 420,
			render: (text: any, record: PatientCareGap) => {
				if (record !== undefined && record !== null) {
					const data = record?.gap_details;
					return (
						<>
							<Text>
								{
									(data?.date !== undefined ? "Last Date: " + data?.date : '') + (data?.result !== undefined ? " Result: " + data?.result : '') + (data?.notes !== undefined ? " Notes: " + data?.notes : '') +
									(data?.testType !== undefined ? " Test Type: " + data?.testType : '') + (data?.systolicBp !== undefined ? " Systolic Bp: " + data?.systolicBp : '') + (data?.diastolicBp !== undefined ? " Diastolic Bp: " + data?.diastolicBp : '') +
									(data?.examResult !== undefined ? " Exam Result: " + data?.examResult : '')
								}
							</Text>
							<div>
								<Text strong>{record?.name}</Text>
								<span>
									<Text strong className="float-right">{moment(record?.created_at).format('MM/DD/YYYY HH:mm:ss')}</Text>
								</span>
							</div>
						</>
					)
				}
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			width: 150,
		},
	];

	const careGapColumns = [
		{
			title: 'Gap Name',
			dataIndex: 'title',
			key: 'title',
		},
		{
			title: 'Gap Results',
			dataIndex: 'details',
			key: 'details',
			render: (text: any, record: PatientCareGap) => {

				if (record !== undefined && record !== null) {

					const firstIndex = record?.details[0]?.caregap_details;
					if (firstIndex !== null && firstIndex !== undefined) {
						const data = JSON.parse(firstIndex);
						return (
							<Text>{
								(data?.date !== undefined ? "Last Date: " + data?.date : '') + (data?.result !== undefined ? " Result: " + data?.result : '') + (data?.notes !== undefined ? " Notes: " + data?.notes : '') +
								(data?.testType !== undefined ? " Test Type: " + data?.testType : '') + (data?.systolicBp !== undefined ? " Systolic Bp: " + data?.systolicBp : '') + (data?.diastolicBp !== undefined ? " Diastolic Bp: " + data?.diastolicBp : '') +
								(data?.examResult !== undefined ? " Exam Result: " + data?.examResult : '')
							}</Text>
						)
					}
				}
			},
		},
		{
			title: 'Details',
			dataIndex: 'details',
			key: 'details',
			className: "gapDetailsClass",
			render: (text: any, record: PatientCareGap) => {

				if (record !== undefined && record !== null) {

					return (
						<Tooltip title="View Details"><span className="viewDetails" onClick={() => handleviewDetails(record)}><EyeOutlined /></span></Tooltip>
					)
				}
			},
		},
		{
			title: 'File',
			dataIndex: 'details',
			key: 'details',
			render: (text: any, record: PatientCareGap) => {

				if (record !== undefined && record !== null) {

					const firstIndex = record?.details[0]?.filename;
					if (firstIndex !== null && firstIndex !== undefined) {
						return (
							<Tooltip title={firstIndex}><span className="viewDetails" onClick={() => handleFileClick(firstIndex)}><FileOutlined /></span></Tooltip>
						)
					}
				}
			},
		},
		{
			title: 'Status',
			dataIndex: 'status',
			key: 'status',
			render: (_: any, record: PatientCareGap) => {
				const selectedValue = record?.gap_status;

				return (
					<Select
						onChange={(value: any) => onChange(value, record.db_column)}
						className={`${record.db_column} custom-select-class ${getClassNameForOption(selectedValue)}`}
						value={selectedValue}
						disabled={record?.db_column === "pc_readmissions_gap" ? true : false || patients?.gaps_as_per === "1" ? true : false}
					>
						{record.options.map((item) => (
							<Option
								key={item}
								value={item}
								className={`${record.db_column} custom-select-option ${getClassNameForOption(item)} ${item === selectedValue ? 'selected-option' : ''}`}
							>
								{item?.value}
							</Option>
						))}
					</Select>


				);
			},
		},
		{
			title: 'Comment',
			dataIndex: 'comments',
			key: 'comments',
			render: (text: any, record: PatientCareGap) => {
				let customClass = "blusComment";
				let lastComment = "";
				if (record !== undefined && record !== null) {
					if (record.comments.length > 0) {
						const dateString = record.comments[0]?.updated_at;
						const providedDate = moment(dateString);
						const currentDate = moment();
						const weekDiff = Math.round(currentDate.diff(providedDate, "week", true));
						if (weekDiff <= 4) {
							customClass = 'pinkComment';
						} else if (weekDiff > 4 && weekDiff <= 12) {
							customClass = 'yellowComment';
						} else if (weekDiff > 12) {
							customClass = 'greenComment';
						}
						lastComment = record.comments[0]?.comment !== undefined ? record.comments[0]?.comment : "";
					}
				}

				return (
					<Button type="link"
						onClick={() => handleEditComment(record?.comments, record?.db_column)}
					>
						<Tooltip placement="topLeft" title={lastComment !== "" ? htmlToReact(lastComment) : ""}>
							<MessageOutlined className={customClass} />
						</Tooltip>
					</Button>
				)
			},
		},
	];

	const commentColumns = [
		{
			title: 'Comment',
			dataIndex: 'comment',
			key: 'comment',
			render: (_: any, record: any) =>
				record ? (
					<>
						<div>{htmlToReact(record?.comment)}
						</div>
						<strong className="float-left showNameAndDate" >{record?.userinfo?.name}</strong><strong className="float-right showNameAndDate">{moment(record?.created_at).format('MM/DD/YYYY HH:mm:ss')}</strong>
					</>
				) : null
		},
		{
			title: 'Action',
			dataIndex: 'id',
			key: 'id',
			width: 70,
			render: (id: string, record: { comment: string }) => {
				return <Button type="ghost" onClick={() => handleEditSingleComment(id, record?.comment)}><EditOutlined /></Button>;
			}
		},
	];

	return (
		<>
			<div className="container-fluid">
				<Card>
					<Row className="mb-2" style={{ float: "right" }}>
						<DatePicker
							picker="year"
							value={selectedYear}
							onChange={(date, dateString) => handleFilterYear(dateString)}
						/>

					</Row>
					<Table
						columns={careGapColumns}
						dataSource={careGapSource}
						pagination={false}

					/>
				</Card>
			</div>

			<Modal width={600} title="Complete Blood Pressure Controlled" open={isEditBpModal} onCancel={handleCancel} onOk={() => handleOk()}>
				<Spin spinning={loading} indicator={antIcon}>
					<Row className="mb-2">
						<Col span={24}><Text strong>Date must be after most recent hypertension diagnosis. <br />To close this gap, the screening date must be in the range {startYear} - {endYear}</Text></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Date of BP Measurement:</Col>
						<Col span={6}>
							<DatePicker
								name="date"
								format="MM/DD/YYYY"
								placeholder="MM/DD/YYYY"
								value={formattedDate}
								onChange={(date, dateString) => {
									onChangeDate('date', dateString);
								}}
								disabledDate={(current) => {
									const startOfYear = moment().startOf("year");
									const endOfYear = moment().endOf("year");
									return current.isBefore(startOfYear) || current.isAfter(endOfYear);
								}}
							/>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Systolic BP</Col>
						<Col span={6}>
							<Input type="number" value={payload?.systolicBp ?? ''} min={1} name="systolicBp" onChange={(e: any) => handleEditCareGap(e)} />
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Diastolic BP</Col>
						<Col span={6}>
							<Input type="number" value={payload?.diastolicBp ?? ''} min={1} name="diastolicBp" onChange={(e: any) => handleEditCareGap(e)} />
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Attatchment (Optional)</Col>
						<Col span={6}><Input type="file" accept="application/pdf" className="InputFileClass" onChange={(e: any) => handleFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
					</Row>
				</Spin>
			</Modal>

			<Modal width={600} title="Complete Breast Cancer Screening" open={isEditBCSModal} onCancel={handleCancel} onOk={() => handleOk()}>
				<Spin spinning={loading} indicator={antIcon}>
					<Row className="mb-2">
						<Col span={24}><Text strong>To close this gap, the screening date must be in the range 10-01-2022 - 08-29-2023</Text></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Date of Mammography</Col>
						<Col span={6}>
							<DatePicker
								value={formattedDate}
								name="date"
								format="MM/DD/YYYY"
								placeholder="MM/DD/YYYY"
								onChange={(date, dateString) => onChangeDate("date", dateString)}
								disabledDate={(current) => {
									const currentDate = moment();
									const decemberOfCurrentYear = moment().month(11).endOf('month');
									const startDate = decemberOfCurrentYear.clone().subtract(27, 'months');
									return current.isBefore(startDate) || current.isAfter(currentDate);
								}}
							/>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Result</Col>
						<Col span={6}>
							<select
								className="form-control form-control-sm"
								placeholder="Select a Status"
								name="result"
								onChange={(e: any) => handleEditCareGap(e)}
								value={payload?.result ?? ''}
							>
								<option value="" disabled selected>None</option>
								<option value="Abnormal">Abnormal</option>
								<option value="Normal">Normal</option>
							</select>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Attatchment (Optional)</Col>
						<Col span={6}><Input type="file" accept="application/pdf" className="InputFileClass" onChange={(e: any) => handleFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
					</Row>
					<Row className="mb-2">
						<Col span={24}>
							<label htmlFor="">Notes (Optional)</label>
							<TextArea value={payload?.notes} name="notes" maxLength={100} onChange={(e: any) => handleEditCareGap(e)} />
						</Col>
					</Row>
				</Spin>
			</Modal>

			<Modal width={600} title="Complete Colorectal Cancer Screening" open={isEditCCSModal} onCancel={handleCancel} onOk={() => handleOk()}>
				<Spin spinning={loading} indicator={antIcon}>
					<Row className="mb-2">
						<Col span={18}>
							<Text >Test Type</Text> <br />
							<Text strong>FOBT/FIT Test: During current calendar year <br />
								Colonoscopy: During current calendar year or 9 years older <br />
								Cologuard: During current calendar year or 2 years older <br />
								To close this gap, the screening date must be in the range {ccsStartValue} - {ccsEndValue}</Text>

						</Col>
						<Col span={6}>
							<select
								className="form-control form-control-sm"
								placeholder="Select a Status"
								name="kidney_health_gap"
								onChange={(e: any) => onChangeCCS(e)}
							>
								<option value="" disabled selected>None</option>
								<option value="FOBT/FIT">FOBT/FIT</option>
								<option value="Colonoscopy">Colonoscopy</option>
								<option value="Cologuard">Cologuard</option>
							</select>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Date of Screening (Select test type to enable date)</Col>
						<Col span={6}>
							<DatePicker
								value={formattedDate}
								name="date"
								format="MM/DD/YYYY"
								placeholder="MM/DD/YYYY"
								onChange={(date, dateString) => onChangeDate("date5 ", dateString)}
								disabledDate={disabledDate}
								disabled={ccsChangeValue === "" ? true : false}
							/>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Test Result</Col>
						<Col span={6}>
							<select
								className="form-control form-control-sm"
								placeholder="Select a Status"
								name="result"
								value={payload?.result ?? ''}
								onChange={(e: any) => handleEditCareGap(e)}
							>
								<option value="" disabled selected>None</option>
								<option value="Positive">Positive</option>
								<option value="Negative">Negative</option>
							</select>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Attatchment (Optional)</Col>
						<Col span={6}><Input type="file" accept="application/pdf" className="InputFileClass" onChange={(e: any) => handleFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
					</Row>
					<Row className="mb-2">
						<Col span={24}>
							<label htmlFor="">Notes (Optional)</label>
							<TextArea value={payload?.notes} name="notes" maxLength={100} onChange={(e: any) => handleEditCareGap(e)} />
						</Col>
					</Row>
				</Spin>
			</Modal>

			<Modal width={600} title="Controlling High Blood Pressure" open={isEditCBPModal} onCancel={handleCancel} onOk={() => handleOk()}>
				<Spin spinning={loading} indicator={antIcon}>
					<Row className="mb-2">
						<Col span={24}><Text strong>Date must be after most recent hypertension diagnosis. <br />To close this gap, the screening date must be in the range {startYear} - {endYear}</Text></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Date of BP Measurement:</Col>
						<Col span={6}>
							<DatePicker
								value={formattedDate}
								name="date"
								format="MM/DD/YYYY"
								placeholder="MM/DD/YYYY"
								onChange={(date, dateString) => onChangeDate("date", dateString)}
								disabledDate={(current) => {
									const startOfYear = moment().startOf("year");
									const endOfYear = moment().endOf("year");
									return current.isBefore(startOfYear) || current.isAfter(endOfYear);
								}}
							/>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Systolic BP</Col>
						<Col span={6}><Input type="number" value={payload?.systolicBp ?? ''} name="systolicBp" onChange={(e: any) => handleEditCareGap(e)} /></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Diastolic BP</Col>
						<Col span={6}><Input type="number" value={payload?.diastolicBp ?? ''} name="diastolicBp" onChange={(e: any) => handleEditCareGap(e)} /></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Attatchment (Optional)</Col>
						<Col span={6}><Input type="file" accept="application/pdf" className="InputFileClass" onChange={(e: any) => handleFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
					</Row>
				</Spin>
			</Modal>

			<Modal width={600} title="Complete Diabetic HbA1c < 8%" open={isEditHbA1cModal} onCancel={handleCancel} onOk={() => handleOk()}>
				<Spin spinning={loading} indicator={antIcon}>
					<Row className="mb-2">
						<Col span={24}><Text strong>To close this gap, the screening date must be in the range {startYear} - {endYear}</Text></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Date of HbA1C Test:</Col>
						<Col span={6}>
							<DatePicker
								value={formattedDate}
								name="date"
								format="MM/DD/YYYY"
								placeholder="MM/DD/YYYY"
								onChange={(date, dateString) => onChangeDate("date", dateString)}
								disabledDate={(current) => {
									const startOfYear = moment().startOf("year");
									const endOfYear = moment().endOf("year");
									return current.isBefore(startOfYear) || current.isAfter(endOfYear);
								}}
							/>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Exam Result</Col>
						<Col span={6}><Input type="text" value={payload?.examResult ?? ''} name="examResult" onChange={(e: any) => handleEditCareGap(e)} /></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Attatchment (Optional)</Col>
						<Col span={6}><Input type="file" accept="application/pdf" className="InputFileClass" onChange={(e: any) => handleFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
					</Row>
				</Spin>
			</Modal>
			<Modal width={600} title="Set Patient Scheduled Date" open={isEditScheduleModal} onCancel={handleCancel} onOk={() => handleOk()}>
				<Spin spinning={loading} indicator={antIcon}>
					<Row className="mb-2">
						<Col span={24}><Text strong>Select a Date for Schedule:</Text></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Date:</Col>
						<Col span={6}>
							<DatePicker
								value={formattedDate}
								name="date"
								format="MM/DD/YYYY"
								placeholder="MM/DD/YYYY"
								onChange={(date, dateString) => onChangeDate("date", dateString)}
								defaultValue={undefined}
								disabledDate={(current) => {
									const currentDate = moment();
									return current.isBefore(currentDate);
								}}
							/>
						</Col>
					</Row>
				</Spin>
			</Modal>
			<Modal width={600} title="Complete Diabetes Care - Blood Sugar Control (>9%)" open={isEditHbA1cPoorModal} onCancel={handleCancel} onOk={() => handleOk()}>
				<Spin spinning={loading} indicator={antIcon}>
					<Row className="mb-2">
						<Col span={24}><Text strong>To close this gap, the screening date must be in the range {startYear} - {endYear}</Text></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Date of HbA1C Test:</Col>
						<Col span={6}>
							<DatePicker
								value={formattedDate}
								name="date"
								format="MM/DD/YYYY"
								placeholder="MM/DD/YYYY"
								onChange={(date, dateString) => onChangeDate("date", dateString)}
								disabledDate={(current) => {
									const startOfYear = moment().startOf("year");
									const endOfYear = moment().endOf("year");
									return current.isBefore(startOfYear) || current.isAfter(endOfYear);
								}}
							/>
						</Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Exam Result</Col>
						<Col span={6}><Input type="text" value={payload?.examResult ?? ''} name="examResult" onChange={(e: any) => handleEditCareGap(e)} /></Col>
					</Row>
					<Row className="mb-2">
						<Col span={18}>Attatchment (Optional)</Col>
						<Col span={6}><Input type="file" accept="application/pdf" className="InputFileClass" onChange={(e: any) => handleFileChange(e)} /><CloudUploadOutlined /><Text type="success">{fileName}</Text></Col>
					</Row>
				</Spin>
			</Modal>


			<Modal width={800} title={gapTitle} open={isEditComment} onCancel={handleCancel} maskClosable={false}
				closable={false} onOk={() => handleCommentSave()}>
				<Spin spinning={loading} indicator={antIcon}>
					<Table
						dataSource={reversedDataSource}
						columns={commentColumns}
						pagination={false}
						size="small"
						scroll={{ y: 350, }}
					/>
					<SunEditor
						setDefaultStyle="font-family: Arial; font-size: 14px;"
						setContents={commentInput}
						onChange={setCommentInput}
						name="comment"
						lang="en"
						height="100"
						setOptions={{
							buttonList: [
								["font", "fontSize"],
								["bold", "underline", "italic"],
								["undo", "redo"],
							],
							defaultTag: "div",
							minHeight: "100px",
							showPathLabel: false,
						}}
					/>
				</Spin>
			</Modal>

			<Modal width={800} title="Edit Comment" open={isEditSingleComment} onCancel={handleCancelComment} maskClosable={false}
				closable={false} onOk={() => handleSingleCommentSave()}>
				<Spin spinning={loading} indicator={antIcon}>
					<SunEditor
						setDefaultStyle="font-family: Arial; font-size: 14px;"
						setContents={singleCommentInput}
						onChange={setSingleCommentInput}
						name="comment"
						lang="en"
						height="100"
						setOptions={{
							buttonList: [
								["font", "fontSize"],
								["bold", "underline", "italic"],
								["undo", "redo"],
							],
							defaultTag: "div",
							minHeight: "100px",
							showPathLabel: false,
						}}
					/>
				</Spin>
			</Modal>
			<Modal width={800} title="View Gap Details" open={isEditViewGapDetails} onCancel={handleCancel} maskClosable={false}
				closable={false} okButtonProps={{ style: { display: 'none' } }}>
				<Spin spinning={loading} indicator={antIcon}>
					<Table
						dataSource={viewGapDetails}
						columns={gapColumns}
						pagination={false}
						size="small"
						scroll={{ y: 350, }}
					/>
				</Spin>
			</Modal>
		</>
	);
};

export default PatientCareGaps;
