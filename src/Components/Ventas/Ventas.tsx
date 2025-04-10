import React, { useEffect, useState } from "react";
import { Button, Divider } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchVentas,
  selectVentas,
  selectVentasLoading,
  selectVentasPage,
  selectVentasPageSize,
  selectVentasTotal,
  setPage,
  setPageSize,
} from "../../Redux/Ventas";
import TablaVentas from "./TableVentas";
import CrearVentaModal from "./CrearVentas";
import EditarVentaModal from "./EditarVenta";
import { AppDispatch } from "../../Redux/Store";
import { PlusOutlined } from "@ant-design/icons";

const Ventas: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const ventas = useSelector(selectVentas);
  const loading = useSelector(selectVentasLoading);
  const total = useSelector(selectVentasTotal);
  const page = useSelector(selectVentasPage);
  const pageSize = useSelector(selectVentasPageSize);

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [ventaEditando, setVentaEditando] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchVentas({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };

  const handleEdit = (venta: any) => {
    setVentaEditando(venta);
    setEditModalVisible(true);
  };

  return (
    <div>
      <Divider>Ventas</Divider>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Crear Venta
        </Button>
      </div>

      <TablaVentas
        ventas={ventas}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        loading={loading}
      />

      <CrearVentaModal
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      {ventaEditando && (
        <EditarVentaModal
          visible={isEditModalVisible}
          venta={ventaEditando}
          onClose={() => {
            setEditModalVisible(false);
            setVentaEditando(null);
          }}
        />
      )}
    </div>
  );
};

export default Ventas;
