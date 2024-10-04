// src/components/BreadcrumbComponent.tsx
import React from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation } from "react-router-dom";

const BreadcrumbComponent: React.FC = () => {
  const location = useLocation();
  const getBreadcrumbItems = (pathname: string) => {
    const pathParts = pathname.split("/").filter((part) => part);
    return pathParts.map((part, index) => ({
      title: part.charAt(0).toUpperCase() + part.slice(1),
      link: "/" + pathParts.slice(0, index + 1).join("/"),
    }));
  };

  return (
    <Breadcrumb style={{ margin: "16px 0" }}>
      {getBreadcrumbItems(location.pathname).map((item, index) => (
        <Breadcrumb.Item key={index}>
          <Link to={item.link}>{item.title}</Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbComponent;
