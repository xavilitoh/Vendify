using DataAcces.Repositorio;
using DataAcces;
using Shared.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Test.Productos
{
    public class ProductosDATest
    {

        private CategoriaDA _categoriaDA;
        private ProductosDA _productoDA;
        private SubcategoriasDA _subcategoriaDA;
        private MarcasDA _marcaDA;
        private ApplicationDbContext dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");

        public ProductosDATest()
        {
            _categoriaDA = new CategoriaDA(dbContext);
            _productoDA = new ProductosDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _marcaDA = new MarcasDA(dbContext);
        }

        [Fact]
        public async Task Save_Producto_OK()
        {
            //Preparacion
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _productoDA = new ProductosDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _marcaDA = new MarcasDA(dbContext);

            //preparar marca
            var marca = await _marcaDA.Save(new Marca { Id = 0, Descripcion = "oreo" });
            var categoria = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "galleta" });
            var subcategoria = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = categoria.Id });

            //ejecutar
            var result = await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true});

            //Evaluar
            Assert.IsType<Producto>(result);
        }

        [Fact]
        public async Task Up_Producto_OK()
        {
            //Preparacion
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _productoDA = new ProductosDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _marcaDA = new MarcasDA(dbContext);

            //preparar marca
            var marca = await _marcaDA.Save(new Marca { Id = 0, Descripcion = "oreo" });
            var categoria = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "galleta" });
            var subcategoria = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = categoria.Id });
            var producto = await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });

            var desc = "editado";
            producto.Descripcion = desc;
            //ejecutar
            var result = await _productoDA.Update(producto);
            var resp = await _productoDA.Get(producto.Id);

            //Evaluar
            Assert.IsType<int>(result);
            Assert.Equal(desc, resp.Descripcion);
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

            //preparar marca
            var marca = await _marcaDA.Save(new Marca { Id = 0, Descripcion = "oreo" });
            var categoria = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "galleta" });
            var subcategoria = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = categoria.Id });
            var producto = await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });

            //ejecutar
            var result = await _productoDA.Get(producto.Id);
            //Evaluar
            Assert.NotNull(result);
            Assert.IsType<Producto>(result);
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

            //preparar marca
            var marca = await _marcaDA.Save(new Marca { Id = 0, Descripcion = "oreo" });
            var categoria = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "galleta" });
            var subcategoria = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = categoria.Id });
            await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });
            await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });
            await _productoDA.Save(new Producto { Id = 0, BarCode = "", ConImpuesto = false, Descripcion = "DF", IdMarca = marca.Id, IdCategoria = categoria.Id, IdSubcategoria = subcategoria.Id, StockMinimo = 10, Enable = true });

            //ejecutar
            var result = await _productoDA.Get();
            //Evaluar
            Assert.NotNull(result);
            Assert.IsType<List<Producto>>(result);
        }
    }
}