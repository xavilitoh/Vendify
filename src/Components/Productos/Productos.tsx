import React, { useEffect, useState } from "react";
import { Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store";
import { fetchProducts, createProduct } from "../../Redux/Productos";
import { fetchMarcas } from "../../Redux/MarcasSlice";
import { fetchCategories } from "../../Redux/CategorySlice";
import { fetchSubcategorias } from "../../Redux/SubCategoriaSlice";
import CreateProductModal from "./CrearProducto";
import ProductsTable from "./ProductsTable";
import Cookies from "js-cookie";

const Products: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch: AppDispatch = useDispatch();

  const { products, loading } = useSelector((state: RootState) => state.productos);
  const { marcas } = useSelector((state: RootState) => state.marcas);
  const { categorias } = useSelector((state: RootState) => state.categorias);
  const { subcategorias } = useSelector((state: RootState) => state.subCategorias);

  useEffect(() => {
    dispatch(fetchProducts());

    // Fetch related data for the form
    const usuario = Cookies.get("usuario")
    console.log(usuario)
    const idEntidad = Cookies.get("usuario") ;
    
    if (idEntidad) {
      dispatch(fetchMarcas());
      dispatch(fetchCategories());
      dispatch(fetchSubcategorias());
    }
  }, [dispatch]);

  const handleCreateProduct = async (values: any) => {
    try {
      const idEntidad = parseInt(Cookies.get("idEntidad") || "0");
      const resultAction = await dispatch(createProduct({ ...values, idEntidad }));
      if (createProduct.fulfilled.match(resultAction)) {
        message.success("Producto creado exitosamente");
        setIsModalVisible(false);
      } else {
        message.error("Error al crear el producto");
      }
    } catch {
      message.error("Error inesperado al crear el producto");
    }
  };

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
        Crear Producto
      </Button>

      <CreateProductModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleCreateProduct}
        marcas={marcas}
        categorias={categorias}
        subcategorias={subcategorias}
      />

      <ProductsTable products={products} loading={loading} />
    </div>
  );
};

export default Products;
