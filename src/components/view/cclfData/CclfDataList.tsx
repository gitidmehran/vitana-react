import { LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import { Button, Col, message, Row, Spin, Table, Typography, Upload } from "antd";
import React, { useState } from "react";
import { handleCclfData } from "../../../actions/CclfData/CclfActions";
import { OpenNotification } from "../../../Utilties/Utilties";

export const CclfDataList = () => {
	const { Title } = Typography;
	const { Dragger } = Upload;
	const [data, setData] = useState<any>([]);
	const [loader, setLoader] = useState<boolean>(false);


	const handleFileUpload = (info: any) => {
		setLoader(true);
		const fileReader = new FileReader();
		fileReader.onload = (e) => {
			try {
				const { result } = e.target as any;
				const data = new Uint8Array(result);
				const workbook = XLSX.read(data, { type: "array" });

				// Assuming the first sheet is the one to convert
				const worksheet = workbook.Sheets[workbook.SheetNames[0]];
				const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
				const headers = jsonData[0] as string[];
				const rows = jsonData.slice(1);
				const headerMappings: { [key: string]: string } = {
					CURRENT_MBI_ID: "member_id",
					CLM_LINE_CVRD_PD_AMT: "covered_amount",
				};
				const jsonDataWithHeaders = rows.map((row: any) => {
					const obj: { [key: string]: any } = {};
					headers.forEach((header, index) => {
						let customHeader = header.replace(/\s/g, "_");
						// eslint-disable-next-line no-prototype-builtins
						if (headerMappings.hasOwnProperty(customHeader)) {
							customHeader = headerMappings[customHeader];
							obj[customHeader] = row[index];
						}

					});
					return obj;
				});
				setLoader(false);
				setData(jsonDataWithHeaders);
			} catch (error) {
				message.error("Please upload a valid excel file");
			}
		};

		const fileList = info.fileList.slice(-1);

		if (fileList.length > 0) {
			fileReader.readAsArrayBuffer(fileList[0].originFileObj);
		} else {
			setData([]);
		}
	};

	const handleCclfSubmit = () => {
		const payload = {
			data: data
		}
		handleCclfData(payload).then(({ data: response }) => {

			console.log(response);

			if (response.success === true) {
				OpenNotification("success", "Data added successfully");
			}
		});
	};

	const columns = [
		{
			title: "Id",
			width: 50,
			render: (text: string, data: any, index: number) => index + 1,
		},

		{
			title: "CURRENT_MBI_ID",
			render: (_: string, data: any) => data?.member_id,
		},
		/*  {
			title: "CUR_CLM_UNIQ_ID",
			render: (_: string, data: any) => data?.cur_clm_uniq_id,
		},
		{
			title: "CLM_LINE_NUM",
			render: (_: string, data: any) => data?.clm_line_num,
		},
		{
			title: "BENE_MBI_ID",
			render: (_: string, data: any) => data?.bene_mbi_id,
		},
		{
			title: "BENE_HIC_NUM",
			render: (_: string, data: any) => data?.bene_hic_num,
		},
		{
			title: "CLM_TYPE_CD",
			render: (_: string, data: any) => data?.clm_type_cd,
		},
		{
			title: "CLM_FROM_DT",
			render: (_: string, data: any) => data?.clm_from_dt,
		},
		{
			title: "CLM_THRU_DT",
			render: (_: string, data: any) => data?.clm_thru_dt,
		},
		{
			title: "RNDRG_PRVDR_TYPE_CD",
			render: (_: string, data: any) => data?.rndrg_prvdr_type_cd,
		},
		{
			title: "RNDRG_PRVDR_FIPS_ST_CD",
			render: (_: string, data: any) => data?.rndrg_prvdr_fips_st_cd,
		},
		{
			title: "CLM_PRVDR_SPCLTY_CD",
			render: (_: string, data: any) => data?.clm_prvdr_spclty_cd,
		},
		{
			title: "CLM_FED_TYPE_SRVC_CD",
			render: (_: string, data: any) => data?.clm_fed_type_srvc_cd,
		},
		{
			title: "CLM_POS_CD",
			render: (_: string, data: any) => data?.clm_pos_cd,
		},
		{
			title: "CLM_LINE_FROM_DT",
			render: (_: string, data: any) => data?.clm_line_from_dt,
		},
		{
			title: "CLM_LINE_THRU_DT",
			render: (_: string, data: any) => data?.clm_line_thru_dt,
		},
		{
			title: "CLM_LINE_HCPCS_CD",
			render: (_: string, data: any) => data?.clm_line_hcpcs_cd,
		}, */
		{
			title: "CLM_LINE_CVRD_PD_AMT",
			render: (_: string, data: any) => data?.covered_amount,
		},
		/* {
			title: "CLM_LINE_PRMRY_PYR_CD",
			render: (_: string, data: any) => data?.clm_line_prmry_pyr_cd,
		},
		{
			title: "CLM_LINE_DGNS_CD",
			render: (_: string, data: any) => data?.clm_line_dgns_cd,
		},
		{
			title: "CLM_RNDRG_PRVDR_TAX_NUM",
			render: (_: string, data: any) => data?.clm_rndrg_prvdr_tax_num,
		},
		{
			title: "RNDRG_PRVDR_NPI_NUM",
			render: (_: string, data: any) => data?.rndrg_prvdr_npi_num,
		},
		{
			title: "CLM_CARR_PMT_DNL_CD",
			render: (_: string, data: any) => data?.clm_carr_pmt_dnl_cd,
		},
		{
			title: "CLM_PRCSG_IND_CD",
			render: (_: string, data: any) => data?.clm_prcsg_ind_cd,
		},
		{
			title: "CLM_ADJSMT_TYPE_CD",
			render: (_: string, data: any) => data?.clm_adjsmt_type_cd,
		},
		{
			title: "CLM_EFCTV_DT",
			render: (_: string, data: any) => data?.clm_efctv_dt,
		},
		{
			title: "CLM_IDR_LD_DT",
			render: (_: string, data: any) => data?.clm_idr_ld_dt,
		},
		{
			title: "CLM_CNTL_NUM",
			render: (_: string, data: any) => data?.clm_cntl_num,
		},
		{
			title: "BENE_EQTBL_BIC_HICN_NUM",
			render: (_: string, data: any) => data?.bene_eqtbl_bic_hicn_num,
		},
		{
			title: "CLM_LINE_ALOWD_CHRG_AMT",
			render: (_: string, data: any) => data?.clm_line_alowd_chrg_amt,
		},
		{
			title: "CLM_LINE_SRVC_UNIT_QTY",
			render: (_: string, data: any) => data?.clm_line_srvc_unit_qty,
		},
		{
			title: "HCPCS_1_MDFR_CD",
			render: (_: string, data: any) => data?.hcpcs_1_mdfr_cd,
		},
		{
			title: "HCPCS_2_MDFR_CD",
			render: (_: string, data: any) => data?.hcpcs_2_mdfr_cd,
		},
		{
			title: "HCPCS_3_MDFR_CD",
			render: (_: string, data: any) => data?.hcpcs_3_mdfr_cd,
		},
		{
			title: "HCPCS_4_MDFR_CD",
			render: (_: string, data: any) => data?.hcpcs_4_mdfr_cd,
		},
		{
			title: "HCPCS_5_MDFR_CD",
			render: (_: string, data: any) => data?.hcpcs_5_mdfr_cd,
		},
		{
			title: "CLM_DISP_CD",
			render: (_: string, data: any) => data?.clm_disp_cd,
		},
		{
			title: "CLM_DGNS_1_CD",
			render: (_: string, data: any) => data?.clm_dgns_1_cd,
		},
		{
			title: "CLM_DGNS_2_CD",
			render: (_: string, data: any) => data?.clm_dgns_2_cd,
		},
		{
			title: "CLM_DGNS_3_CD",
			render: (_: string, data: any) => data?.clm_dgns_3_cd,
		},
		{
			title: "CLM_DGNS_4_CD",
			render: (_: string, data: any) => data?.clm_dgns_4_cd,
		},
		{
			title: "CLM_DGNS_5_CD",
			render: (_: string, data: any) => data?.clm_dgns_5_cd,
		},
		{
			title: "CLM_DGNS_6_CD",
			render: (_: string, data: any) => data?.clm_dgns_6_cd,
		},
		{
			title: "CLM_DGNS_7_CD",
			render: (_: string, data: any) => data?.clm_dgns_7_cd,
		},
		{
			title: "CLM_DGNS_8_CD",
			render: (_: string, data: any) => data?.clm_dgns_8_cd,
		},
		{
			title: "DGNS_PRCDR_ICD_IND",
			render: (_: string, data: any) => data?.dgns_prcdr_icd_ind,
		},
		{
			title: "CLM_DGNS_9_CD",
			render: (_: string, data: any) => data?.clm_dgns_9_cd,
		},
		{
			title: "CLM_DGNS_10_CD",
			render: (_: string, data: any) => data?.clm_dgns_10_cd,
		},
		{
			title: "CLM_DGNS_11_CD",
			render: (_: string, data: any) => data?.clm_dgns_11_cd,
		},
		{
			title: "CLM_DGNS_12_CD",
			render: (_: string, data: any) => data?.clm_dgns_12_cd,
		},
		{
			title: "HCPCS_BETOS_CD",
			render: (_: string, data: any) => data?.hcpcs_betos_cd,
		},
		{
			title: "CLM_RNDRG_PRVDR_NPI_NUM",
			render: (_: string, data: any) => data?.clm_rndrg_prvdr_npi_num,
		},
		{
			title: "CLM_RFRG_PRVDR_NPI_NUM",
			render: (_: string, data: any) => data?.clm_rfrg_prvdr_npi_num,
		},
		{
			title: "CLM_CNTRCTR_NUM",
			render: (_: string, data: any) => data?.clm_cntrctr_num,
		}, */

	];

	return (
		<div className="container mt-5" style={{ background: "white", borderRadius: "7px", }} >
			<Row>
				<Col xs={24} sm={24} md={24} lg={24} xl={12}>
					<Title level={2}>CCLF Data</Title>
				</Col>
			</Row>

			<Row gutter={16} align="middle" className="mb-5">
				<Col md={24} className="text-center">
					<div style={{ height: "50px" }}>
						<Dragger
							accept=".csv"
							maxCount={1}
							showUploadList={false}
							onChange={handleFileUpload}
							beforeUpload={() => false}
						>
							<span>
								<UploadOutlined /> Upload the file
							</span>
						</Dragger>
					</div>
				</Col>
			</Row>

			<Spin spinning={loader} indicator={<LoadingOutlined style={{ fontSize: 34 }} spin />}>

				{data.length > 0 ? (
					<>
						<Row>
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								<Table
									bordered
									scroll={{ x: 600 }}
									columns={columns}
									dataSource={data}
								/>
							</Col>
						</Row>
					</>
				) : null}
			</Spin>

			<Row>
				<Col>
					<Button
						loading={loader}
						type="primary"
						onClick={() => {
							handleCclfSubmit();
						}}
					>
						Save
					</Button>
				</Col>
			</Row>
		</div>
	);
}