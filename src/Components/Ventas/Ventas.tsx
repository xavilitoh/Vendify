import React, { useEffect, useState } from "react";
import { Segmented } from "antd";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Redux/Store";
import { fetchClientesSelectList } from "../../Redux/Clientes";
import { fetchProductsSelectList } from "../../Redux/Productos";
import Container from "../Utils/Container";
import VentaForm from "./CrearForm";

interface PropsVentas {
  isDarkMode?: boolean;
}

const CrearVenta: React.FC<PropsVentas> = ({ isDarkMode }) => {
  const dispatch: AppDispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("Venta");

  useEffect(() => {
    dispatch(fetchClientesSelectList());
    dispatch(fetchProductsSelectList());
  }, [dispatch]);

  return (
    <Container isDarkMode={isDarkMode}>

      
      <div style={{ marginTop: 20 }}>
        <Segmented
          options={["Venta", "Detalles de Caja", "Cuadre"]}
          value={selectedTab}
          onChange={(val) => setSelectedTab(val.toString())}
        />
      </div>

      {selectedTab === "Venta" && (
        <div style={{ marginTop: 20 }}>
          <VentaForm />
        </div>
      )}

      {selectedTab === "Detalles de Caja" && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>Detalles de Caja</h3>
          <p>
            Contenido relacionado a los movimientos o estado actual de la caja.
          </p>
        </div>
      )}

      {selectedTab === "Cuadre" && (
        <div className="card" style={{ marginTop: 20 }}>
          <h3>Cuadre de Caja</h3>
          <p>Resumen del cuadre de caja al final del día.</p>
        </div>
      )}
    </Container>
  );
};

export default CrearVenta;
