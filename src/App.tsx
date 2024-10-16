// src/App.tsx
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout, ConfigProvider, theme, Button } from "antd";
import Cookies from "js-cookie"; // For token storage
import { useNavigate } from "react-router-dom";
import SiderComponent from "./Pages/Sider";
import HeaderComponent from "./Pages/Header";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Productos from "./Components/Productos/Productos";
import ProtectedRoute from "./Components/ProtectedRoute";
import BreadcrumbComponent from "./Components/BreadCrumb";
import ThemeSwitcher from "./Components/ThemeSwitcher";
import { ItemSider } from "./Components/SiderItems";
import Usuarios from "./Components/Usuarios/Usuarios";
import Categorias from "./Components/Categorias/Categorias";
const { Content } = Layout;

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
  // Leer el tema guardado en localStorage o usar el valor por defecto (modo claro)
const [isDarkMode, setIsDarkMode] = useState(() => {
  const savedTheme = localStorage.getItem("isDarkMode");
  return savedTheme ? JSON.parse(savedTheme) : false;
});

const {
  token: { colorBgContainer },
} = theme.useToken();

// Función para cambiar el tema y guardar la preferencia en localStorage
const toggleDarkMode = (checked: boolean) => {
  setIsDarkMode(checked);
  localStorage.setItem("isDarkMode", JSON.stringify(checked)); // Guardar el tema en localStorage
};

  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const ItemsMenu = [
    { key: 1, label: `Perfil` },
    {
      key: 2,
      label: (
        <Button onClick={handleLogout} style={{ cursor: "pointer" }}>
          Salir
        </Button>
      ),
    },
    {
      key: "switch",
      label: (
        <ThemeSwitcher
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ),
    },
  ];

  const isAuthenticated = !!Cookies.get("token");

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
            {isAuthenticated && <BreadcrumbComponent />}
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
                <Route path="/login" element={<Login />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute>
                      <Usuarios />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/categorias"
                  element={
                    <ProtectedRoute>
                      <Categorias />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/productos"
                  element={
                    <ProtectedRoute>
                      <Productos />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
