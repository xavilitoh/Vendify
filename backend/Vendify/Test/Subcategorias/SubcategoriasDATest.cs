﻿using DataAcces.Repositorio;
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
        private readonly SubcategoriasDA _subcategoriaDA;
        private readonly CategoriaDA _categoriaDA;
        private readonly ApplicationDbContext dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");

        public SubcategoriasDATest()
        {
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _categoriaDA = new CategoriaDA(dbContext);
        }

        [Fact]
        public async Task Save_Marca_OK()
        {
            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });

            var result = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = Cat_result.Id });
            var desc = result.Descripcion;
            Assert.IsType<Subcategoria>(result);
            Assert.Equal(desc, result.Descripcion);
        }

        [Fact]
        public async Task GET_List_SubCat_OK()
        {
            dbContext.Subategorias.ExecuteDelete();
            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });

            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada2", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada3", ICategoria = Cat_result.Id });

            var result = await _subcategoriaDA.Get();

            Assert.IsType<List<Subcategoria>>(result);
            Assert.Equal(3, result.Count);
        }

        [Fact]
        public async Task GET_List_SubCat_By_Cat_OK()
        {
            dbContext.Subategorias.ExecuteDelete();
            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });
            var Cat_result2 = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas2" });

            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada2", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada3", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada3", ICategoria = Cat_result2.Id });

            var result = await _subcategoriaDA.GetByCategoriaId(Cat_result.Id);

            Assert.IsType<List<Subcategoria>>(result);
            Assert.Equal(3, result.Count);
        }
    }
}