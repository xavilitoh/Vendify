import React from "react";
import { Modal, Form, Input, Select } from "antd";

interface ClientProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onCancel: () => void;
}

const ClientForm: React.FC<ClientProps> = ({
  visible,
  onCreate,
  onCancel,
}: ClientProps) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Create Client"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onCreate(values);
          })
          .catch((info) => console.log("Validation Failed:", info));
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nombres"
          label="nombres"
          rules={[
            { required: true, message: "Un Cliente debe tener un nombre" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="apellidos"
          label="apellidos"
          rules={[
            { required: true, message: "Un Cliente debe tener un apellido" },
          ]}
        >
          <Input type="email" />
        </Form.Item>
        <Form.Item
          name="noDocumento"
          label="No. Documento"
          rules={[
            {
              required: true,
              message: "Un Cliente debe tener un No. Documento",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="telefono"
          label="Telefono"
          rules={[
            {
              required: true,
              message: "Un Cliente debe tener un telefono",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Sexo"
          name="sexo"
          rules={[{ required: true, message: "Por favor seleccione su sexo" }]}
        >
          <Select placeholder="Seleccione su sexo">
            <Select.Option value={true}>Masculino</Select.Option>
            <Select.Option value={false}>Femenino</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ClientForm;
