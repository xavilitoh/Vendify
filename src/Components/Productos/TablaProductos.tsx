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
  onEdit: (product: Product) => void;
  filteredSubcategories: Subcategoria[];
  onCategoryChange: (categoryId: number) => void;
}

const TableProducts: React.FC<TableProductsProps> = ({
  products,
  onEdit,
  filteredSubcategories,
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
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Stock",
      dataIndex: "stockMinimo",
      key: "stockMinimo",
    },
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
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          defaultCurrent: 1,
        }}
      />
      <ProductDetailsDrawer
        productId={selectedProductId}
        visible={drawerVisible}
        onClose={onCloseDrawer}
      />
      {filteredSubcategories.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <h4>Subcategorías Filtradas:</h4>
          <ul>
            {filteredSubcategories.map((subcategory) => (
              <li key={subcategory.id}>{subcategory.descripcion}</li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default TableProducts;
