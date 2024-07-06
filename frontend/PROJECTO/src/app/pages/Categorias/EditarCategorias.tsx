import React from "react";
import { Form, Input, FormInstance } from "antd";


interface DataType {
  descripcion: string;
  id: number;
}

interface CreateClientFormProps {
  form: FormInstance<DataType>;
  categoria: DataType | null;
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
