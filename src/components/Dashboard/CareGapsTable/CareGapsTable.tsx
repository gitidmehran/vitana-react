import React from "react";
import { Card, DatePicker, Space, Switch, Table, Tooltip, Typography } from "antd";
import { InfoCircleOutlined, StarFilled } from "@ant-design/icons";
import moment from "moment";
const { Text } = Typography;
interface Props {
	careGapsData: any;
	careGapStatus: any;
	careGapStatusDate: any;
	handleSwitchCareGap: () => void;
	handleShowAllCompliant: (title: string, name: string, value: string) => void;
	handleShowCompliantFilter: (title: string, name: string, value: string) => void;
	handleFilterYear: (date: string) => void;
	insuranceProvider: string;
	filterYear: string;

}
const CareGapsTable: React.FC<Props> = ({
	careGapsData,
	careGapStatus,
	careGapStatusDate,
	handleSwitchCareGap,
	handleShowAllCompliant,
	handleShowCompliantFilter,
	handleFilterYear,
	insuranceProvider,
	filterYear
}) => {

	const selectedYear = filterYear !== "" ? moment(filterYear, 'YYYY') : undefined;

	const columns = [
		{
			title: 'Measure Name',
			dataIndex: 'Title',
			key: '0',
			fixed: 'left' as const,
			width: 250,
		},
		{
			title: 'Compliant Members',
			dataIndex: 'ClosedPatients',
			key: '1',
			className: 'tableTextCenter',
			render: (ClosedPatients: number, record: { Title: string, db_col_name: string, ClosedPatientsDifference: number }) => {
				const isCompliant = record?.ClosedPatientsDifference > 0;
				const canClick = isCompliant ? true : false;

				return (
					<>
						<span className="compNonCompClass" onClick={() => handleShowAllCompliant(record?.Title, record?.db_col_name, "ClosedPatients")}>
							{ClosedPatients}
						</span>
						<Tooltip title={`Discrepancy : ${record?.ClosedPatientsDifference}`} className="float-right">
							<InfoCircleOutlined
								onClick={() => canClick ? handleShowCompliantFilter(record?.Title, record?.db_col_name, "ClosedPatients") : false}
								className={`float-right ${isCompliant ? 'compliantIcon' : 'compliantIconBlank'}`}
							/>
						</Tooltip>
					</>
				);
			},

		},
		{
			title: 'Non-Compliant Members',
			dataIndex: 'OpenPatients',
			key: '2',
			className: 'tableTextCenter',
			render: (OpenPatients: number, record: { Title: string, db_col_name: string, ClosedPatientsDifference: number }) => {
				const isNonCompliant = record?.ClosedPatientsDifference > 0;
				const canClick = isNonCompliant ? true : false;

				return (
					<>
						<span className="compNonCompClass" onClick={() => handleShowAllCompliant(record?.Title, record.db_col_name, "OpenPatients")}>
							{OpenPatients}
						</span>
						<Tooltip title={`Discrepancy : ${record?.ClosedPatientsDifference}`} className="float-right">
							<InfoCircleOutlined
								onClick={() => canClick ? handleShowCompliantFilter(record?.Title, record.db_col_name, "ClosedPatients") : false}
								className={`float-right ${isNonCompliant ? 'nonCompliantIcon' : 'nonCompliantIconBlank'}`}
							/>
						</Tooltip>
					</>
				);
			},
		},
		// {
		//   title: 'Eligible',
		//   dataIndex: 'Eligible',
		//   key: '3',
		//   className: 'tableTextCenter'
		// },
		{
			title: 'Eligible',
			dataIndex: 'Total',
			key: '4',
			className: 'tableTextCenter'
		},
		{
			title: 'Minimum Performance Standard (MPS)*',
			dataIndex: 'Required_Par',
			key: '5',
			className: 'tableTextCenter',
			render: (Required_Par: string) => {
				return (
					<>
						{Required_Par !== "-" ? Required_Par + "%" : "-"}
					</>
				);
			},
		},
		{
			title: 'Your Rate',
			dataIndex: 'Acheived',
			key: '6',
			className: 'tableTextCenter',
			render: (Acheived: string) => {
				return (
					<>
						{Acheived !== "-" ? Math.round(Number(Acheived)) + "%" : "-"}
					</>
				);
			},
		},
		{
			title: 'Current Star',
			dataIndex: 'Star',
			key: '7',
			className: 'tableTextCenter',
			render: (Star: string) => {
				const ratingNumber = parseInt(Star);
				if (!isNaN(ratingNumber) && ratingNumber > 0) {
					let customClass = "starFilled";
					if (ratingNumber === 1) {
						customClass = "redStar";
					} else if ((ratingNumber === 2 && insuranceProvider === 'hcpw-001') || (ratingNumber === 4 && insuranceProvider === 'hum-001') || (ratingNumber === 4 && insuranceProvider === 'med-arz-001')) {
						customClass = "starFilled";
					} else if (ratingNumber === 3) {
						customClass = "orangeStar";
					} else if (ratingNumber === 4 && insuranceProvider === 'hcpw-001') {
						customClass = "greenStar";
					} else if ((ratingNumber === 2 && insuranceProvider === 'hum-001' || (ratingNumber === 2 && insuranceProvider === 'med-arz-001'))) {
						customClass = "pinkStar";
					} else if (ratingNumber === 5) {
						customClass = "greenStar";
					}


					return (
						<>
							<span>
								{ratingNumber}
								<StarFilled className={customClass} style={{ fontSize: "18px" }} />
							</span>
						</>
					);
				}
				return 'N/A';
			},
		},
		{
			title: 'Members to reach goal',
			dataIndex: 'Members_remaining',
			key: '8',
			className: 'tableTextCenter'
		},
		{
			title: 'Active Patients (Non-Comp)',
			dataIndex: 'ActiveNonComp',
			key: '9',
			className: 'tableTextCenter',
			render: (ActiveNonComp: number, record: { Title: string, db_col_name: string }) => {
				return (
					<>
						<span className="compNonCompClass" onClick={() => handleShowAllCompliant(record?.Title, record?.db_col_name, "ActiveNonComp")}>
							{ActiveNonComp}
						</span>
					</>
				);
			},

		},
		{
			title: 'Patient Refused',
			dataIndex: 'Refused',
			key: '10',
			className: 'tableTextCenter',
			render: (Refused: number, record: { Title: string, db_col_name: string }) => {
				return (
					<>
						<span className="compNonCompClass" onClick={() => handleShowAllCompliant(record?.Title, record?.db_col_name, "Patient Refused")}>
							{Refused}
						</span>
					</>
				);
			},
		},
		{
			title: 'Scheduled',
			dataIndex: 'Scheduled',
			key: '11',
			className: 'tableTextCenter',
			render: (Scheduled: number, record: { Title: string, db_col_name: string }) => {
				return (
					<>
						<span className="compNonCompClass" onClick={() => handleShowAllCompliant(record?.Title, record?.db_col_name, "Scheduled")}>
							{Scheduled}
						</span>
					</>
				);
			},
		},
		{
			title: 'UnScheduled',
			dataIndex: 'UnScheduled',
			key: '12',
			className: 'tableTextCenter nowrap',
			render: (UnScheduled: string, record: { Title: string, db_col_name: string }) => {
				return (
					<>
						<span className="compNonCompClass" onClick={() => handleShowAllCompliant(record?.Title, record?.db_col_name, "UnScheduled")}>
							{UnScheduled}
						</span>
					</>
				);
			},
		},
	];


	return (
		<Card title={"Gaps data"} size="small"
			extra={
				<>
					<Space className="mr-2" direction="horizontal">
						{/* <DatePicker picker="year" onChange={(date, dateString) => handleFilterYear(dateString)} /> */}
						<DatePicker
							picker="year"
							value={selectedYear}
							onChange={(date, dateString) => handleFilterYear(dateString)}
						/>
					</Space>
					<Text strong>{careGapStatus + ' '}</Text>
					<Switch onClick={handleSwitchCareGap} />
					<br />
					<Text strong>{careGapStatusDate}</Text></>
			}
		>
			<Table columns={columns} dataSource={careGapsData} pagination={false} size="small" scroll={{ x: 1300 }} />
		</Card>
	);
};
export default CareGapsTable;
