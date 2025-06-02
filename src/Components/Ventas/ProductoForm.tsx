import React from "react";
import { Form, Select, InputNumber, Button } from "antd";
import { useSelector } from "react-redux";

const { Option } = Select;

interface Props {
  form: any;
  onFinish: (values: any) => void;
}

const ProductoForm: React.FC<Props> = ({ form, onFinish }) => {
  const products = useSelector((state: any) => state.productos.selectList);

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="idProducto"
        label="Producto"
        rules={[{ required: true, message: "Seleccione un producto" }]}
      >
        <Select placeholder="Seleccione un producto">
          {products.map((product: any) => (
            <Option key={product.id} value={product.id}>
              {product.value}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="cantidad"
        label="Cantidad"
        rules={[{ required: true, message: "Ingrese la cantidad" }]}
      >
        <InputNumber min={1} />
      </Form.Item>

      <Form.Item
        name="precio"
        label="Precio"
        rules={[{ required: true, message: "Ingrese el precio" }]}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Button type="primary" htmlType="submit" style={{ marginTop: "15px" }}>
        Agregar Producto
      </Button>
    </Form>
  );
};

export default ProductoForm;
