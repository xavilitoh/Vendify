using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Entidades.Base
{
    public class ModeloBase
    {
        [Key]
        public int Id { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public bool Enable { get; set; } = true;
    }
}
