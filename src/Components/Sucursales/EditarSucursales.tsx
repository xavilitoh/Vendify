import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, Button, notification } from "antd";
import { formatPhoneNumber } from "../Utils/Validators";

interface EditSucursalModalProps {
  visible: boolean;
  sucursal: any;
  onClose: () => void;
  onUpdate: (id: number, values: any) => Promise<any>; // Ensure it returns the API response
}

const EditSucursalModal: React.FC<EditSucursalModalProps> = ({
  visible,
  sucursal,
  onClose,
  onUpdate,
}) => {
  const [form] = Form.useForm();

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    form.setFieldsValue({ telefono: formattedValue });
  };

  useEffect(() => {
    if (visible && sucursal) {
      form.setFieldsValue(sucursal);
    }
  }, [sucursal, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedValues = { ...values, id: sucursal.id }; // Add ID

      // Wait for the Redux response (onUpdate returns a promise)
      await onUpdate(sucursal.id, updatedValues);

      // Show success notification only if the update succeeds
      notification.success({
        message: "Sucursal actualizada",
        description: `La sucursal "${values.descripcion}" ha sido actualizada con éxito.`,
        placement: "topRight",
      });

      // Reset form and close modal
      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error("Error updating sucursal:", error);

      // Show error notification
      notification.error({
        message: "Error al actualizar",
        description: "Ocurrió un error inesperado. Intente de nuevo.",
        placement: "topRight",
      });
    }
  };

  return (
    <Modal
      title="Editar Sucursal"
      visible={visible}
      onCancel={() => {
        onClose();
        form.resetFields();
      }}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Guardar Cambios
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[
            { required: true, message: "Por favor ingresa la descripción" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="direccion"
          label="Dirección"
          rules={[
            { required: true, message: "Por favor ingresa la dirección" },
          ]}
        >
          <Input />
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
          <Input onChange={handlePhoneChange} />
        </Form.Item>
        <Form.Item label="Habilitado" name="enable" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSucursalModal;
