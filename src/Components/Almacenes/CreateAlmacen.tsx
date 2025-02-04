import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSucursales,
  selectSucursales,
  selectLoading as selectSucursalesLoading,
} from "../../Redux/Sucursales";
import { AppDispatch } from "../../Redux/Store";

const { Option } = Select;

interface CreateAlmacenModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (values: any) => void;
}

const CreateAlmacenModal: React.FC<CreateAlmacenModalProps> = ({
  visible,
  onClose,
  onCreate,
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

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onCreate(values); // Send the form values, including idSucursal
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Crear Nuevo Almacén"
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Crear Almacén
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAlmacenModal;
