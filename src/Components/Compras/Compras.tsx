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

const Compras: React.FC = () => {
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
    <div>
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
  );
};

export default Compras;
