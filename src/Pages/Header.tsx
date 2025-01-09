// src/components/Header.tsx
import React from "react";
import { Menu } from "antd";
import { MenuProps } from "antd";

interface HeaderProps {
  isDarkMode: boolean;
  items: MenuProps["items"];
}

const HeaderComponent: React.FC<HeaderProps> = ({ isDarkMode, items }) => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "7vh",
        background: `${isDarkMode ? "#000000" : "#fff"}`,
      }}
    >
      <div
        style={{
          fontSize: "20px",
          textTransform: "uppercase",
          marginLeft: "25px",
          fontWeight: "800",
          color: `${isDarkMode ? "#fff" : "#282929"}`,
        }}
      >
        Vendify
      </div>
      <Menu
        theme={isDarkMode ? "dark" : "light"}
        mode="horizontal"
        defaultSelectedKeys={["2"]}
        items={items}
        style={{
          display: "flex",
          flex: 0.1,
          minWidth: "270px",
          height: "inherit",
          alignItems: "center",
          justifyContent: "center",
          background: "inherit",
          border: "none",
        }}
      />
    </header>
  );
};

export default HeaderComponent;
