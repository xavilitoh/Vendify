// components/Categories.tsx
import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import CreateCategoryModal from "./CreateCategoriaModal";
import { AppDispatch, RootState } from "../../Redux/Store";
import {
  createCategory,
  fetchCategories,
  setPage,
  setPageSize,
} from "../../Redux/CategorySlice";
import CategoriesTable from "./CategoriasTable";
import Container from "../Utils/Container";

interface CreateCategoryFormValues {
  descripcion: string;
}

interface CategoriesProps {
  isDarkMode?: boolean; // Optional prop for dark mode
}

const Categories: React.FC<CategoriesProps> = ({isDarkMode}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { categorias, loading, page, pageSize, total } = useSelector(
    (state: RootState) => state.categorias
  );

  console.log(total);
  useEffect(() => {
    dispatch(fetchCategories({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage)); // ✅ Updates the page number
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize)); // ✅ Updates page size if changed
    }
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
    <Container isDarkMode={isDarkMode}>


      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Crear Categoría
      </Button>

      <CreateCategoryModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreateCategory}
      />
      <CategoriesTable
        categories={categorias}
        loading={loading}
        total={total}
        pageSize={pageSize}
        page={page}
        onPageChange={handlePageChange}
      />
        </Container>
  );
};

export default Categories;
