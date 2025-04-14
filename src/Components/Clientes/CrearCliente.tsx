import React from "react";
import { Modal, Form, Input, Select } from "antd";
import { formatNoDocumento, formatPhoneNumber } from "../Utils/Validators"; // Adjust the import path as necessary

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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ telefono: formattedValue });
  };

  const handleNoDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNoDocumento(e.target.value);
    form.setFieldsValue({ noDocumento: formattedValue });
  };

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
            form.resetFields();
          })
          .catch((info) => console.log("Validation Failed:", info));
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nombres"
          label="Nombre Completo"
          rules={[
            { required: true, message: "Un Cliente debe tener un nombre" },
          ]}
        >
          <Input placeholder="Jose Ureña" min={3} max={50} />
        </Form.Item>
        <Form.Item
          name="apellidos"
          label="Apellidos"
          rules={[
            { required: true, message: "Un Cliente debe tener un apellido" },
          ]}
        >
          <Input placeholder="Hernadez Suarez" min={2} max={50}/>
        </Form.Item>
        <Form.Item
          name="noDocumento"
          label="No. Documento"
          rules={[
            {
              required: true,
              message: "Un Cliente debe tener un No. Documento",
            },
            {
              message: "El documento debe estar en formato 000-000000-0",
            },
          ]}
        >
          <Input
            maxLength={13}
            onChange={handleNoDocumentoChange}
            placeholder="402-3616656-8"
          />
        </Form.Item>
        <Form.Item
          name="telefono"
          label="Telefono"
          rules={[
            {
              required: true,
              message: "Un Cliente debe tener un telefono",
            },
            {
              pattern: /^\d{3}-\d{3}-\d{4}$/,
              message: "El teléfono debe estar en formato 809-430-5241",
            },
          ]}
        >
          <Input
            onChange={handlePhoneChange}
            maxLength={12}
            placeholder="829-395-9249"
          />
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
