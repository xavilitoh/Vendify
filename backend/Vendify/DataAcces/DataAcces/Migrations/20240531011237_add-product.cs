using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAcces.Migrations
{
    /// <inheritdoc />
    public partial class addproduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Productos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    ConImpuesto = table.Column<bool>(type: "INTEGER", nullable: false),
                    IdMarca = table.Column<int>(type: "INTEGER", nullable: true),
                    IdCategoria = table.Column<int>(type: "INTEGER", nullable: true),
                    IdSubcategoria = table.Column<int>(type: "INTEGER", nullable: true),
                    StockMinimo = table.Column<double>(type: "REAL", nullable: false),
                    Descripcion = table.Column<string>(type: "TEXT", maxLength: 20, nullable: false),
                    BarCode = table.Column<string>(type: "TEXT", maxLength: 128, nullable: false),
                    Enable = table.Column<bool>(type: "INTEGER", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "TEXT", nullable: false),
                    FechaModificacion = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Productos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Productos_Categorias_IdCategoria",
                        column: x => x.IdCategoria,
                        principalTable: "Categorias",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Productos_Marcas_IdMarca",
                        column: x => x.IdMarca,
                        principalTable: "Marcas",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Productos_Subcategorias_IdSubcategoria",
                        column: x => x.IdSubcategoria,
                        principalTable: "Subcategorias",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdCategoria",
                table: "Productos",
                column: "IdCategoria");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdMarca",
                table: "Productos",
                column: "IdMarca");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_IdSubcategoria",
                table: "Productos",
                column: "IdSubcategoria");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Productos");
        }
    }
}
