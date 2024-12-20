import React, { useEffect, useState } from "react";
import { Modal, Form, Input, InputNumber, Switch, Select, Button } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Store";

const { Option } = Select;

interface CreateProductFormValues {
  idMarca: number;
  idCategoria: number;
  idSubcategoria: number;
  descripcion: string;
  stockMinimo: number;
  barCode: string;
  conImpuesto: boolean;
}

interface CreateProductModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateProductFormValues) => void;
  marcas: { id: number; descripcion: string }[];
  categorias: { id: number; descripcion: string }[];
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  marcas,
  categorias,
}) => {
  const [form] = Form.useForm();
  const [filteredSubcategorias, setFilteredSubcategorias] = useState<
    { id: number; idCategoria: number; descripcion: string }[]
  >([]);

  // Obtener las subcategorías desde el estado global
  const subcategorias = useSelector(
    (state: RootState) => state.subCategorias.subcategorias
  );

  // Filtrar subcategorías basado en la categoría seleccionada
  const handleCategoryChange = (idCategoria: number) => {
    const filtered = subcategorias.filter((sub) => sub.iCategoria === idCategoria);
    console.log(filtered)
    form.setFieldsValue({ idSubcategoria: undefined }); // Resetear selección de subcategoría
  };

  useEffect(() => {
    if (!visible) {
      setFilteredSubcategorias([]); // Resetear cuando el modal se cierra
    }
  }, [visible]);

  return (
    <Modal
      title="Crear Producto"
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
          onSubmit(values as CreateProductFormValues);
          form.resetFields();
        }}
      >
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: "Por favor ingrese una descripción" }]}
        >
          <Input placeholder="Ingrese la descripción" />
        </Form.Item>

        <Form.Item
          label="Marca"
          name="idMarca"
          rules={[{ required: true, message: "Seleccione una marca" }]}
        >
          <Select placeholder="Seleccione una marca">
            {marcas.map((marca) => (
              <Option key={marca.id} value={marca.id}>
                {marca.descripcion}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Categoría"
          name="idCategoria"
          rules={[{ required: true, message: "Seleccione una categoría" }]}
        >
          <Select placeholder="Seleccione una categoría" onChange={handleCategoryChange}>
            {categorias.map((cat) => (
              <Option key={cat.id} value={cat.id}>
                {cat.descripcion}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Subcategoría"
          name="idSubcategoria"
          rules={[{ required: true, message: "Seleccione una subcategoría" }]}
        >
          <Select placeholder="Seleccione una subcategoría">
            {filteredSubcategorias.map((sub) => (
              <Option key={sub.id} value={sub.id}>
                {sub.descripcion}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Código de Barras"
          name="barCode"
          rules={[{ required: true, message: "Ingrese un código de barras" }]}
        >
          <Input placeholder="Ingrese el código de barras" />
        </Form.Item>

        <Form.Item
          label="Stock Mínimo"
          name="stockMinimo"
          rules={[{ required: true, message: "Ingrese el stock mínimo" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Con Impuesto" name="conImpuesto" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProductModal;
