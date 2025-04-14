import React from "react";
import { Table, Button, Space } from "antd";

interface TableAlmacenesProps {
  almacenes: any[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number, pageSize?: number) => void;
  onEdit: (almacen: any) => void;
}

const TableAlmacenes: React.FC<TableAlmacenesProps> = ({
  almacenes,
  total,
  currentPage,
  pageSize,
  loading,
  onPageChange,
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
      style={{ marginTop: 20 }}
      loading={loading}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: (newPage, newPageSize) => {
          onPageChange(newPage, newPageSize);
        },
        showSizeChanger: true,
        showTotal: (total) => `Total: ${total}`,
      }}
    />
  );
};

export default TableAlmacenes;
