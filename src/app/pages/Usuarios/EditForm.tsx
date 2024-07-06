// EditUserForm.tsx
import React from "react";
import { Form, Input, FormInstance } from "antd";

interface EditUserFormProps {
  form: FormInstance<DataType>;
  user: DataType | null;
}
interface DataType {
  id: number; // Change from string to number
  fullName: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
}

const EditUserForm: React.FC<EditUserFormProps> = ({ form, user }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      name="edit_user"
      initialValues={user || {}}
    >
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
        rules={[{ required: true, message: "Por favor ingrese el nombre" }]}
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
        name="telefono"
        label="Telefono"
        rules={[{ required: true, message: "Por favor ingrese el telefono" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="documento"
        label="Cedula"
        rules={[{ required: true, message: "Por favor ingrese la cedula" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="direccion" label="Direccion">
        <Input />
      </Form.Item>
    </Form>
  );
};

export default EditUserForm;
