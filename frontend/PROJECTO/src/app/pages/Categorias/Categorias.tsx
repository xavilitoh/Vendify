import { CategoriasList } from "./CategoriasList";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";

const usersBreadcrumbs: Array<PageLink> = [
  {
    title: "Categorias",
    path: "/categorias",
    isSeparator: false,
    isActive: false,
  },
];

export function Categorias() {
  return (
    <>
      <PageTitle breadcrumbs={usersBreadcrumbs}>Categorias</PageTitle>
      <CategoriasList />
    </>
  );
}
