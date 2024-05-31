using DataAcces.Repositorio;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Shared.Entidades;
using Vendify.DTO;

namespace Vendify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductosController : ControllerBase
    {
        private readonly IProductosDA productosDA;

        public ProductosController(IProductosDA productosDA)
        {
            this.productosDA = productosDA;
        }


        [HttpGet]
        public async Task<ObjectResult> Get()
        {
            var data = await productosDA.Get();

            return data.Count > 0 ? Ok(data.ToList()) : NotFound("No se encontraron registros");
        }

        [HttpGet("{id}")]
        public async Task<ObjectResult> Get(int id)
        {
            var data = await productosDA.Get(id);
            return data is null ? NotFound("Registro no encontrado") : Ok(data);
        }

        [HttpPost]
        public async Task<ObjectResult> Post([FromBody] ProductoDTO dto)
        {
            var result = await productosDA.Save(new Producto { BarCode = dto.BarCode, Descripcion = dto.Descripcion, StockMinimo = dto.StockMinimo, IdCategoria = dto.IdCategoria, IdMarca = dto.IdMarca, IdSubcategoria = dto.IdSubcategoria, ConImpuesto = dto.ConImpuesto});

            return Ok(result);
        }

        [HttpPut]
        public async Task<ObjectResult> Put([FromBody] Producto dto, int id)
        {
            if (id != dto.Id) return BadRequest("Id no coincide con el objeto de registro");

            var result = await productosDA.Update(dto);

            return result > 0 ? Ok("Operacion Exitosa") : BadRequest("Algo salio mal :(");
        }
    }
}