import React, { useState } from "react";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { ToolbarType, useLayout } from "../../core";
import { PageTitleWrapper } from "./page-title";
import { Button, Modal, Form } from "antd";
import CreateClientForm from "./../../../../app/pages/Usuarios/CrearCliente";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../Redux/Store";
import { createUser } from "../../../../Redux/Features/Users/userSlice";

interface DataType {
  id?: string;
  fullName: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  documento: string;
  direccion: string;
}

const ToolbarWrapper = () => {
  const { config, classes } = useLayout();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<DataType>();

  if (!config.app?.toolbar?.display) {
    return null;
  }

  const isPageTitleVisible = showPageTitle(
    config.app?.toolbar?.layout,
    config.app?.pageTitle?.display
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log(values);
      dispatch(createUser(values));
      form.resetFields();
      setIsModalVisible(false);
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Check if the current route is the one where you want to show the "Crear Cliente" button and form
  const isClientRoute = location.pathname === "/usuarios"; // Update this to match your route

  return (
    <div
      id="kt_app_toolbar"
      className={clsx(
        "app-toolbar",
        classes.toolbar.join(" "),
        config?.app?.toolbar?.class
      )}
    >
      <div
        id="kt_app_toolbar_container"
        className={clsx(
          "app-container",
          classes.toolbarContainer.join(" "),
          config.app?.toolbar?.containerClass,
          config.app?.toolbar?.minimize?.enabled ? "app-toolbar-minimize" : "",
          {
            "container-fluid": config.app?.toolbar?.container === "fluid",
            "container-xxl": config.app?.toolbar?.container === "fixed",
          }
        )}
      >
        {isPageTitleVisible && <PageTitleWrapper />}
        {isClientRoute && (
          <>
            <Button type="primary" onClick={showModal}>
              Crear Cliente
            </Button>
            <Modal
              title="Crear Cliente"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <CreateClientForm form={form} />
            </Modal>
          </>
        )}
      </div>
    </div>
  );
};

const showPageTitle = (
  appToolbarLayout?: ToolbarType,
  appPageTitleDisplay?: boolean
): boolean => {
  const viewsWithPageTitles = ["classic", "reports", "saas"];
  if (!appToolbarLayout || !appPageTitleDisplay) {
    return false;
  }

  return (
    appPageTitleDisplay &&
    viewsWithPageTitles.some((t) => t === appToolbarLayout)
  );
};

export { ToolbarWrapper };
