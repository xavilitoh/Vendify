using DataAcces.Repositorio;
using DataAcces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Shared.Entidades;

namespace Test.Subcategorias
{
    public class SubcategoriasDATest
    {
        private  SubcategoriasDA _subcategoriaDA;
        private  CategoriaDA _categoriaDA;
        private  ApplicationDbContext dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");

        public SubcategoriasDATest()
        {
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _categoriaDA = new CategoriaDA(dbContext);
        }

        [Fact]
        public async Task Save_Marca_OK()
        {
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);

            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });

            var result = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = Cat_result.Id });
            var desc = result.Descripcion;
            Assert.IsType<Subcategoria>(result);
            Assert.Equal(desc, result.Descripcion);
        }

        [Fact]
        public async Task GET_List_SubCat_OK()
        {
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);

            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });

            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada2", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada3", ICategoria = Cat_result.Id });

            var result = await _subcategoriaDA.Get();

            Assert.IsType<List<Subcategoria>>(result);
        }

        [Fact]
        public async Task GET_List_SubCat_By_Cat_OK()
        {
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);

            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });

            var result = await _subcategoriaDA.GetByCategoriaId(Cat_result.Id);

            Assert.IsType<List<Subcategoria>>(result);
        }


        [Fact]
        public async Task Update_Marca_OK()
        {
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);

            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });

            var data = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = Cat_result.Id });
            var result = await _subcategoriaDA.Update(data);

            Assert.IsType<int>(result);
            Assert.Equal(1, result);
        }
    }
}
