//REACT
import React, { useState } from "react";
//REACT-ROUTER
import { Routes, Route } from "react-router-dom";

//ANT-DESIGN
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, ConfigProvider, theme, Switch } from "antd";
import SiderComponent from "./Pages/Sider";
import HeaderComponent from "./Pages/Header";
import Home from "./Pages/Home";
//Items Layout

const { Content } = Layout;

const ItemSider: MenuProps["items"] = [
  { key: 1, icon: React.createElement(UserOutlined), label: "Usuarios" },
  { key: 2, icon: React.createElement(LaptopOutlined), label: `Productos` },
  {
    key: 2,
    icon: React.createElement(NotificationOutlined),
    label: `Categorias`,
  },
  { key: 2, icon: React.createElement(NotificationOutlined), label: `Pagos` },
];

const lightTheme = {
  colorPrimary: "#1890ff", // Primary color for light mode
  colorBgContainer: "#fff", // Background color for light mode
  borderRadius: 8, // Example of customizing border radius
};

const darkTheme = {
  colorPrimary: "#00b96b", // Primary color for dark mode
  colorBgContainer: "black", // Background color for dark mode
  borderRadius: 8, // Example of customizing border radius
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Toggle dark mode
  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  const ItemsMenu: MenuProps["items"] = [
    { key: 1, label: `Perfil` },
    { key: 2, label: `Salir` },
    {
      key: "switch",
      label: (
        <Switch
          checkedChildren="Claro"
          unCheckedChildren="Oscuro"
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDarkMode ? darkTheme : lightTheme, // Apply custom theme tokens
      }}
    >
      <Layout>
        <HeaderComponent isDarkMode={isDarkMode} items={ItemsMenu} />
        <Layout>
          <SiderComponent
            items={ItemSider}
            backgroundColor={colorBgContainer}
          />
          <Layout style={{ padding: "0 24px 24px" }}>
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Inicio</Breadcrumb.Item>
              <Breadcrumb.Item>Lista</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                backgroundColor: isDarkMode
                  ? "#1f1f1f"
                  : lightTheme.colorBgContainer,
                borderRadius: lightTheme.borderRadius,
                height: "100vh",
              }}
            >
              <Routes>
                <Route path="/" element={<Home />}></Route>
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
