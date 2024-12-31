import React from "react";
import { Modal, Form, Input, InputNumber, Checkbox, Button } from "antd";
import { useDispatch } from "react-redux";
import { updateProduct } from "../../Redux/Productos";
import { AppDispatch } from "../../Redux/Store";


interface EditProductModalProps {
  visible: boolean;
  product: any;
  onClose: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ visible, product, onClose }) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    }
  }, [product, form]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(updateProduct({ id: product.id, productData: values })).unwrap();
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
          rules={[{ required: true, message: "Por favor ingresa la descripción" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="idMarca"
          label="Marca"
          rules={[{ required: true, message: "Por favor selecciona una marca" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="idCategoria"
          label="Categoría"
          rules={[{ required: true, message: "Por favor selecciona una categoría" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="idSubcategoria"
          label="Subcategoría"
          rules={[{ required: true, message: "Por favor selecciona una subcategoría" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="idUnidad"
          label="Unidad"
          rules={[{ required: true, message: "Por favor selecciona una unidad" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="stockMinimo"
          label="Stock Mínimo"
          rules={[{ required: true, message: "Por favor ingresa el stock mínimo" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="barCode"
          label="Código de Barras"
          rules={[{ required: true, message: "Por favor ingresa el código de barras" }]}
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
