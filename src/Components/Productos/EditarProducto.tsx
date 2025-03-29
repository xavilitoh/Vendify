import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Checkbox, Button } from "antd";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../Redux/Productos";
import { AppDispatch } from "../../Redux/Store";
import api from "../../Api/VendifyApi";

const { Option } = Select;

interface EditProductModalProps {
  visible: boolean;
  product: any;
  onClose: () => void;
}

interface Marca {
  id: number;
  descripcion: string;
}

interface Categorias {
  id: number;
  descripcion: string;
}

interface subCategorias {
  id: number;
  descripcion: string;
}

interface subCategorias {
  id: number;
  descripcion: string;
}

interface unidades {
  id: number;
  descripcion: string;
}
const EditProductModal: React.FC<EditProductModalProps> = ({
  visible,
  product,
  onClose,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [categorias, setCategorias] = useState<Categorias[]>([]);
  const [subcategorias, setSubcategorias] = useState<subCategorias[]>([]);
  const [unidades, setUnidades] = useState<unidades[]>([]);

  // Fetch options for the dropdowns
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marcasRes, categoriasRes, subcategoriasRes, unidadesRes] =
          await Promise.all([
            api.get<Marca[]>("/Marcas"), // Replace with your API endpoint
            api.get<Categorias[]>("/Categorias"),
            api.get<subCategorias[]>("/Subcategorias"),
            api.get<unidades[]>("/Unidades"),
          ]);
        setMarcas(marcasRes.data);
        setCategorias(categoriasRes.data);
        setSubcategorias(subcategoriasRes.data);
        setUnidades(unidadesRes.data);
      } catch (error) {
        console.error("Error fetching options for dropdowns:", error);
      }
    };
    fetchData();
  }, []);

  // Populate form when the product data changes
  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product, form]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(
        updateProduct({ id: product.id, productData: values })
      ).unwrap();
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error al actualizar el producto", error);
    }
  };

  return (
    <Modal
      title="Editar Producto"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[
            { required: true, message: "Por favor ingresa la descripción" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="idMarca"
          label="Marca"
          rules={[
            { required: true, message: "Por favor selecciona una marca" },
          ]}
        >
          <Select placeholder="Selecciona una marca">
            {marcas.map((marca: any) => (
              <Option key={marca.id} value={marca.id}>
                {marca.descripcion} {/* Display the description */}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="idCategoria"
          label="Categoría"
          rules={[
            { required: true, message: "Por favor selecciona una categoría" },
          ]}
        >
          <Select placeholder="Selecciona una categoría">
            {categorias.map((categoria: any) => (
              <Option key={categoria.id} value={categoria.id}>
                {categoria.descripcion} {/* Display the description */}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="idSubcategoria"
          label="Subcategoría"
          rules={[
            {
              required: true,
              message: "Por favor selecciona una subcategoría",
            },
          ]}
        >
          <Select placeholder="Selecciona una subcategoría">
            {subcategorias.map((subcategoria: any) => (
              <Option key={subcategoria.id} value={subcategoria.id}>
                {subcategoria.descripcion} {/* Display the description */}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="idUnidad"
          label="Unidad"
          rules={[
            { required: true, message: "Por favor selecciona una unidad" },
          ]}
        >
          <Select placeholder="Selecciona una unidad">
            {unidades.map((unidad: any) => (
              <Option key={unidad.id} value={unidad.id}>
                {unidad.descripcion} {/* Display the description */}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="stockMinimo"
          label="Stock Mínimo"
          rules={[
            { required: true, message: "Por favor ingresa el stock mínimo" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="barCode"
          label="Código de Barras"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el código de barras",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="conImpuesto" valuePropName="checked">
          <Checkbox>Con Impuesto</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
