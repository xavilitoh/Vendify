using Microsoft.EntityFrameworkCore;
using Shared.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAcces.Repositorio
{
    public interface IProductosDA : InterfaceBase<Producto>
    {

    }

    public class ProductosDA : IProductosDA
    {
        private readonly ApplicationDbContext dbContext;

        public ProductosDA(ApplicationDbContext dbContext)
        {
            this.dbContext = dbContext;
        }

        public async Task<Producto?> Get(int id)
        {
            return await dbContext.Productos.AsNoTracking()
                 .FirstOrDefaultAsync(model => model.Id == id) ?? null;
        }

        public async Task<List<Producto>> Get()
        {
            return await dbContext.Productos.AsNoTracking().ToListAsync();
        }

        public async Task<Producto> Save(Producto modelo)
        {
            await dbContext.Database.EnsureCreatedAsync();
            try
            {
                await dbContext.Productos.AddAsync(modelo);
                await dbContext.SaveChangesAsync();

                return modelo;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<int> Update(Producto modelo)
        {
            await dbContext.Database.EnsureCreatedAsync();

            try
            {
                dbContext.Update(modelo);
                dbContext.SaveChanges();

                return 1;
            }
            catch (Exception ex)
            {
                return -1;
            }
        }
    }
}
