import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import EditCategoryModal from "./EditarCategoria";
import { updateCategory } from "../../Redux/CategorySlice";
import { AppDispatch } from "../../Redux/Store";

interface Category {
  id: number;
  descripcion: string;
  fechaCreacion: string;
  fechaModificacion: string | null;
  enable: boolean;
}

interface CategoriesTableProps {
  categories: Category[] | null;
  loading: boolean;
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  loading,
}) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (categories) {
      setCategoriesList(categories);
    }
  }, [categories]);

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalVisible(true);
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedCategory(null);
  };

  const handleEditSubmit = (values: {
    descripcion: string;
    enable: boolean;
  }) => {
    if (selectedCategory) {
      dispatch(
        updateCategory({
          id: selectedCategory.id,
          descripcion: values.descripcion,
          fechaCreacion: selectedCategory.fechaCreacion,
          fechaModificacion: new Date().toISOString(),
          enable: values.enable,
        })
      )
        .then(() => {
          message.success("Categoría actualizada exitosamente");
          setIsEditModalVisible(false);

          setCategoriesList((prevCategories) =>
            prevCategories.map((cat) =>
              cat.id === selectedCategory.id
                ? {
                    ...cat,
                    descripcion: values.descripcion,
                    fechaModificacion: new Date().toISOString(),
                    enable: values.enable,
                  }
                : cat
            )
          );
        })
        .catch(() => {
          message.error("Error al actualizar la categoría");
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
      title: "Fecha de Creación",
      dataIndex: "fechaCreacion",
      key: "fechaCreacion",
      render: (fecha: string) => moment(fecha).format("YYYY-MM-DD"),
    },
    {
      title: "Fecha de Modificación",
      dataIndex: "fechaModificacion",
      key: "fechaModificacion",
      render: (fecha: string | null) =>
        fecha ? moment(fecha).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Habilitado",
      dataIndex: "enable",
      key: "enable",
      render: (enable: boolean) => (enable ? "Sí" : "No"),
    },
    {
      title: "Acción",
      key: "operation",
      render: (_: any, record: Category) => (
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
        dataSource={categoriesList || []}
        rowKey={(record) => record.id.toString()}
        loading={loading}
        pagination={{
          pageSize: 8,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
          defaultCurrent: 1,
        }}
        style={{ marginTop: "30px" }}
      />

      {selectedCategory && (
        <EditCategoryModal
          visible={isEditModalVisible}
          onCancel={handleCancelEditModal}
          onSubmit={handleEditSubmit}
          initialValues={{
            descripcion: selectedCategory.descripcion,
            enable: selectedCategory.enable,
            fechaCreacion: selectedCategory.fechaCreacion,
          }}
        />
      )}
    </>
  );
};

export default CategoriesTable;