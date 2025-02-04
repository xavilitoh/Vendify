import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select, notification, Switch } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSucursales,
  selectSucursales,
  selectLoading as selectSucursalesLoading,
} from "../../Redux/Sucursales";
import { AppDispatch } from "../../Redux/Store";

const { Option } = Select;

interface EditAlmacenModalProps {
  visible: boolean;
  almacen: any;
  onClose: () => void;
  onUpdate: (id: number, values: any) => Promise<any>;
}

const EditAlmacenModal: React.FC<EditAlmacenModalProps> = ({
  visible,
  almacen,
  onClose,
  onUpdate,
}) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const sucursales = useSelector(selectSucursales) || [];
  const loadingSucursales = useSelector(selectSucursalesLoading);

  // Fetch active sucursales when the modal opens
  useEffect(() => {
    if (visible) {
      dispatch(fetchSucursales());
    }
  }, [dispatch, visible]);

  // Set form fields when modal opens
  useEffect(() => {
    if (visible && almacen) {
      form.setFieldsValue({
        ...almacen,
        sucursal: almacen.sucursal ? almacen.sucursal.id : null, // Set the correct sucursal ID
      });
    }
  }, [almacen, visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedValues = { ...values, id: almacen.id };

      const response = await onUpdate(almacen.id, updatedValues);
      if (response && response.id) {
        notification.success({
          message: "Almacén actualizado",
          description: `El almacén "${values.descripcion}" ha sido actualizado con éxito.`,
          placement: "topRight",
          className: "dark-notification",
        });
      }

      form.resetFields();
      onClose();
    } catch (error: any) {
      console.error("Error updating almacen:", error);
    }
  };

  return (
    <Modal
      title="Editar Almacén"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Select for Sucursal */}
        <Form.Item
          name="idSucursal"
          label="Sucursal"
          rules={[{ required: true, message: "Seleccione una sucursal" }]}
        >
          <Select
            placeholder="Seleccione una sucursal"
            loading={loadingSucursales}
          >
            {sucursales.map((sucursal) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.descripcion}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[{ required: true, message: "Ingrese la descripción" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="direccion"
          label="Dirección"
          rules={[{ required: true, message: "Ingrese la dirección" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Habilitado" name="enable" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditAlmacenModal;
