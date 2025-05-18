import React, { useEffect } from "react";
import { Modal, Form, InputNumber, Input, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { createCaja } from "../../Redux/Cajas.";
import { AppDispatch } from "../../Redux/Store";
import { fetchSucursales, selectSucursales } from "../../Redux/Sucursales";
import {
  fetchCajaEstaciones,
  selectCajaEstaciones,
} from "../../Redux/CajaEstacion";

interface CreateCajaModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateCajaModal: React.FC<CreateCajaModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const sucursales = useSelector(selectSucursales);
  const cajaEstaciones = useSelector(selectCajaEstaciones);

  useEffect(() => {
    dispatch(fetchSucursales());
    dispatch(fetchCajaEstaciones({ page: 1, pageSize: 100 })); // Carga inicial
  }, [dispatch]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      dispatch(
        createCaja({
          ...values,
          fechaApertura: new Date().toISOString(),
          fechaCierre: new Date().toISOString(),
          montoCierre: 0,
          totalEfectivo: 0,
          totalTarjeta: 0,
          totalOtrosMedios: 0,
          numeroTransacciones: 0,
          estado: 1, // Puedes ajustar según tu lógica
          totalVentas: 0,
          totalDevoluciones: 0,
        })
      );
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Crear Caja"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Crear"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="idSucursal"
          label="Sucursal"
          rules={[{ required: true }]}
        >
          <Select placeholder="Seleccione una sucursal">
            {sucursales.map((sucursal: any) => (
              <Select.Option key={sucursal.id} value={sucursal.id}>
                {sucursal.descripcion}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="idCajaEstacion"
          label="Caja Estación"
          rules={[{ required: true }]}
        >
          <Select placeholder="Seleccione una caja estación">
            {cajaEstaciones.map((caja: any) => (
              <Select.Option key={caja.id} value={caja.id}>
                {caja.descripcion}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="idUsuario"
          label="ID Usuario"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="montoApertura"
          label="Monto Apertura"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          name="codigoSeguridad"
          label="Código Seguridad"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCajaModal;
