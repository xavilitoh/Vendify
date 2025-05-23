// src/components/Sider.tsx
import React, { useState, useEffect } from "react";
import { Menu, Layout } from "antd";
import { MenuProps } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Sider } = Layout;

interface SiderProps {
  items: MenuProps["items"];
  isDarkMode: boolean;
}

const SiderComponent: React.FC<SiderProps> = ({ items, isDarkMode }) => {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sider-collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const handleCollapse = (value: boolean) => {
    setCollapsed(value);
    localStorage.setItem("sider-collapsed", String(value));
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={handleCollapse}
      style={{ background: isDarkMode ? "#001529" : "#fff" }}
      trigger={
        <div style={{ background: isDarkMode ? "#202020" : "#fff", textAlign: "center", padding: 8 }}>
          {collapsed ? (
            <MenuUnfoldOutlined style={{ color: isDarkMode ? "#fff" : "#202020" }} />
          ) : (
            <MenuFoldOutlined style={{ color: isDarkMode ? "#fff" : "#202020" }} />
          )}
        </div>
      }
    >
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
