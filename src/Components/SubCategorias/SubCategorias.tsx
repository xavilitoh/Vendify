import React, { useState, useEffect } from "react";
import { Button, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { PlusOutlined } from "@ant-design/icons";
import CreateSubcategoryModal from "./CreateSubcategoroaModal";
import { AppDispatch, RootState } from "../../Redux/Store";
import {
  createSubcategoria,
  fetchSubcategorias,
} from "../../Redux/SubCategoriaSlice";
import SubcategoriesTable from "./SubCategoriaTable";

interface CreateSubcategoryFormValues {
  descripcion: string;
  idCategoria: number;
  idEntidad: number;
}

const Subcategories: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { subcategorias, loading } = useSelector(
    (state: RootState) => state.subCategorias
  );

  useEffect(() => {
    dispatch(fetchSubcategorias());
  }, [dispatch]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCreateSubcategory = async (
    values: CreateSubcategoryFormValues
  ) => {
    try {
      const resultAction = await dispatch(createSubcategoria(values));

      if (createSubcategoria.fulfilled.match(resultAction)) {
        message.success("Subcategoría creada exitosamente");
        setIsModalVisible(false);
      } else {
        message.error("Error al crear la subcategoría");
      }
    } catch (error) {
      console.error(error);
      message.error("Error inesperado al crear la subcategoría");
    }
  };

  return (
    <div className="subcategories">
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        Crear Subcategoría
      </Button>

      <CreateSubcategoryModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSubmit={handleCreateSubcategory}
      />
      <SubcategoriesTable subcategories={subcategorias} loading={loading} />
    </div>
  );
};

export default Subcategories;
