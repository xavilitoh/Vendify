import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCajas,
  selectLoading,
  selectPage,
  selectPageSize,
  selectTotal,
  setPage,
  setPageSize,
} from "../../Redux/Cajas.";
import TableCajas from "./TableCajas";
import Container from "../Utils/Container";
import { AppDispatch } from "../../Redux/Store";
import { Typography } from "antd";
const { Title, Paragraph } = Typography;
interface CajasProps {
  isDarkMode: boolean;
}

const Cajas: React.FC<CajasProps> = ({ isDarkMode }) => {
  const dispatch: AppDispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);

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
    <Container isDarkMode={isDarkMode}>
      <div style={{ marginBottom: 16 }}>
        <Title level={4}>Cajas</Title>
        <Paragraph>Lista de cajas y sus estados actuales.</Paragraph>
      </div>

      <TableCajas
        loading={loading}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default Cajas;
