using Shared.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAcces
{
    public interface InterfaceBase<T> where T : class
    {
        Task<T> Save(T marca);
        Task<T?> Get(int id);
        Task<List<T>> Get();
    }
}
