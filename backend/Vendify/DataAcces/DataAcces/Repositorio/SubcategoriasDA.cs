using Microsoft.EntityFrameworkCore;
using Shared.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAcces.Repositorio
{
    public interface ISubcategoriasDA : InterfaceBase<Subcategoria>
    {
        Task<List<Subcategoria>> GetByCategoriaId(int IdCategoria);
    }

    public class SubcategoriasDA : ISubcategoriasDA
    {

        private readonly ApplicationDbContext dbContext;

        public SubcategoriasDA(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Subcategoria> Get(int id)
        {
            return await dbContext.Subategorias.AsNoTracking()
                .FirstOrDefaultAsync(model => model.Id == id) ?? new();
        }

        public async Task<List<Subcategoria>> Get()
        {
            return await dbContext.Subategorias.AsNoTracking().ToListAsync();
        }

        public async Task<List<Subcategoria>> GetByCategoriaId(int IdCategoria)
        {
            return await dbContext.Subategorias.AsNoTracking().Where(a=> a.ICategoria == IdCategoria).ToListAsync();
        }

        public async Task<Subcategoria> Save(Subcategoria subcategoria)
        {
            await dbContext.Database.EnsureCreatedAsync();
            try
            {
                subcategoria.Descripcion = subcategoria.Descripcion.ToUpper();
                await dbContext.Subategorias.AddAsync(subcategoria);
                await dbContext.SaveChangesAsync();

                return subcategoria;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
