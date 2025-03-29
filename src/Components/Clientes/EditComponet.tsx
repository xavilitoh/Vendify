import React, { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";

interface EditClientProps {
  visible: boolean;
  clientData: any | null;
  onUpdate: (values: any) => void;
  onCancel: () => void;
}

const EditClientForm: React.FC<EditClientProps> = ({ visible, clientData, onUpdate, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (clientData) {
      form.setFieldsValue(clientData);
    }
  }, [clientData, form]);

  return (
    <Modal
      visible={visible}
      title="Editar Cliente"
      okText="Actualizar"
      cancelText="Cancelar"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onUpdate({ ...clientData, ...values });
            form.resetFields(); // Reset only on success
          })
          .catch((info) => console.log("Validation Failed:", info));
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="nombres" label="Nombre" rules={[{ required: true, message: "El nombre es obligatorio" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="apellidos" label="Apellidos" rules={[{ required: true, message: "El apellido es obligatorio" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="noDocumento" label="No. Documento" rules={[{ required: true, message: "El documento es obligatorio" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, message: "El teléfono es obligatorio" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Sexo" name="sexo" rules={[{ required: true, message: "Seleccione el sexo" }]}>
          <Select placeholder="Seleccione su sexo">
            <Select.Option value={true}>Masculino</Select.Option>
            <Select.Option value={false}>Femenino</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditClientForm;
