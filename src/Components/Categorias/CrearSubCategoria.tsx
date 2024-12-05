import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface CreateSubcategoryFormValues {
  descripcion: string;
}

interface CreateSubcategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateSubcategoryFormValues) => void;
}

const CreateSubcategoryModal: React.FC<CreateSubcategoryModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Crear Subcategoría"
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
          onSubmit(values as CreateSubcategoryFormValues);
          form.resetFields();
        }}
      >
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: "Por favor ingrese una descripción" }]}
        >
          <Input placeholder="Ingrese la descripción" />
        </Form.Item>
        
      </Form>
    </Modal>
  );
};

export default CreateSubcategoryModal;
