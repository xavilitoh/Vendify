import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface CreateUnidadFormValues {
  descripcion: string;
  abreviatura: string;
}

interface CreateUnidadModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateUnidadFormValues) => void;
}

const CreateUnidadModal: React.FC<CreateUnidadModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Crear Unidad"
      visible={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Crear
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values as CreateUnidadFormValues);
          form.resetFields();
        }}
      >
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[
            { required: true, message: "Por favor ingrese una descripción" },
          ]}
        >
          <Input placeholder="DOLARES" maxLength={15} />
        </Form.Item>
        <Form.Item
          label="Abreviatura"
          name="abreviatura"
          rules={[
            { required: true, message: "Por favor ingrese una abreviatura" },
          ]}
        >
          <Input placeholder="USD" maxLength={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUnidadModal;
