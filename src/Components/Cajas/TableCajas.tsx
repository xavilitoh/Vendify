import React from "react";
import { Table } from "antd";
import { useSelector } from "react-redux";
import { selectCajas } from "../../Redux/Cajas.";
import moment from "moment";
interface TableCajasProps {
  loading: boolean;
  total: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number, pageSize?: number) => void;
}

const TableCajas: React.FC<TableCajasProps> = ({
  loading,
  total,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const cajas = useSelector(selectCajas);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Sucursal", dataIndex: "idSucursal", key: "idSucursal" },
    {
      title: "Caja Estación",
      dataIndex: "idCajaEstacion",
      key: "idCajaEstacion",
    },
    { title: "Usuario", dataIndex: "idUsuario", key: "idUsuario" },
    {
      title: "Monto Apertura",
      dataIndex: "montoApertura",
      key: "montoApertura",
    },
    { title: "Monto Cierre", dataIndex: "montoCierre", key: "montoCierre" },
    {
      title: "Total Efectivo",
      dataIndex: "totalEfectivo",
      key: "totalEfectivo",
    },
    { title: "Total Tarjeta", dataIndex: "totalTarjeta", key: "totalTarjeta" },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    {
      title: "Fecha Apertura",
      dataIndex: "fechaApertura",
      key: "fechaApertura",
      render: (fecha: string | null) =>
        fecha ? moment(fecha).format("YYYY-MM-DD HH:mm") : "N/A",
    },
    {
      title: "Fecha Cierre",
      dataIndex: "fechaCierre",
      key: "fechaCierre",
      render: (fecha: string | null) =>
        fecha ? moment(fecha).format("YYYY-MM-DD HH:mm") : "N/A",
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={cajas}
      loading={loading}
      scroll={{ x: "max-content" }}
      pagination={{
        current: currentPage,
        pageSize: pageSize,
        total: total,
        onChange: onPageChange,
      }}
      rowKey="id"
    />
  );
};

export default TableCajas;
