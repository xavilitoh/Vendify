import React from "react";
import { Modal } from "antd";

interface ModalWrapperProps {
  visible: boolean;
  title: string;
  onOk: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  visible,
  title,
  onOk,
  onCancel,
  children,
}) => {
  return (
    <Modal title={title} visible={visible} onOk={onOk} onCancel={onCancel}>
      {children}
    </Modal>
  );
};

export { ModalWrapper };
