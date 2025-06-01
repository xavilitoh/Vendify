import React, { useEffect } from "react";
import {
  Form,
  InputNumber,
  Select,
  Button,
  message,
  Typography,
  Card,
  Row,
  Col,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import {
  fetchCajaEstaciones,
  selectCajaEstaciones,
} from "../../Redux/CajaEstacion";
import { abrirCaja } from "../../Redux/Cajas.";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

interface AbrirCajaPantallaProps {
  visible: boolean;
}

const AbrirCajaPantalla: React.FC<AbrirCajaPantallaProps> = ({ visible }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();
  const cajaEstaciones = useSelector(selectCajaEstaciones);

  useEffect(() => {
    if (visible) {
      dispatch(fetchCajaEstaciones({ page: 1, pageSize: 100 }));
    }
  }, [dispatch, visible]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const { idCajaEstacion, montoApertura } = values;
      await dispatch(abrirCaja({ idCajaEstacion, montoApertura })).unwrap();
      message.success("Caja abierta exitosamente");
      navigate("/crearventas");
      form.resetFields();
    } catch (error: any) {
      const apiMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error desconocido al abrir la caja";
      message.error(apiMessage);
    }
  };

  if (!visible) return null;

  return (
    <Row
      justify="center"
      align="middle"
      style={{ minHeight: "50vh", background: "inherit" }}
    >
      <Col>
        <Card
          style={{
            minWidth: 400,
            maxWidth: 420,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            borderRadius: 16,
            padding: 0,
            border: "none",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0, color: "#2b3a55" }}>
              Abrir Caja
            </Title>
            <Text type="secondary">Complete los datos para abrir la caja</Text>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={{ width: "100%" }}
          >
            <Form.Item
              name="idCajaEstacion"
              label={<span style={{ fontWeight: 500 }}>Caja Estación</span>}
              rules={[
                { required: true, message: "Seleccione una caja estación" },
              ]}
            >
              <Select placeholder="Seleccione una caja estación" size="large">
                {cajaEstaciones.map((caja: any) => (
                  <Select.Option key={caja.id} value={caja.id}>
                    {caja.descripcion}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="montoApertura"
              label={<span style={{ fontWeight: 500 }}>Monto de Apertura</span>}
              rules={[
                { required: true, message: "Ingrese el monto de apertura" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                size="large"
                prefix="$"
                placeholder="Ingrese el monto"
              />
            </Form.Item>

            <Row justify="end" gutter={12} style={{ marginTop: 24 }}>
              <Col>
                <Button
                  onClick={() => {
                    form.resetFields();
                  }}
                  style={{ borderRadius: 8 }}
                >
                  Cancelar
                </Button>
              </Col>
              <Col>
                <Button type="primary" htmlType="submit" size="large">
                  Abrir Caja
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AbrirCajaPantalla;
