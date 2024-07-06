import { Table, Space, Button } from "antd";
import type { ColumnsType } from "antd/lib/table";
import React, { useEffect } from "react";

interface DataType {
  id: number;
  fullName: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
}

//Table Props
interface TableUsersProps {
  users: DataType[];
  rowKey: string;
  onEdit: (user: DataType) => void; // Add onEdit prop
}

const TableUsers: React.FC<TableUsersProps> = ({ users, rowKey, onEdit }) => {
  //Columnas Tablas
  useEffect(() => {}, [users]);
  const columns: ColumnsType<DataType> = [
    {
      title: "Nombre",
      dataIndex: "fullName",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Telefono",
      dataIndex: "telefono",
      key: "telefono",
    },
    {
      title: "Cedula",
      dataIndex: "documento",
      key: "documento",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record: DataType) => (
        <Space size="middle">
          <Button onClick={() => onEdit(record)}>Editar</Button>
          <Button type="primary" danger>
            Eliminar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table<DataType> columns={columns} dataSource={users} rowKey={rowKey} />
    </>
  );
};

export { TableUsers };
