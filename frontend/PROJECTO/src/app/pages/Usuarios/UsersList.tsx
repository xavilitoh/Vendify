import React, { useEffect, useState } from "react";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { useSelector, useDispatch } from "react-redux";
import { TableUsers } from "./Table";
import { ModalWrapper } from "../Utils/CustomModal"; // Import the ModalWrapper component
import EditUserForm from "./EditForm"; // Import the EditUserForm component
import { Form, Spin } from "antd";
import {
  fetchUsers,
  updateUser,
  selectAllUsers,
  getUsersStatus,
  getUsersError,
} from "../../../Redux/Features/Users/userSlice";
import { AppDispatch } from "../../../Redux/Store";

// Data Type del usuario
interface DataType {
  id: number; // Change from string to number
  fullName: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
}

const UsersListWrapper: React.FC = () => {
  //Metodos de Redux
  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector(selectAllUsers);
  const status = useSelector(getUsersStatus);
  const error = useSelector(getUsersError);

  //Estado del Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataType | null>(null);
  //Instancia del Form
  const [form] = Form.useForm();
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [status, dispatch]);
  //Abrir Modal
  const showEditModal = (user: DataType) => {
    setSelectedUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };
  //Actualizar Usuario
  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedUser = { ...selectedUser, ...values };

      const usuarioFinal = {
        fullName: updatedUser.fullName,
        id: updatedUser.id,
        nombres: updatedUser.nombres,
        apellidos: updatedUser.apellidos,
        noDocumento: updatedUser.documento,
        address: updatedUser.direccion,
        telefono: updatedUser.telefono,
        email: updatedUser.email,
        sexo: updatedUser.sexo,
      };
      dispatch(updateUser(usuarioFinal));
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <ToolbarWrapper />
      <Content>
        <div style={{ padding: 24 }}>
          {status === "loading" && <Spin />}
          {status === "failed" && <p>{error}</p>}
          {status === "succeeded" && (
            <TableUsers users={users} rowKey="id" onEdit={showEditModal} />
          )}
        </div>
      </Content>
      <ModalWrapper
        visible={isModalVisible}
        title="Editar Usuario"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {selectedUser && <EditUserForm form={form} user={selectedUser} />}
      </ModalWrapper>
    </>
  );
};

export { UsersListWrapper };
