using Shared.Entidades.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Entidades
{
    public class Subcategoria : ModeloBaseCompleto
    {

        public int ICategoria { get; set; }

        [ForeignKey("ICategoria")]
        public virtual Categoria? Categoria { get; set; }
    }
}