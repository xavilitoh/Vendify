import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  usuario: {
    nombres: string;
    apellido: string;
    email: string;
  };
}

interface LoginFormProps {
  isDarkMode: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ isDarkMode }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        "https://vendify_api.wxbolab.com/api/Account/Login",
        {
          userName: values.email,
          pass: values.password,
        }
      );

      const { token } = response.data;
      const { usuario } = response.data;
      Cookies.set("token", token, { expires: 7 });
      Cookies.set("usuario", JSON.stringify(usuario), { expires: 7 });

      message.success(`Bienvenido, ${usuario?.nombres}`);
      navigate("/");
    } catch (error) {
      message.error("Contraseña o correo incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <img
        className="imagen-logo"
        src={`../../public/Images/${isDarkMode ? "2-dark" : "2"}.png`}
      />
      <div className="login-form-container">
        <h1 className="">Entrar</h1>
        <Form
          name="login"
          className="login-form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Por favor ingresar un correo" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Correo"
              type="email"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Por favor ingresar una contraseña" },
            ]}
          >
            <Input
              prefix={<LockOutlined />}
              type="password"
              placeholder="Contaseña"
            />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Recuerdame</Checkbox>
            </Form.Item>

            <a className="login-form-forgot" href="">
              Olvidaste la contraseña
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={loading}
            >
              Entrar
            </Button>
          </Form.Item>
          <a className="login-form-forgot" href="/registrarse">
            ¿No tienes Cuenta? Registrate aqui
          </a>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
