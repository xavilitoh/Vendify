import { Table, Button, message, Switch } from "antd";
import { useState, useEffect } from "react";

import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { updatePrice } from "../../Redux/Price";
import EditPriceModal from "./EditarPrecios";

interface Price {
  id: number;
  descripcion: string;
  enable: boolean;
}

interface PricesTableProps {
  prices: Price[];
  loading: boolean;
}

const PricesTable: React.FC<PricesTableProps> = ({ prices, loading }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(null);
  const [pricesList, setPricesList] = useState<Price[]>([]);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    setPricesList(prices);
  }, [prices]);

  const handleEditClick = (price: Price) => {
    setSelectedPrice(price);
    setIsEditModalVisible(true);
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedPrice(null);
  };

  const handleEditSubmit = (values: {
    descripcion: string;
    enable: boolean;
  }) => {
    if (selectedPrice) {
      dispatch(
        updatePrice({
          id: selectedPrice.id,
          descripcion: values.descripcion,
          enable: values.enable,
          idEntidad: 0, // Placeholder value
          entidad: null, // Include enable in the payload
        })
      )
        .then(() => {
          message.success("Precio actualizado exitosamente");
          setIsEditModalVisible(false);
          setPricesList((prev) =>
            prev.map((price) =>
              price.id === selectedPrice.id
                ? {
                    ...price,
                    descripcion: values.descripcion,
                    enable: values.enable,
                  }
                : price
            )
          );
        })
        .catch(() => {
          message.error("Error al actualizar el precio");
        });
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Habilitado",
      dataIndex: "enable",
      key: "enable",
      render: (enable: boolean) => (
        /*    <Tag color={enable ? "green" : "red"}>
          {enable ? "Sí" : "No"}
        </Tag> */

        <Switch checked={enable} disabled></Switch> // Bind to the current state
      ),
    },
    {
      title: "Acción",
      key: "action",
      render: (_: any, record: Price) => (
        <Button type="primary" onClick={() => handleEditClick(record)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={pricesList}
        rowKey={(record) => record.id.toString()}
        loading={loading}
        pagination={{
          pageSize: 8,
        }}
        style={{ marginTop: "30px" }}
      />

      {selectedPrice && (
        <EditPriceModal
          visible={isEditModalVisible}
          onCancel={handleCancelEditModal}
          onSubmit={handleEditSubmit}
          initialValues={{
            descripcion: selectedPrice.descripcion,
            enable: selectedPrice.enable,
          }}
        />
      )}
    </>
  );
};

export default PricesTable;
