import React, { useState, useRef } from "react";

import { useLocation } from "react-router-dom";

import SuperBill from "./super-bill";
import Careplan from "./AWVCarePlane";
import AWVCarePlanTextView from "./AWVCarePlanTextView";
import { Tabs } from "antd";

const AwvCarePlan: React.FC = () => {
  const location = useLocation();
  const id = location.state.questionid;
  const newTabIndex = useRef(0);
  const [openedTabs, setOpenedTabs] = useState<string[]>([]);

  const add = (questionid: any) => {
    const label = "SuperBill";
    if (!openedTabs.includes(label)) {
      const newActiveKey = `newTab${newTabIndex.current++}`;
      setOpenedTabs([...openedTabs, label]);
      setItems((prevItems: any) => [
        ...prevItems,
        {
          label,
          children: <SuperBill questionid={questionid} />,
          key: newActiveKey,
        },
      ]);
      setActiveKey(newActiveKey);
    } else {
      setActiveKey(label);
    }
  };

  const view = (data: any) => {
    const label = "View As Text";
    if (!openedTabs.includes(label)) {
      const newActiveKey = `newTab${newTabIndex.current++}`;
      setOpenedTabs([...openedTabs, label]);
      setItems((prevItems: any) => [
        ...prevItems,
        {
          label,
          children: <AWVCarePlanTextView data={data} />,
          key: newActiveKey,
        },
      ]);
      setActiveKey(newActiveKey);
    } else {
      setActiveKey(label);
    }
  };
  const defaultPanes = [
    {
      label: `Careplan`,
      children: <Careplan questionid={id} add={add} view={view} />,
      key: id,
    },
  ];
  const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
  const [items, setItems] = useState<any>(defaultPanes);

  const onChange = (key: string) => {
    setActiveKey(key);
  };

  return (
    <Tabs
      onChange={onChange}
      activeKey={activeKey}
      hideAdd
      type="card"
      items={items}
    />
  );
};
export default AwvCarePlan;
