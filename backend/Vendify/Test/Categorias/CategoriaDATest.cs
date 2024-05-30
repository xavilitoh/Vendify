using DataAcces.Repositorio;
using DataAcces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Shared.Entidades;
using Microsoft.EntityFrameworkCore;

namespace Test.Categorias
{
    public class CategoriaDATest
    {
        private readonly CategoriaDA _categoriaDA;
        private readonly ApplicationDbContext dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");

        public CategoriaDATest()
        {
            dbContext.Categorias.ExecuteDelete();
            _categoriaDA = new CategoriaDA(dbContext);
        }

        [Fact]
        public async Task GET_List_Categoria_OK()
        {
            dbContext.Categorias.ExecuteDelete();
            await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });
            await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas2" });
            await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas3" });

            var result = await _categoriaDA.Get();
            Assert.IsType<List<Categoria>>(result);
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public async Task Save_Categoria_OK()
        {
            var desc = "Galletas";
            var result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = desc });
            Assert.IsType<Categoria>(result);
            Assert.Equal(desc.ToUpper(), result.Descripcion);
        }
    }
}