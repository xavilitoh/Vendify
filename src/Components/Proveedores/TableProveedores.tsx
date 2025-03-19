import React from "react";
import { Table, Button, Switch } from "antd";
import { Proveedor } from "../../Redux/Proveedores";

interface TableProveedoresProps {
  proveedores: Proveedor[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  onEdit: (proveedor: Proveedor) => void;
  loading?: boolean;
}

const TableProveedores: React.FC<TableProveedoresProps> = ({
  proveedores,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  loading,
}) => {
  const columns = [
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Dirección", dataIndex: "direccion", key: "direccion" },
    { title: "Teléfono", dataIndex: "telefono", key: "telefono" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "RNC", dataIndex: "rnc", key: "rnc" },
    { title: "Representante", dataIndex: "nombre", key: "nombre" },
    {
      title: "Habilitado",
      dataIndex: "enable",
      key: "enable",
      render: (enabled: boolean) => <Switch checked={enabled} disabled />,
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Proveedor) => (
        <Button type="primary" onClick={() => onEdit(record)}>
          Editar
        </Button>
      ),
    },
  ];

  console.log(proveedores);

  return (
    <Table
      dataSource={proveedores}
      columns={columns}
      rowKey="id"
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize,

        total,
        onChange: (page, pageSize) => onPageChange(page, pageSize),
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20"],
      }}
      style={{ marginTop: 20 }}
    />
  );
};

export default TableProveedores;
