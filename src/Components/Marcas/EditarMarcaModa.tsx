import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button } from "antd";

interface EditMarcaFormValues {
  descripcion: string;
  enable: boolean;
}

interface EditMarcaModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: EditMarcaFormValues) => void;
  initialValues: EditMarcaFormValues;
}

const EditMarcaModal: React.FC<EditMarcaModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Update form fields whenever initialValues change
  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, visible, form]);

  return (
    <Modal
      title="Editar Marca"
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
          Guardar
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values as EditMarcaFormValues);
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
        <Form.Item
          label="Habilitado"
          name="enable"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditMarcaModal;
