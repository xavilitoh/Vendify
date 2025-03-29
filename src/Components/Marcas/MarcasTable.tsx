import React, { useState, useEffect } from "react";
import { Table, Button, message, Switch } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { updateMarca } from "../../Redux/MarcasSlice";
import EditMarcaModal from "./EditarMarcaModa";

interface Marca {
  id: number;
  descripcion: string;
  enable: boolean;
  idEntidad: number;
  entidad: {
    id: number;
    nombre: string;
    rnc: string;
    direccion: string;
    telefono1: string;
    telefono2: string;
    email: string;
  } | null;
  fechaCreacion: string;
  fechaModificacion: string | null;
}

interface MarcasTableProps {
  marcas: Marca[];
  loading: boolean;
}

const MarcasTable: React.FC<MarcasTableProps> = ({ marcas, loading }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [marcasList, setMarcasList] = useState<Marca[]>([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setMarcasList(marcas);
  }, [marcas]);

  const handleEditClick = (marca: Marca) => {
    setSelectedMarca(marca);
    setIsEditModalVisible(true);
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedMarca(null);
  };

  const handleEditSubmit = (values: {
    descripcion: string;
    enable: boolean;
  }) => {
    if (selectedMarca) {
      dispatch(
        updateMarca({
          id: selectedMarca.id,
          descripcion: values.descripcion,
          enable: values.enable,
          idEntidad: selectedMarca.idEntidad,
          fechaCreacion: selectedMarca.fechaCreacion,
          fechaModificacion: new Date().toISOString(),
        })
      )
        .then(() => {
          message.success("Marca actualizada exitosamente");
          setIsEditModalVisible(false);
          setMarcasList((prev) =>
            prev.map((marca) =>
              marca.id === selectedMarca.id
                ? {
                    ...marca,
                    descripcion: values.descripcion,
                    enable: values.enable,
                  }
                : marca
            )
          );
        })
        .catch(() => {
          message.error("Error al actualizar la marca");
        });
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
      title: "Entidad",
      dataIndex: "Identidad",
      key: "entidad",
      render: (entidad: Marca["entidad"]) => (entidad ? entidad.nombre : "N/A"),
    },
    {
      title: "Fecha de Creación",
      dataIndex: "fechaCreacion",
      key: "fechaCreacion",
      render: (fecha: string) => moment(fecha).format("YYYY-MM-DD"),
    },
    {
      title: "Fecha de Modificación",
      dataIndex: "fechaModificacion",
      key: "fechaModificacion",
      render: (fecha: string | null) =>
        fecha ? moment(fecha).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Habilitado",
      dataIndex: "enable",
      key: "enable",
      render: (enable: boolean) => <Switch checked={enable} disabled />,
    },
    {
      title: "Acción",
      key: "action",
      render: (_: any, record: Marca) => (
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
        dataSource={marcasList}
        rowKey={(record) => record.id.toString()}
        loading={loading}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          defaultCurrent: 1,
        }}
        style={{ marginTop: "30px" }}
      />

      {selectedMarca && (
        <EditMarcaModal
          visible={isEditModalVisible}
          onCancel={handleCancelEditModal}
          onSubmit={handleEditSubmit}
          initialValues={{
            descripcion: selectedMarca.descripcion,
            enable: selectedMarca.enable,
          }}
        />
      )}
    </>
  );
};

export default MarcasTable;
