import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import moment from "moment";
import {
  Table,
  Form,
  Input,
  Button,
  Select,
  InputNumber,
  Collapse,
  message,
  DatePicker,
} from "antd";
import {
  fetchProductsSelectList,
  selectPage,
  selectPageSize,
} from "../../Redux/Productos";
import {
  fetchProveedoresSelectList,
  selectProveedoresSelectList,
} from "../../Redux/Proveedores";
import { createCompra } from "../../Redux/Compras";
import "./CrearCompra.css";
import Container from "../Utils/Container";

const { Option } = Select;
const { Panel } = Collapse;

// 👇 Responsive Hook
const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

export interface Compra {
  id: number;
  factura: string;
  fechaFactura: string;
  idProveedor: number;
  proveedor: any | null;
  detalleDeCompras: any[];
  total: number;
  fechaCreacion: string;
  fechaModificacion: string | null;
  descripcion: string;
  enable: boolean;
  idEntidad: number;
  entidad: any | null;
}

interface CreateCompraViewprosps {
  isDarkMode: boolean;
}

const CreateCompraView: React.FC<CreateCompraViewprosps> = ({ isDarkMode }) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const [detalleDeCompras, setDetalleDeCompras] = useState<any[]>([]);
  const [width] = useWindowSize();

  const products = useSelector((state: any) => state.productos.selectList);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);
  const proveedores = useSelector(selectProveedoresSelectList);

  useEffect(() => {
    dispatch(fetchProductsSelectList());
    dispatch(fetchProveedoresSelectList());
  }, [dispatch, page, pageSize]);

  const handleSubmit = () => {
    if (detalleDeCompras.length === 0) {
      return message.error("Debe agregar al menos un producto");
    }

    form.validateFields().then((values) => {
      const newCompra: Compra = {
        id: 0,
        descripcion: values.descripcion,
        factura: values.factura,
        idProveedor: values.idProveedor,
        fechaFactura: moment(values.fechaFactura).toISOString(),
        proveedor: null,
        detalleDeCompras,
        enable: true,
        idEntidad: 0,
        entidad: null,
        total: detalleDeCompras.reduce((acc, item) => acc + item.total, 0),
        fechaCreacion: moment().toISOString(),
        fechaModificacion: moment().toISOString(),
      };

      dispatch(createCompra(newCompra))
        .unwrap()
        .then(() => {
          message.success("Compra creada exitosamente");
          setDetalleDeCompras([]);
          form.resetFields();
        })
        .catch(() => {
          message.error("Error al crear la compra");
        });
    });
  };

  const handleAddProduct = (values: any) => {
    const selectedProduct = products.find(
      (p: any) => p.id === values.idProducto
    );
    const newProduct = {
      descripcion: selectedProduct?.value || "Producto desconocido",
      idProducto: values.idProducto,
      cantidad: values.cantidad,
      precio: values.precio,
      total: values.cantidad * values.precio,
    };
    setDetalleDeCompras((prev) => [...prev, newProduct]);
    productForm.resetFields();
  };

  const removeProduct = (id: number) => {
    setDetalleDeCompras(detalleDeCompras.filter((item) => item.idProducto !== id));
  };

  const productColumns = [
    { title: "ID", dataIndex: "idProducto", key: "id" },
    { title: "Producto", dataIndex: "descripcion", key: "descripcion" },
    { title: "Cantidad", dataIndex: "cantidad", key: "cantidad" },
    { title: "Precio", dataIndex: "precio", key: "precio" },
    { title: "Total", dataIndex: "total", key: "total" },
    {
      title: "Acción",
      key: "action",
      render: (_: any, record: any) => (
        <Button danger onClick={() => removeProduct(record.idProducto)}>
          Eliminar
        </Button>
      ),
    },
  ];

  const isMobile = width < 768;

  return (
    <Container isDarkMode={isDarkMode}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: "20px",
        }}
      >
        <div style={{ flex: 1 }} className="card">
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
              rules={[{ required: true, message: "Ingrese el número de factura" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="fechaFactura"
              label="Fecha Factura"
              rules={[{ required: true, message: "Ingrese la fecha" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="idProveedor"
              label="Proveedor"
              rules={[{ required: true, message: "Seleccione un proveedor" }]}
            >
              <Select placeholder="Seleccione un proveedor">
                {proveedores.map((proveedor: any) => (
                  <Option key={proveedor.id} value={proveedor.id}>
                    {proveedor.value}
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

        <div style={{ flex: 1 }} className="card">
          <h3>Productos Agregados</h3>
          <Table
            dataSource={detalleDeCompras}
            columns={productColumns}
            rowKey="idProducto"
            pagination={false}
          />
          <Collapse>
            <Panel header="Agregar Producto" key="1">
              <Form form={productForm} layout="vertical" onFinish={handleAddProduct}>
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
                  <InputNumber min={1} style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                  name="precio"
                  label="Precio"
                  rules={[{ required: true, message: "Ingrese el precio" }]}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>
                <Button type="primary" htmlType="submit" style={{ marginTop: 15 }}>
                  Agregar Producto
                </Button>
              </Form>
            </Panel>
          </Collapse>
        </div>
      </div>
    </Container>
  );
};

export default CreateCompraView;
