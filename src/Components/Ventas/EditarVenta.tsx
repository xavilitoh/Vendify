import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface Props {
  visible: boolean;
  onClose: () => void;
  venta: any;
}

const EditarVentaModal: React.FC<Props> = ({ visible, onClose, venta }) => {
  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    console.log("Editar venta:", venta.id, values);
    onClose();
  };

  return (
    <Modal
      title={`Editar Venta #${venta.id}`}
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={venta}
        onFinish={handleFinish}
      >
        <Form.Item name="cliente" label="Cliente">
          <Input />
        </Form.Item>
        <Form.Item name="descripcion" label="Descripción">
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Actualizar
        </Button>
      </Form>
    </Modal>
  );
};

export default EditarVentaModal;
