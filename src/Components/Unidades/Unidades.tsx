import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store";
import { fetchUnidades, createUnidad } from "../../Redux/UnidadesSlice";
import CreateUnidadModal from "./CrearUnidadModal";
import UnidadesTable from "./UnidadesTable";

interface CreateUnidadFormValues {
  descripcion: string;
  abreviatura: string;
}

const Unidades: React.FC = () => {
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
    <div>
      {/* Button to trigger Create Modal */}
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Crear Unidad
      </Button>

      {/* Modal Component */}
      <CreateUnidadModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreateUnidad}
      />

      {/* Table Component */}
      <UnidadesTable unidades={unidades} loading={loading} />
    </div>
  );
};

export default Unidades;
