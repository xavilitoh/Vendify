import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store";
import { fetchPrices, createPrice } from "../../Redux/Price";
import CreatePriceModal from "./CrearPrecios";
import PricesTable from "./PreciosTable";
import Container from "../Utils/Container";

interface CreatePriceFormValues {
  descripcion: string;
}

interface PreciosProps {
  isDarkMode?: boolean; // Optional prop for dark mode
}

const Precios: React.FC<PreciosProps> = ({isDarkMode}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { prices, loading } = useSelector((state: RootState) => state.precios);


  useEffect(() => {
    dispatch(fetchPrices());
  }, [dispatch]);

  const showModal = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);

  const handleCreatePrice = async (values: CreatePriceFormValues) => {
    try {
      const resultAction = await dispatch(createPrice(values));
      if (createPrice.fulfilled.match(resultAction)) {
        message.success("Precio creado exitosamente");
        setIsModalVisible(false);
      } else {
        message.error("Error al crear el precio");
      }
    } catch {
      message.error("Error inesperado al crear el precio");
    }
  };

  return (
    <Container isDarkMode={isDarkMode}>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Crear Precio
      </Button>
      <CreatePriceModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreatePrice}
      />
      <PricesTable prices={prices} loading={loading} />
    </Container>
  );
};

export default Precios;
