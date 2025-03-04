import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  InputNumber,
} from "antd";

const { Option } = Select;

const CreateCompraView: React.FC = () => {
  const [form] = Form.useForm();
  const products = useSelector((state: any) => state.productos.products);
  console.log(products);
  const [compras, setCompras] = useState<any[]>([]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const newCompra = {
        id: compras.length + 1,
        descripcion: values.descripcion,
        factura: values.factura,
        fechaFactura: values.fechaFactura.format("YYYY-MM-DD"),
        idProveedor: values.idProveedor,
        detalleDeCompras: values.detalleDeCompras.map((detalle: any) => {
          const selectedProduct = products.find(
            (p: any) => p.id === detalle.idProducto
          );
          return {
            id: compras.length + 1,
            descripcion: selectedProduct?.nombre || "",
            idEntidad: selectedProduct?.idEntidad || 0,
            idProducto: detalle.idProducto,
            cantidad: detalle.cantidad,
            precio: detalle.precio,
            total: detalle.cantidad * detalle.precio,
          };
        }),
      };
      setCompras([...compras, newCompra]);
      form.resetFields();
    });
  };

  const columns = [
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    { title: "Factura", dataIndex: "factura", key: "factura" },
    {
      title: "Fecha de Factura",
      dataIndex: "fechaFactura",
      key: "fechaFactura",
    },
    { title: "Proveedor", dataIndex: "idProveedor", key: "idProveedor" },
    {
      title: "Total",
      key: "total",
      render: (_: any, record: any) =>
        record.detalleDeCompras.reduce(
          (sum: number, d: any) => sum + d.total,
          0
        ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: "1 1 33%" }}>
        <h2>Crear Compra</h2>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: "Ingrese la descripción" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="factura"
            label="Factura"
            rules={[
              { required: true, message: "Ingrese el número de factura" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="idProveedor"
            label="Proveedor"
            rules={[{ required: true, message: "Seleccione un proveedor" }]}
          >
            <Select placeholder="Seleccione un proveedor">
              <Option value={1011}>Proveedor 1011</Option>
              <Option value={1012}>Proveedor 1012</Option>
            </Select>
          </Form.Item>
          <Form.List name="detalleDeCompras">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div
                    key={key}
                    style={{
                      marginBottom: 8,
                      border: "1px solid #ddd",
                      padding: 8,
                      borderRadius: 5,
                    }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "idProducto"]}
                      label="Producto"
                      rules={[
                        { required: true, message: "Seleccione un producto" },
                      ]}
                    >
                      <Select placeholder="Seleccione un producto">
                        {products.map((product: any) => (
                          <Option key={product.id} value={product.id}>
                            {product.nombre}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "cantidad"]}
                      label="Cantidad"
                      rules={[
                        { required: true, message: "Ingrese la cantidad" },
                      ]}
                    >
                      <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "precio"]}
                      label="Precio"
                      rules={[{ required: true, message: "Ingrese el precio" }]}
                    >
                      <InputNumber min={0} />
                    </Form.Item>
                    <Button danger onClick={() => remove(name)}>
                      Eliminar
                    </Button>
                  </div>
                ))}
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={() => add()}
                  block
                >
                  Agregar Producto
                </Button>
              </>
            )}
          </Form.List>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: 16 }}
            >
              Crear
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div style={{ flex: "2 1 66%" }}>
        <h2>Compras Agregadas</h2>
        <Table
          dataSource={compras}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default CreateCompraView;
