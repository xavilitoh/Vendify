import React, { useEffect } from "react";
import { Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
import { AppDispatch } from "../../Redux/Store";
import { PlusOutlined } from "@ant-design/icons";
import Container from "../Utils/Container";

interface VentasProps { 
  isDarkMode: boolean; // This prop is not used in the current component but can be used for styling or theming
}

const Ventas: React.FC<VentasProps> = ({isDarkMode}) => {
  const dispatch: AppDispatch = useDispatch();
  const ventas = useSelector(selectVentas);
  const loading = useSelector(selectVentasLoading);
  const total = useSelector(selectVentasTotal);
  const page = useSelector(selectVentasPage);
  const pageSize = useSelector(selectVentasPageSize);

  useEffect(() => {
    dispatch(fetchVentas({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };

  return (
    <Container isDarkMode={isDarkMode}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />}>
          <Link to="/crearventas">Crear Venta</Link>
        </Button>
      </div>

      <TablaVentas
        ventas={ventas}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </Container>
  );
};

export default Ventas;
