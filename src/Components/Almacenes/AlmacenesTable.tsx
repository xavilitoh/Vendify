import React from "react";
import { Table, Button, Space } from "antd";

interface TableAlmacenesProps {
  almacenes: any[];
  onEdit: (almacen: any) => void;
}

const TableAlmacenes: React.FC<TableAlmacenesProps> = ({
  almacenes,
  onEdit,
}) => {
  const columns = [
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Dirección", dataIndex: "direccion", key: "direccion" },
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
      dataSource={almacenes}
      columns={columns}
      rowKey="id"
      style={{ marginTop: "20px" }}
    />
  );
};

export default TableAlmacenes;
