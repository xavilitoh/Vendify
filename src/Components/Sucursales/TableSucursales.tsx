import React from "react";
import { Table, Button, Space, Switch } from "antd";

interface TableSucursalesProps {
  sucursales: any[];
  onEdit: (sucursal: any) => void;
  loading?: boolean;
}

const TableSucursales: React.FC<TableSucursalesProps> = ({
  sucursales,
  onEdit,
  loading,
}) => {
  console.log(sucursales);

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
        </Space>
      ),
    },
  ];

  return (
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
  );
};

export default TableSucursales;
