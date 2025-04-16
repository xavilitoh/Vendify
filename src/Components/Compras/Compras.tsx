import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  fetchCompras,
  selectCompras,
  selectLoading,
  selectTotal,
  selectPage,
  selectPageSize,
  setPage,
  setPageSize,
} from "../../Redux/Compras";
import { AppDispatch } from "../../Redux/Store";
import TableCompras from "./TableCompras";
import { Link } from "react-router-dom";
import Container from "../Utils/Container";

interface ComprasProps {
  isDarkMode: boolean;  // This prop is not used in the current component but can be used for styling or theming
}

const Compras: React.FC<ComprasProps> = ({isDarkMode}) => {
  const dispatch: AppDispatch = useDispatch();
  const compras = useSelector(selectCompras);
  const loading = useSelector(selectLoading);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);

  useEffect(() => {
    dispatch(fetchCompras({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };

  return (
    <Container isDarkMode={isDarkMode}>
    <div style={{ overflow: "auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />}>
          <Link to="/crearcompra">Crear Compra</Link>
        </Button>
      </div>

      <TableCompras
        compras={compras}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
      />
    </div>
    </Container>
  );
};

export default Compras;
