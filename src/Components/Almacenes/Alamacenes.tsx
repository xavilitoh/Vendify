import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin, notification } from "antd";
import {
  fetchAlmacenes,
  createAlmacen,
  updateAlmacen,
  selectAlmacenes,
  selectLoading,
} from "../../Redux/Almacenes";
import { AppDispatch } from "../../Redux/Store";
import TableAlmacenes from "./AlmacenesTable";
import CreateAlmacenModal from "./CreateAlmacen";
import EditAlmacenModal from "./EditarAlmacen";
import { PlusOutlined } from "@ant-design/icons";

const Almacenes: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const almacenes = useSelector(selectAlmacenes) || [];
  const loading = useSelector(selectLoading);

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingAlmacen, setEditingAlmacen] = useState<any | null>(null);

  // Fetch almacenes on component mount
  useEffect(() => {
    dispatch(fetchAlmacenes());
  }, [dispatch]);

  // Handle opening the edit modal
  const handleEdit = (almacen: any) => {
    setEditingAlmacen(almacen);
    setEditModalVisible(true);
  };

  // Handle creating a new almacen
  const handleCreate = async (values: any) => {
    try {
      await dispatch(createAlmacen(values)).unwrap();
      notification.success({
        message: "Almacén creado",
        description: `El almacén "${values.descripcion}" ha sido creado exitosamente.`,
        placement: "topRight",
      });
      setCreateModalVisible(false);
    } catch (error: any) {
      notification.error({
        message: "Error al crear almacén",
        description: error.message || "Ocurrió un error inesperado.",
        placement: "topRight",
      });
    }
  };

  // Handle updating an almacen
  const handleUpdate = async (id: number, values: any) => {
    try {
      await dispatch(updateAlmacen({ id, almacenData: values })).unwrap();
      notification.success({
        message: "Almacén actualizado",
        description: `El almacén "${values.descripcion}" ha sido actualizado exitosamente.`,
        placement: "topRight",
      });
      setEditModalVisible(false);
      setEditingAlmacen(null);
    } catch (error: any) {
      notification.error({
        message: "Error al actualizar almacén",
        description: error.message || "Ocurrió un error inesperado.",
        placement: "topRight",
      });
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => setCreateModalVisible(true)}
        icon={<PlusOutlined />}
      >
        Crear Almacén
      </Button>

      {loading ? (
        <Spin size="large" />
      ) : (
        <TableAlmacenes almacenes={almacenes} onEdit={handleEdit} />
      )}

      <CreateAlmacenModal
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={handleCreate}
      />

      {editingAlmacen && (
        <EditAlmacenModal
          visible={isEditModalVisible}
          almacen={editingAlmacen}
          onClose={() => {
            setEditModalVisible(false);
            setEditingAlmacen(null);
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Almacenes;
