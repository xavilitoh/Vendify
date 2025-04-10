import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Divider } from "antd";
import {
  fetchProducts,
  selectLoading,
  selectTotal,
  selectPage,
  selectPageSize,
  setPage,
  setPageSize,
} from "../../Redux/Productos";
import {
  fetchCategories,
  fetchCategoriesSelectList,
} from "../../Redux/CategorySlice";
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
import { AppDispatch } from "../../Redux/Store";
import { Subcategoria } from "../../Redux/SubCategoriaSlice";
import { PlusOutlined } from "@ant-design/icons";
import { fetchInventario, selectInventario } from "../../Redux/Inventario";
import Stats from "./Stats";
import StatsPrueba from "./StatsPrueba";

const Products: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const Items = useSelector(selectInventario);
  const loading = useSelector(selectLoading);
  const subcategories = useSelector(selectSubcategorias);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategoria[]
  >([]); // Explicit type
  useEffect(() => {
    dispatch(fetchProducts({ page, pageSize }));
    dispatch(fetchCategories({ page, pageSize }));
    dispatch(fetchCategoriesSelectList());
    dispatch(fetchSubcategorias());
    dispatch(fetchMarcas());
    dispatch(fetchPrices());
    dispatch(fetchUnidades());
    dispatch(fetchInventario({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handleCategoryChange = (categoryId: number) => {
    const filtered = subcategories.filter(
      (subcategory) => subcategory.idCategoria === categoryId
    );
    setFilteredSubcategories(filtered); // No error here
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setEditModalVisible(true);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };

  return (
    <div>
      <StatsPrueba />
      <Divider />
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => setCreateModalVisible(true)}
          icon={<PlusOutlined />}
        >
          Crear Producto
        </Button>
      </div>

      <TableProducts
        products={Items}
        total={total}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={handlePageChange}
        onEdit={handleEdit}
        onCategoryChange={handleCategoryChange}
        loading={loading}
      />

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
