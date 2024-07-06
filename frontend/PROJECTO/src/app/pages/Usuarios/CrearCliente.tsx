import React from "react";
import { Form, Input, FormInstance, Select } from "antd";
const { Option } = Select;

interface CreateClientFormProps {
  form: FormInstance<DataType>;
}

interface DataType {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  noDocumento: string;
  address: string;
  pass: string;
  sexo: string;
}

const CreateClientForm: React.FC<CreateClientFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="nombres"
        label="Nombre"
        rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="apellidos"
        label="Apellido"
        rules={[{ required: true, message: "Por favor ingrese el apellido" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="email"
        label="Correo"
        rules={[{ required: true, message: "Por favor ingrese el correo" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="pass"
        label="Contraseña"
        rules={[{ required: true, message: "Por favor ingrese la contraseña" }]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="telefono"
        label="Teléfono"
        rules={[{ required: true, message: "Por favor ingrese el teléfono" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="noDocumento"
        label="Documento"
        rules={[{ required: true, message: "Por favor ingrese el documento" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="address" label="Dirección">
        <Input />
      </Form.Item>
      <Form.Item
        name="sexo"
        label="Sexo"
        rules={[{ required: true, message: "Por favor seleccione su sexo" }]}
      >
        <Select placeholder="Seleciona tu genero">
          <Option value="Masculino">Masculino</Option>
          <Option value="Femenino">Femenino</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};

export default CreateClientForm;
