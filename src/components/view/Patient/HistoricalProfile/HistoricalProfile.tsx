
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Card, Col, DatePicker, Input, Modal, Row, Select, Spin, Table, Tooltip, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { OpenNotification } from "../../../../Utilties/Utilties";
import { CloudUploadOutlined, EditOutlined, EyeOutlined, FileOutlined, LoadingOutlined, MessageOutlined } from "@ant-design/icons";
import moment from "moment";

import { PatientCareGap } from "@/Types/PatientType";


const { Text } = Typography;
interface Props {
    patients: any,
}
const HistoricalProfile: React.FC<Props> = ({
    patients,
}) => {
    const [patientHistory, setPatientHistory] = useState<any[]>([]);
    const [historyDetails, setHistoryDetails] = useState<any>({});
    const [outerHistoryDetails, setOuterHistoryDetails] = useState<any>({});
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        setPatientHistory(patients?.patients_history);
    }
    const handleviewDetails = (record: any) => {
        const data = JSON.parse(record?.differences);
        setHistoryDetails(data);
        setOuterHistoryDetails(record);
        setIsModalOpen(true);
    }
    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };


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
    const PatientColumns = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Patient Name',
            dataIndex: 'patient_id',
            key: 'patient_id',
            render: (text: any, record: any) => {
                return patients?.name;

            },
        },
        {
            title: 'Created User',
            dataIndex: 'created_user',
            key: 'created_user',
            render: (text: any, record: any) => {
                return record?.userinfo?.name;
            },
        },
        {
            title: 'Date',
            dataIndex: 'updated_at',
            key: 'updated_at',
            render: (text: any, record: any) => {
                return moment(record?.created_at).format('MM/DD/YYYY HH:mm:ss');
            },
        },
        {
            title: 'View Details',
            dataIndex: 'differences',
            key: 'differences',
            render: (text: any, record: any) => {
                return <Tooltip title="View Full Details"><span className="viewDetails" onClick={() => handleviewDetails(record)}><EyeOutlined /></span></Tooltip>
            },
        },
    ]

    return (
        <>
            <div className="container-fluid">
                <Card>

                    <Table
                        columns={PatientColumns}
                        dataSource={patientHistory}
                        pagination={false}
                    />
                </Card>
            </div>
            <Modal title="Patient Log Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                {historyDetails?.first_name !== undefined ?
                    <Row>
                        <Col span={6}>
                            First Name
                        </Col>
                        <Col span={18}>
                            {historyDetails?.first_name}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.last_name !== undefined ?
                    <Row>
                        <Col span={6}>
                            Last Name
                        </Col>
                        <Col span={18}>
                            {historyDetails?.last_name}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.mid_name !== undefined ?
                    <Row>
                        <Col span={6}>
                            Middle Name
                        </Col>
                        <Col span={18}>
                            {historyDetails?.mid_name}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.dob !== undefined ?
                    <Row>
                        <Col span={6}>
                            DOB
                        </Col>
                        <Col span={18}>
                            {historyDetails?.dob}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.gender !== undefined ?
                    <Row>
                        <Col span={6}>
                            Gender
                        </Col>
                        <Col span={18}>
                            {historyDetails?.gender}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.address !== undefined ?
                    <Row>
                        <Col span={6}>
                            Address Line 1
                        </Col>
                        <Col span={18}>
                            {historyDetails?.address}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.address_2 !== undefined ?
                    <Row>
                        <Col span={6}>
                            Address Line 2
                        </Col>
                        <Col span={18}>
                            {historyDetails?.address_2}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.city !== undefined ?
                    <Row>
                        <Col span={6}>
                            City
                        </Col>
                        <Col span={18}>
                            {historyDetails?.city}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.state !== undefined ?
                    <Row>
                        <Col span={6}>
                            State
                        </Col>
                        <Col span={18}>
                            {historyDetails?.state}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.zipCode !== undefined ?
                    <Row>
                        <Col span={6}>
                            Zip Code
                        </Col>
                        <Col span={18}>
                            {historyDetails?.zipCode}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.preferred_contact !== undefined ?
                    <Row>
                        <Col span={6}>
                            Preferred Contact
                        </Col>
                        <Col span={18}>
                            {historyDetails?.preferred_contact}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.contact_no !== undefined ?
                    <Row>
                        <Col span={6}>
                            Phone
                        </Col>
                        <Col span={18}>
                            {historyDetails?.contact_no}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.cell !== undefined ?
                    <Row>
                        <Col span={6}>
                            Cell
                        </Col>
                        <Col span={18}>
                            {historyDetails?.cell}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.email !== undefined ?
                    <Row>
                        <Col span={6}>
                            Email
                        </Col>
                        <Col span={18}>
                            {historyDetails?.email}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.clinic_id !== undefined ?
                    <Row>
                        <Col span={6}>
                            Clinic
                        </Col>
                        <Col span={18}>
                            {historyDetails?.clinic_id}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.doctor_id !== undefined ?
                    <Row>
                        <Col span={6}>
                            Primary Care Physician
                        </Col>
                        <Col span={18}>
                            {historyDetails?.doctor_id}
                        </Col>
                    </Row>
                    : null}
                {outerHistoryDetails?.insuranceName !== undefined ?
                    <Row>
                        <Col span={6}>
                            Insurance
                        </Col>
                        <Col span={18}>
                            {outerHistoryDetails?.insuranceName}
                        </Col>
                    </Row>
                    : null}
                {outerHistoryDetails?.group !== undefined ?
                    <Row>
                        <Col span={6}>
                            Group
                        </Col>
                        <Col span={18}>
                            {outerHistoryDetails?.group}
                        </Col>
                    </Row>
                    : null}
                {outerHistoryDetails?.status !== undefined ?
                    <Row>
                        <Col span={6}>
                            Status
                        </Col>
                        <Col span={18}>
                            {outerHistoryDetails?.status}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.member_id !== undefined ?
                    <Row>
                        <Col span={6}>
                            Member Id
                        </Col>
                        <Col span={18}>
                            {historyDetails?.member_id}
                        </Col>
                    </Row>
                    : null}
                {historyDetails?.coordinator_id !== undefined ?
                    <Row>
                        <Col span={6}>
                            CCM Coordinator
                        </Col>
                        <Col span={18}>
                            {historyDetails?.coordinator_id}
                        </Col>
                    </Row>
                    : null}

            </Modal>
        </>
    );
};

export default HistoricalProfile;
