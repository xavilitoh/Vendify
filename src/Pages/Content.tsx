// src/components/Content.tsx
import React from "react";
import { Breadcrumb, Layout } from "antd";

interface ContentProps {
  backgroundColor: string;
  borderRadius: string | number;
}

const Content: React.FC<ContentProps> = ({ backgroundColor, borderRadius }) => {
  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <section
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: backgroundColor,
          borderRadius: borderRadius,
          height: "100vh",
        }}
      >
        Content
      </section>
    </Layout>
  );
};

export default Content;
