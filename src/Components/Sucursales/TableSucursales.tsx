import React, { useState } from "react";
import { Table, Button, Space, Switch } from "antd";
import VerSucursal from "./VerSucursal";

interface TableSucursalesProps {
  sucursales: any[];
  onEdit: (sucursal: any) => void;
  loading?: boolean;
  isDarkMode?: boolean; // Optional prop for dark mode
}

const TableSucursales: React.FC<TableSucursalesProps> = ({
  sucursales,
  onEdit,
  loading,
  isDarkMode
}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState<any>(null);

  const handleView = (record: any) => {
    setSelectedSucursal(record);
    setOpenDrawer(true);
  };

  const columns = [
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Dirección",
      dataIndex: "direccion",
      key: "direccion",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Estado",
      dataIndex: "enable",
      key: "estado",
      render: (enable: boolean) => <Switch checked={enable} disabled />,
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="primary" onClick={() => onEdit(record)}>
            Editar
          </Button>
          <Button onClick={() => handleView(record)}>Ver</Button>
        </Space>
      ),
    },
  ];

  return (
    <React.Fragment>
      <Table
        dataSource={sucursales}
        loading={loading}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          defaultCurrent: 1,
        }}
        columns={columns}
        rowKey="id"
      />
      <VerSucursal
        isDarkMode={isDarkMode}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        selectedSucursal={selectedSucursal}
      ></VerSucursal>
    </React.Fragment>
  );
};

export default TableSucursales;
