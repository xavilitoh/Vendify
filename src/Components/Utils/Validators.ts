export const formatDocumento = (inputValue: string) => {
  // Remueve cualquier guion para evitar duplicados y asegura que solo queden números
  const numbers = inputValue.split("-").join("").slice(0, 11); // Máximo 11 dígitos

  // Aplica el formato en bloques
  let formattedValue = "";
  if (numbers.length > 0) {
    formattedValue += numbers.slice(0, 3); // Primer bloque
  }
  if (numbers.length > 3) {
    formattedValue += `-${numbers.slice(3, 10)}`; // Segundo bloque
  }
  if (numbers.length > 10) {
    formattedValue += `-${numbers.slice(10, 11)}`; // Tercer bloque
  }

  return formattedValue;
};

export const formatPhoneNumber = (value: string) => {
  // Remove non-numeric characters
  const cleaned = value.replace(/\D/g, "");

  // Format the number as XXX-XXX-XXXX
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
  } else {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(
      6,
      10
    )}`;
  }
};
