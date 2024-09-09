import React from "react";
import { Col, DatePicker, Modal, Row, Select, Space, Spin, Table, TableColumnsType } from "antd";
import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Upload } from "antd";
// import { useAppSelector } from "../../../hooks/hooks";
// import { RootState } from "../../../store/store";
import { aetnaColumns, allwellColumns, hcpColumns, healthChoiceArizonaColumns, humanaColumns, medicareArozonaColumns } from "../../../Constant/constant";
import moment from "moment";
import "./CareGaps.css";

type Props = {
    isGenerateGapOpen: boolean;
    setGenerateOpen: () => void;
    title: string;
    bulkData: any;
    clinics: any;
    errors: any;
    insurancesCLinic: any;
    isDisabledUpload: boolean;
    insuranceLabel: string;
    loading: boolean;
    handleFileChange: (info: any) => void;
    handleGenerateSubmit: () => void;
    filterOption: (input: string, option?: { label: string; value: string }) => boolean;
    handleClinicIdChange: (value: any) => void;
    handleInsuranceIdChange: (value: number, label: any) => void;
    handleFilterYear: (date: string) => void;
    filterYear: string;

};
const { Dragger } = Upload;

const GenerateCareGaps = ({
    isGenerateGapOpen,
    title,
    bulkData,
    clinics,
    errors,
    insurancesCLinic,
    isDisabledUpload,
    insuranceLabel,
    loading,
    filterYear,
    setGenerateOpen,
    handleFileChange,
    handleGenerateSubmit,
    handleClinicIdChange,
    handleInsuranceIdChange,
    filterOption,
    handleFilterYear,
}: Props) => {
    // const { clinicId } = useAppSelector(
    //     (state: RootState) => state.clinicReducer
    // );
    const currentYear = moment().year();
    const disabledDate = (currentDate: { year: () => any; }) => {
        const year = currentDate.year();
        return year !== currentYear;
    };
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
            open={isGenerateGapOpen}
            onOk={handleGenerateSubmit}
            okText="Generate"
            okButtonProps={{ className: "btn-success text-light", shape: "round", }}
            cancelButtonProps={{ className: "btn-danger text-light", shape: "round" }}
            onCancel={() => setGenerateOpen()}
            width={800}
            bodyStyle={{ height: "150px" }}
            destroyOnClose
            maskClosable={false}
        >
            <Spin spinning={loading} indicator={antIcon}>
                <Row gutter={16} align="middle" className="mt-4">
                    <Col md={8} className="">
                        <div>
                            {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                            <Space direction="horizontal">
                                {/* <DatePicker picker="year" onChange={(date, dateString) => handleFilterYear(dateString)} /> */}
                                <DatePicker
                                    picker="year"
                                    // value={selectedYear}
                                    defaultValue={moment(currentYear, 'YYYY')}
                                    disabledDate={disabledDate}
                                    allowClear={false}
                                    onChange={(date, dateString) => handleFilterYear(dateString)}
                                />
                            </Space>
                        </div>
                    </Col>
                    <Col md={8} className="">
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
                    <Col md={8} className="">
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
                </Row>
            </Spin>
        </Modal>
    );
};

export default GenerateCareGaps;
