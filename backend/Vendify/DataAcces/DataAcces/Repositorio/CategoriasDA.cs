using Microsoft.EntityFrameworkCore;
using Shared.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAcces.Repositorio
{
    public interface ICategoriaDA : InterfaceBase<Categoria>
    {

    }

    public class CategoriaDA : ICategoriaDA
    {
        private readonly ApplicationDbContext dbContext;

        public CategoriaDA(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Categoria> Get(int id)
        {
            return await dbContext.Categorias.AsNoTracking()
                 .FirstOrDefaultAsync(model => model.Id == id) ?? new();
        }

        public async Task<List<Categoria>> Get()
        {
            return await dbContext.Categorias.AsNoTracking().ToListAsync();
        }

        public async Task<Categoria> Save(Categoria categoria)
        {
            await dbContext.Database.EnsureCreatedAsync();
            try
            {
                categoria.Descripcion = categoria.Descripcion.ToUpper();
                await dbContext.Categorias.AddAsync(categoria);
                await dbContext.SaveChangesAsync();

                return categoria;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
