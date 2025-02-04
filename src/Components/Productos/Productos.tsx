import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Spin } from "antd";
import {
  fetchProducts,
  selectProducts,
  selectLoading,
} from "../../Redux/Productos";
import { fetchCategories } from "../../Redux/CategorySlice";
import {
  fetchSubcategorias,
  selectSubcategorias,
} from "../../Redux/SubCategoriaSlice";
import { fetchMarcas } from "../../Redux/MarcasSlice";
import { fetchPrices } from "../../Redux/Price";
import { fetchUnidades } from "../../Redux/UnidadesSlice";
import CreateProductModal from "./CrearProducto";
import EditProductModal from "./EditarProducto";
import TableProducts from "./TablaProductos";
import { AppDispatch } from "../../Redux/Store"; // Import the AppDispatch type
import { Subcategoria } from "../../Redux/SubCategoriaSlice"; // Assuming you have a type defined for Subcategoria
import { PlusOutlined } from "@ant-design/icons";

const Products: React.FC = () => {
  const dispatch: AppDispatch = useDispatch(); // Cast useDispatch to AppDispatch
  const products = useSelector(selectProducts);
  const loading = useSelector(selectLoading);
  const subcategories = useSelector(selectSubcategorias);

  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategoria[]
  >([]); // Explicit type

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSubcategorias());
    dispatch(fetchMarcas());
    dispatch(fetchPrices());
    dispatch(fetchUnidades());
  }, [dispatch]);

  const handleCategoryChange = (categoryId: number) => {
    const filtered = subcategories.filter(
      (subcategory) => subcategory.iCategoria === categoryId
    );
    setFilteredSubcategories(filtered); // No error here
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Crear Producto
        </Button>
      </div>

      {loading ? (
        <Spin size="large" />
      ) : (
        <TableProducts
          products={products}
          onEdit={handleEdit}
          onCategoryChange={handleCategoryChange}
          filteredSubcategories={filteredSubcategories}
        />
      )}

      <CreateProductModal
        visible={isCreateModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCategoryChange={handleCategoryChange}
        filteredSubcategories={filteredSubcategories}
      />

      {editingProduct && (
        <EditProductModal
          visible={isEditModalVisible}
          product={editingProduct}
          onClose={() => {
            setEditModalVisible(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default Products;
