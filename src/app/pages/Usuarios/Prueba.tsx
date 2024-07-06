import { UsersListWrapper } from "./UsersList";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: "Mantenimiento",
    path: "/usuarios",
    isSeparator: false,
    isActive: false,
  },
];

export function Prueba() {
  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Usuarios</PageTitle>
      <UsersListWrapper />
    </>
  );
}
