import React, { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import Cookies from "js-cookie";

interface CreateMarcaFormValues {
  descripcion: string;
  idEntidad?: number;
}

interface CreateMarcaModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateMarcaFormValues) => void;
}

const CreateMarcaModal: React.FC<CreateMarcaModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      // Get user data from cookies
      const userCookie = Cookies.get("usuario");

      if (userCookie) {
        const user = JSON.parse(userCookie);
        console.log(user?.empresa?.id);

        // Set the 'idEntidad' field if available
        if (user?.empresa?.id) {
          form.setFieldsValue({ idEntidad: user.empresa.id });
        }
      }
    }
  }, [visible, form]);

  return (
    <Modal
      title="Crear Marca"
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
          onSubmit(values as CreateMarcaFormValues);
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

export default CreateMarcaModal;
