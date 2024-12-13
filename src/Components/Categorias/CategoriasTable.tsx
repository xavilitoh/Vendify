import React, { useState, useEffect } from "react";
import { Table, Button, message, Switch } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import EditCategoryModal from "./EditarCategoria";
import CreateSubcategoriaModal from "./CrearSubCategoria";
import { updateCategory } from "../../Redux/CategorySlice";
import { AppDispatch } from "../../Redux/Store";
import apiClient from "../../Api/VendifyApi";
import Cookies from "js-cookie";

export interface Empresa {
  id: number;
  nombre: string;
  rnc: string;
  idArchivo: number | null;
  foto: string;
  direccion: string;
  telefono1: string;
  telefono2: string;
  email: string;
}

export interface Usuario {
  id: number;
  idEntidad: number;
  fullName: string;
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
  fechaNaci: string; // ISO date string
  sexo: boolean;
  userName: string;
  empresa: Empresa;
}

interface Subcategory {
  id: number;
  descripcion: string;
}

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

const CategoriesTable: React.FC<CategoriesTableProps> = ({ categories, loading }) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSubcategoryModalVisible, setIsSubcategoryModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (categories) {
      setCategoriesList(categories);
    }
  }, [categories]);

  const handleSubcategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setIsSubcategoryModalVisible(true);

    try {
      const response = await apiClient.get(`Subcategorias/GetByCategoriaId/${category.id}`);
      if (response.status === 200) {
        setSubcategories(response.data); // Fetch subcategories for the selected category
      } else {
        setSubcategories([]);
        message.error("Error al obtener las subcategorías");
      }
    } catch (error) {
      console.error(error);
      setSubcategories([]);
      message.error("Error inesperado al obtener las subcategorías");
    }
  };

  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalVisible(true);
  };

  const handleCancelEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedCategory(null);
  };

  const handleCancelSubcategoryModal = () => {
    setIsSubcategoryModalVisible(false);
    setSelectedCategory(null);
  };

  const handleEditSubmit = (values: { descripcion: string; enable: boolean }) => {
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

  const handleSubcategorySubmit = async (values: { descripcion: string }) => {
    if (selectedCategory) {
      try {
        const usuario = Cookies.get("usuario");
        if (!usuario) {
          throw new Error("No se encontraron datos de la entidad");
        }

        const usuarioFinal = JSON.parse(usuario);
        const idEntidad = parseInt(usuarioFinal.empresa.id);

        const response = await apiClient.post("Subcategorias", {
          descripcion: values.descripcion,
          idCategoria: selectedCategory.id,
          idEntidad,
        });

        if (response.status === 200) {
          message.success("Subcategoría creada exitosamente");
          setSubcategories((prev) => [...prev, { id: response.data.id, descripcion: values.descripcion }]);
          setIsSubcategoryModalVisible(false);
        } else {
          message.error("Error al crear la subcategoría");
        }
      } catch (error) {
        console.error(error);
        message.error("Error inesperado al crear la subcategoría");
      }
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
      render: (fecha: string | null) => (fecha ? moment(fecha).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Habilitado",
      dataIndex: "enable",
      key: "enable",
      render: (enable: boolean) => <Switch checked={enable} disabled />,
    },
    {
      title: "Acción",
      key: "operation",
      render: (_: any, record: Category) => [
        <Button type="default" onClick={() => handleSubcategoryClick(record)}>
          Gestionar
        </Button>,
        <Button type="primary" style={{ marginLeft: "5px" }} onClick={() => handleEditClick(record)}>
          Editar
        </Button>,
      ],
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

      {selectedCategory && (
        <CreateSubcategoriaModal
          visible={isSubcategoryModalVisible}
          onCancel={handleCancelSubcategoryModal}
          onSubmit={handleSubcategorySubmit}
          subcategories={subcategories}
        />
      )}
    </>
  );
};

export default CategoriesTable;
