using DataAcces.Repositorio;
using DataAcces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vendify.Controllers;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Shared.Entidades;
using Vendify.DTO;

namespace Test.Subcategorias
{
    public class SubcategoriasControllerTest
    {
        private  SubcategoriasDA _subcategoriaDA;
        private  CategoriaDA _categoriaDA;
        private  ApplicationDbContext dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
        private  SubcategoriasController _controller;

        public SubcategoriasControllerTest()
        {
            _subcategoriaDA = new SubcategoriasDA(dbContext);
            _categoriaDA = new CategoriaDA(dbContext);
            _controller = new SubcategoriasController(_subcategoriaDA);
        }


        [Fact]
        public async Task GET_OK()
        {
            //preparacion 

            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);

            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });

            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada2", ICategoria = Cat_result.Id });
            await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = "Salada3", ICategoria = Cat_result.Id });

            var result = await _controller.Get();
            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GET_BY_ID_OK()
        {

            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);

            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });
            var desc = "Salada";
            var result_save = await _subcategoriaDA.Save(new Subcategoria { Id = 0, Descripcion = desc, ICategoria = Cat_result.Id});
            var result = await _controller.Get(result_save.Id);

            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);
            var cat = Assert.IsType<Subcategoria>(result.Value);
            Assert.Equal(desc.ToUpper(), cat.Descripcion);
        }

        [Fact]
        public async Task SAVE_FAIL()
        {
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);

            var _dto = new SubcategoriaDTO();

            var result = await _controller.Post(_dto);

            Assert.NotNull(result);
            var data = Assert.IsType<BadRequestObjectResult>(result);
            Assert.IsType<string>(result.Value);
            Assert.Equal(result.Value, "El campo descripcion es requerido");
        }

        [Fact]
        public async Task SAVE_OK()
        {
            dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
            _categoriaDA = new CategoriaDA(dbContext);
            _subcategoriaDA = new SubcategoriasDA(dbContext);

            var Cat_result = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });
            var _dto = new SubcategoriaDTO { Descripcion = "Galletas", IdCategoria = Cat_result.Id };

            var result = await _controller.Post(_dto);

            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);
            Assert.IsType<Subcategoria>(result.Value);
        }
    }
}
