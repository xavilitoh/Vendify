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
  CopyOutlined,
  DollarOutlined,
  AppstoreOutlined,
  BarcodeOutlined,
  ProfileOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";

export const ItemSider: MenuProps["items"] = [
  {
    key: "11",
    icon: React.createElement(DollarOutlined),
    label: "Inventario",
    children: [
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
        key: 15,
        icon: React.createElement(WindowsOutlined),
        label: <Link to="subcategorias"> Sub-Categorias</Link>,
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
    ],
  },
  {
    key: 1,
    icon: React.createElement(UserOutlined),
    label: <Link to="usuarios"> Usuarios</Link>,
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
    icon: React.createElement(CopyOutlined),
    label: <Link to="proveedores"> Proveedores</Link>,
  },
  {
    key: 25,
    icon: React.createElement(UserOutlined),
    label: <Link to="clientes"> Clientes</Link>,
  },
  {
    key: "10",
    icon: React.createElement(AppstoreOutlined),
    label: "Compras",
    children: [
      {
        key: "10-1",
        label: <Link to="compras">Ver Compras</Link>,
        icon: React.createElement(AppstoreOutlined),
      },
      {
        key: "10-2",
        label: <Link to="crearcompra">Crear Compra</Link>,
        icon: React.createElement(PlusOutlined),
      },
    ],
  },
  {
    key: "150",
    icon: React.createElement(DollarOutlined),
    label: "Ventas",
    children: [
      {
        key: "10-5",
        label: <Link to="cajasventas">Crear Venta</Link>,
        icon: React.createElement(EyeOutlined),
      },
         {
        key: "10-6",
        label: <Link to="verventas">Ver Venta</Link>,
        icon: React.createElement(EyeOutlined),
      },
    ],
  },
  {
    key: "196",
    icon: React.createElement(BarcodeOutlined),
    label: <Link to="cajas"> Cajas</Link>,
  },

  {
    key: "143",
    icon: React.createElement(ProfileOutlined),
    label: <Link to="cajasestacion"> Cajas Estacion</Link>,
  },
];
