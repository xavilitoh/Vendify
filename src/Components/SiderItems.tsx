// src/menuItems.ts
import React from "react";
import { Link } from "react-router-dom";

import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export const ItemSider: MenuProps["items"] = [
  {
    key: 1,
    icon: React.createElement(UserOutlined),
    label: <Link to="usuarios"> Usuarios</Link>,
  },
  {
    key: 2,
    icon: React.createElement(LaptopOutlined),
    label: <Link to="productos"> Productos</Link>,
  },
  {
    key: 3,
    icon: React.createElement(NotificationOutlined),
    label: <Link to="categorias"> Categorias</Link>,
  },
  {
    key: 4,
    icon: React.createElement(NotificationOutlined),
    label: <Link to="marcas"> Marcas</Link>,
  },
  {
    key: 5,
    icon: React.createElement(NotificationOutlined),
    label: <Link to="precios"> Precios</Link>,
  },
  {
    key: 6,
    icon: React.createElement(NotificationOutlined),
    label: <Link to="subcategorias"> SubCategorias</Link>,
  }
];
