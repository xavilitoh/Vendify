using DataAcces.Repositorio;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.Entidades;
using Vendify.DTO;

namespace Vendify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubcategoriasController : ControllerBase
    {
        private readonly ISubcategoriasDA subcategoriasDA;

        public SubcategoriasController(ISubcategoriasDA subcategoriasDA)
        {
            this.subcategoriasDA = subcategoriasDA;
        }

        [HttpGet]
        public async Task<ObjectResult> Get()
        {
            var data = await subcategoriasDA.Get();
            return data.Count > 0 ? Ok(data.ToList()) : NotFound("No se encontraron registros");
        }

        [HttpGet("{id}")]
        public async Task<ObjectResult> Get(int id)
        {
            var data = await subcategoriasDA.Get(id);
            return data is null ? NotFound("Registro no encontrado") : Ok(data);
        }

        [HttpGet("GetByCategoriaId/{idCategoria}")]
        public async Task<ObjectResult> GetByCategoriaId(int idCategoria)
        {
            var data = await subcategoriasDA.GetByCategoriaId(idCategoria);
            return data.Count > 0 ? Ok(data.ToList()) : NotFound("No se encontraron registros");
        }

        [HttpPost]
        public async Task<ObjectResult> Post([FromBody] SubcategoriaDTO dto)
        {
            if (string.IsNullOrEmpty(dto.Descripcion)) return BadRequest("El campo descripcion es requerido");

            var subcategoria = new Subcategoria
            {
                Descripcion = dto.Descripcion,
                ICategoria = dto.IdCategoria
            };

            var result = await subcategoriasDA.Save(subcategoria);

            return Ok(result);
        }

        [HttpPut]
        public async Task<ObjectResult> Put([FromBody] Subcategoria dto, int id)
        {
            if (id != dto.Id) return BadRequest("Id no coincide con el objeto de registro");
            if (string.IsNullOrEmpty(dto.Descripcion)) return BadRequest("El campo descripcion es requerido");

            var result = await subcategoriasDA.Update(dto);

            return result > 0 ? Ok("Operacion exitosa") : BadRequest("Algo salio mal :(");
        }
    }
}