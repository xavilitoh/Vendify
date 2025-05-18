import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Layout, ConfigProvider, theme, Button, Switch } from "antd";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import SiderComponent from "./Pages/Sider";
import HeaderComponent from "./Pages/Header";
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
import CrearVentas from "./Components/Ventas/CrearVentas";
import Cajas from "./Components/Cajas/Cajas";
import CajaEstacionPage from "./Components/EstacionCajas/EstacionCajas";
import ResetPassword from "./Pages/ResetPassword";
import OlvideContraseña from "./Pages/OlvideContraseña";
const { Content } = Layout;

const lightTheme = {
  colorPrimary: "#1890ff",
  colorBgContainer: "#fff",
  borderRadius: 8,
  secondaryColor: "#f5f5f5",
};

const darkTheme = {
  colorPrimary: "#1890ff",
  colorBgContainer: "#202020",
  borderRadius: 8,
  secondaryColor: "#303030",
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
          style={{
            background: isDarkMode
              ? darkTheme.colorBgContainer
              : lightTheme.colorBgContainer,
          }}
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
                isDarkMode
                  ? darkTheme.secondaryColor
                  : lightTheme.colorBgContainer
              }
            />
          )}
          <Layout
            style={{
              padding: "0 24px 24px",
              backgroundColor: isDarkMode ? darkTheme.secondaryColor : "",
            }}
          >
            {isAuthenticated && <BreadcrumbComponent />}
            <Content
              style={{
                padding: 10,
                margin: 0,
                minHeight: 280,
                backgroundColor: isDarkMode
                  ? darkTheme.secondaryColor
                  : lightTheme.secondaryColor,
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
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/forget-password" element={<OlvideContraseña />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Productos isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/usuarios"
                  element={
                    <ProtectedRoute>
                      <Usuarios isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/categorias"
                  element={
                    <ProtectedRoute>
                      <Categorias isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/productos"
                  element={
                    <ProtectedRoute>
                      <Productos isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/marcas"
                  element={
                    <ProtectedRoute>
                      <Marcas isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/precios"
                  element={
                    <ProtectedRoute>
                      <Precios isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/unidades"
                  element={
                    <ProtectedRoute>
                      <Unidades isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/sucursales"
                  element={
                    <ProtectedRoute>
                      <Sucursales isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/almacenes"
                  element={
                    <ProtectedRoute>
                      <Almacenes isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/proveedores"
                  element={
                    <ProtectedRoute>
                      <Proveedores isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/compras"
                  element={
                    <ProtectedRoute>
                      <Compras isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/crearcompra"
                  element={
                    <ProtectedRoute>
                      <CrearCompra isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/subcategorias"
                  element={
                    <ProtectedRoute>
                      <Subcategories isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clientes"
                  element={
                    <ProtectedRoute>
                      <Clientes isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/ventas"
                  element={
                    <ProtectedRoute>
                      <Ventas isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route path="/crearVentas" element={<CrearVentas />} />

                <Route
                  path="/cajas"
                  element={
                    <ProtectedRoute>
                      <Cajas isDarkMode={isDarkMode} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/cajasestacion"
                  element={
                    <ProtectedRoute>
                      <CajaEstacionPage isDarkMode={isDarkMode} />
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
