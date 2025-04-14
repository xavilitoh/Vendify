import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Switch, Button } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { fetchCategoriesSelectList } from "../../Redux/CategorySlice";

interface CreateSubcategoriaFormValues {
  descripcion: string;
  iCategoria: number;
  enable: boolean;
}

interface CreateSubcategoriaModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateSubcategoriaFormValues) => void;
  categories: { id: number; descripcion: string; enable: boolean }[]; // Pass available categories
}

const CreateSubcategoriaModal: React.FC<CreateSubcategoriaModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  categories,
}) => {
  const [form] = Form.useForm();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCategoriesSelectList());
  }, [dispatch]);

  return (
    <Modal
      title="Crear Subcategoría"
      visible={visible}
      onCancel={() => {
        onCancel();
        form.resetFields();
      }}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Crear
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values as CreateSubcategoriaFormValues);
          form.resetFields();
        }}
      >
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[
            { required: true, message: "Por favor ingrese una descripción" },
          ]}
        >
          <Input placeholder="Ingrese la descripción" />
        </Form.Item>
        <Form.Item
          label="Categoría"
          name="iCategoria"
          rules={[{ required: true, message: "Seleccione una categoría" }]}
        >
          <Select placeholder="Seleccione una categoría">
            {categories.map((category) => (
              <Select.Option key={category.id} value={category.id}>
                {category.descripcion}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Habilitado" name="enable" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateSubcategoriaModal;
