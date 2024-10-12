// components/Categories.tsx
import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import CreateCategoryModal from "./CreateCategoriaModal";
import { AppDispatch, RootState } from "../../Redux/Store";
import { createCategory, fetchCategories } from "../../Redux/CategorySlice";
import CategoriesTable from "./CategoriasTable";

interface CreateCategoryFormValues {
  descripcion: string;
}

const Categories: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { categorias, loading } = useSelector(
    (state: RootState) => state.categorias
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateCategory = async (values: CreateCategoryFormValues) => {
    try {
      const resultAction = await dispatch(createCategory(values));

      if (createCategory.fulfilled.match(resultAction)) {
        message.success("Categoría creada exitosamente");
        setIsModalVisible(false);
      } else {
        message.error("Error al crear la categoría");
      }
    } catch (error) {
      console.log(error);
      message.error("Error inesperado al crear la categoría");
    }
  };

  return (
    <div className="categories">
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Crear Categoría
      </Button>

      <CreateCategoryModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreateCategory}
      />
      <CategoriesTable categories={categorias} loading={loading} />
    </div>
  );
};

export default Categories;
