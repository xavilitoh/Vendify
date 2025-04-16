import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store";
import { fetchMarcas, createMarca } from "../../Redux/MarcasSlice";
import CreateMarcaModal from "./CreateMarcaModal";
import MarcasTable from "./MarcasTable";
import Container from "../Utils/Container";

interface CreateMarcaFormValues {
  descripcion: string;
  idEntidad?: number;

}

interface MarcasProps {
  isDarkMode?: boolean; // Optional prop for dark mode      
}
const Marcas: React.FC<MarcasProps> = ({isDarkMode}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { marcas, loading } = useSelector((state: RootState) => state.marcas);

  useEffect(() => {
    dispatch(fetchMarcas());
  }, [dispatch]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleCreateMarca = async (values: CreateMarcaFormValues) => {
    try {
      const resultAction = await dispatch(createMarca(values));
      if (createMarca.fulfilled.match(resultAction)) {
        message.success("Marca creada exitosamente");
        setIsModalVisible(false);
      } else {
        message.error("Error al crear la marca");
      }
    } catch {
      message.error("Error inesperado al crear la marca");
    }
  };

  return (
    <Container isDarkMode={isDarkMode}>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Crear Marca
      </Button>
      <CreateMarcaModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreateMarca}
      />
      <MarcasTable marcas={marcas} loading={loading} />
    </Container>
  );
};

export default Marcas;
