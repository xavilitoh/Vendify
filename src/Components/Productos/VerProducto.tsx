import React, { useEffect, useState } from "react";
import {
  Drawer,
  Row,
  Col,
  Divider,
  Spin,
  Table,
  Button,
  Modal,
  Select,
  InputNumber,
  Form,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import Barcode from "react-barcode";
import api from "../../Api/VendifyApi";
import { useSelector } from "react-redux";
import { selectUnidades } from "../../Redux/UnidadesSlice";
import { selectPrices } from "../../Redux/Price";
import { AxiosHeaders } from "axios";

import "./VerProducto.css";

const { Option } = Select;

interface Product {
  id: number;
  nombre: string;
  categoria: string;
  marca: string;
  subcategoria: string;
  unidad: string;
  idMarca: number;
  idCategoria: number;
  idSubcategoria: number;
  idUnidad: number;
  descripcion: string;
  stockMinimo: number;
  barCode: string;
  conImpuesto: boolean;
  precios: Price[];
}

interface Price {
  idUnidad: number;
  idPrecio: number;
  monto: number;
  fraccion: number;
}

interface ProductDetailsDrawerProps {
  productId: number | null;
  visible: boolean;
  onClose: () => void;
}

const ProductDetailsDrawer: React.FC<ProductDetailsDrawerProps> = ({
  productId,
  visible,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [priceEntries, setPriceEntries] = useState<Price[]>([]);
  const [isAddPriceModalVisible, setIsAddPriceModalVisible] = useState(false);
  const [isEditPriceModalVisible, setIsEditPriceModalVisible] = useState(false);
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [newPrice, setNewPrice] = useState<Price>({
    idUnidad: 0,
    idPrecio: 0,
    monto: 0,
    fraccion: 0,
  });

  const unidades = useSelector(selectUnidades);
  const precios = useSelector(selectPrices);

  useEffect(() => {
    if (productId && visible) {
      fetchProductDetails(productId);
    }
  }, [productId, visible]);

  const fetchProductDetails = async (id: number) => {
    setLoading(true);
    try {
      const response = await api.get<Product>(
        `https://vendify_api.wxbolab.com/api/Productos/${id}`
      );
      setProduct(response.data);
      setPriceEntries(response.data.precios || []);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const addPrice = async () => {
    if (!product) return;
    try {
      const response = await api.post(
        `https://vendify_api.wxbolab.com/api/Productos/AddPrecio/${product.id}`,
        {
          idUnidad: newPrice.idUnidad,
          idPrecio: newPrice.idPrecio,
          monto: newPrice.monto,
          fraccion: newPrice.fraccion,
        }
      );
      setPriceEntries((prev) => [...prev, response.data as Price]);
      setIsAddPriceModalVisible(false);
      setNewPrice({ idUnidad: 0, idPrecio: 0, monto: 0, fraccion: 0 });
    } catch (error) {
      console.error("Error adding price:", error);
    }
  };

  const editPrice = async () => {
    if (!product || !editingPrice) return;
    try {
      await api.put(
        `https://vendify_api.wxbolab.com/api/Productos/UpdatePrecio/${product.id}`,
        editingPrice
      );
      setPriceEntries((prev) =>
        prev.map((price) =>
          price.idUnidad === editingPrice.idUnidad &&
          price.idPrecio === editingPrice.idPrecio
            ? editingPrice
            : price
        )
      );
      setIsEditPriceModalVisible(false);
      setEditingPrice(null);
    } catch (error) {
      console.error("Error editing price:", error);
    }
  };

  const deletePrice = async (priceToDelete: Price) => {
    if (!product) return;
    try {
      await api.delete(
        `https://vendify_api.wxbolab.com/api/Productos/DeletePrecio/${product.id}`,
        {
          headers: new AxiosHeaders({ "Content-Type": "application/json" }),
          data: priceToDelete,
        }
      );

      setPriceEntries((prev) =>
        prev.filter(
          (price) =>
            !(
              price.idUnidad === priceToDelete.idUnidad &&
              price.idPrecio === priceToDelete.idPrecio
            )
        )
      );
    } catch (error) {
      console.error("Error deleting price:", error);
    }
  };

  const columns = [
    {
      title: "Unidad",
      dataIndex: "idUnidad",
      key: "idUnidad",
      render: (idUnidad: number) =>
        unidades.find((unidad) => unidad.id === idUnidad)?.descripcion || "N/A",
    },
    {
      title: "Precio",
      dataIndex: "idPrecio",
      key: "idPrecio",
      render: (idPrecio: number) =>
        precios.find((price) => price.id === idPrecio)?.descripcion || "N/A",
    },
    {
      title: "Monto",
      dataIndex: "monto",
      key: "monto",
    },
    {
      title: "Fracción",
      dataIndex: "fraccion",
      key: "fraccion",
    },
    {
      title: "Acciones",
      key: "actions",
      render: (_: any, record: Price) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => {
              setEditingPrice(record);
              setIsEditPriceModalVisible(true);
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Estás seguro de eliminar este precio?"
            onConfirm={() => deletePrice(record)} // Execute delete function on confirm
            okText="Sí"
            cancelText="No"
          >
            <Button type="primary" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Drawer
      width={640}
      placement="right"
      closable={true}
      onClose={onClose}
      open={visible}
    >
      {loading ? (
        <Spin size="large" />
      ) : (
        product && (
          <>
            <p style={{ fontSize: "25px", fontWeight: "600" }}>
              {product.nombre}
            </p>
            <Row>
              <Col span={12}>
                <p className="Titulos">Nombre:</p> {product.nombre}
              </Col>
              <Col span={12}>
                <p className="Titulos">Marca:</p> {product.marca}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <p className="Titulos">Categoría:</p> {product.categoria}
              </Col>
              <Col span={12}>
                <p className="Titulos">Subcategoría:</p> {product.subcategoria}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <p className="Titulos">Unidad:</p> {product.unidad}
              </Col>
              <Col span={12}>
                <p className="Titulos">Stock Mínimo:</p> {product.stockMinimo}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <p className="Titulos">Código de Barras:</p>
                <Barcode value={product.barCode || "-"} />
              </Col>
              <Col span={12}>
                <p className="Titulos">Con Impuesto:</p>
                {product.conImpuesto ? (
                  <Tag color="#87d068">Sí</Tag>
                ) : (
                  <Tag color="#f50">No</Tag>
                )}
              </Col>
            </Row>
            <Divider />
            <p style={{ fontSize: "25px", fontWeight: "600" }}>Precios</p>
            <Button
              type="primary"
              onClick={() => setIsAddPriceModalVisible(true)}
              style={{ marginBottom: "16px" }}
            >
              Agregar Precio
            </Button>
            <Table
              columns={columns}
              dataSource={priceEntries}
              rowKey={(record) => `${record.idUnidad}-${record.idPrecio}`}
              pagination={false}
            />
          </>
        )
      )}

      {/* Add Price Modal */}
      <Modal
        title="Agregar Precio"
        visible={isAddPriceModalVisible}
        onOk={addPrice}
        onCancel={() => setIsAddPriceModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item
            label="Unidad"
            rules={[
              { required: true, message: "Por favor selecciona una unidad" },
            ]}
          >
            <Select
              placeholder="Selecciona una unidad"
              onChange={(value) =>
                setNewPrice((prev) => ({ ...prev, idUnidad: value }))
              }
              value={newPrice.idUnidad || undefined}
            >
              {unidades.map((unidad) => (
                <Option key={unidad.id} value={unidad.id}>
                  {unidad.descripcion}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Precio"
            rules={[
              { required: true, message: "Por favor selecciona un precio" },
            ]}
          >
            <Select
              placeholder="Selecciona un precio"
              onChange={(value) =>
                setNewPrice((prev) => ({ ...prev, idPrecio: value }))
              }
              value={newPrice.idPrecio || undefined}
            >
              {precios.map((price) => (
                <Option key={price.id} value={price.id}>
                  {price.descripcion}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Monto">
            <InputNumber
              placeholder="Monto"
              style={{ width: "100%" }}
              onChange={(value) =>
                setNewPrice((prev) => ({ ...prev, monto: value || 0 }))
              }
              value={newPrice.monto || undefined}
            />
          </Form.Item>
          <Form.Item label="Fracción">
            <InputNumber
              placeholder="Fracción"
              style={{ width: "100%" }}
              onChange={(value) =>
                setNewPrice((prev) => ({ ...prev, fraccion: value || 0 }))
              }
              value={newPrice.fraccion || undefined}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Price Modal */}
      <Modal
        title="Editar Precio"
        visible={isEditPriceModalVisible}
        onOk={editPrice}
        onCancel={() => setIsEditPriceModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Monto">
            <InputNumber
              placeholder="Monto"
              style={{ width: "100%" }}
              value={editingPrice?.monto}
              onChange={(value) =>
                setEditingPrice((prev) =>
                  prev ? { ...prev, monto: value || 0 } : null
                )
              }
            />
          </Form.Item>
          <Form.Item label="Fracción">
            <InputNumber
              placeholder="Fracción"
              style={{ width: "100%" }}
              value={editingPrice?.fraccion}
              onChange={(value) =>
                setEditingPrice((prev) =>
                  prev ? { ...prev, fraccion: value || 0 } : null
                )
              }
            />
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  );
};

export default ProductDetailsDrawer;
