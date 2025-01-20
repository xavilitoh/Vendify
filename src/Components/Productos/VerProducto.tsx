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
  Input,
  Space,
  Tag,
} from "antd";
import Barcode from "react-barcode";
import api from "../../Api/VendifyApi";
import "./VerProducto.css";

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
  const [editingPrice, setEditingPrice] = useState<Price | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = async (price: Price) => {
    if (!product) return;

    try {
      await api.put(
        `https://vendify_api.wxbolab.com/api/Productos/UpdatePrecio/${product.id}`,
        {
          idUnidad: price.idUnidad,
          idPrecio: price.idPrecio,
          idProducto: product.id,
          monto: price.monto,
          fraccion: price.fraccion,
        }
      );

      setProduct((prev) =>
        prev
          ? {
              ...prev,
              precios: prev.precios.map((p) =>
                p.idUnidad === price.idUnidad && p.idPrecio === price.idPrecio
                  ? { ...p, monto: price.monto, fraccion: price.fraccion }
                  : p
              ),
            }
          : null
      );
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error updating price:", error);
    }
  };

  const deletePrice = async (price: Price) => {
    if (!product) return;

    try {
      await api.delete(
        `https://vendify_api.wxbolab.com/api/Productos/DeletePrecio/${product.id}`
      );

      setProduct((prev) =>
        prev
          ? {
              ...prev,
              precios: prev.precios.filter(
                (p) =>
                  !(
                    p.idUnidad === price.idUnidad &&
                    p.idPrecio === price.idPrecio
                  )
              ),
            }
          : null
      );
    } catch (error) {
      console.error("Error deleting price:", error);
    }
  };

  const handleSave = () => {
    if (editingPrice) {
      updatePrice(editingPrice);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingPrice(null);
  };

  const handleDelete = (price: Price) => {
    Modal.confirm({
      title: "¿Estás seguro de eliminar este precio?",
      content: "Esta acción no se puede deshacer.",
      okText: "Sí",
      okType: "danger",
      cancelText: "No",
      onOk: () => deletePrice(price),
    });
  };

  const columns = [
    {
      title: "Unidad",
      dataIndex: ["unidad", "descripcion"],
      key: "unidad",
      render: (text: string) => text || "N/A",
    },
    {
      title: "Precio",
      dataIndex: ["precio", "descripcion"],
      key: "precio",
      render: (text: string) => text || "N/A",
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
      title: "Acción",
      key: "accion",
      render: (record: Price) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingPrice(record);
              setIsModalVisible(true);
            }}
          >
            Editar
          </Button>
          <Button danger onClick={() => handleDelete(record)}>
            Eliminar
          </Button>
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
              Detalles del Producto
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
              <Col span={24}>
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
            <Table
              columns={columns}
              dataSource={product.precios}
              rowKey={(_, index) => (index ?? 0).toString()}
              pagination={false}
            />
            <Modal
              title="Editar Precio"
              visible={isModalVisible}
              onOk={handleSave}
              onCancel={handleCancel}
            >
              <div>
                <p>Monto:</p>
                <Input
                  value={editingPrice?.monto}
                  onChange={(e) =>
                    setEditingPrice((prev) =>
                      prev
                        ? { ...prev, monto: parseFloat(e.target.value) || 0 }
                        : null
                    )
                  }
                />
              </div>
              <div>
                <p>Fracción:</p>
                <Input
                  value={editingPrice?.fraccion}
                  onChange={(e) =>
                    setEditingPrice((prev) =>
                      prev
                        ? { ...prev, fraccion: parseFloat(e.target.value) || 0 }
                        : null
                    )
                  }
                />
              </div>
            </Modal>
          </>
        )
      )}
    </Drawer>
  );
};

export default ProductDetailsDrawer;
