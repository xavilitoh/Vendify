import React from "react";
import { Modal, Form, Input, DatePicker, Radio, Button } from "antd";
import moment from "moment";

interface CreateUserFormValues {
  email: string;
  pass: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  address: string;
  fecaNac: string; 
  noDocumento: string;
  sexo: boolean;
}

interface CreateUserModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateUserFormValues) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Crear Usuario"
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
  
          const formattedValues = {
            ...values,
            fecaNac: values.fecaNac.format("YYYY-MM-DD"), 
          };

          onSubmit(formattedValues as CreateUserFormValues);
          form.resetFields();
        }}
        initialValues={{
          fecaNac: moment(),
        }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Por favor ingrese su email" }]}
        >
          <Input placeholder="Ingrese su email" />
        </Form.Item>

        <Form.Item
          label="Contraseña"
          name="pass"
          rules={[
            { required: true, message: "Por favor ingrese su contraseña" },
          ]}
        >
          <Input.Password placeholder="Ingrese su contraseña" />
        </Form.Item>

        <Form.Item
          label="Nombres"
          name="nombres"
          rules={[{ required: true, message: "Por favor ingrese sus nombres" }]}
        >
          <Input placeholder="Ingrese sus nombres" />
        </Form.Item>

        <Form.Item
          label="Apellidos"
          name="apellidos"
          rules={[
            { required: true, message: "Por favor ingrese sus apellidos" },
          ]}
        >
          <Input placeholder="Ingrese sus apellidos" />
        </Form.Item>

        <Form.Item
          label="Teléfono"
          name="telefono"
          rules={[{ required: true, message: "Por favor ingrese su teléfono" }]}
        >
          <Input placeholder="Ingrese su teléfono" />
        </Form.Item>

        <Form.Item
          label="Dirección"
          name="address"
          rules={[
            { required: true, message: "Por favor ingrese su dirección" },
          ]}
        >
          <Input placeholder="Ingrese su dirección" />
        </Form.Item>

        <Form.Item
          label="Fecha de Nacimiento"
          name="fecaNac"
          rules={[
            {
              required: true,
              message: "Por favor seleccione su fecha de nacimiento",
            },
          ]}
        >
          <DatePicker
            format="YYYY-MM-DD"
            placeholder="Seleccione fecha de nacimiento"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          label="No. Documento"
          name="noDocumento"
          rules={[
            {
              required: true,
              message: "Por favor ingrese su número de documento",
            },
          ]}
        >
          <Input placeholder="Ingrese su número de documento" />
        </Form.Item>

        <Form.Item
          label="Sexo"
          name="sexo"
          rules={[{ required: true, message: "Por favor seleccione su sexo" }]}
        >
          <Radio.Group>
            <Radio value={true}>Masculino</Radio>
            <Radio value={false}>Femenino</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
