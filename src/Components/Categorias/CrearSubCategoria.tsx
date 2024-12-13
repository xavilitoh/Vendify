import React, { useEffect, useRef, useState } from "react";
import { Modal, Form, Input, Button, Tag, Tooltip, InputRef } from "antd";
import { PlusOutlined } from "@ant-design/icons";

interface Subcategory {
  id: number;
  descripcion: string;
}

interface CreateSubcategoryFormValues {
  descripcion: string;
}

interface CreateSubcategoryModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateSubcategoryFormValues) => void;
  subcategories: Subcategory[]; // List of existing subcategories
}

const CreateSubcategoriaModal: React.FC<CreateSubcategoryModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  subcategories,
}) => {
  const [form] = Form.useForm();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (visible) {
      setTags(subcategories.map((sub) => sub.descripcion)); // Load existing subcategories
    }
  }, [visible, subcategories]);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && !tags.includes(inputValue)) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue("");
  };

  return (
    <Modal
      title="Gestionar Subcategorías"
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
      <div >
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
        {inputVisible ? (
          <Input
            ref={inputRef}
            type="text"
            size="small"
            style={{ width: 100 }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        ) : (
          <Tag
            onClick={() => setInputVisible(true)}
            style={{ background: "#fff", borderStyle: "dashed" }}
          >
            <PlusOutlined /> Nueva Categoria
          </Tag>
        )}
      </div>

   {/*    <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onSubmit(values as CreateSubcategoryFormValues);
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
      </Form> */}
    </Modal>
  );
};

export default CreateSubcategoriaModal;
