import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, message } from "antd";
import {
  fetchAlmacenes,
  selectAlmacenes,
  selectLoading,
  selectTotal,
  selectPage,
  selectPageSize,
  setPage,
  setPageSize,
  createAlmacen,
  updateAlmacen
} from "../../Redux//Almacenes";
import { AppDispatch } from "../../Redux/Store";
import TableAlmacenes from "./AlmacenesTable";
import CreateAlmacenModal from "./CreateAlmacen";
import EditAlmacenModal from "./EditarAlmacen";
import { PlusOutlined } from "@ant-design/icons";
import Container from "../Utils/Container";

interface AlmacenesProps {
  isDarkMode?: boolean; // Optional prop for dark mode  
}

const Almacenes: React.FC<AlmacenesProps> = ({isDarkMode}) => {
  const dispatch: AppDispatch = useDispatch();
  const almacenes = useSelector(selectAlmacenes) || [];
  const loading = useSelector(selectLoading);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingAlmacen, setEditingAlmacen] = useState<any | null>(null);

  // Fetch almacenes on component mount
  useEffect(() => {
    dispatch(fetchAlmacenes({ page, pageSize }));
  }, [dispatch,page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };

  // Handle opening the edit modal
  const handleEdit = (almacen: any) => {
    setEditingAlmacen(almacen);
    setEditModalVisible(true);
  };

  // Handle creating a new almacen
  const handleCreate = async (values: any) => {
    try {
      await dispatch(createAlmacen(values)).unwrap();
      message.success("Almacén Creado correctamente");
      setCreateModalVisible(false);
    } catch (error: any) {
      message.error("Ocurrió un error al actualizar el almacén");
    }
  };

  // Handle updating an almacen
  const handleUpdate = async (id: number, values: any) => {
    try {
      await dispatch(updateAlmacen({ id, almacenData: values })).unwrap();
      message.success("Almacén actualizado correctamente");
      setEditModalVisible(false);
      setEditingAlmacen(null);
    } catch (error: any) {
      message.error("Ocurrió un error al actualizar el almacén");
    }
  };

  console.log(almacenes);

  return (
    <Container isDarkMode={isDarkMode}>
      <Button
        type="primary"
        onClick={() => setCreateModalVisible(true)}
        icon={<PlusOutlined />}
      >
        Crear Almacén
      </Button>

      <TableAlmacenes
        almacenes={almacenes}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        loading={loading}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
      />

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
    </Container>
  );
};

export default Almacenes;
