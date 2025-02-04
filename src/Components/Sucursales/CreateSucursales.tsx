import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface CreateSucursalModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (values: any) => void;
}

const CreateSucursalModal: React.FC<CreateSucursalModalProps> = ({
  visible,
  onClose,
  onCreate,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onCreate(values);
      form.resetFields();
    });
  };

  const formatPhoneNumber = (value: string) => {
    // Remove non-numeric characters
    const cleaned = value.replace(/\D/g, "");

    // Format the number as XXX-XXX-XXXX
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 6) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
        6,
        10
      )}`;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ telefono: formattedValue });
  };

  return (
    <Modal
      title="Crear Sucursal"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[
            { required: true, message: "Por favor ingresa la descripción" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="direccion"
          label="Dirección"
          rules={[
            { required: true, message: "Por favor ingresa la dirección" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="telefono"
          label="Teléfono"
          rules={[
            { required: true, message: "Por favor ingresa el teléfono" },
            {
              pattern: /^\d{3}-\d{3}-\d{4}$/,
              message: "El teléfono debe estar en formato 809-430-5241",
            },
          ]}
        >
          <Input
            maxLength={12}
            onChange={handlePhoneChange}
            placeholder="809-430-5241"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Crear
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSucursalModal;
