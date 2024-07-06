import { ID, Response } from "../../../../../../_metronic/helpers";
export type User = {
  id?: ID;
  fullName?: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  documento?: string;
  direccion?: string;
};

export type UsersQueryResponse = Response<Array<User>>;

export const initialUser: User = { 
  id: 1,
  fullName: "Art Director",
  nombre: "Enderson",
  apellido: "",
  email: "",
};
