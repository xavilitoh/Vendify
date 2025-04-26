import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select, Switch } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { fetchSucursales, selectSucursales } from "../../Redux/Sucursales";
import { updateCajaEstacion } from "../../Redux/CajaEstacion";

const { Option } = Select;

interface EditCajaEstacionProps {
  visible: boolean;
  onClose: () => void;
  cajaEstacion: any; // Puedes tiparlo mejor si quieres
}

const EditCajaEstacion: React.FC<EditCajaEstacionProps> = ({ visible, onClose, cajaEstacion }) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const sucursales = useSelector(selectSucursales);

  useEffect(() => {
    dispatch(fetchSucursales());
    if (cajaEstacion) {
      form.setFieldsValue({
        descripcion: cajaEstacion.descripcion,
        idSucursal: cajaEstacion.idSucursal,
        estado: cajaEstacion.estado === 1
      });
    }
  }, [dispatch, cajaEstacion, form]);

  const handleUpdate = (values: any) => {
    const updatedData = {
      ...values,
      id:cajaEstacion.id // Convertimos el boolean a 1 o 0
    };

    dispatch(updateCajaEstacion({ id: cajaEstacion.id, data: updatedData }));
    onClose();
    form.resetFields();
  };

  return (
    <Modal
      title="Editar Caja Estación"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        onFinish={handleUpdate}
        layout="vertical"
      >
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: "Ingrese una descripción" }]}
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

        <Form.Item
          label="Estado"
          name="estado"
          valuePropName="checked"
        >
          <Switch checkedChildren="Activo" unCheckedChildren="Inactivo" />
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

export default EditCajaEstacion;
