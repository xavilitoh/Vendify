using Microsoft.EntityFrameworkCore;
using Shared.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAcces.Repositorio
{
    public interface IMarcasDA
    {
        Task<Marca> Save(Marca marca);
        Task<Marca> Get(int id);
        Task<List<Marca>> Get();
    }
    public class MarcasDA : IMarcasDA
    {
        private readonly ApplicationDbContext dbContext;

        public MarcasDA(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Marca> Get(int id)
        {
            return await dbContext.Marcas.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Id == id) ?? new();
        }

        public async Task<List<Marca>> Get()
        {
            return await dbContext.Marcas.AsNoTracking().ToListAsync();
        }

        public async Task<Marca> Save(Marca marca)
        {
            await dbContext.Database.EnsureCreatedAsync();
            try
            {
                marca.Descripcion = marca.Descripcion.ToUpper();
                await dbContext.Marcas.AddAsync(marca);
                await dbContext.SaveChangesAsync();

                return marca;
            }
            catch (Exception ex)
            {

                throw;
            }
        }
    }
}