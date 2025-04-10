import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout, ConfigProvider, theme, Button, Switch } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SiderComponent from "./Pages/Sider";
import HeaderComponent from "./Pages/Header";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Productos from "./Components/Productos/Productos";
import ProtectedRoute from "./Components/ProtectedRoute";
import BreadcrumbComponent from "./Components/BreadCrumb";
import { ItemSider } from "./Components/SiderItems";
import Usuarios from "./Components/Usuarios/Usuarios";
import Categorias from "./Components/Categorias/Categorias";
import Registrarse from "./Pages/Registrarse";
import Marcas from "./Components/Marcas/Marcas";
import Precios from "./Components/Precios/Precios";
import Unidades from "./Components/Unidades/Unidades";
import Sucursales from "./Components/Sucursales/Sucursales";
import Almacenes from "./Components/Almacenes/Alamacenes";
import Proveedores from "./Components/Proveedores/Provedores";
import Compras from "./Components/Compras/Compras";
import CrearCompra from "./Components/Compras/CreateCompra";
import Subcategories from "./Components/SubCategorias/SubCategorias";
import Clientes from "./Components/Clientes/Clientes";
import Ventas from "./Components/Ventas/Ventas";

const { Content } = Layout;

const lightTheme = {
  colorPrimary: "#1890ff",
  colorBgContainer: "#fff",
  borderRadius: 8,
};

const darkTheme = {
  colorPrimary: "#1890ff",
  colorBgContainer: "#000000",
  borderRadius: 8,
};

const App: React.FC = () => {
  const navigate = useNavigate();

  const getSystemDarkMode = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("isDarkMode");
    return savedTheme !== null ? JSON.parse(savedTheme) : getSystemDarkMode();
  });

  useEffect(() => {
    // Sync with system dark mode changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("isDarkMode") === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Toggle dark mode and save user preference
  const toggleDarkMode = (checked: boolean) => {
    setIsDarkMode(checked);
    localStorage.setItem("isDarkMode", JSON.stringify(checked));
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  const ItemsMenu = [
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
        <Switch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          style={{ background: isDarkMode ? "#1890ff" : "#f0f0f0" }}
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
          <HeaderComponent
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
            items={ItemsMenu}
            handleLogout={handleLogout}
          />
        )}
        <Layout>
          {isAuthenticated && (
            <SiderComponent
              items={ItemSider}
              backgroundColor={
                isDarkMode ? "#303030" : lightTheme.colorBgContainer
              }
            />
          )}
          <Layout
            style={{
              padding: "0 24px 24px",
              backgroundColor: isDarkMode ? "#303030" : "",
            }}
          >
            {isAuthenticated && <BreadcrumbComponent />}
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
                backgroundColor: isDarkMode
                  ? "#000000"
                  : lightTheme.colorBgContainer,
                borderRadius: lightTheme.borderRadius,
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <Routes>
                <Route
                  path="/login"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Login isDarkMode={isDarkMode} />
                    )
                  }
                />
                <Route
                  path="/registrarse"
                  element={
                    isAuthenticated ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Registrarse isDarkMode={isDarkMode} />
                    )
                  }
                />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Productos />
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
                <Route
                  path="/marcas"
                  element={
                    <ProtectedRoute>
                      <Marcas />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/precios"
                  element={
                    <ProtectedRoute>
                      <Precios />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/unidades"
                  element={
                    <ProtectedRoute>
                      <Unidades />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sucursales"
                  element={
                    <ProtectedRoute>
                      <Sucursales />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/almacenes"
                  element={
                    <ProtectedRoute>
                      <Almacenes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proveedores"
                  element={
                    <ProtectedRoute>
                      <Proveedores />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/compras"
                  element={
                    <ProtectedRoute>
                      <Compras />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crearcompra"
                  element={
                    <ProtectedRoute>
                      <CrearCompra />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subcategorias"
                  element={
                    <ProtectedRoute>
                      <Subcategories />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clientes"
                  element={
                    <ProtectedRoute>
                      <Clientes />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ventas"
                  element={
                    <ProtectedRoute>
                      <Ventas />
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
