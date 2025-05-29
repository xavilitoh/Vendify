import React, { useState } from "react";
import { Table, Button, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";

import EditCajaEstacion from "./EditarCajaEstacion";

interface CajaEstacion {
  id: number;
  descripcion: string;
  enable: boolean;
}

interface TableCajaEstacionProps {
  cajaEstaciones: CajaEstacion[];
  loading: boolean;
}

const TableCajaEstacion: React.FC<TableCajaEstacionProps> = ({
  cajaEstaciones,
  loading,
}) => {
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedCajaEstacion, setSelectedCajaEstacion] =
    useState<CajaEstacion | null>(null);

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
    /*     {
      title: "Sucursal",
      dataIndex: "id",
      key: "idSucursal",
      render: (id: number) => {
        // Ensure sucursales is available and has data
        const sucursal = sucursales.find((s) => s.id === id);
        return sucursal ? sucursal.descripcion : "Sucursal no encontrada"; // Return descripcion or fallback message
      },
    }, */
    {
      title: "Estado",
      dataIndex: "enable",
      key: "estado",
      render: (enable: boolean) => <Switch checked={enable} disabled />,
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
        scroll={{ x: 'max-content' }} 
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
