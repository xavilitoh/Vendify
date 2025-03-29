import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import {
  fetchSucursales,
  createSucursal,
  updateSucursal,
  selectSucursales,
  selectLoading,
} from "../../Redux/Sucursales";
import { AppDispatch } from "../../Redux/Store"; // Import the AppDispatch type
import TableSucursales from "./TableSucursales";
import CreateSucursalModal from "./CreateSucursales";
import EditSucursalModal from "./EditarSucursales";
import { PlusOutlined } from "@ant-design/icons";

const Sucursales: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const sucursales = useSelector(selectSucursales);
  const loading = useSelector(selectLoading);

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingSucursal, setEditingSucursal] = useState(null);
  useEffect(() => {
    dispatch(fetchSucursales());
  }, [dispatch]);

  const handleEdit = (sucursal: any) => {
    setEditingSucursal(sucursal);
    setEditModalVisible(true);
  };

  const handleCreate = async (values: any) => {
    await dispatch(createSucursal(values));
    setCreateModalVisible(false);
  };

  const handleUpdate = async (id: number, values: any) => {
    await dispatch(updateSucursal({ id, sucursalData: values })).unwrap();

    setEditModalVisible(false);
    setEditingSucursal(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Crear Sucursal
        </Button>
      </div>

      <TableSucursales
        sucursales={sucursales || []}
        onEdit={handleEdit}
        loading={loading}
      />

      <CreateSucursalModal
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreate={handleCreate}
      />

      {editingSucursal && (
        <EditSucursalModal
          visible={isEditModalVisible}
          sucursal={editingSucursal}
          onClose={() => {
            setEditModalVisible(false);
            setEditingSucursal(null);
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default Sucursales;
