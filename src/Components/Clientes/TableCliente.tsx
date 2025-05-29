import React from "react";
import { Table, Button, Space } from "antd";

interface TableProps {
  clientes: any[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading?: boolean;
  onEdit?: (record: any) => void;
  onDelete?: (id: string) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

const TableComponent: React.FC<TableProps> = ({
  clientes,
  total,
  currentPage,
  pageSize,
  loading,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  const enhancedColumns = [
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
    },
    {
      title: "No. Documento",
      dataIndex: "noDocumento",
      key: "noDocumento",
    },
    {
      title: "Telefono",
      dataIndex: "telefono",
      key: "telefono",
    },

    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space>
          <Button type="primary" onClick={() => onEdit?.(record)}>
            Editar
          </Button>
          <Button type="primary" danger onClick={() => onDelete?.(record.id)}>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={enhancedColumns}
      dataSource={clientes}
      loading={loading}
      rowKey="id"
            scroll={{ x: 'max-content' }} 
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20"],
      }}
    />
  );
};

export default TableComponent;
