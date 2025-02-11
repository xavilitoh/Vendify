import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button } from "antd";

interface EditCategoryFormValues {
  descripcion: string;
  enable: boolean;
  fechaCreacion: string;
}

interface EditCategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: EditCategoryFormValues) => void;
  initialValues: EditCategoryFormValues;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Modal
      title="Editar Categoría"
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
          Guardar Cambios
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={initialValues}
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

        <Form.Item
          label="Habilitado"
          name="enable"
          valuePropName="checked" // This ensures the switch is controlled by the form
        >
          <Switch checkedChildren="Sí" unCheckedChildren="No" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
