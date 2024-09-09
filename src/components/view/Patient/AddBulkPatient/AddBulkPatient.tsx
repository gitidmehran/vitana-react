import { Col, Modal, Row, Select, Table } from "antd";
import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { useAppSelector } from "../../../../hooks/hooks";
import { RootState } from "../../../../store/store";
type Props = {
  IsOpenBulk: boolean;
  setBulkOpen: () => void;
  title: string;
  bulkData: any;
  clinics: any;
  errors: any;
  loader: boolean;
  insurancesCLinic: any;
  handleFileChange: (info: any) => void;
  handleBulkSubmit: () => void;
  handleInsuranceBulk: (value: string) => void;
  handleClinicChange: (e: any, fromBulk: boolean) => void;
};
const { Dragger } = Upload;

const AddBulkPatient = ({
  IsOpenBulk,
  title,
  bulkData,
  clinics,
  errors,
  loader,
  setBulkOpen,
  handleFileChange,
  handleBulkSubmit,
  handleInsuranceBulk,
  handleClinicChange,
  insurancesCLinic,
}: Props) => {
  const { clinicId } = useAppSelector(
    (state: RootState) => state.clinicReducer
  );

  const columns = [
    {
      title: "Member ID",
      dataIndex: "member_id",
      key: "member_id",
    },
    {
      title: "Patient Full Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Middle Name",
      dataIndex: "mid_name",
      key: "mid_name",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      key: "dob",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Groups Status",
      dataIndex: "groups",
      key: "groups",
    },
    {
      title: "Address Line 1",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Zip Code",
      dataIndex: "zipCode",
      key: "zipCode",
    },
    {
      title: "Contact No",
      dataIndex: "contact_no",
      key: "contact_no",
    },
    {
      title: "Cell",
      dataIndex: "cell",
      key: "cell",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Clinic",
      dataIndex: "clinic_id",
      key: "clinic_id",
    },
    {
      title: "Primary Care Physician",
      dataIndex: "doctor_id",
      key: "doctor_id",
    },
    {
      title: "Insurance",
      dataIndex: "insurance_id",
      key: "insurance_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];
  return (
    <Modal
      title={title}
      open={IsOpenBulk}
      onOk={handleBulkSubmit}
      okButtonProps={{ className: "btn-success text-light", shape: "round", loading: loader, }}
      cancelButtonProps={{ className: "btn-danger text-light", shape: "round" }}
      onCancel={() => setBulkOpen()}
      width={1200}
      bodyStyle={{ height: "520px" }}
      destroyOnClose
    >
      <Row gutter={16} align="middle">
        {clinicId === null || clinicId?.length > 1 ? (
          <>
            <Col md={5} className="">
              <div>
                {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                <Select
                  style={{ width: "100%", borderRadius: "6px" }}
                  showSearch
                  dropdownStyle={{ borderRadius: "6px" }}
                  allowClear
                  status={errors ? 'error' : ''}
                  placeholder="Select a Clinic"
                  onChange={(e) => handleClinicChange(e, true)}
                  options={clinics.map((items: any) => ({
                    value: items.id,
                    label: items.name,
                  }))}
                />
              </div>
            </Col>
            <Col md={5} className="">
              <div>
                {errors && <div style={{ color: 'red' }}>Please select an option</div>}
                <Select
                  style={{ width: "100%", borderRadius: "6px" }}
                  showSearch
                  dropdownStyle={{ borderRadius: "6px" }}
                  allowClear
                  status={errors ? 'error' : ''}
                  placeholder="Select an Insurance"
                  onChange={(value) => handleInsuranceBulk(value)}
                  options={insurancesCLinic.map((items: any) => ({
                    value: items.id,
                    label: items.name,
                  }))}
                />
              </div>
            </Col>
          </>
        ) : null}
        <Col md={clinicId === null || clinicId?.length > 1 ? 14 : 24} className="text-center">
          <div style={{ height: "50px" }}>
            <Dragger
              accept=".xlsx"
              maxCount={1}
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
    </Modal>
  );
};

export default AddBulkPatient;
