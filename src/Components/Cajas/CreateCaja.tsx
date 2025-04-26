import React from "react";
import { Modal, Form, InputNumber, Switch, Input } from "antd";
import { useDispatch } from "react-redux";
import { createCaja } from "../../Redux/Cajas.";
import { AppDispatch } from "../../Redux/Store";

interface CreateCajaModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateCajaModal: React.FC<CreateCajaModalProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      dispatch(createCaja(values));
      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  return (
    <Modal
      title="Crear Caja"
      visible={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Crear"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item name="idSucursal" label="ID Sucursal" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="idCajaEstacion" label="ID Caja Estación" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="idUsuario" label="ID Usuario" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="abierta" label="Abierta" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="montoApertura" label="Monto Apertura" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="codigoSeguridad" label="Código Seguridad" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCajaModal;
