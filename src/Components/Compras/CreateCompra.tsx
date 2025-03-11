import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import {
  Table,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Collapse,
  message,
} from "antd";
import {
  fetchProducts,
  selectPage,
  selectPageSize,
} from "../../Redux/Productos";
import {
  fetchProveedoresSelectList,
  selectProveedoresSelectList,
} from "../../Redux/Proveedores";

import "./CrearCompra.css";
const { Option } = Select;
const { Panel } = Collapse;

const CreateCompraView: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const products = useSelector((state: any) => state.productos.products);
  const [detalleDeCompras, setDetalleDeCompras] = useState<any[]>([]);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const proveedores = useSelector(selectProveedoresSelectList);

  useEffect(() => {
    dispatch(fetchProducts({ page, pageSize }));
    dispatch(fetchProveedoresSelectList());
  }, [dispatch, page, pageSize]);

  const handleSubmit = () => {
    if (detalleDeCompras.length === 0) {
      return message.error("Debe agregar al menos un producto");
    }

    form.validateFields().then((values) => {
      const newCompra = {
        id: Date.now(),
        descripcion: values.descripcion,
        factura: values.factura,
        fechaFactura: values.fechaFactura
          ? values.fechaFactura.format("YYYY-MM-DD")
          : null,
        idProveedor: values.idProveedor,
        detalleDeCompras,
      };
      console.log("New compra:", newCompra);
      setDetalleDeCompras([]);
      form.resetFields();
    });
  };

  const handleAddProduct = (values: any) => {
    const selectedProduct = products.find(
      (p: any) => p.id === values.idProducto
    );
    const newProduct = {
      id: Date.now(),
      descripcion: selectedProduct?.nombre || "Producto desconocido",
      idProducto: values.idProducto,
      cantidad: values.cantidad,
      precio: values.precio,
      total: values.cantidad * values.precio,
    };
    setDetalleDeCompras((prev) => [...prev, newProduct]);
    productForm.resetFields();
  };

  const removeProduct = (id: number) => {
    setDetalleDeCompras(detalleDeCompras.filter((item) => item.id !== id));
  };

  const productColumns = [
    { title: "Producto", dataIndex: "descripcion", key: "descripcion" },
    { title: "Cantidad", dataIndex: "cantidad", key: "cantidad" },
    { title: "Precio", dataIndex: "precio", key: "precio" },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "Acción",
      key: "action",
      render: (_: any, record: any) => (
        <Button danger onClick={() => removeProduct(record.id)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: "1 1 50%" }} className="card">
        <h3>Crear Compra</h3>
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
            <Select placeholder="Seleccione un producto">
              {proveedores.map((product: any) => (
                <Option key={product.id} value={product.value}>
                  {product.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginTop: 16 }}
          >
            Crear Compra
          </Button>
        </Form>
      </div>

      <div style={{ flex: "1 1 50%" }} className="card">
        <h3>Productos Agregados</h3>
        <Table
          dataSource={detalleDeCompras}
          columns={productColumns}
          rowKey="id"
          pagination={false}
        />

        {/* Collapsible Add Product Form */}
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
                      {product.nombre}
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

export default CreateCompraView;
