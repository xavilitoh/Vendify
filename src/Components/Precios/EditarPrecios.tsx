import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button } from "antd";

interface EditPriceFormValues {
  descripcion: string;
  enable: boolean;
}

interface EditPriceModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: EditPriceFormValues) => void;
  initialValues: EditPriceFormValues;
}

const EditPriceModal: React.FC<EditPriceModalProps> = ({
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
      title="Editar Precio"
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
          onSubmit(values as EditPriceFormValues);
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
        <Form.Item label="Habilitado" name="enable" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPriceModal;
