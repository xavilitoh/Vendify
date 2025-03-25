import React, { useState } from "react";
import { Table, Button, Modal, Form, Input } from "antd";

interface ClientProps {
  visible: boolean;
  onCreate: (values: any) => void;  
  onCancel: () => void;
}                        


const ClientForm: React.FC<ClientProps> = ({ visible, onCreate, onCancel }: ClientProps) => {
    const [form] = Form.useForm();
  
    return (
      <Modal
        visible={visible}
        title="Create Client"
        okText="Create"
        cancelText="Cancel"
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              onCreate(values);
            })
            .catch((info) => console.log("Validation Failed:", info));
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Please enter the email" }]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ required: true, message: "Please enter the phone number" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    );
  };
  
  export default ClientForm ;
