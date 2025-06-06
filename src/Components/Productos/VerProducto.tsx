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
  Space,
  Popconfirm,
  Image,
  Descriptions,
  Tabs,
  Typography,
} from "antd";
import Barcode from "react-barcode";
import api from "../../Api/VendifyApi";
import { useSelector } from "react-redux";
import { selectUnidades } from "../../Redux/UnidadesSlice";
import { selectPrices } from "../../Redux/Price";
import { AxiosHeaders } from "axios";

import "./VerProducto.css";

const { Option } = Select;
const { TabPane } = Tabs;
const BaseUrl = import.meta.env.VITE_APP_API_URL;
const { Title } = Typography;

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
  foto: string;
}

interface Price {
  idUnidad: number;
  idPrecio: number;
  monto: number;
  fraccion: number;
  id: number;
}

interface ProductDetailsDrawerProps {
  productId: number | null;
  visible: boolean;
  onClose: () => void;
}

const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

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
    id: 0,
  });

  const unidades = useSelector(selectUnidades);
  const precios = useSelector(selectPrices);
  const [width] = useWindowSize();
  const drawerWidth = width < 768 ? "100%" : width * 0.6;

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
      setNewPrice({ idUnidad: 0, idPrecio: 0, monto: 0, fraccion: 0, id: 0 });
    } catch (error) {
      console.error("Error adding price:", error);
    }
  };

  const editPrice = async () => {
    if (!product || !editingPrice) return;
    try {
      const updatedPrice = {
        idUnidad: editingPrice.idUnidad,
        idPrecio: editingPrice.idPrecio,
        monto: editingPrice.monto,
        fraccion: editingPrice.fraccion,
        idProducto: product.id,
        id: editingPrice.id,
      };

      await api.put(
        `https://vendify_api.wxbolab.com/api/Productos/UpdatePrecio/${updatedPrice.id}`,
        updatedPrice
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
            onConfirm={() => deletePrice(record)}
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
      width={drawerWidth}
      placement="right"
      closable
      onClose={onClose}
      open={visible}
      keyboard={true}
      title={<Title>{product?.nombre}</Title>}
    >
      <Row>
        <Col span={12}>
          <Image
            width={200}
            alt="Product Image"
            placeholder={
              <div
                style={{
                  width: 200,
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spin />
              </div>
            }
            src={product?.foto ? `${BaseUrl}/${product.foto}` : "default.jpg"}
          />
        </Col>
        <Divider type="vertical" orientation="center" />
        <Col span={6}>
          <Barcode value={product?.barCode || "-"} />
        </Col>
      </Row>
      {loading ? (
        <Spin size="large" />
      ) : (
        product && (
          <Tabs defaultActiveKey="1" type="card">
            <TabPane tab="Información" key="1">
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Marca">
                  {product.marca}
                </Descriptions.Item>
                <Descriptions.Item label="Categoria">
                  {product.categoria}
                </Descriptions.Item>
                <Descriptions.Item label="Subcategoria">
                  {product.subcategoria}
                </Descriptions.Item>
                <Descriptions.Item label="Unidad">
                  {product.unidad}
                </Descriptions.Item>
                <Descriptions.Item label="Stock Minimo">
                  {product.stockMinimo}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>

            <TabPane tab="Precios" key="2">
              <Button
                type="primary"
                onClick={() => setIsAddPriceModalVisible(true)}
                style={{ marginBottom: 16 }}
              >
                Agregar Precio
              </Button>
              <Table
                columns={columns}
                dataSource={priceEntries}
                rowKey={(record) => `${record.idUnidad}-${record.idPrecio}`}
                pagination={false}
              />
            </TabPane>
          </Tabs>
        )
      )}

      <Modal
        title="Agregar Precio"
        visible={isAddPriceModalVisible}
        onOk={addPrice}
        onCancel={() => setIsAddPriceModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Unidad">
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
          <Form.Item label="Precio">
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
              style={{ width: "100%" }}
              placeholder="Monto"
              onChange={(value) =>
                setNewPrice((prev) => ({ ...prev, monto: value || 0 }))
              }
              value={newPrice.monto}
            />
          </Form.Item>
          <Form.Item label="Fracción">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Fracción"
              onChange={(value) =>
                setNewPrice((prev) => ({ ...prev, fraccion: value || 0 }))
              }
              value={newPrice.fraccion}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Editar Precio"
        visible={isEditPriceModalVisible}
        onOk={editPrice}
        onCancel={() => setIsEditPriceModalVisible(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Monto">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Monto"
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
              style={{ width: "100%" }}
              placeholder="Fracción"
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
