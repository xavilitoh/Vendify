import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children,isDarkMode }) => {
  return (
    <div style={{ background: isDarkMode ? "#202020" : "#fff", padding: "20px", marginTop:"20px" }}>
      {children}
    </div>
  );
};

export default Container;
