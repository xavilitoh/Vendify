import React from "react";
import { Compra } from "../../Redux/Compras";
import { Descriptions, Divider, Table } from "antd";
import { getFormatedCurrency } from "../Utils/CurrencyFunctinos";
import moment from "moment";

interface VerComprasProps {
  compra: Compra;
}

const VerCompras: React.FC<VerComprasProps> = ({ compra }) => {
  const columns = [
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "factura",
    },
    {
      title: "cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Precio",
      dataIndex: "precio",
      key: "precio",
      render: (total: number) => getFormatedCurrency(total),
    },
    {
        title: "Total",
        dataIndex: "total",
        key: "precio",
        render: (total: number) => getFormatedCurrency(total),
      },
  ];
  return (
    <div>
      <Descriptions title={`${compra.descripcion}`} bordered column={1}>

        <Descriptions.Item label="Factura">{compra.factura}</Descriptions.Item>
        <Descriptions.Item label="Fecha Factura">
          {moment(compra.fechaFactura).format("DD/MM/YYYY")}
        </Descriptions.Item>
        {
          <Descriptions.Item label="Total">
            {getFormatedCurrency(compra.total)}
          </Descriptions.Item>
        }
      </Descriptions>
      <Divider />
      <Table
        columns={columns}
        dataSource={compra.detalleDeCompras}
        pagination={false}
      />
    </div>
  );
};

export default VerCompras;
