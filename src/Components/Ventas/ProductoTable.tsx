import React from "react";
import { Table, Button } from "antd";

interface Props {
  detalles: any[];
  onRemove: (idProducto: number) => void;
}

const ProductosTable: React.FC<Props> = ({ detalles, onRemove }) => {
  const columns = [
    { title: "ID", dataIndex: "idProducto" },
    { title: "Descripción", dataIndex: "descripcion" },
    { title: "Cantidad", dataIndex: "cantidad" },
    { title: "Precio", dataIndex: "precio" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Acción",
      render: (_: any, record: any) => (
        <Button danger onClick={() => onRemove(record.idProducto)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <Table
      dataSource={detalles}
      columns={columns}
      rowKey="idProducto"
      pagination={false}
    />
  );
};

export default ProductosTable;
