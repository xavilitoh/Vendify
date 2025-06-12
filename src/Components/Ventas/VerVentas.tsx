import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  fetchVentas,
  selectVentas,
  selectTotal,
  selectPage,
  selectPageSize,
  setPage,
  setPageSize,

} from "../../Redux/Ventas";
import { AppDispatch } from "../../Redux/Store";
import Container from "../Utils/Container";
import moment from "moment";
import { getFormatedCurrency } from "../Utils/CurrencyFunctinos";
interface VentasProps {
  isDarkMode: boolean;
}

const Ventas: React.FC<VentasProps> = ({ isDarkMode }) => {
  const dispatch: AppDispatch = useDispatch();
  const ventas = useSelector(selectVentas);
  const total = useSelector(selectTotal);
  const page = useSelector(selectPage);
  const pageSize = useSelector(selectPageSize);

  useEffect(() => {
    dispatch(fetchVentas({ page, pageSize }));
  }, [dispatch, page, pageSize]);

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    dispatch(setPage(newPage));
    if (newPageSize && newPageSize !== pageSize) {
      dispatch(setPageSize(newPageSize));
    }
  };

  console.log("Ventas data:", ventas);

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Cliente",
      dataIndex: ["cliente", "nombres"], // or "cliente.nombres" (but array format is safer)
      key: "nombreCliente",
    },
    {
      title: "Fecha",
      dataIndex: "fechaCreacion",
      key: "fecha",
      render: (fechaCreacion: string | null) =>
              fechaCreacion ? moment(fechaCreacion).format("YYYY-MM-DD") : "N/A",
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => getFormatedCurrency(total)

    },
    {
      title: "Usuario",
      dataIndex: "nombreUsuario",
      key: "nombreUsuario",
    },
  ];

  return (
    <Container isDarkMode={isDarkMode}>
      <Table
        columns={columns}
        dataSource={ventas}
        rowKey="id"
        scroll={{ x: "max-content" }}
        pagination={{
          current: page,
          pageSize,
          total,
          onChange: handlePageChange,
          showSizeChanger: true,
          pageSizeOptions: ["5", "10", "20"],
        }}
      />
    </Container>
  );
};

export default Ventas;
