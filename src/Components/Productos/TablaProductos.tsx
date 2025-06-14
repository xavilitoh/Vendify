import React, { useState } from "react";
import { Table, Button } from "antd";
import ProductDetailsDrawer from "./VerProducto";

interface Product {
  idProducto: number;
  nombreProducto: string;
  abrebiaturaUnidad: string;
  idUnidadBase: number;
  unidad: string;
  stock: number;
  stockMinimo: number;
  codigo: string;
}

interface TableProductsProps {
  products: Product[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  onEdit: (product: Product) => void;
  onCategoryChange: (categoryId: number) => void;
  loading: boolean;
}

const TableProducts: React.FC<TableProductsProps> = ({
  products,
  total,
  currentPage,
  pageSize,
  onPageChange,
  onEdit,
  loading,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const [drawerVisible, setDrawerVisible] = useState(false);
  const showDrawer = (productId: number) => {
    setSelectedProductId(productId);
    setDrawerVisible(true);
  };

  const onCloseDrawer = () => {
    setDrawerVisible(false);
    setSelectedProductId(null);
  };

  const columns = [
    { title: "Nombre", dataIndex: "nombreProducto", key: "nombre" },
    { title: "Código", dataIndex: "codigo", key: "codigo" },
    { title: "Stock", dataIndex: "stock", key: "stock" },
    { title: "Stock Mínimo", dataIndex: "stockMinimo", key: "stockMinimo" },
    { title: "Unidad", dataIndex: "unidad", key: "unidad" },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Product) => (
        <>
          <Button onClick={() => showDrawer(record.idProducto)}>Ver</Button>
          <Button
            type="primary"
            style={{ marginLeft: "10px" }}
            onClick={() => onEdit(record)}
          >
            Editar
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        loading={loading}
          scroll={{ x: 'max-content' }} // 👈 makes it responsive horizontally

        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: (newPage, newPageSize) => {
            onPageChange(newPage, newPageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
      />

      <ProductDetailsDrawer
        productId={selectedProductId}
        visible={drawerVisible}
        onClose={onCloseDrawer}
      />
    </>
  );
};

export default TableProducts;
