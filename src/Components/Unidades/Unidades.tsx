import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store";
import { fetchUnidades, createUnidad } from "../../Redux/UnidadesSlice";
import CreateUnidadModal from "./CrearUnidadModal";
import UnidadesTable from "./UnidadesTable";
import Container from "../Utils/Container";

interface CreateUnidadFormValues {
  descripcion: string;
  abreviatura: string;
}

interface UnidadesProps {
  isDarkMode?: boolean; // Optional prop for dark mode
}

const Unidades: React.FC<UnidadesProps> = ({isDarkMode}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  // Fetch the Unidades state from Redux
  const { unidades, loading } = useSelector(
    (state: RootState) => state.unidades
  );

  // Fetch unidades when the component mounts
  useEffect(() => {
    dispatch(fetchUnidades());
  }, [dispatch]);

  // Modal Control Functions
  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  // Handle form submission to create a Unidad
  const handleCreateUnidad = async (values: CreateUnidadFormValues) => {
    try {
      const idEntidad = parseInt(localStorage.getItem("idEntidad") || "0", 10);

      const resultAction = await dispatch(
        createUnidad({ ...values, idEntidad })
      );

      if (createUnidad.fulfilled.match(resultAction)) {
        message.success("Unidad creada exitosamente");
        setIsModalVisible(false);
      } else {
        message.error("Error al crear la unidad");
      }
    } catch {
      message.error("Error inesperado al crear la unidad");
    }
  };

  return (
    <Container isDarkMode={isDarkMode}>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Crear Unidad
      </Button>

      <CreateUnidadModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreateUnidad}
      />

      <UnidadesTable unidades={unidades} loading={loading} />
    </Container>
  );
};

export default Unidades;
