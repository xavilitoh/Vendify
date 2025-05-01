import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { fetchSucursales } from "../../Redux/Sucursales";
import { updateCajaEstacion } from "../../Redux/CajaEstacion";

interface EditCajaEstacionProps {
  visible: boolean;
  onClose: () => void;
  cajaEstacion: any;
}

const EditCajaEstacion: React.FC<EditCajaEstacionProps> = ({
  visible,
  onClose,
  cajaEstacion,
}) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const [loadingSucursales, setLoadingSucursales] = useState(true);

  useEffect(() => {
    if (visible) {
      dispatch(fetchSucursales()).then(() => {
        setLoadingSucursales(false);
      });
    }
  }, [dispatch, visible]);

  useEffect(() => {
    if (!loadingSucursales && cajaEstacion) {
      form.setFieldsValue({
        descripcion: cajaEstacion.descripcion,
        idSucursal: cajaEstacion.idSucursal,
        estado: cajaEstacion.estado === 1,
      });
    }
  }, [loadingSucursales, cajaEstacion, form]);

  const handleUpdate = (values: any) => {
    const updatedData = {
      descripcion: values.descripcion,
      idSucursal: values.idSucursal,
      enable: values.estado,
      id: cajaEstacion.id,
    };

    dispatch(updateCajaEstacion({ id: cajaEstacion.id, data: updatedData }));
    onClose();
    form.resetFields();
    setLoadingSucursales(true); // Reset para la próxima vez
  };

  return (
    <Modal
      title="Editar Caja Estación"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnClose
    >
      <Form form={form} onFinish={handleUpdate} layout="vertical">
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: "Ingrese una descripción" }]}
        >
          <Input />
        </Form.Item>

        {/*         <Form.Item
          label="Sucursal"
          name="idSucursal"
          rules={[{ required: true, message: "Seleccione una sucursal" }]}
        >
          <Select
            placeholder="Selecciona una sucursal"
            defaultValue={cajaEstacion.idSucursal}
          >
            {sucursales.map((sucursal: any) => (
              <Option key={sucursal.id} value={sucursal.id}>
                {sucursal.descripcion}
              </Option>
            ))}
          </Select>
        </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Guardar Cambios
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCajaEstacion;
