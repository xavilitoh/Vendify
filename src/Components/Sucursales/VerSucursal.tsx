import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, message, Drawer } from "antd";
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
  updateAlmacen,
} from "../../Redux/Almacenes";
import { AppDispatch } from "../../Redux/Store";
import TableAlmacenes from "../Almacenes/AlmacenesTable";
import CreateAlmacenModal from "../Almacenes/CreateAlmacen";
import EditAlmacenModal from "../Almacenes/EditarAlmacen";
import { PlusOutlined } from "@ant-design/icons";
import CustomTabs from "../Utils/CustomTabs";
import Container from "../Utils/Container";

interface VerSucursalProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  selectedSucursal: any; // Assuming selectedSucursal contains the selected sucursal's data
  isDarkMode?: boolean;
}

const VerSucursal: React.FC<VerSucursalProps> = ({
  setOpenDrawer,
  openDrawer,
  selectedSucursal,
  isDarkMode,
}) => {
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
  }, [dispatch, page, pageSize]);

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

  // Filter almacenes to only show those that match the selectedSucursal
  const filteredAlmacenes = almacenes.filter(
    (almacen) => almacen.idSucursal === selectedSucursal?.id
  );

  const tabs = [
    {
      label: "Almacenes",
      key: "1",
      children: (
        <TableAlmacenes
          almacenes={filteredAlmacenes} // Pass filtered almacenes
          total={total}
          currentPage={page}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange}
          onEdit={handleEdit}
        />
      ),
    },
    { label: "Cajas", key: "2", children: <div>Contenido del Tab 2</div> },
    { label: "Tab 3", key: "3", children: <div>Contenido del Tab 3</div> },
  ];

  return (
    <Drawer
      title="Detalle de la Sucursal"
      placement="right"
      onClose={() => setOpenDrawer(false)}
      open={openDrawer}
      width={800}
    >
      <Container isDarkMode={isDarkMode}>
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Crear Almacén
        </Button>

        <CustomTabs items={tabs} />

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
    </Drawer>
  );
};

export default VerSucursal;
