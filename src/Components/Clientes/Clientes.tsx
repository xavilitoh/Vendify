import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, message } from "antd";
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
  createCliente,
  updateCliente,
} from "../../Redux/Clientes";
import CreateClienteModal from "./CrearCliente";
import TableClientes from "./TableCliente";
import { AppDispatch } from "../../Redux/Store";
import EditClientForm from "./EditComponet";

const Clientes: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const clientes = useSelector(selectClientes);
  const loading = useSelector(selectLoading);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchClientes({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };

  console.log(clientes);
  const handleCreateCliente = (values: any) => {
    dispatch(createCliente(values))
      .unwrap()
      .then(() => {
        setCreateModalVisible(false);
        message.success("Cliente creado exitosamente");
      })
      .catch((error) => {
        message.error("Error al crear el cliente: " + error);
      });
  };

  const handleEditClient = (client: any) => {
    setEditingClient(client);
    setEditModalVisible(true);
  };

  const handleUpdateClient = (updatedClient: any) => {
    dispatch(updateCliente(updatedClient))
      .unwrap()
      .then(() => {
        message.success("Cliente actualizado exitosamente");
        setEditModalVisible(false);
      })
      .catch(() => {
        message.error("Error al actualizar el cliente");
      });
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
        onEdit={handleEditClient}
      />

      <CreateClienteModal
        onCreate={handleCreateCliente}
        visible={isCreateModalVisible}
        onCancel={() => setCreateModalVisible(false)}
      />

      <EditClientForm
        visible={isEditModalVisible}
        clientData={editingClient}
        onUpdate={handleUpdateClient}
        onCancel={() => setEditModalVisible(false)}
      />
    </div>
  );
};

export default Clientes;
