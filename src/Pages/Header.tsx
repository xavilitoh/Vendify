import React from "react";
import { Switch, Button } from "antd";
import { MenuProps } from "antd";

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: (checked: boolean) => void;
  handleLogout: () => void; // ✅ Add this prop
  items: MenuProps["items"];
}

const HeaderComponent: React.FC<HeaderProps> = ({
  isDarkMode,
  toggleDarkMode,
  handleLogout,
}) => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "7vh",
        background: `${isDarkMode ? "#000000" : "#fff"}`,
        padding: "0 40px",
      }}
    >
      <div
        style={{
          fontSize: "20px",
          textTransform: "uppercase",
          fontWeight: "800",
          color: `${isDarkMode ? "#fff" : "#282929"}`,
          cursor: "pointer",
        }}
        onClick={() => {
          window.location.href = "/"; // Redirect to home page
        }}
      >
        Vendify
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        {/* Logout Button */}
        <Button onClick={handleLogout} style={{ cursor: "pointer" }}>
          Salir
        </Button>

        {/* Theme Switch */}
        <Switch
          checked={isDarkMode}
          onChange={toggleDarkMode}
          checkedChildren="🌙"
          unCheckedChildren="☀️"
          style={{ background: isDarkMode ? "#1890ff" : "#f0f0f0" }}
        />
      </div>
    </header>
  );
};

export default HeaderComponent;
