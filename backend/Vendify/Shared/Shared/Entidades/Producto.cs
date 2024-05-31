using Shared.Entidades.Base;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shared.Entidades
{
    public class Producto : ModeloBaseCompleto
    {
        [Display(Name = "Este producto tiene impuestos?")]
        public bool ConImpuesto { get; set; }

        [Display(Name = "Marca")]
        public int? IdMarca { get; set; } = 0;

        [Display(Name = "Categoria")]
        public int? IdCategoria { get; set; }

        [Display(Name = "Subcategoria")]
        public int? IdSubcategoria { get; set; }

        [Display(Name = "Stock minimo")]
        [Required(ErrorMessage = "Este campo es requerido")]
        public double StockMinimo { get; set; }

        [MaxLength(20, ErrorMessage = "el campo {0} no acepta mas de {1} caracteres")]
        public new string Descripcion { get; set; } = string.Empty;

        [MaxLength(128, ErrorMessage = "el campo {0} no acepta mas de {1} caracteres")]
        public string BarCode { get; set; } = string.Empty;

        [ForeignKey("IdMarca")]
        public virtual Marca? Marca { get; set; }

        [ForeignKey("IdCategoria")]
        public virtual Categoria? Categoria { get; set; }

        [ForeignKey("IdSubcategoria")]
        public virtual Subcategoria? Subcategoria { get; set; }
    }
}
