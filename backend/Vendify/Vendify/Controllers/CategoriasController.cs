using DataAcces.Repositorio;
using Microsoft.AspNetCore.Mvc;
using Shared.Entidades;
using Vendify.DTO;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Vendify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriasController : ControllerBase
    {
        private readonly ICategoriaDA categoriaDA;

        public CategoriasController(ICategoriaDA categoriaDA)
        {
            this.categoriaDA = categoriaDA;
        }

        // GET: api/<CategoriasController>
        [HttpGet]
        public async Task<ObjectResult> Get()
        {
            var data = await categoriaDA.Get();
            return Ok(data.ToList());
        }

        // GET api/<CategoriasController>/5
        [HttpGet("{id}")]
        public async Task<ObjectResult> Get(int id)
        {
            var data = await categoriaDA.Get(id);
            return Ok(data);
        }

        // POST api/<CategoriasController>
        [HttpPost]
        public async Task<ObjectResult> Post([FromBody] CategoriaDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Descripcion)) return BadRequest("El campo descripcion es requerido");

            var categoria = new Categoria
            {
                Descripcion = dto.Descripcion,
            };

            var result = await categoriaDA.Save(categoria);

            return Ok(result);
        }
    }
}
