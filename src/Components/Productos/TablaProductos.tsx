import React, { useState } from "react";
import { Table, Button, Switch } from "antd";
import ProductDetailsDrawer from "./VerProducto";

interface Product {
  id: number;
  nombre: string;
  idMarca: number;
  idCategoria: number;
  idSubcategoria: number;
  idUnidad: number;
  descripcion: string;
  stockMinimo: number;
  barCode: string;
  conImpuesto: boolean;
}

interface Subcategoria {
  id: number;
  descripcion: string;
  iCategoria: number;
  enable: boolean;
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
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Stock", dataIndex: "stockMinimo", key: "stockMinimo" },
    {
      title: "Con Impuesto",
      dataIndex: "conImpuesto",
      key: "conImpuesto",
      render: (enable: boolean) => <Switch checked={enable} disabled />,
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Product) => (
        <>
          <Button onClick={() => showDrawer(record.id)}>Ver</Button>
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
