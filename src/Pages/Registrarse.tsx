import React, { useState } from "react";
import { Steps, Form, Input, Button, message, Radio, DatePicker } from "antd";
import { FormInstance } from "antd/lib/form";
import type { RadioChangeEvent } from "antd";
import "./Registrarse.css";
import moment from "moment";
import apiClient from "../Api/VendifyApi";

const { Step } = Steps;

interface User {
  email: string;
  pass: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  address: string;
  fecaNac: string;
  noDocumento: string;
  sexo: boolean;
  idEntidad: number;
}

interface Company {
  id: number;
  nombre: string;
  rnc: string;
  idArchivo: number;
  foto: string;
  direccion: string;
  telefono1: string;
  telefono2: string;
  email: string;
}

interface FormValues {
  usuario: User;
  empresa: Company;
}

const RegistrationForm: React.FC = () => {
  const [current, setCurrent] = useState<number>(0);
  const [form] = Form.useForm<FormInstance<FormValues>>();
  const [sexo, setSexo] = useState<boolean>(true);

  const [formData, setFormData] = useState<FormValues>({
    usuario: {
      email: "",
      pass: "",
      nombres: "",
      apellidos: "",
      telefono: "",
      address: "",
      fecaNac: "",
      noDocumento: "",
      sexo: true,
      idEntidad: 0,
    },
    empresa: {
      id: 1,
      nombre: "",
      rnc: "",
      idArchivo: 0,
      foto: "default.png",
      direccion: "",
      telefono1: "",
      telefono2: "",
      email: "",
    },
  });

  const next = () => {
    form
      .validateFields()
      .then((values) => {
        setFormData((prevData) => ({
          ...prevData,
          ...values,
        }));
        setCurrent(current + 1);
      })
      .catch((errorInfo) => {
        console.error("Validation Failed:", errorInfo);
      });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = async (values: FormValues) => {
    // Merge final form values
    const finalValues = { ...formData, ...values };
    console.log("Form values:", finalValues);

    try {
      const response = await apiClient.post("/Account/Register", {
        body: JSON.stringify(finalValues),
      });

      console.log(response);
    } catch (error) {
      console.log(error);
      message.error("Registration Failed");
    }
  };

  const onSexoChange = (e: RadioChangeEvent) => {
    setSexo(e.target.value);
  };

  const steps = [
    {
      title: "Email y Contraseña",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={formData}
        >
          <Form.Item
            label="Email"
            name={["usuario", "email"]}
            rules={[{ required: true, message: "Por favor agrega un correo" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name={["usuario", "pass"]}
            rules={[
              { required: true, message: "Por favor agrega una contraseña" },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Información del Usuario",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={formData}
        >
          <Form.Item
            label="Nombre"
            name={["usuario", "nombres"]}
            rules={[{ required: true, message: "Por favor agrega tu nombre" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Apellido"
            name={["usuario", "apellidos"]}
            rules={[
              { required: true, message: "Por favor agrega tu apellido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Telefono"
            name={["usuario", "telefono"]}
            rules={[
              { required: true, message: "Por favor agrega tu teléfono" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Dirección"
            name={["usuario", "address"]}
            rules={[
              { required: true, message: "Por favor agrega tu dirección" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Fecha de Nacimiento"
            name={["usuario", "fecaNac"]}
            rules={[
              {
                required: true,
                message: "Por favor agrega tu fecha de nacimiento",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current > moment().endOf("day")
              }
            />
          </Form.Item>
          <Form.Item
            label="Documento"
            name={["usuario", "noDocumento"]}
            rules={[
              { required: true, message: "Por favor agrega tu documento" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sexo"
            name={["usuario", "sexo"]}
            rules={[
              { required: true, message: "Por favor selecciona tu sexo" },
            ]}
          >
            <Radio.Group onChange={onSexoChange} value={sexo}>
              <Radio value={true}>Masculino</Radio>
              <Radio value={false}>Femenino</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Información de la Compañia",
      content: (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={formData}
        >
          <Form.Item
            label="Nombre de la Compañía"
            name={["empresa", "nombre"]}
            rules={[
              {
                required: true,
                message: "Por favor agrega el nombre de la compañía",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="RNC"
            name={["empresa", "rnc"]}
            rules={[{ required: true, message: "Por favor agrega el RNC" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Correo de la Compañía"
            name={["empresa", "email"]}
            rules={[
              {
                required: true,
                message: "Por favor agrega el correo de la compañía",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Direccion"
            name={["empresa", "direccion"]}
            rules={[
              {
                required: true,
                message: "Por favor agrega el direccion",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Teléfono de la Compañía"
            name={["empresa", "telefono1"]}
            rules={[
              {
                required: true,
                message: "Por favor agrega el teléfono de la compañía",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Teléfono de la Compañía 2"
            name={["empresa", "telefono2"]}
            rules={[
              {
                required: true,
                message: "Por favor agrega el teléfono de la compañía",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      ),
    },
  ];

  return (
    <div className="form-container">
      <Steps current={current}>
        {steps.map((step) => (
          <Step key={step.title} title={step.title} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action" style={{ marginTop: 16 }}>
        {current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => form.submit()}>
            Submit
          </Button>
        )}
        {current > 0 && (
          <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
