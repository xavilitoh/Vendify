// components/CreateSubcategoryModal.tsx
import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { useSelector } from "react-redux";
import { selectCategoriesSelectList } from "../../Redux/CategorySlice";

interface CreateSubcategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: {
    descripcion: string;
    idCategoria: number;
    idEntidad: number;
  }) => void;
}

const CreateSubcategoryModal: React.FC<CreateSubcategoryModalProps> = ({
  visible,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const categories = useSelector(selectCategoriesSelectList);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(values);
        onSubmit(values);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation Failed:", info);
      });
  };

  return (
    <Modal
      title="Crear Subcategoría"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item
          name="descripcion"
          label="Descripción"
          rules={[
            { required: true, message: "Por favor ingrese una descripción" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="idCategoria"
          label="Categoría"
          rules={[{ required: true, message: "Seleccione una categoría" }]}
        >
          <Select placeholder="Seleccione una categoría">
            {categories.map((categoria) => (
              <Select.Option key={categoria.id} value={categoria.id}>
                {categoria.value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Crear
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSubcategoryModal;
