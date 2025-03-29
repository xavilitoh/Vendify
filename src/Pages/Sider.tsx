// src/components/Sider.tsx
import React from "react";
import { Menu } from "antd";
import { MenuProps, Layout } from "antd";
const { Sider } = Layout;

interface SiderProps {
  items: MenuProps["items"];
  backgroundColor: string;
}

const SiderComponent: React.FC<SiderProps> = ({ items, backgroundColor }) => {
  return (
    <Sider style={{ width: 200, background: backgroundColor }}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        style={{ height: "100%", borderRight: 0 }}
        items={items}
      />
    </Sider>
  );
};

export default SiderComponent;
