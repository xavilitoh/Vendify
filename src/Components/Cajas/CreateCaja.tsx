import React, { useEffect } from "react";
import { Modal, Form, InputNumber, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import {
  fetchCajaEstaciones,
  selectCajaEstaciones,
} from "../../Redux/CajaEstacion";
import { cerrarCaja } from "../../Redux/Cajas."; // ✅ Importar thunk

interface CloseCajaModalProps {
  visible: boolean;
  onClose: () => void;
}

const CloseCajaModal: React.FC<CloseCajaModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const cajaEstaciones = useSelector(selectCajaEstaciones);

  useEffect(() => {
    dispatch(fetchCajaEstaciones({ page: 1, pageSize: 100 }));
  }, [dispatch]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { idCajaEstacion, montoCierre } = values;

      await dispatch(cerrarCaja({ idCajaEstacion, montoCierre })).unwrap();

      message.success("Caja cerrada exitosamente");
      form.resetFields();
      onClose();
    } catch (error) {
      message.error("Error al cerrar la caja");
      console.error("Error al cerrar la caja:", error);
    }
  };

  return (
    <Modal
      title="Cerrar Caja"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Cerrar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="idCajaEstacion"
          label="Caja Estación"
          rules={[{ required: true, message: "Seleccione una caja estación" }]}
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
          name="montoCierre"
          label="Monto Cierre"
          rules={[{ required: true, message: "Ingrese el monto de cierre" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CloseCajaModal;
