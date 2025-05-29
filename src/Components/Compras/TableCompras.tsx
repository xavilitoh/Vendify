import React, { useState } from "react";
import { Table, Button, Drawer } from "antd";
import { Compra } from "../../Redux/Compras";
import VerCompras from "./VerCompras";
import { getFormatedCurrency } from "../Utils/CurrencyFunctinos";
import moment from "moment";

interface TableComprasProps {
  compras: Compra[];
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
  loading: boolean;
}

const TableCompras: React.FC<TableComprasProps> = ({
  compras,
  total,
  currentPage,
  pageSize,
  onPageChange,
  loading,
}) => {
  const [visible, setVisible] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);

  const handleOpen = (compra: Compra) => {
    setSelectedCompra(compra);
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
    setSelectedCompra(null);
  };

  const columns = [
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "factura",
    },
    {
      title: "Fecha",
      dataIndex: "fechaFactura",
      key: "fechaFactura",
      render: (total: number) => moment(total).format("DD/MM/YYYY"),
    },
    {
      title: "Proovedor",
      key: "descripcion",
      render: (_: any, record: Compra) =>
        record.proveedor?.descripcion || "N/A",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => getFormatedCurrency(total),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (_: any, record: Compra) => (
        <Button onClick={() => handleOpen(record)}>Ver</Button>
      ),
    },
  ];


  return (
    <>
      <Table
        columns={columns}
        dataSource={compras}
        rowKey={(record) => record.id.toString()}
        scroll={{ x: 'max-content' }} 
        pagination={{
          current: currentPage,
          pageSize,
          total,
          onChange: onPageChange,
        }}
        loading={loading}
      />

      <Drawer
        title="Detalles de la Compra"
        open={visible}
        onClose={handleClose}
        width={1000}
      >
        {selectedCompra && <VerCompras compra={selectedCompra} />}
      </Drawer>
    </>
  );
};

export default TableCompras;
