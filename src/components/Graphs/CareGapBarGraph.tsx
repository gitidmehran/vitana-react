import React, { useEffect, useState } from "react";
import { DualAxes } from '@ant-design/plots';
import { CareGapsTypes, DashboardGraphType } from "../../Types/Dashboard";
interface Props {
    careGapsData: any;
}
const CareGapBarGraph: React.FC<Props> = ({
    careGapsData,
}) => {
    const [careGapTypes, setcareGapTypes] = useState<CareGapsTypes[]>([]);
    const [transformData, setTransformData] = useState<DashboardGraphType[]>([]);
    useEffect(() => {
        CareGapDataFetch();
    }, [careGapsData]);
    const CareGapDataFetch = () => {
        if (careGapsData) {
            const newCareGapTypes = [] as any | [];
            careGapsData.forEach((item: { ShortTitle: string, Required_Par: string }) => {
                return newCareGapTypes.push({
                    title: item?.ShortTitle,
                    value: parseFloat(item?.Required_Par),
                    type: 'Required',
                });
            });
            careGapsData.forEach((item: { ShortTitle: string, Acheived: string }) => {
                return newCareGapTypes.push({
                    title: item?.ShortTitle,
                    value: parseFloat(item?.Acheived),
                    type: 'Current',
                });
            });
            careGapsData?.map((item: { ShortTitle: string }) => {
                return setTransformData([{ title: item?.ShortTitle }]);
            })
            setcareGapTypes(newCareGapTypes);
        }
    }
    let careGapData = [] as any | [];
    careGapData = careGapTypes;
    const config = {
        data: [careGapData, transformData],
        xField: 'title',
        yField: ['value', 'count'],
        geometryOptions: [
            {
                geometry: 'column',
                isGroup: true,
                isStack: true,
                seriesField: "type",
            },
            {
                geometry: "column",
                isStack: true,
                isGroup: true,
                seriesField: "type",
            }
        ],
    };
    return (
        <DualAxes {...config} />
    );
};
export default CareGapBarGraph;
