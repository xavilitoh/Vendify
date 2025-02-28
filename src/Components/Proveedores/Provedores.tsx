import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import {
  fetchProveedores,
  selectProveedores,
  selectLoading as selectProveedoresLoading,
  selectTotal as selectProveedoresTotal,
  selectPage as selectProveedoresPage,
  selectPageSize as selectProveedoresPageSize,
  setPage as setProveedoresPage,
  setPageSize as setProveedoresPageSize,
} from "../../Redux/Proveedores";
import CreateProveedorModal from "./CreateProveedores";
import EditProveedorModal from "./EditarProveedores";
import TableProveedores from "./TableProveedores";
import { AppDispatch } from "../../Redux/Store";
import { Proveedor } from "../../Redux/Proveedores";

const Proveedores: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const proveedores = useSelector(selectProveedores);
  const loading = useSelector(selectProveedoresLoading);
  const total = useSelector(selectProveedoresTotal);
  const page = useSelector(selectProveedoresPage);
  const pageSize = useSelector(selectProveedoresPageSize);

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(
    null
  );

  useEffect(() => {
    dispatch(fetchProveedores({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setEditModalVisible(true);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setProveedoresPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setProveedoresPageSize(newPageSize));
    }
  };

  return (
    <div>
      <Button type="primary" onClick={() => setCreateModalVisible(true)}>
        Crear Proveedor
      </Button>

      <TableProveedores
        proveedores={proveedores}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        loading={loading}
      />

      <CreateProveedorModal
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
      {editingProveedor && (
        <EditProveedorModal
          visible={isEditModalVisible}
          proveedor={editingProveedor}
          onClose={() => {
            setEditModalVisible(false);
            setEditingProveedor(null);
          }}
        />
      )}
    </div>
  );
};

export default Proveedores;
