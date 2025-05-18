// src/routes/ResetPassword.tsx
import { useSearchParams, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Form, Input, Button, Typography, message as antdMessage } from "antd";
import apiClient from "../Api/VendifyApi";

const { Title } = Typography;

export default function ResetPassword() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const rawToken = searchParams.get("token");
  const rawEmail = searchParams.get("email");

  const token = rawToken ? decodeURIComponent(rawToken) : "";
  const email = rawEmail ? decodeURIComponent(rawEmail) : "";

  const onFinish = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      await apiClient.post(`/Account/ResetPassword`, {
        email,
        token,
        newPassword: values.password,
      });
      antdMessage.success("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);
      antdMessage.error("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  if (!email || !token) {
    return <Navigate to="/error?msg=Invalid reset link" />;
  }

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
      <Title level={3}>Reiniciar tu contraseña</Title>
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Contraseña"
          name="password"
          rules={[{ required: true, message: "Inserta tu contraseña" }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Confirma Contraseña"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Confirma tu contraseña" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Las contraseñas no coinciden")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Reiniciar Contraseña
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
