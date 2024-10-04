import React from "react";
import { Table, Button } from "antd";
import moment from "moment";
import { ColumnsType } from "antd/es/table"; // Import the correct type for columns

interface UserCreate {
  email: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  address: string;
  fecaNac: string;
  noDocumento: string; // Field matches with UserCreate
}

interface UsersTableProps {
  users: UserCreate[] | null;
  loading: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, loading }) => {
  // Define the column types explicitly using UserCreate
  const columns: ColumnsType<UserCreate> = [
    {
      title: "Nombre",
      dataIndex: "nombres",
      key: "nombres",
      width: 200,
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Teléfono",
      dataIndex: "telefono",
      key: "telefono",
      width: 250,
    },
    {
      title: "Dirección",
      dataIndex: "address", // Corrected from direccion to address
      key: "address",
      width: 400,
    },
    {
      title: "Fecha de Nacimiento",
      dataIndex: "fecaNac", // Using fecaNac from UserCreate
      key: "fecaNac",
      render: (date: string | undefined) => {
        return date ? moment(date).format("YYYY-MM-DD") : "N/A";
      },
      width: 250,
    },
    {
      title: "Documento",
      dataIndex: "noDocumento", // Using noDocumento from UserCreate
      key: "noDocumento",
      width: 150,
    },
    {
      title: "Acción",
      key: "operation",
      fixed: "right",
      width: 400,
      render: () => (
        <>
          <Button type="primary">Editar</Button>
          <Button danger type="primary" style={{ marginLeft: "7px" }}>
            Eliminar
          </Button>
        </>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={users || []}
      rowKey={(record) => record.email}
      loading={loading}
      pagination={{
        pageSize: 8,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20"],
        defaultCurrent: 1,
      }}
      style={{ marginTop: "30px" }}
    />
  );
};

export default UsersTable;
