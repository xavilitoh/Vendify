using DataAcces.Repositorio;
using DataAcces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Entidades;
using Vendify.Controllers;
using Vendify.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Test.Productos
{
    public class ProductosControllerTest
    {
        private CategoriaDA _categoriaDA;
        private ProductosDA _productoDA;
        private SubcategoriasDA _subcategoriaDA;
        private MarcasDA _marcaDA;
        private ApplicationDbContext dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
        private ProductosController _Controller;


        [Fact]
        public async Task Save_Producto_OK()
        {
            //Preparacion
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _productoDA = new ProductosDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _marcaDA = new MarcasDA(dbContext);
            _Controller = new ProductosController(_productoDA);

            //preparar marca
            var marca = await _marcaDA.Save(new Marca { Id = 0, Descripcion = "oreo" });
            var categoria = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "galleta" });
            var subcategoria = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = categoria.Id });

            //ejecutar
            var result = await _Controller.Post(new ProductoDTO { BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10 });

            //Evaluar
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task Get_Producto_OK()
        {
            //Preparacion
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _productoDA = new ProductosDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _marcaDA = new MarcasDA(dbContext);
            _Controller = new ProductosController(_productoDA);

            //preparar marca
            var marca = await _marcaDA.Save(new Marca { Id = 0, Descripcion = "oreo" });
            var categoria = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "galleta" });
            var subcategoria = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = categoria.Id });
            var producto = await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });

            //ejecutar
            var result = await _Controller.Get(producto.Id);

            //Evaluar
            var produc = Assert.IsType<OkObjectResult>(result).Value;
            Assert.IsType<Producto>(produc);
        }

        [Fact]
        public async Task Update_Producto_OK()
        {
            //Preparacion
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _productoDA = new ProductosDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _marcaDA = new MarcasDA(dbContext);
            _Controller = new ProductosController(_productoDA);

            //preparar marca
            var marca = await _marcaDA.Save(new Marca { Id = 0, Descripcion = "oreo" });
            var categoria = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "galleta" });
            var subcategoria = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = categoria.Id });
            var producto = await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });

            //ejecutar
            var result = await _Controller.Put(producto, producto.Id);

            //Evaluar
            var produc = Assert.IsType<OkObjectResult>(result).Value;
            Assert.IsType<string>(produc);
        }

        [Fact]
        public async Task Get_List_Producto_OK()
        {
            //Preparacion
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _productoDA = new ProductosDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _marcaDA = new MarcasDA(dbContext);
            _Controller = new ProductosController(_productoDA);

            dbContext.Productos.ExecuteDelete();
            //preparar marca
            var marca = await _marcaDA.Save(new Marca { Id = 0, Descripcion = "oreo" });
            var categoria = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "galleta" });
            var subcategoria = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = categoria.Id });

            await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });
            await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });

            //ejecutar
            var result = await _Controller.Get();

            //Evaluar
            Assert.IsType<OkObjectResult>(result);
            var produc = Assert.IsType<List<Producto>>(result.Value);
            Assert.Equal(2, produc.Count);
        }

    }
}
