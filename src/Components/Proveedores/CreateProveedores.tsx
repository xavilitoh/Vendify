import React from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { createProveedor, ProveedorRequest } from "../../Redux/Proveedores";
import { AppDispatch } from "../../Redux/Store";
import { formatPhoneNumber } from "../Utils/Validators";

interface CreateProveedorModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateProveedorModal: React.FC<CreateProveedorModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ telefono: formattedValue });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const proveedorData: ProveedorRequest = {
        id: 0,
        descripcion: values.descripcion,
        direccion: values.direccion,
        telefono: values.telefono,
        email: values.email,
        rnc: values.rnc,
        nombre: values.nombre,
      };
      await dispatch(createProveedor(proveedorData)).unwrap();
      message.success("Proovedor creado exitosamente");

      form.resetFields();
      onClose();
    } catch (error) {
      console.error("Error al crear el proveedor", error);
      Modal.error({
        title: "Error",
        content:
          error instanceof Error
            ? error.message
            : "Error inesperado, intentelo nuevamente",
      });
    }
  };

  return (
    <Modal
      title="Crear Proveedor"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[
            { required: true, message: "Por favor ingresa la descripción" },
          ]}
        >
          <Input
            placeholder="Ingrese la descripción"
            maxLength={50}
            minLength={3}
          />
        </Form.Item>
        <Form.Item
          name="direccion"
          label="Dirección"
          rules={[
            { required: true, message: "Por favor ingresa la dirección" },
          ]}
        >
          <Input
            placeholder="Ingrese la dirección"
            maxLength={50}
            minLength={3}
          />
        </Form.Item>
        <Form.Item
          name="telefono"
          label="Teléfono"
          rules={[
            { required: true, message: "Por favor ingresa el teléfono" },
            {
              pattern: /^\d{3}-\d{3}-\d{4}$/,
              message: "El teléfono debe estar en formato 809-430-5241",
            },
          ]}
        >
          <Input
            placeholder="829-395-9249"
            maxLength={12}
            minLength={3}
            onChange={handlePhoneChange}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Por favor ingresa un email válido",
            },
          ]}
        >
          <Input placeholder="Ingrese el email" maxLength={50} minLength={3} />
        </Form.Item>
        <Form.Item
          name="rnc"
          label="RNC"
          rules={[{ required: true, message: "Por favor ingresa el RNC" }]}
        >
          <Input placeholder="Ingrese el RNC" maxLength={12} minLength={12} />
        </Form.Item>
        <Form.Item
          name="nombrer"
          label="Nombre del Representante"
          rules={[
            {
              required: true,
              message: "Por favor ingresa el nombre del representante",
            },
          ]}
        >
          <Input
            placeholder="Ingrese el nombre del representante"
            maxLength={50}
            minLength={3}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Crear
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProveedorModal;
