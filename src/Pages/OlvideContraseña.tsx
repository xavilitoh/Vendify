import { useState } from "react";
import { Form, Input, Button, Typography, message as antdMessage } from "antd";
import apiClient from "../Api/VendifyApi";

const { Title } = Typography;

export default function ForgotPassword() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await apiClient.post("/Account/ForgotPassword", {
        email: values.email,
        backToUrl: "http://localhost:5173/reset-password/",
      });
      antdMessage.success(
        "Revisa tu correo para el enlace de restablecimiento."
      );
    } catch (error) {
      console.error(error);
      antdMessage.error("No se pudo enviar el correo de recuperación.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 8,
      }}
    >
      <Title level={3}>Recuperar Contraseña</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Correo electrónico"
          name="email"
          rules={[
            { required: true, message: "Ingresa tu correo" },
            { type: "email", message: "Correo no válido" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Enviar enlace
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
