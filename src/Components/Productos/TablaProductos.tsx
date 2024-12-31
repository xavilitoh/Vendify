import React from "react";
import { Table, Button } from "antd";

interface Product {
  id: number;
  descripcion: string;
  idMarca: number;
  idCategoria: number;
  idSubcategoria: number;
  idUnidad: number;
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
  onCategoryChange: (categoryId: number) => void;
  filteredSubcategories: Subcategoria[];
}

const TableProducts: React.FC<TableProductsProps> = ({
  products,
  onEdit,
  filteredSubcategories,
}) => {
  const columns = [
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Marca",
      dataIndex: "idMarca",
      key: "idMarca",
    },
    {
      title: "Categoría",
      dataIndex: "idCategoria",
      key: "idCategoria",
    },
    {
      title: "Subcategoría",
      dataIndex: "idSubcategoria",
      key: "idSubcategoria",
    },
    {
      title: "Unidad",
      dataIndex: "idUnidad",
      key: "idUnidad",
    },
    {
      title: "Stock Mínimo",
      dataIndex: "stockMinimo",
      key: "stockMinimo",
    },
    {
      title: "Código de Barras",
      dataIndex: "barCode",
      key: "barCode",
    },
    {
      title: "Con Impuesto",
      dataIndex: "conImpuesto",
      key: "conImpuesto",
      render: (value: boolean) => (value ? "Sí" : "No"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Product) => (
        <Button type="link" onClick={() => onEdit(record)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={products} columns={columns} rowKey="id" />
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
