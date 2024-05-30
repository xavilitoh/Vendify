using DataAcces;
using DataAcces.Repositorio;
using Microsoft.AspNetCore.Mvc;
using Shared.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vendify.Controllers;

namespace Test
{
    public class TestMarcas
    {
        private readonly MarcasDA _marcaDA;
        private readonly ApplicationDbContext dbContext = new ApplicationDbContext(DateTime.Now.Ticks + ".db");

        public TestMarcas()
        {
            _marcaDA = new MarcasDA(dbContext);
        }

        [Fact]
        public async Task GET_List_Marca_OK()
        {
            await _marcaDA.Save(new Shared.Entidades.Marca { Id = 0, Descripcion = "oreo" });
            await _marcaDA.Save(new Shared.Entidades.Marca { Id = 0, Descripcion = "oreo2" });
            await _marcaDA.Save(new Shared.Entidades.Marca { Id = 0, Descripcion = "oreo3" });

            var result = await _marcaDA.Get();
            Assert.IsType<List<Marca>>(result);
            Assert.Equal(4, result.Count);
        }

        [Fact]
        public async Task Save_Marca_OK()
        {
            var result = await _marcaDA.Save(new Shared.Entidades.Marca { Id = 0, Descripcion = "oreo" });
            var desc = result.Descripcion;
            Assert.IsType<Marca>(result);
            Assert.Equal(desc, result.Descripcion);
        }

        [Fact]
        public async Task GET_Marca_OK()
        {
            var result = await _marcaDA.Get(1);
            var desc = result.Descripcion;
            Assert.IsType<Marca>(result);
        }

        [Fact]
        public async Task GET_Marca_NO_OK()
        {
            await _marcaDA.Save(new Shared.Entidades.Marca { Id = 0, Descripcion = "oreo" });

            var _input = 4654654;
            var result = await _marcaDA.Get(_input);
            var id = result.Id;
            Assert.NotEqual(id, _input);
        }
    }
}
