import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Divider } from "antd";
import {
  fetchCajas,
  selectLoading,
  selectTotal,
  selectPage,
  selectPageSize,
  setPage,
  setPageSize,
} from "../../Redux/Cajas.";
import CreateCajaModal from "./CreateCaja";
import TableCajas from "./TableCajas";
import { AppDispatch } from "../../Redux/Store";
import { PlusOutlined } from "@ant-design/icons";
import Container from "../Utils/Container";

interface CajasProps {
  isDarkMode?: boolean;
}

const Cajas: React.FC<CajasProps> = ({ isDarkMode }) => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchCajas({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };

  return (
    <>
      <Container isDarkMode={isDarkMode}>
        <Divider />
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={() => setCreateModalVisible(true)}
            icon={<PlusOutlined />}
          >
            Crear Caja
          </Button>
        </div>

        <TableCajas
          loading={loading}
          total={total}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={handlePageChange}
        />

        <CreateCajaModal
          visible={isCreateModalVisible}
          onClose={() => setCreateModalVisible(false)}
        />
      </Container>
    </>
  );
};

export default Cajas;
