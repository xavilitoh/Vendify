import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AbrirCaja from "../EstacionCajas/AbrirCaja";
import { checkCajaAbierta, selectCajaActual } from "../../Redux/Cajas.";
import { Spin } from "antd";

interface CajasProps {
  isDarkMode?: boolean;
}

const Cajas: React.FC<CajasProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cajaActual = useSelector(selectCajaActual);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      await dispatch(checkCajaAbierta() as any); // Use 'as any' if using thunk
      setLoading(false);
    };
    check();
  }, [dispatch]);

  useEffect(() => {
    if (cajaActual) {
      navigate("/ventas");
    }
  }, [cajaActual, navigate]);

  if (loading) {
    return (
      <div
        style={{ display: "flex", justifyContent: "center", paddingTop: "20%" }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return !cajaActual ? <AbrirCaja visible={true} /> : <div>Caja Cerrada</div>;
};

export default Cajas;
