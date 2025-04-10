import React from "react";
import { Table } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";

interface Props {
  ventas: any[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  onEdit: (venta: any) => void;
  loading: boolean;
}

const TablaVentas: React.FC<Props> = ({
  ventas,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  loading,
}) => {
  const columns: ColumnsType<any> = [
    { title: "ID", dataIndex: "id" },
    {
      title: "Cliente",
      dataIndex: ["cliente", "nombre"],
      render: (_, record) => record.cliente?.nombre || "N/A",
    },
    { title: "Total", dataIndex: "total" },
    { title: "Impuestos", dataIndex: "impuestos" },
    {
      title: "Fecha",
      dataIndex: "fechaCreacion",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Acciones",
      render: (_, record) => (
        <Button onClick={() => onEdit(record)} type="link">
          Editar
        </Button>
      ),
    },
  ];

  const pagination: TablePaginationConfig = {
    current: currentPage,
    pageSize,
    total,
    onChange: onPageChange,
    showSizeChanger: true,
    pageSizeOptions: ["5", "10", "20", "50"],
  };

  return (
    <Table
      columns={columns}
      dataSource={ventas}
      rowKey="id"
      loading={loading}
      pagination={pagination}
    />
  );
};

export default TablaVentas;
