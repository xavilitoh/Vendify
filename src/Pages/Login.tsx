import React, { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import axios, { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// Define the type for the login form values
interface LoginFormValues {
  email: string;
  password: string;
}

// Define the expected response structure from the API
interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
  };
}

const LoginForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      // Make API call to the login endpoint
      const response: AxiosResponse<LoginResponse> = await axios.post(
        "https://vendify_api.wxbolab.com/api/Account/Login",
        {
          userName: values.email,
          pass: values.password,
        }
      );

      // Extract token from the response
      const { token } = response.data;

      // Store the token in cookies
      Cookies.set("token", token, { expires: 7 });

      // Display a success message
      message.success("Ha entrado con exito");

      // Redirect to the dashboard
      navigate("/");
    } catch (error) {
      // Display error message
      console.log(error);
      message.error("Contraseña o correo incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <Form
        name="login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Por favor ingresar un correo" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Correo" type="email" />
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
      </Form>
    </div>
  );
};

export default LoginForm;
