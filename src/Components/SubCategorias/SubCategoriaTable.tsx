import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import {
  Subcategoria,
  updateSubcategoria,
} from "../../Redux/SubCategoriaSlice";

interface SubcategoriesTableProps {
  subcategories: any[]; // Change any to the correct type
  loading: boolean; // Change any to the correct type
}

const SubcategoriesTable: React.FC<SubcategoriesTableProps> = ({
  subcategories,
  loading,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState({});
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();

  const handleEdit = (subcategory: any) => {
    setSelectedSubcategory(subcategory);
    form.setFieldsValue(subcategory); // Populate form with current data
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleUpdate = async () => {
    if (selectedSubcategory) {
      // Check if selectedSubcategory is not null
      try {
        const values = await form.validateFields();
        const resultAction = await dispatch(
          updateSubcategoria({ ...(selectedSubcategory || {}), ...values }) // Safely spread
        );

        if (updateSubcategoria.fulfilled.match(resultAction)) {
          message.success("Subcategoría actualizada exitosamente");
          setIsModalVisible(false);
        } else {
          message.error("Error al actualizar la subcategoría");
        }
      } catch (error) {
        message.error("Error inesperado al actualizar la subcategoría");
      }
    } else {
      message.error("No subcategoría selected");
    }
  };

  const columns = [
    { title: "Descripción", dataIndex: "descripcion", key: "descripcion" },
    {
      title: "Habilitado",
      dataIndex: "enable",
      key: "enable",
      render: (val: unknown) => (val ? "Sí" : "No"),
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: unknown, record: Subcategoria) => (
        <Button type="primary" onClick={() => handleEdit(record)}>
          Editar
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        style={{ marginTop: "15px" }}
        columns={columns}
        dataSource={subcategories}
        scroll={{ x: 'max-content' }} 
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 8 }}
      />

      {/* Edit Modal */}
      <Modal
        title="Editar Subcategoría"
        open={isModalVisible}
        onCancel={handleCancel}
        onOk={handleUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="descripcion"
            label="Descripción"
            rules={[{ required: true, message: "Campo requerido" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default SubcategoriesTable;
