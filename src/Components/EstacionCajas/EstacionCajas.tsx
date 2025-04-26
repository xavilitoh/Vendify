import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Divider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { fetchCajaEstaciones,selectCajaEstaciones, selectLoading, selectTotal, selectPage, selectPageSize, setPage, setPageSize } from "../../Redux/\CajaEstacion";
import TableCajaEstacion from "./TableCajaEstacion";
import CreateCajaEstacion from "./CreateCajaEstacion";
import { AppDispatch } from "../../Redux/Store";
import Container from "../Utils/Container";

interface CajaEstacionProps {
  isDarkMode?: boolean; // Optional prop for dark mode
}

const CajaEstacionPage: React.FC<CajaEstacionProps> = ({ isDarkMode }) => {
  const dispatch: AppDispatch = useDispatch();
  const cajaEstaciones = useSelector(selectCajaEstaciones);
  const loading = useSelector(selectLoading);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCajaEstaciones({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };
  console.log("Caja Estaciones:", cajaEstaciones);
  return (
    <Container isDarkMode={isDarkMode}>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Crear Caja Estación
        </Button>
      </div>

      <TableCajaEstacion
        cajaEstaciones={cajaEstaciones}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
      />

      <CreateCajaEstacion
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </Container>
  );
};

export default CajaEstacionPage;
