import React from "react";
import { Table, Button, Space } from "antd";

interface TableProps {
  data: any[];
  total: number;
  currentPage: number;
  pageSize: number;
  loading?: boolean;
  onEdit?: (record: any) => void;
  onDelete?: (id: string) => void;
  onPageChange: (page: number, pageSize?: number) => void;
}

const TableComponent: React.FC<TableProps> = ({
  data,
  total,
  currentPage,
  pageSize,
  loading,
  onEdit,
  onDelete,
  onPageChange,
}) => {
  const enhancedColumns = [
    {
      title: "Actions",
      key: "actions",
      render: (record: any) => (
        <Space>
          {onEdit && <Button type="link" onClick={() => onEdit(record)}>Edit</Button>}
          {onDelete && <Button type="link" danger onClick={() => onDelete(record.id)}>Delete</Button>}
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={enhancedColumns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      pagination={{
        current: currentPage,
        pageSize,
        total,
        onChange: onPageChange,
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "20"],
      }}
    />
  );
};

export default TableComponent;
