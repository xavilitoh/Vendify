import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import CreateUserModal from "./CrearUsuarioModal";
import { AppDispatch, RootState } from "../../Redux/Store";
import { createUser } from "../../Redux/UserSlice";
import { fetchUsers } from "../../Redux/UserSlice";
import UsersTable from "./UserTable";

interface CreateUserFormValues {
  email: string;
  pass: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  address: string;
  fecaNac: string;
  noDocumento: string;
  sexo: boolean;
}

const Usuarios: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { users, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateUser = async (values: CreateUserFormValues) => {
    try {
      console.log(values);
      const resultAction = await dispatch(createUser(values));

      if (createUser.fulfilled.match(resultAction)) {
        message.success("Usuario creado exitosamente");
        setIsModalVisible(false);
      } else {
        message.error("Error al crear el usuario");
      }
    } catch (error) {
      console.log(error);
      message.error("Error inesperado al crear el usuario");
    }
  };
  return (
    <div className="usuarios">
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Crear Usuario
      </Button>

      <CreateUserModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreateUser}
      />
      <UsersTable users={users} loading={loading} />
    </div>
  );
};

export default Usuarios;