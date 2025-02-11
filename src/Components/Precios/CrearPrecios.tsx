import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface CreatePriceFormValues {
  descripcion: string;
}

interface CreatePriceModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreatePriceFormValues) => void;
}

const CreatePriceModal: React.FC<CreatePriceModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Crear Precio"
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
          onSubmit(values as CreatePriceFormValues);
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
          <Input placeholder="Ingrese la descripción" maxLength={50} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreatePriceModal;
