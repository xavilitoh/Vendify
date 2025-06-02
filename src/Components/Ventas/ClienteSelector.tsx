import React from "react";
import { Form, Select } from "antd";
import { useSelector } from "react-redux";
import { selectClientesSelectList } from "../../Redux/Clientes";

const { Option } = Select;

const ClienteSelector: React.FC = () => {
  const clientes = useSelector(selectClientesSelectList);

  return (
    <Form.Item
      name="idCliente"
      label="Cliente"
      rules={[{ required: true, message: "Seleccione un cliente" }]}
    >
      <Select placeholder="Seleccione un cliente">
        {clientes.map((cliente: any) => (
          <Option key={cliente.id} value={cliente.id}>
            {cliente.value}
          </Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default ClienteSelector;
