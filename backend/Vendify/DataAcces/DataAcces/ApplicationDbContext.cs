using Microsoft.EntityFrameworkCore;
using Shared.Entidades;
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

            base.OnModelCreating(modelBuilder);
        }
    }
}