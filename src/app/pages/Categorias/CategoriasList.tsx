import React, { useEffect, useState } from "react";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { Table, Button, Modal, Form, Space, Popconfirm } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategorias,
  createCategoria,
  updateCategoria,
  selectAllCategorias,
  getCategoriasStatus,
  getCategoriasError,
} from "../../../Redux/Features/Categorias/CategoriaSlice";
import { AppDispatch } from "../../../Redux/Store";
import CrearCategoria from "./CrearCategoria";
import EditarCategoria from "./EditarCategorias";

interface Categoria {
  id: number;
  descripcion: string;
}

const CategoriasList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categorias = useSelector(selectAllCategorias);
  const status = useSelector(getCategoriasStatus);
  const error = useSelector(getCategoriasError);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<Categoria | null>(
    null
  );
  const [form] = Form.useForm();

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategorias());
    }
  }, [status, dispatch]);

  const showCreateModal = () => {
    setSelectedCategoria(null);
    form.resetFields();
    setIsModalVisible(true);
  };
  const showEditModal = (categoria: Categoria) => {
    setSelectedCategoria(categoria);
    form.setFieldsValue(categoria);
    setIsModalVisibleEdit(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      if (selectedCategoria) {
        const updatedCategoria = { ...selectedCategoria, ...values };
        dispatch(updateCategoria(updatedCategoria));
      } else {
        dispatch(createCategoria(values));
      }
      setIsModalVisible(false);
    });
  };

  const handleOkEdit = () => {
    form.validateFields().then((values) => {
      if (selectedCategoria) {
        const updatedCategoria = { ...selectedCategoria, ...values };
        dispatch(updateCategoria(updatedCategoria));
      } else {
        dispatch(createCategoria(values));
      }
      setIsModalVisibleEdit(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancelEdit = () => {
    setIsModalVisibleEdit(false);
  };
  return (
    <>
      <ToolbarWrapper />
      <Content>
        <Button
          type="primary"
          onClick={showCreateModal}
          style={{ marginBottom: 16 }}
        >
          Crear Categoría
        </Button>
        <Table
          dataSource={categorias}
          rowKey="id"
          columns={[
            {
              title: "Descripción",
              dataIndex: "descripcion",
              key: "descripcion",
            },
            {
              title: "Acciones",
              dataIndex: "id",
              key: "acciones",
              render: (i, categoria) => (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => showEditModal(categoria)}
                  >
                    Editar
                  </Button>
                  <Popconfirm
                    onConfirm={() => alert("Hola")}
                    title="Borrar Categoria"
                    description="Seguro de que quieres eliminar este registro"
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" danger>
                      Eliminar
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />
        <Modal
          title={selectedCategoria ? "Editar Categoría" : "Crear Categoría"}
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <CrearCategoria form={form} />
        </Modal>
        <Modal
          title={selectedCategoria ? "Editar Categoría" : "Crear Categoría"}
          visible={isModalVisibleEdit}
          onOk={handleOkEdit}
          onCancel={handleCancelEdit}
        >
          <EditarCategoria form={form} categoria={selectedCategoria} />
        </Modal>
        {status === "loading" && <p>Cargando...</p>}
        {status === "failed" && <p>{error}</p>}
      </Content>
    </>
  );
};

export { CategoriasList };
