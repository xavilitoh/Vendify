import React, { useEffect } from "react";
import { Modal, Form, InputNumber, Select, message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import {selectCajasSelectList,fetchCajasSelectList} from "../../Redux/Cajas.";

import { cerrarCaja} from "../../Redux/Cajas."; // ✅ Importar thunk


interface CreateCajaModalProps {
  visible: boolean;
  onClose: () => void;
}

const CreateCajaModal: React.FC<CreateCajaModalProps> = ({
  visible,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const cajas = useSelector(selectCajasSelectList);
  console.log("Cajas:", cajas);

  useEffect(() => {
    dispatch(fetchCajasSelectList()); // Carga inicial
  }, [dispatch]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { idCajaEstacion, montoCierre } = values;
      form.resetFields();
    await dispatch(cerrarCaja({ idCajaEstacion, montoCierre })).unwrap();
        
      form.resetFields();
      message.success("Caja Cerrada exitosamente");
      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
      message.error("Error intentando cerrar la caja");
    }
  };

  return (
    <Modal
      title="Cerrar Caja"
      open={visible}
      onOk={handleOk}
      onCancel={onClose}
      okText="Cerrar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">

        <Form.Item
          name="idCajaEstacion"
          label="Caja Estación"
          rules={[{ required: true }]}
        >
          <Select placeholder="Seleccione una caja estación">
            {cajas.map((caja: any) => (
              <Select.Option key={caja.id} value={caja.id}>
                {caja.descripcion}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="montoCierre"
          label="Monto Cierre"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

      </Form>
    </Modal>
  );
};

export default CreateCajaModal;
