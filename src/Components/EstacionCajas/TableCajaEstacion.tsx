import React, { useState } from "react";
import { Table, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import EditCajaEstacion from "./EditarCajaEstacion";

interface CajaEstacion {
  id: number;
  descripcion: string;
  idSucursal: number;
  estado: number;
}

interface TableCajaEstacionProps {
  cajaEstaciones: CajaEstacion[];
  loading: boolean;
}

const TableCajaEstacion: React.FC<TableCajaEstacionProps> = ({ cajaEstaciones, loading }) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedCajaEstacion, setSelectedCajaEstacion] = useState<CajaEstacion | null>(null);

  const handleEdit = (cajaEstacion: CajaEstacion) => {
    setSelectedCajaEstacion(cajaEstacion);
    setEditModalVisible(true);
  };

  const columns = [
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Sucursal",
      dataIndex: "idSucursal",
      key: "idSucursal",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
      render: (estado: number) => (estado === 1 ? "Activo" : "Inactivo"),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: CajaEstacion) => (
        <Button
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          type="primary"
        >
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={cajaEstaciones}
        rowKey="id"
        loading={loading}
      />

      {selectedCajaEstacion && (
        <EditCajaEstacion
          visible={isEditModalVisible}
          onClose={() => setEditModalVisible(false)}
          cajaEstacion={selectedCajaEstacion}
        />
      )}
    </>
  );
};

export default TableCajaEstacion;
