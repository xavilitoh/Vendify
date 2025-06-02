import React, { useState } from "react";
import { Form, Button, Collapse, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { AppDispatch } from "../../Redux/Store";
import { createVenta } from "../../Redux/Ventas";

import ClienteSelector from "./ClienteSelector";
import ProductoForm from "./ProductoForm";
import ProductosTable from "./ProductoTable";

const { Panel } = Collapse;

const VentaForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const [detalles, setDetalles] = useState<any[]>([]);
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
    if (detalles.length === 0)
      return message.error("Debe agregar al menos un producto");

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

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: "1 1 50%" }} className="card">
        <h3>Productos Agregados</h3>
        <ProductosTable detalles={detalles} onRemove={removeProduct} />
        <Collapse>
          <Panel header="Agregar Producto" key="1">
            <ProductoForm form={productForm} onFinish={handleAddProduct} />
          </Panel>
        </Collapse>
      </div>

      <div style={{ flex: "1 1 50%" }} className="card">
        <h3>Crear Venta</h3>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <ClienteSelector />
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%", marginTop: 16 }}
          >
            Crear Venta
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default VentaForm;
