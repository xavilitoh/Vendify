import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Select,
  Steps,
  Table,
  message,
  Upload,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, fetchProducts } from "../../Redux/Productos";
import { selectSubcategorias } from "../../Redux/SubCategoriaSlice";
import { selectMarcas } from "../../Redux/MarcasSlice";
import { selectPrices } from "../../Redux/Price";
import { selectUnidades } from "../../Redux/UnidadesSlice";
import { AppDispatch } from "../../Redux/Store";
import { Subcategoria } from "../../Redux/SubCategoriaSlice";
import { selectCategoriesSelectList } from "../../Redux/CategorySlice";

interface CreateProductModalProps {
  visible: boolean;
  onClose: () => void;
  onCategoryChange: (categoryId: number) => void;
  filteredSubcategories: Subcategoria[];
}

const { Option } = Select;
const { Step } = Steps;

const CreateProductModal: React.FC<CreateProductModalProps> = ({
  visible,
  onClose,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [productData, setProductData] = useState<any>({});
  const [priceEntries, setPriceEntries] = useState<any[]>([]);
  const categories = useSelector(selectCategoriesSelectList);
  const allSubcategories = useSelector(selectSubcategorias);
  const marcas = useSelector(selectMarcas);
  const prices = useSelector(selectPrices);
  const unidades = useSelector(selectUnidades);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [foto, setImageData] = useState<string | null>(null); // This will hold the base64 image data

  const [filteredSubcategories, setFilteredSubcategories] = useState<
    Subcategoria[]
  >([]);

  useEffect(() => {}, [dispatch]);

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false; // Prevent upload
    }

    // Convert image to base64 and set it to state
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;

      const cleanedBase64 = base64String.replace(
        /^data:image\/[a-z]+;base64,/,
        ""
      );

      setImageUrl(base64String); // For displaying image
      setImageData(cleanedBase64); // For saving Base64 data
    };
    reader.readAsDataURL(file); // Convert the file to Base64
    return false; // Don't upload to server, since we handle it locally
  };

  // Handle the file change (upload, error, etc.)
  const handleUploadChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
    }
    if (info.file.status === "error") {
      message.error("Image upload failed.");
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: number) => {
    const filtered = allSubcategories.filter(
      (subcategory) => subcategory.idCategoria === categoryId
    );

    setFilteredSubcategories(filtered);
    form.setFieldsValue({ idSubcategoria: undefined });
  };

  const handleNext = async () => {
    try {
      const values = await form.validateFields();
      setProductData({ ...productData, ...values });
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleAddPrice = async () => {
    try {
      const priceData = await form.validateFields([
        "IdUnidad",
        "IdPrecio",
        "Monto",
        "Fraccion",
      ]);
      setPriceEntries([...priceEntries, { ...priceData, IdProducto: 0 }]);
      form.resetFields(["IdUnidad", "IdPrecio", "Monto", "Fraccion"]);
    } catch (error) {
      console.error("Validation failed for price entry:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      let productValues = await form.validateFields([
        "idMarca",
        "idCategoria",
        "idSubcategoria",
        "idUnidad",
        "descripcion",
        "stockMinimo",
        "barCode",
        "conImpuesto",
      ]);

      if (priceEntries.length === 0) {
        throw new Error("Debe agregar al menos un precio.");
      }

      if (!productValues.idSubcategoria) {
        productValues = { ...productValues, idSubcategoria: 0 };
      }

      const finalData = {
        ...productData,
        ...productValues,
        precios: priceEntries,
        foto,
      };

      console.log(finalData);

      await dispatch(createProduct(finalData)).unwrap();

      await dispatch(fetchProducts({ page: 1, pageSize: 10 }));

      form.resetFields();
      setProductData({});
      setPriceEntries([]);
      setCurrentStep(0);
      onClose();
      message.success("Producto Creado Exitosamente");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al crear el producto", error.message);
        message.error("Error al crear el producto");
      } else {
        console.log(error);
        console.error("Unexpected error:", error);
        message.error("Error al crear el producto");
      }
    }
  };

  return (
    <Modal
      title="Crear Producto"
      width={600}
      visible={visible}
      onCancel={() => {
        setCurrentStep(0);
        setProductData({});
        setPriceEntries([]);
        form.resetFields();
        onClose();
      }}
      footer={null}
    >
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        <Step title="Datos Iniciales" />
        <Step title="Detalles del Producto" />
        <Step title="Precios" />
      </Steps>

      <Form form={form} layout="vertical">
        {currentStep === 0 && (
          <>
            <Form.Item
              name="idMarca"
              label="Marca"
              rules={[
                { required: true, message: "Por favor selecciona una marca" },
              ]}
            >
              <Select placeholder="Selecciona una marca">
                {marcas.map((marca) => (
                  <Option key={marca.id} value={marca.id}>
                    {marca.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="idCategoria"
              label="Categoría"
              rules={[
                {
                  required: true,
                  message: "Por favor selecciona una categoría",
                },
              ]}
            >
              <Select
                placeholder="Selecciona una categoría"
                onChange={(value) => handleCategoryChange(value)}
              >
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    {category.value}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="idSubcategoria"
              label="Subcategoría"
              /*     rules={[
                {
                  required: true,
                  message: "Por favor selecciona una subcategoría",
                },
              ]} */
            >
              <Select placeholder="Selecciona una subcategoría">
                {filteredSubcategories.map((subcategory) => (
                  <Option key={subcategory.id} value={subcategory.id}>
                    {subcategory.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="idUnidad"
              label="Unidad"
              rules={[
                { required: true, message: "Por favor selecciona una unidad" },
              ]}
            >
              <Select placeholder="Selecciona una unidad">
                {unidades.map((unidad) => (
                  <Option key={unidad.id} value={unidad.id}>
                    {unidad.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item
              name="descripcion"
              label="Descripción"
              rules={[
                { required: true, message: "Por favor ingresa la descripción" },
              ]}
            >
              <Input placeholder="Ingrese la descripción" />
            </Form.Item>
            <Form.Item
              name="stockMinimo"
              label="Stock Mínimo"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el stock mínimo",
                },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Ingrese la cantidad"
              />
            </Form.Item>
            <Form.Item
              name="barCode"
              label="Código de Barras"
              rules={[
                {
                  required: true,
                  message: "Por favor ingresa el código de barras",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="conImpuesto"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox>Con Impuesto</Checkbox>
            </Form.Item>
            <Form.Item
              name="image"
              label="Imagen"
              rules={[{ required: true, message: "Por favor sube una imagen" }]}
            >
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleUploadChange}
                maxCount={1} // Only allow 1 image to be uploaded
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Image" style={{ width: "100%" }} />
                ) : (
                  <div>
                    {loading ? <Spin /> : <UploadOutlined />}
                    <div>Subir Imagen</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Form.Item
              name="IdUnidad"
              label="Unidad"
              rules={[
                { required: true, message: "Por favor selecciona una unidad" },
              ]}
            >
              <Select placeholder="Selecciona una unidad">
                {unidades.map((unidad) => (
                  <Option key={unidad.id} value={unidad.id}>
                    {unidad.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="IdPrecio"
              label="Precio"
              rules={[
                { required: true, message: "Por favor selecciona un precio" },
              ]}
            >
              <Select placeholder="Selecciona un precio">
                {prices.map((price) => (
                  <Option key={price.id} value={price.id}>
                    {price.descripcion}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="Monto"
              label="Monto"
              rules={[
                { required: true, message: "Por favor ingresa el monto" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item
              name="Fraccion"
              label="Fracción"
              rules={[
                { required: true, message: "Por favor ingresa la fracción" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Button type="primary" onClick={handleAddPrice}>
              Agregar Precio
            </Button>
            <Table
              dataSource={priceEntries}
              columns={[
                { title: "Unidad", dataIndex: "IdUnidad", key: "IdUnidad" },
                { title: "Precio", dataIndex: "IdPrecio", key: "IdPrecio" },
                { title: "Monto", dataIndex: "Monto", key: "Monto" },
                { title: "Fracción", dataIndex: "Fraccion", key: "Fraccion" },
              ]}
              rowKey={(record) => `${record.IdUnidad}-${record.IdPrecio}`}
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </Form>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 24,
        }}
      >
        {currentStep > 0 && <Button onClick={handlePrevious}>Anterior</Button>}
        {currentStep < 2 && (
          <Button type="primary" onClick={handleNext}>
            Siguiente
          </Button>
        )}
        {currentStep === 2 && (
          <Button type="primary" onClick={handleSubmit}>
            Crear
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default CreateProductModal;
