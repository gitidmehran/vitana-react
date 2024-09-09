import React from "react";
import { Col, Form, Input, Row, Select, Switch, Table } from "antd";
import { Modal } from "antd";
import moment from "moment";

type props = {
    title: string;
    isBulkAssign: boolean;
    data: any;
    loading: boolean;
    patient: any;
    errors: any;
    coordinators: any;
    selectedRowKeys: any;
    handleBulkAssign: () => void;
    setAssignBulkOpen: () => void;
    handleOkBulkAssign: () => void;
    handleCoordinatorChange: (value: any) => void;
    setSelectedRowData: (value: any) => void;
    setSelectedRowKeys: (value: any) => void;
    onSearch: (name: any, value: any) => void;
    getAssigned: boolean;
    handleGetAssigned: () => void;
};

const columns = [
    {
        title: "Id",
        key: "index",
        render: (text: string, record: any, index: number) => index + 1,
    },
    {
        title: "Account",
        dataIndex: "identity",
    },
    {
        title: "Name",
        dataIndex: "name",
    },
    {
        title: "Contact",
        dataIndex: "contact_no",
        render: (text: string) =>
            text?.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
    },

    {
        title: "DOB",
        dataIndex: "dob",
        render: (text: any, record: any) => moment(record.dob).format("MM/DD/YYYY"),
    },
    {
        title: "Age",
        dataIndex: "age",
    },
    {
        title: "Insurance",
        dataIndex: "insurance_name",
    },
    {
        title: "Address",
        dataIndex: "address",
    },
    {
        title: "CCM Coordinator",
        dataIndex: "coordinator_name",
    },
];
const { Search } = Input;

const AssignBulkPatient = ({
    isBulkAssign,
    title,
    selectedRowKeys,
    patient,
    errors,
    coordinators,
    data,
    loading,
    setAssignBulkOpen,
    handleOkBulkAssign,
    onSearch,
    handleCoordinatorChange,
    setSelectedRowData,
    setSelectedRowKeys,
    getAssigned,
    handleGetAssigned,
}: props) => {
    const onSelectChange = (newSelectedRowKeys: any) => {
        setSelectedRowData(newSelectedRowKeys);
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };


    return (
        <>
            <Modal
                width={1200}
                title={[
                    <>
                        <Row gutter={[16, 16]}>
                            <Col md={12}>
                                <span className="pt-2">{title}</span>
                            </Col>
                            <Col md={4}>
                                <Form>
                                    <Form.Item label="Assigned" className="float-right mr-2">
                                        <Switch defaultChecked={getAssigned} onChange={() => handleGetAssigned()} />
                                    </Form.Item>
                                </Form>
                            </Col>
                            <Col md={4}>
                                <Select
                                    style={{ width: "100%", borderRadius: "6px" }}
                                    showSearch
                                    dropdownStyle={{ borderRadius: "6px" }}
                                    allowClear
                                    status={errors ? "error" : ""}
                                    placeholder="Select a Co-ordinator"
                                    value={patient?.coordinator_id}
                                    onChange={(value) => handleCoordinatorChange(value)}
                                    options={coordinators.map((items: any) => ({
                                        value: items.id,
                                        label: items.name,
                                    }))}
                                />
                            </Col>
                            <Col md={4}>
                                <Search
                                    placeholder="Search"
                                    className="float-right mr-2"
                                    onSearch={onSearch}
                                    enterButton
                                    allowClear
                                    style={{ width: "auto" }}
                                />
                            </Col>
                        </Row>
                    </>,
                ]}
                open={isBulkAssign}
                onOk={handleOkBulkAssign}
                onCancel={setAssignBulkOpen}
                maskClosable={false}
                confirmLoading={loading}
                closable={false}
            >
                <div>
                    <Table
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={data}
                        rowKey={(record) => record.id}
                        loading={loading}
                        pagination={false}
                        scroll={{ y: 400 }}
                    />
                </div>
            </Modal>
        </>
    );
};

export default AssignBulkPatient;
