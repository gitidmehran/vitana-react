import React from "react";
import { Col, DatePicker, Modal, Row, Select, Space, Spin, Table, TableColumnsType, Typography } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Upload } from "antd";
// import { useAppSelector } from "../../../hooks/hooks";
// import { RootState } from "../../../store/store";
import { aetnaColumns, allwellColumns, hcpColumns, healthChoiceArizonaColumns, humanaColumns, medicareArozonaColumns } from "../../../Constant/constant";
import moment from "moment";
const { Text } = Typography;
type Props = {
    IsOpenBulk: boolean;
    setBulkOpen: () => void;
    title: string;
    bulkData: any;
    clinics: any;
    errors: any;
    insurancesCLinic: any;
    isDisabledUpload: boolean;
    insuranceLabel: string;
    loading: boolean;
    handleFileChange: (info: any) => void;
    handleBulkSubmit: () => void;
    filterOption: (input: string, option?: { label: string; value: string }) => boolean;
    handleClinicIdChange: (value: any) => void;
    handleInsuranceIdChange: (value: number, label: any) => void;
    handleFilterYear: (date: string) => void;
    filterYear: string;

};
const { Dragger } = Upload;

const AddCareGaps = ({
    IsOpenBulk,
    title,
    bulkData,
    clinics,
    errors,
    insurancesCLinic,
    isDisabledUpload,
    insuranceLabel,
    loading,
    filterYear,
    setBulkOpen,
    handleFileChange,
    handleBulkSubmit,
    handleClinicIdChange,
    handleInsuranceIdChange,
    filterOption,
    handleFilterYear,
}: Props) => {
    // const { clinicId } = useAppSelector(
    //     (state: RootState) => state.clinicReducer
    // );
    const antIcon = <LoadingOutlined style={{ fontSize: 34 }} spin />;
    let columns: TableColumnsType<any> | undefined = [];
    if (insuranceLabel === "hcpw-001") {
        columns = hcpColumns;
    }
    if (insuranceLabel === "hum-001") {
        columns = humanaColumns;
    }
    if (insuranceLabel === "med-arz-001") {
        columns = medicareArozonaColumns;
    }
    if (insuranceLabel === "aet-001") {
        columns = aetnaColumns;
    }
    if (insuranceLabel === "allwell-001") {
        columns = allwellColumns;
    }
    if (insuranceLabel === "hcarz-001") {
        columns = healthChoiceArizonaColumns;
    }
    if (insuranceLabel === "uhc-001") {
        columns = healthChoiceArizonaColumns;
    }
    const selectedYear = filterYear !== "" ? moment(filterYear, 'YYYY') : undefined;
    return (
        <Modal
            title={title}
            open={IsOpenBulk}
            onOk={handleBulkSubmit}
            okButtonProps={{ className: "btn-success text-light", shape: "round", }}
            cancelButtonProps={{ className: "btn-danger text-light", shape: "round" }}
            onCancel={() => setBulkOpen()}
            width={1200}
            bodyStyle={{ height: "570px" }}
            destroyOnClose
            maskClosable={false}
        >
            <Spin spinning={loading} indicator={antIcon}>
                <Row gutter={16} align="middle">
                    <Col md={4} className="">
                        <div>
                            {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                            <Space className="mr-2" direction="horizontal">
                                {/* <DatePicker picker="year" onChange={(date, dateString) => handleFilterYear(dateString)} /> */}
                                <DatePicker
                                    picker="year"
                                    value={selectedYear}
                                    allowClear={false}
                                    onChange={(date, dateString) => handleFilterYear(dateString)}
                                />
                            </Space>
                        </div>
                    </Col>
                    <Col md={4} className="">
                        <div>
                            {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                            <Select
                                style={{ width: "100%", borderRadius: "6px" }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={filterOption}
                                dropdownStyle={{ borderRadius: "6px" }}
                                allowClear
                                status={errors ? 'error' : ''}
                                placeholder="Select a Clinic"
                                onChange={(value) => handleClinicIdChange(value)}
                                options={clinics.map((items: any) => ({
                                    value: items.id,
                                    label: items.name,
                                }))}
                            />
                        </div>
                    </Col>
                    <Col md={4} className="">
                        <div>
                            {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                            <Select
                                style={{ width: "100%", borderRadius: "6px" }}
                                showSearch
                                optionFilterProp="children"
                                filterOption={filterOption}
                                dropdownStyle={{ borderRadius: "6px" }}
                                allowClear
                                status={errors ? 'error' : ''}
                                placeholder="Select an Insurance"
                                onChange={(value: number, label: any) => handleInsuranceIdChange(value, label)}
                                options={insurancesCLinic.map((items: { id: any, name: any }) => ({
                                    value: items.id,
                                    label: items.name,
                                }))}
                            />

                        </div>
                    </Col>
                    <Col md={11} className="text-center">
                        <div style={{ height: "50px" }}>
                            <Dragger
                                accept=".xlsx"
                                maxCount={1}
                                disabled={isDisabledUpload}
                                showUploadList={false}
                                onChange={handleFileChange}
                                beforeUpload={() => false}
                            >
                                <span>
                                    <UploadOutlined /> Upload the file
                                </span>
                            </Dragger>
                        </div>
                    </Col>
                    {/* <>
                </>
                {clinicId === null || clinicId?.length >= 1 ? (
                ): null} */}
                </Row>
                <br />
                {bulkData.length > 0 ? (
                    <Row>
                        <Col md={24} className="text-center">
                            <Table
                                pagination={{
                                    showSizeChanger: false,
                                    total: bulkData.length,
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} items`,
                                }}
                                scroll={{ x: 400 }}
                                bordered
                                className="text-nowrap"
                                columns={columns}
                                dataSource={bulkData}
                            />
                        </Col>
                    </Row>
                ) : null}
                <Row style={{ position: "sticky", bottom: "0" }}>
                    <ul>
                        <li>Make sure the sheet doesn't have any gap relevant column if no status is available</li>
                    </ul>
                </Row>
            </Spin>
        </Modal>
    );
};

export default AddCareGaps;
