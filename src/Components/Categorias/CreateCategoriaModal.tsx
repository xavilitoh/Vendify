// components/CreateCategoryModal.tsx
import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface CreateCategoryFormValues {
  descripcion: string;
}

interface CreateCategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateCategoryFormValues) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Crear Categoria t"
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
          console.log(values);
          onSubmit(values as CreateCategoryFormValues);
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
          <Input placeholder="Ingrese la descripción" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCategoryModal;
