import React, { useEffect, useState } from "react";
import { Drawer, Row, Col, Divider, Spin, Table, Button,Tag,Space } from "antd";
import api from "../../Api/VendifyApi";
import './VerProducto.css';
import Barcode from "react-barcode"; // For traditional barcode


interface Product {
  id: number;
  nombre: string;
  categoria:string;
  marca:string;
  subcategoria:string;
  unidad:string
  idMarca: number;
  idCategoria: number;
  idSubcategoria: number;
  idUnidad: number;
  descripcion: string;
  stockMinimo: number;
  barCode: string;
  conImpuesto: boolean;
  precios: Price[]; // Adjusted type
}

interface Price {
  unidad: { descripcion: string } | null;
  precio: { descripcion: string } | null;
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

  console.log(product)

  useEffect(() => {
    if (productId && visible) {
      fetchProductDetails(productId);
    }
  }, [productId, visible]);

  const fetchProductDetails = async (id: number) => {
    setLoading(true);
    try {
      const response = await api.get<Product>(`https://vendify_api.wxbolab.com/api/Productos/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
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
      title: "Accion",
      dataIndex: "accion",
      key: "fraccion",
       render: () => (
        <>
          <Button   type="primary">Editar</Button>
          <Button
            color="danger" variant="solid"
            style={{ marginLeft: "10px" }}
          >
            Eliminar
          </Button>
        </>
      ),
    }
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
            <p
              className="site-description-item-profile-p"
              style={{ fontSize: '25px', fontWeight: '600' }}
            >
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
                <Space direction="vertical" align="center">
                  {/* QR Code */}
                  <Barcode value={product.barCode || "-"} />                
                  </Space>
              </Col>
              <Col span={12}>
                <p className="Titulos"> Con Impuesto:</p> {product.conImpuesto ? <Tag color="#87d068">Si</Tag> :  <Tag color="#f50">No</Tag>}
              </Col>
            </Row>
            <Divider />
            <p style={{ fontSize: '25px', fontWeight: '600' }}>Precios</p>
            <Table
              columns={columns}
              dataSource={product.precios}
              rowKey={( index) => index.toString()} // Ensures unique row keys
              pagination={false}
            />
          </>
        )
      )}
    </Drawer>
  );
};

export default ProductDetailsDrawer;
