import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { fetchSucursales, selectSucursales } from "../../Redux/Sucursales";
import { createCajaEstacion } from "../../Redux/CajaEstacion";

const { Option } = Select;

interface CreateCajaEstacionProps {
  visible: boolean;
  onClose: () => void;
}

const CreateCajaEstacion: React.FC<CreateCajaEstacionProps> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const sucursales = useSelector(selectSucursales);


  useEffect(() => {
    dispatch(fetchSucursales());
  }, [dispatch]);

  const handleCreate = (values: any) => {
    dispatch(createCajaEstacion(values));
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title="Crear Caja Estación"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleCreate}
        layout="vertical"
      >
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: "Por favor ingrese la descripción" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Sucursal"
          name="idSucursal"
          rules={[{ required: true, message: "Seleccione una sucursal" }]}
        >
          <Select placeholder="Selecciona una sucursal">
            {sucursales.map((sucursal: any) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.descripcion}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Crear
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateCajaEstacion;
