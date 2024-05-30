using Microsoft.EntityFrameworkCore;
using DataAcces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.OpenApi;
using Shared.Entidades;
using DataAcces.Repositorio;
namespace Vendify.Controllers;

public static class MarcaEndpoints
{
    public static void MapMarcaEndpoints (this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Marca").WithTags(nameof(Marca));

        group.MapGet("/", async (IMarcasDA db) =>
        {
            return await db.Get();
        })
        .WithName("GetAllMarcas")
        .WithOpenApi();

        group.MapGet("/{id}", async Task<Results<Ok<Marca>, NotFound>> (int id, IMarcasDA db) =>
        {
            return await db.Get(id)
                is not Marca model
                    ? TypedResults.NotFound(): (model.Id == id) ? TypedResults.Ok(model) : TypedResults.NotFound();
        })
        .WithName("GetMarcaById")
        .WithOpenApi();

        group.MapPost("/", async (Marca marca, IMarcasDA db) =>
        {
            await db.Save(marca);
            return TypedResults.Created($"/api/Marca/{marca.Id}",marca);
        })
        .WithName("CreateMarca")
        .WithOpenApi();
    }
}
