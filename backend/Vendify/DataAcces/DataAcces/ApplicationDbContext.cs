using Microsoft.EntityFrameworkCore;
using Shared.Entidades;
using Shared.Entidades.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace DataAcces
{
    public class ApplicationDbContext : DbContext
    {

        string _db = "ventify.db";
        public DbSet<Marca> Marcas { get; set; }
        public DbSet<Categoria> Categorias { get; set; }
        public DbSet<Subcategoria> Subategorias { get; set; }
        public DbSet<Producto> Productos { get; set; }

        public ApplicationDbContext()
        {
            
        }

        public ApplicationDbContext(string db)
        {
            _db = db;
        }


        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite(
                    connectionString: "Filename=ventify.db",
                    sqliteOptionsAction: opt =>
                    {
                        opt.MigrationsAssembly(Assembly.GetExecutingAssembly().FullName);
                    }
                    );

            base.OnConfiguring(optionsBuilder);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Marca>().ToTable("Marcas");
            modelBuilder.Entity<Marca>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Categoria>().ToTable("Categorias");
            modelBuilder.Entity<Categoria>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            modelBuilder.Entity<Subcategoria>().ToTable("Subcategorias");
            modelBuilder.Entity<Subcategoria>(entity =>
            {
                entity.HasKey(e => e.Id);
            });

            base.OnModelCreating(modelBuilder);
        }

        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            OnBeforeSaving();
            return base.SaveChangesAsync(cancellationToken);
        }

        private void OnBeforeSaving()
        {
            var entidades = ChangeTracker.Entries();
            var fecha = DateTime.Now;

            foreach (var modelo in entidades) 
            {
                if (modelo.Entity is ModeloBase model)
                {
                    switch (modelo.State)
                    {
                        case EntityState.Added:
                            model.Enable = true;
                            break;
                        case EntityState.Modified:
                            break;
                    }
                }

                if (modelo.Entity is ModeloBaseCompleto modeloBase)
                {
                    switch (modelo.State)
                    {
                        case EntityState.Added:
                            modeloBase.FechaCreacion = fecha;
                            break;
                        case EntityState.Modified:
                            modeloBase.FechaModificacion = fecha;
                            modelo.Property(nameof(modeloBase.FechaCreacion)).IsModified = false;
                            break;
                    }
                }
            }
        }
    }
}