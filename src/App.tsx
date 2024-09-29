import React, { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Layout,
  ConfigProvider,
  theme,
  Switch,
  Button,
} from "antd";
import Cookies from "js-cookie"; // For token storage
import { useNavigate } from "react-router-dom";
import SiderComponent from "./Pages/Sider";
import HeaderComponent from "./Pages/Header";
import Home from "./Pages/Home";
import Login from "./Pages/Login";

const { Content } = Layout;

const ItemSider: MenuProps["items"] = [
  { key: 1, icon: React.createElement(UserOutlined), label: "Usuarios" },
  { key: 2, icon: React.createElement(LaptopOutlined), label: `Productos` },
  {
    key: 3,
    icon: React.createElement(NotificationOutlined),
    label: `Categorias`,
  },
  { key: 4, icon: React.createElement(NotificationOutlined), label: `Pagos` },
];

const lightTheme = {
  colorPrimary: "#1890ff",
  colorBgContainer: "#fff",
  borderRadius: 8,
};

const darkTheme = {
  colorPrimary: "#00b96b",
  colorBgContainer: "black",
  borderRadius: 8,
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
  };

  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    Cookies.remove("token"); // Remove the token from cookies
    navigate("/login"); // Redirect to the login page
  };

  // Menu items for header
  const ItemsMenu: MenuProps["items"] = [
    { key: 1, label: `Perfil` }, // Profile option (can be linked to profile page if needed)
    {
      key: 2,
      label: (
        <Button onClick={handleLogout} style={{ cursor: "pointer" }}>
          Salir
        </Button>
      ), // 'Salir' (Logout) option
    },
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

  const isAuthenticated = !!Cookies.get("token");

  const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({
    children,
  }) => {
    const location = useLocation();

    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: isDarkMode ? darkTheme : lightTheme,
      }}
    >
      <Layout>
        {isAuthenticated && (
          <HeaderComponent isDarkMode={isDarkMode} items={ItemsMenu} />
        )}
        <Layout>
          {isAuthenticated && (
            <SiderComponent
              items={ItemSider}
              backgroundColor={colorBgContainer}
            />
          )}
          <Layout style={{ padding: "0 24px 24px" }}>
            {isAuthenticated && (
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item>Inicio</Breadcrumb.Item>
                <Breadcrumb.Item>Lista</Breadcrumb.Item>
                <Breadcrumb.Item>App</Breadcrumb.Item>
              </Breadcrumb>
            )}
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
                {/* Public route for login */}
                <Route path="/login" element={<Login />} />

                {/* Protected route for Home */}
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                {/* Add more protected routes here */}
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
