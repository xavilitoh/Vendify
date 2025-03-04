// TablaCompras.tsx
import React from "react";
import { Table, Button } from "antd";
import { Compra } from "../../Redux/Compras";

interface TableComprasProps {
  compras: Compra[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  onEdit: (compra: Compra) => void;
  loading: boolean;
}

const TableCompras: React.FC<TableComprasProps> = ({
  compras,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  loading,
}) => {
  const columns = [
    {
      title: "Factura",
      dataIndex: "factura",
      key: "factura",
    },
    {
      title: "Fecha",
      dataIndex: "fechaFactura",
      key: "fechaFactura",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `$${total.toFixed(2)}`,
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Compra) => (
        <Button onClick={() => onEdit(record)}>Ver</Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={compras}
      rowKey={(record) => record.id.toString()}
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: onPageChange,
      }}
      loading={loading}
    />
  );
};

export default TableCompras;
