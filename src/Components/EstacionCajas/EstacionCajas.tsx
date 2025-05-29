import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button,Row,Col } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import {
  fetchCajaEstaciones,
  selectCajaEstaciones,
  selectLoading,
  /*   selectTotal, */
  selectPage,
  selectPageSize,
  /*   setPage,
  setPageSize, */
} from "../../Redux/CajaEstacion";
import TableCajaEstacion from "./TableCajaEstacion";
import CreateCajaEstacion from "./CreateCajaEstacion";
import { AppDispatch } from "../../Redux/Store";
import Container from "../Utils/Container";
import AbriCaja from "./AbrirCaja"; // Import the new component
import CerrarCaja from "./CerrarCaja"; // Import the new component

interface CajaEstacionProps {
  isDarkMode?: boolean; // Optional prop for dark mode
}

const CajaEstacionPage: React.FC<CajaEstacionProps> = ({ isDarkMode }) => {
  const dispatch: AppDispatch = useDispatch();
  const cajaEstaciones = useSelector(selectCajaEstaciones);
  const loading = useSelector(selectLoading);
const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isOpenModalVisible, setOpemModalVisible] = useState(false);
  const [isCloseModalVisible, setCloseModalVisible] = useState(false);


  useEffect(() => {
    dispatch(fetchCajaEstaciones({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  /*  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  }; */

  return (
    <Container isDarkMode={isDarkMode}>
   <Row gutter={[8, 8]} style={{ marginBottom: 16 }} wrap>
  <Col>
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => setCreateModalVisible(true)}
    >
      Crear Caja Estación
    </Button>
  </Col>
</Row>

      <TableCajaEstacion cajaEstaciones={cajaEstaciones} loading={loading} />

      <CreateCajaEstacion
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />
    </Container>
  );
};

export default CajaEstacionPage;
