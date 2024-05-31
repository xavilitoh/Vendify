using DataAcces.Repositorio;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.Entidades;
using Vendify.DTO;

namespace Vendify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarcasController : ControllerBase
    {
        private readonly IMarcasDA marcasDA;

        public MarcasController(IMarcasDA marcasDA)
        {
            this.marcasDA = marcasDA;
        }

        [HttpGet]
        public async Task<ObjectResult> Get()
        {
            var data = await marcasDA.Get();

            return data.Count > 0 ? Ok(data.ToList()) : NotFound("No se encontraron registros");
        }

        [HttpGet("{id}")]
        public async Task<ObjectResult> Get(int id)
        {
            var data = await marcasDA.Get(id);
            return data is null ? NotFound("Registro no encontrado") : Ok(data);
        }

        [HttpPost]
        public async Task<ObjectResult> Post([FromBody] Marca dto)
        {
            if (string.IsNullOrEmpty(dto.Descripcion)) return BadRequest("El campo descripcion es requerido");

            var result = await marcasDA.Save(dto);

            return Ok(result);
        }

        [HttpPut]
        public async Task<ObjectResult> Put([FromBody] Marca dto, int id)
        {
            if (id != dto.Id) return BadRequest("Id no coincide con el objeto de registro");
            if (string.IsNullOrEmpty(dto.Descripcion)) return BadRequest("El campo descripcion es requerido");

            var result = await marcasDA.Update(dto);


            return result > 0 ? Ok("Operacion Exitosa") : BadRequest("Algo salio mal :(");
        }
    }
}