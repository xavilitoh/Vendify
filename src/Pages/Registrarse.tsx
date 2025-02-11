import React, { useState } from "react";
import {
  Steps,
  Form,
  Input,
  Button,
  message,
  Radio,
  DatePicker,
  Upload,
} from "antd";
import type { RadioChangeEvent } from "antd";
import "./Registrarse.css";
import moment from "moment";
import apiClient from "../Api/VendifyApi";
import { useNavigate } from "react-router-dom";
import {
  formatPhoneNumber,
  formatNoDocumento,
} from "../Components/Utils/Validators";
import axios from "axios";
const { Step } = Steps;

interface Usuario {
  email: string;
  pass: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  address: string;
  fecaNac: string;
  noDocumento: string;
  sexo: boolean;
}

interface Empresa {
  nombre: string;
  rnc: string;
  foto: string;
  direccion: string;
  telefono1: string;
  telefono2: string;
  email: string;
}

interface RegistrarseProps {
  isDarkMode: boolean;
}

interface FormValues {
  usuario: Usuario;
  empresa: Empresa;
}

const RegistrationForm: React.FC<RegistrarseProps> = () => {
  const [current, setCurrent] = useState<number>(0);
  const [form] = Form.useForm<FormValues>(); // No necesitas FormInstance<FormValues>
  const [sexo, setSexo] = useState<boolean>(true);
  const navigate = useNavigate();

  const handlePhotoChange = (info: any) => {
    console.log(info);

    const file = info.file.originFileObj || info.file;

    if (file instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData((prevData) => ({
          ...prevData,
          empresa: {
            ...prevData.empresa,
            foto: base64String,
          },
        }));
      };
      reader.readAsDataURL(file);
    } else {
      console.error("Error subiendo la Imagen");
    }
  };

  const handleNoDocumentoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNoDocumento(e.target.value);

    form.setFieldsValue({
      usuario: {
        ...form.getFieldValue("usuario"), // Keep existing values
        noDocumento: formattedValue, // Update formatted value
      },
    });
  };

  const handleCompanyPhoneChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const formattedValue = formatPhoneNumber(e.target.value);

    form.setFieldsValue({
      empresa: {
        ...form.getFieldValue("empresa"), // Keep other company fields unchanged
        [field]: formattedValue, // Update the correct field (telefono1 or telefono2)
      },
    });
  };

  const validateAge = (_: any, value: moment.Moment | null) => {
    if (!value) {
      return Promise.reject("Por favor selecciona una fecha válida");
    }

    const birthDate = new Date(value.toISOString()); // Convert to JS Date
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't happened yet this year
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 18
      ? Promise.resolve()
      : Promise.reject("Debes tener al menos 18 años de edad");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    if (e.target.id === "empresa_telefono1") {
      form.setFieldsValue({
        usuario: {
          ...form.getFieldValue("empresa"),
          telefono1: formattedValue,
        },
      });
    }

    form.setFieldsValue({
      usuario: {
        ...form.getFieldValue("usuario"), // Keep existing values
        telefono: formattedValue, // Update only telefono
      },
    });
  };

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
    },
    empresa: {
      nombre: "",
      rnc: "",
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
          usuario: {
            ...prevData.usuario,
            ...values.usuario,
          },
          empresa: {
            ...prevData.empresa,
            ...values.empresa,
          },
        }));
        setCurrent(current + 1);
      })
      .catch((errorInfo) => {
        console.error("Falló en validación:", errorInfo);
      });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = async (values: FormValues) => {
    const finalValues = { ...formData, ...values };

    if (finalValues.usuario.fecaNac) {
      finalValues.usuario.fecaNac = moment(finalValues.usuario.fecaNac).format(
        "YYYY-MM-DD"
      );
      finalValues.empresa.foto = "string";
    }

    try {
      console.log(finalValues);
      const response = await apiClient.post("/Account/Register", finalValues);
      console.log("Success Response:", response);

      message.success("Usuario Registrado con éxito", 3);
      navigate("/usuarios");
    } catch (error) {
      console.error("Caught Error:", error);

      if (axios.isAxiosError(error)) {
        console.error("Axios Error Details:", error.response); // Debugging

        message.error(
          error.response?.data?.message || "Error al registrar el usuario",
          3
        );
      } else if (error instanceof Error) {
        console.error("JavaScript Error:", error.message);
        message.error(error.message || "Ocurrió un error desconocido", 3);
      } else {
        console.error("Unexpected Error Type:", error);
        message.error("Error inesperado", 3);
      }
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
            rules={[
              { required: true, message: "Por favor agrega un correo" },
              { type: "email", message: "Por favor ingresa un correo válido" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name={["usuario", "pass"]}
            rules={[
              { required: true, message: "Por favor agrega una contraseña" },
              {
                min: 8,
                message: "La contraseña debe tener al menos 8 caracteres",
              },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
                message:
                  "Debe contener al menos una letra, un número y un carácter especial",
              },
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
            <Input min={2} />
          </Form.Item>
          <Form.Item
            label="Apellido"
            name={["usuario", "apellidos"]}
            rules={[
              { required: true, message: "Por favor agrega tu apellido" },
            ]}
          >
            <Input min={2} />
          </Form.Item>
          <Form.Item
            label="Telefono"
            name={["usuario", "telefono"]}
            rules={[
              { required: true, message: "Por favor agrega tu teléfono" },
              {
                pattern: /^\d{3}-\d{3}-\d{4}$/,
                message: "El teléfono debe estar en formato 809-430-5241",
              },
            ]}
          >
            <Input onChange={handlePhoneChange} maxLength={12} />
          </Form.Item>
          <Form.Item label="Dirección" name={["usuario", "address"]}>
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
              {
                validator: validateAge, // Custom validator function
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item
            label="Documento"
            name={["usuario", "noDocumento"]}
            rules={[
              { required: true, message: "Por favor agrega tu documento" },
              {
                message: "El documento debe estar en formato 000-000000-0",
              },
            ]}
          >
            <Input maxLength={13} onChange={handleNoDocumentoChange} />
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
              {
                pattern: /^\d{3}-\d{3}-\d{4}$/,
                message: "El teléfono debe estar en formato 809-430-5241",
              },
            ]}
          >
            <Input
              onChange={(e) => handleCompanyPhoneChange(e, "telefono1")}
              maxLength={12}
            />
          </Form.Item>
          <Form.Item
            label="Teléfono de la Compañía 2"
            name={["empresa", "telefono2"]}
            dependencies={["empresa", "telefono1"]} // Ensure this field depends on telefono1
            rules={[
              {
                required: true,
                message: "Por favor agrega el teléfono de la compañía",
              },
              {
                pattern: /^\d{3}-\d{3}-\d{4}$/,
                message: "El teléfono debe estar en formato 809-430-5241",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (
                    value &&
                    value === getFieldValue(["empresa", "telefono1"])
                  ) {
                    return Promise.reject(
                      "Los teléfonos no pueden ser iguales"
                    );
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input
              onChange={(e) => handleCompanyPhoneChange(e, "telefono2")}
              maxLength={12}
            />
          </Form.Item>
          <Form.Item
            label="Foto de la Compañía"
            name={["empresa", "foto"]}
            rules={[
              {
                required: true,
                message: "Por favor agrega la foto de la compañía",
              },
            ]}
          >
            <Upload
              showUploadList={false}
              onChange={handlePhotoChange}
              beforeUpload={() => false}
            >
              <Button>Subir Photo</Button>
            </Upload>
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
            Siguiente
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button type="primary" onClick={() => form.submit()}>
            Cargar
          </Button>
        )}
        {current > 0 && (
          <Button style={{ marginLeft: 8 }} onClick={() => prev()}>
            Anterior
          </Button>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
