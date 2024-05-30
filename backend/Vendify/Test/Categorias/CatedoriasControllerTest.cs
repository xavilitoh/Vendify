using DataAcces.Repositorio;
using DataAcces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vendify.Controllers;
using Microsoft.EntityFrameworkCore;
using Shared.Entidades;
using Microsoft.AspNetCore.Mvc;
using Vendify.DTO;

namespace Test.Categorias
{
    public class CatedoriasControllerTest
    {
        private readonly CategoriaDA _categoriaDA;
        private readonly ApplicationDbContext dbContext = new ApplicationDbContext(new Guid().ToString() + ".db");
        private readonly CategoriasController _controller;

        public CatedoriasControllerTest()
        {
            dbContext.Categorias.ExecuteDelete();
            _categoriaDA = new CategoriaDA(dbContext);
            _controller = new CategoriasController(_categoriaDA);
        }


        [Fact]
        public async Task GET_OK()
        {
            var result = await _controller.Get();

            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GET_DATA_VALIDATION_OK()
        {
            //preparacion 

            dbContext.Categorias.ExecuteDelete();
            await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas" });
            await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas2" });
            await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = "Galletas3" });

            //ejecucion

            var result = await _controller.Get();

            //evaluacion

            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);
            var categorias = Assert.IsType<List<Categoria>>(result.Value);

        }

        [Fact]
        public async Task GET_BY_ID_OK()
        {
            dbContext.Categorias.ExecuteDelete();
            var desc = "Galletas";
            var result_save = await _categoriaDA.Save(new Categoria { Id = 0, Descripcion = desc });
            var result = await _controller.Get(result_save.Id);

            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);
            var cat = Assert.IsType<Categoria>(result.Value);
            Assert.Equal(desc.ToUpper(), cat.Descripcion);
        }

        [Fact]
        public async Task SAVE_FAIL()
        {
            dbContext.Categorias.ExecuteDelete();

            var _dto = new CategoriaDTO();

            var result = await _controller.Post(_dto);

            Assert.NotNull(result);
            var data = Assert.IsType<BadRequestObjectResult>(result);
            Assert.IsType<string>(result.Value);
            Assert.Equal(result.Value, "El campo descripcion es requerido");
        }

        [Fact]
        public async Task SAVE_OK()
        {
            dbContext.Categorias.ExecuteDelete();

            var _dto = new CategoriaDTO { Descripcion = "Galletas" };

            var result = await _controller.Post(_dto);

            Assert.NotNull(result);
            Assert.IsType<OkObjectResult>(result);
            Assert.IsType<Categoria>(result.Value);
        }
    }
}
