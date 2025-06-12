import React, { useEffect, useState } from "react";
import { Form, Button, Collapse, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { AppDispatch } from "../../Redux/Store";
import { createVenta } from "../../Redux/Ventas";
import { fetchPrecioProducto } from "../../Redux/Productos";

import ClienteSelector from "./ClienteSelector";
import ProductoForm from "./ProductoForm";
import ProductosTable from "./ProductoTable";

import { checkCajaAbierta, selectCajaActual } from "../../Redux/Cajas.";

const { Panel } = Collapse;

const VentaForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [productForm] = Form.useForm();
  const [detalles, setDetalles] = useState<any[]>([]);

  const productos = useSelector((state: any) => state.productos.selectList);
  const cajaActual = useSelector(selectCajaActual);

  useEffect(() => {
    dispatch(checkCajaAbierta());
  }, [dispatch]);

  const handleAddProduct = async (values: any) => {
    try {
      const response = await dispatch(
        fetchPrecioProducto({
          idProducto: values.idProducto,
          cantidad: values.cantidad,
        })
      ).unwrap();

      const producto = productos.find((p: any) => p.id === values.idProducto);

      const newItem = {
        ...response,
        descripcion: producto?.value || "Producto",
        fechaCreacion: moment().toISOString(),
        fechaModificacion: moment().toISOString(),
        enable: true,
      };

      const alreadyAdded = detalles.some((d) => d.idPrecioProducto === newItem.idPrecioProducto);
      if (alreadyAdded) {
        message.warning("Este producto ya fue agregado");
        return;
      }

      setDetalles([...detalles, newItem]);
      productForm.resetFields();
    } catch {
      message.error("Error al obtener el precio del producto");
    }
  };

  const removeProduct = (idProducto: number) => {
    setDetalles(detalles.filter((item) => item.idProducto !== idProducto));
  };

  const handleSubmit = async () => {
    if (!cajaActual) {
      message.error("Caja no disponible");
      return;
    }

    if (detalles.length === 0) {
      message.error("Debe agregar al menos un producto");
      return;
    }

    try {
      const values = await form.validateFields();
      console.log("Valores del formulario:", values);

      const venta = {
        id: 0,
        idCliente: values.idCliente,
        idCaja: cajaActual.idCajaEstacion,
        idUsuario: cajaActual.idUsuario,
        detalles,
      };

      console.log("Venta a crear:", venta);

      await dispatch(createVenta(venta)).unwrap();

      message.success("Venta creada exitosamente");
      form.resetFields();
      setDetalles([]);
      navigate("/ventas");
    } catch(error:any) {
      message.error(error);
    }
  };

  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 1 }} className="card">
        <h3>Productos Agregados</h3>
        <ProductosTable detalles={detalles} onRemove={removeProduct} />
        <Collapse>
          <Panel header="Agregar Producto" key="1">
            <ProductoForm form={productForm} onFinish={handleAddProduct} />
          </Panel>
        </Collapse>
      </div>

      <div style={{ flex: 1 }} className="card">
        <h3>Crear Venta</h3>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <ClienteSelector />
          <Button type="primary" htmlType="submit" block style={{ marginTop: 16 }}>
            Crear Venta
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default VentaForm;
