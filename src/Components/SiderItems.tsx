// src/menuItems.ts
import React from "react";
import { Link } from "react-router-dom";

import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  WindowsOutlined,
  SubnodeOutlined,
  EuroOutlined,
  ShopOutlined,
  WalletOutlined,
  PlusOutlined,
  EyeOutlined,
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
    icon: React.createElement(WindowsOutlined),
    label: <Link to="categorias"> Categorias</Link>,
  },
  {
    key: 4,
    icon: React.createElement(SubnodeOutlined),
    label: <Link to="marcas"> Marcas</Link>,
  },
  {
    key: 5,
    icon: React.createElement(EuroOutlined),
    label: <Link to="precios"> Precios</Link>,
  },
  {
    key: 6,
    icon: React.createElement(NotificationOutlined),
    label: <Link to="Unidades"> Unidades</Link>,
  },
  {
    key: 7,
    icon: React.createElement(ShopOutlined),
    label: <Link to="Sucursales"> Sucursales</Link>,
  },
  {
    key: 8,
    icon: React.createElement(WalletOutlined),
    label: <Link to="almacenes"> Almacenes</Link>,
  },
  {
    key: 9,
    icon: React.createElement(WalletOutlined),
    label: <Link to="proveedores"> Proveedores</Link>,
  },
  {
    key: "10",
    icon: React.createElement(WalletOutlined),
    label: "Compras",
    children: [
      {
        key: "10-1",
        label: <Link to="compras">Ver Compras</Link>,
        icon: React.createElement(EyeOutlined),
      },
      {
        key: "10-2",
        label: <Link to="crearcompra">Crear Compra</Link>,
        icon: React.createElement(PlusOutlined),
      },
    ],
  },
];
