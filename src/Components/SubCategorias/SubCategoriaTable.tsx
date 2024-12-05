import React, { useState } from "react";
import { Table, Tag, Switch, Button } from "antd";

interface Subcategoria {
  iCategoria: number;
  categoria: {
    fechaCreacion: string;
    fechaModificacion: string | null;
    id: number;
    descripcion: string;
    enable: boolean;
    idEntidad: number;
    entidad: any | null;
  };
  fechaCreacion: string;
  fechaModificacion: string | null;
  id: number;
  descripcion: string;
  enable: boolean;
  idEntidad: number;
  entidad: any | null;
}

interface SubcategoriasTableProps {
  subcategorias: Subcategoria[];
  loading: boolean;
}

const SubcategoriasTable: React.FC<SubcategoriasTableProps> = ({
  subcategorias,
  loading,
}) => {
  const [selectedSubcategoria, setSelectedSubcategoria] =
    useState<Subcategoria | null>(null);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Categoría",
      dataIndex: ["categoria", "descripcion"],
      key: "categoria",
    },
    {
      title: "Fecha de Creación",
      dataIndex: "fechaCreacion",
      key: "fechaCreacion",
      render: (fecha: string) => new Date(fecha).toLocaleDateString(),
    },
    {
      title: "Habilitado",
      dataIndex: "enable",
      key: "enable",
      render: (enable: boolean) => (
        <Switch
          checked={enable}
          disabled={true} // Toggle action can be implemented if needed
        />
      ),
    },
    {
      title: "Acción",
      key: "action",
      render: (_: any, record: Subcategoria) => (
        <Button
          type="primary"
          onClick={() => setSelectedSubcategoria(record)}
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={subcategorias}
      rowKey={(record) => record.id.toString()}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20"],
        defaultCurrent: 1,
      }}
      style={{ marginTop: "30px" }}
    /> 
  );
};

export default SubcategoriasTable;
