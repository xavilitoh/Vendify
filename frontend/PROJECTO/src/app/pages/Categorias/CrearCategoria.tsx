import React from "react";
import { Form, Input, FormInstance } from "antd";

interface DataType {
  categoria: string;
  descripcion: string;
}

interface CreateClientFormProps {
  form: FormInstance<DataType>;
}

const CreateClientForm: React.FC<CreateClientFormProps> = ({ form }) => {
  return (
    <Form form={form} layout="vertical" name="categoria_form">
      <Form.Item name="descripcion" label="Descripción">
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
};

export default CreateClientForm;
