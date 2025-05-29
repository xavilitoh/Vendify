import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AbrirCaja from "../EstacionCajas/AbrirCaja";
import { checkCajaAbierta, selectCajaActual } from "../../Redux/Cajas.";

interface CajasProps {
  isDarkMode?: boolean;
}

const Cajas: React.FC<CajasProps> = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cajaActual = useSelector(selectCajaActual);
  console.log(cajaActual, 'CAJA ACTUAL');

  useEffect(() => {
    dispatch(checkCajaAbierta());
  }, [dispatch]);

  useEffect(() => {
    if (cajaActual) {
      navigate("/crearventas");
    }
  }, [cajaActual, navigate]);

  return (
    <>
        
      {!cajaActual ? <AbrirCaja visible={true} /> : <div>Caja Cerrada</div>} 
    </>
  );
};

export default Cajas;
