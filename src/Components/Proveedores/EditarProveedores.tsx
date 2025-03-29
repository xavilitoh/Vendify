import React, { useEffect } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import { useDispatch } from "react-redux";
import { updateProveedor, Proveedor } from "../../Redux/Proveedores";
import { AppDispatch } from "../../Redux/Store";

interface EditProveedorModalProps {
  visible: boolean;
  onClose: () => void;
  proveedor: Proveedor | null;
}

const EditProveedorModal: React.FC<EditProveedorModalProps> = ({
  visible,
  onClose,
  proveedor,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();

  useEffect(() => {
    if (proveedor) {
      form.setFieldsValue({
        descripcion: proveedor.descripcion,
        direccion: proveedor.direccion,
        telefono: proveedor.telefono,
        email: proveedor.email,
        rnc: proveedor.rnc,
        nombre: proveedor.nombre,
      });
    }
  }, [proveedor, form]);

  const handleSubmit = async () => {
    try {
      console.log(proveedor);
      const values = await form.validateFields();
      if (proveedor) {
        const proveedorData = {
          descripcion: values.descripcion,
          direccion: values.direccion,
          telefono: values.telefono,
          email: values.email,
          rnc: values.rnc,
          nombre: values.nombre,
          id: proveedor.id,
        };
        await dispatch(
          updateProveedor({ id: proveedor.id as number, proveedorData })
        ).unwrap();
        form.resetFields();
        onClose();
        message.success("Proveedor actualizado correctamente");
      }
    } catch (error) {
      console.error("Error al actualizar el proveedor", error);
      message.error("Error al actualizar el proveedor");
    }
  };

  return (
    <Modal
      title="Editar Proveedor"
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
          <Input placeholder="Ingrese la descripción" />
        </Form.Item>
        <Form.Item
          name="direccion"
          label="Dirección"
          rules={[
            { required: true, message: "Por favor ingresa la dirección" },
          ]}
        >
          <Input placeholder="Ingrese la dirección" />
        </Form.Item>
        <Form.Item
          name="telefono"
          label="Teléfono"
          rules={[{ required: true, message: "Por favor ingresa el teléfono" }]}
        >
          <Input placeholder="Ingrese el teléfono" />
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
          <Input placeholder="Ingrese el email" />
        </Form.Item>
        <Form.Item
          name="rnc"
          label="RNC"
          rules={[{ required: true, message: "Por favor ingresa el RNC" }]}
        >
          <Input placeholder="Ingrese el RNC" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>
            Actualizar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProveedorModal;
