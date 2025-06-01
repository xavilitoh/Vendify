import React, { useState } from "react";
import {
  Form,
  Select,
  InputNumber,
  Button,
  Collapse,
  Table,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { createVenta } from "../../Redux/Ventas";
import { useNavigate } from "react-router-dom";
import { selectClientesSelectList } from "../../Redux/Clientes";
import moment from "moment";

const { Option } = Select;
const { Panel } = Collapse;

const VentaForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const [detalles, setDetalles] = useState<any[]>([]);

  const clientes = useSelector(selectClientesSelectList);
  const products = useSelector((state: any) => state.productos.selectList);

  const handleAddProduct = (values: any) => {
    const selectedProduct = products.find(
      (p: any) => p.id === values.idProducto
    );
    const newItem = {
      id: 0,
      idVenta: 0,
      idProducto: values.idProducto,
      descripcion: selectedProduct?.value || "Producto",
      cantidad: values.cantidad,
      precio: values.precio,
      impuestos: 0,
      producto: null,
      total: values.cantidad * values.precio,
      fechaCreacion: moment().toISOString(),
      fechaModificacion: moment().toISOString(),
      enable: true,
    };
    setDetalles([...detalles, newItem]);
    productForm.resetFields();
  };

  const removeProduct = (idProducto: number) => {
    setDetalles(detalles.filter((item) => item.idProducto !== idProducto));
  };

  const handleSubmit = () => {
    if (detalles.length === 0) {
      return message.error("Debe agregar al menos un producto");
    }

    form.validateFields().then((values) => {
      const venta = {
        id: 0,
        idCliente: values.idCliente,
        detalles,
      };

      dispatch(createVenta(venta))
        .unwrap()
        .then(() => {
          message.success("Venta creada exitosamente");
          form.resetFields();
          setDetalles([]);
          navigate("/ventas");
        })
        .catch(() => {
          message.error("Error al crear la venta");
        });
    });
  };

  const productColumns = [
    { title: "ID", dataIndex: "idProducto" },
    { title: "Descripción", dataIndex: "descripcion" },
    { title: "Cantidad", dataIndex: "cantidad" },
    { title: "Precio", dataIndex: "precio" },
    { title: "Total", dataIndex: "total" },
    {
      title: "Acción",
      render: (_: any, record: any) => (
        <Button danger onClick={() => removeProduct(record.idProducto)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: "1 1 50%" }} className="card">
        <h3>Crear Venta</h3>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="idCliente"
            label="Cliente"
            rules={[{ required: true, message: "Seleccione un cliente" }]}
          >
            <Select placeholder="Seleccione un cliente">
              {clientes.map((cliente: any) => (
                <Option key={cliente.id} value={cliente.id}>
                  {cliente.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginTop: 16 }}
          >
            Crear Venta
          </Button>
        </Form>
      </div>

      <div style={{ flex: "1 1 50%" }} className="card">
        <h3>Productos Agregados</h3>
        <Table
          dataSource={detalles}
          columns={productColumns}
          rowKey="idProducto"
          pagination={false}
        />

        <Collapse>
          <Panel header="Agregar Producto" key="1">
            <Form
              form={productForm}
              layout="vertical"
              onFinish={handleAddProduct}
            >
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
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: "15px" }}
              >
                Agregar Producto
              </Button>
            </Form>
          </Panel>
        </Collapse>
      </div>
    </div>
  );
};

export default VentaForm;
