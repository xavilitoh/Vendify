import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  fetchClientes,
  selectClientes,
  selectLoading,
  selectTotal,
  selectPage,
  selectPageSize,
  setPage,
  setPageSize,
} from "../../Redux/Clientes";
import CreateClienteModal from "./CrearCliente";
import TableClientes from "./TableCliente";
import { AppDispatch } from "../../Redux/Store";

const Clientes: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const clientes = useSelector(selectClientes);
  const loading = useSelector(selectLoading);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);

  console.log(clientes);

  useEffect(() => {
    dispatch(fetchClientes({ page, pageSize }));
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
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Crear Cliente
        </Button>
      </div>

      <TableClientes
        clientes={clientes}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        loading={loading}
      />

      <CreateClienteModal
        visible={isCreateModalVisible}
        onCancel={() => setCreateModalVisible(false)}
      />
    </div>
  );
};

export default Clientes;