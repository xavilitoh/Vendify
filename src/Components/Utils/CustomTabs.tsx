import React from "react";
import { Tabs } from "antd";

interface TabItem {
  label: string;
  key: string;
  children: React.ReactNode;
}

interface CustomTabsProps {
  items: TabItem[];
  onChange?: (key: string) => void;
  type?: "line" | "card" | "editable-card";
}

const CustomTabs: React.FC<CustomTabsProps> = ({
  items,
  onChange,
  type = "card",
}) => {
  return <Tabs onChange={onChange} type={type} items={items} />;
};

export default CustomTabs;
