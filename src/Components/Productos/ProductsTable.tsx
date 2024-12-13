import React from "react";
import { Table } from "antd";

interface Product {
  id: number;
  descripcion: string;
  barCode: string;
  stockMinimo: number;
  conImpuesto: boolean;
}

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, loading }) => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Código de Barras", dataIndex: "barCode", key: "barCode" },
    { title: "Stock Mínimo", dataIndex: "stockMinimo", key: "stockMinimo" },
    {
      title: "Con Impuesto",
      dataIndex: "conImpuesto",
      key: "conImpuesto",
      render: (value: boolean) => (value ? "Sí" : "No"),
    },
  ];

  return <Table columns={columns} dataSource={products} loading={loading} rowKey="id" style={{marginTop:'15px'}} />;
};

export default ProductsTable;
