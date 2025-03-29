import React, { useState, useEffect } from "react";
import { Table, Button, message, Switch } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { updateUnidad } from "../../Redux/UnidadesSlice";
import EditUnidadModal from "./EditarUnidad";

interface Unidad {
  id: number;
  descripcion: string;
  abreviatura: string;
  enable: boolean;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

interface UnidadesTableProps {
  unidades: Unidad[];
  loading: boolean;
}

const UnidadesTable: React.FC<UnidadesTableProps> = ({ unidades, loading }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedUnidad, setSelectedUnidad] = useState<Unidad | null>(null);
  const [unidadesList, setUnidadesList] = useState<Unidad[]>([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setUnidadesList(unidades);
  }, [unidades]);

  const handleEditClick = (unidad: Unidad) => {
    setSelectedUnidad(unidad);
    setIsEditModalVisible(true);
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedUnidad(null);
  };

  const handleEditSubmit = async (values: {
    descripcion: string;
    abreviatura: string;
    enable: boolean;
  }) => {
    if (selectedUnidad) {
      try {
        await dispatch(
          updateUnidad({
            id: selectedUnidad.id,
            descripcion: values.descripcion,
            abreviatura: values.abreviatura,
            enable: values.enable,
          })
        ).unwrap();

        message.success("Unidad actualizada exitosamente");
        setIsEditModalVisible(false);

        setUnidadesList((prev) =>
          prev.map((unidad) =>
            unidad.id === selectedUnidad.id
              ? {
                  ...unidad,
                  ...values,
                  fechaModificacion: new Date().toISOString(),
                }
              : unidad
          )
        );
      } catch {
        message.error("Error al actualizar la unidad");
      }
    }
  };

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
      title: "Abreviatura",
      dataIndex: "abreviatura",
      key: "abreviatura",
    },
    {
      title: "Habilitado",
      dataIndex: "enable",
      key: "enable",
      render: (enable: boolean) => <Switch checked={enable} disabled />,
    },
    {
      title: "Acción",
      key: "accion",
      render: (_: any, record: Unidad) => (
        <Button type="primary" onClick={() => handleEditClick(record)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={unidadesList}
        rowKey={(record: Unidad) => record.id.toString()}
        loading={loading}
        pagination={{ pageSize: 8 }}
        style={{ marginTop: "10px" }}
      />

      {selectedUnidad && (
        <EditUnidadModal
          visible={isEditModalVisible}
          onCancel={handleCancelEditModal}
          onSubmit={handleEditSubmit}
          initialValues={{
            descripcion: selectedUnidad.descripcion,
            abreviatura: selectedUnidad.abreviatura,
            enable: selectedUnidad.enable,
          }}
        />
      )}
    </>
  );
};

export default UnidadesTable;
