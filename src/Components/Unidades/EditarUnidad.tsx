import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button } from "antd";

interface EditUnidadFormValues {
  descripcion: string;
  abreviatura: string;
  enable: boolean;
}

interface EditUnidadModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: EditUnidadFormValues) => void;
  initialValues: EditUnidadFormValues;
}

const EditUnidadModal: React.FC<EditUnidadModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue(initialValues);
    }
  }, [initialValues, visible, form]);

  return (
    <Modal
      title="Editar Unidad"
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
          onSubmit(values as EditUnidadFormValues);
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
          label="Abreviatura"
          name="abreviatura"
          rules={[{ required: true, message: "Por favor ingrese una abreviatura" }]}
        >
          <Input placeholder="Ingrese la abreviatura" />
        </Form.Item>
        <Form.Item label="Habilitado" name="enable" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUnidadModal;
