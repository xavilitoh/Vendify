namespace Vendify.DTO
{
    public class ProductoDTO
    {
        public int IdMarca { get; set; }
        public int IdCategoria { get; set; }
        public int IdSubcategoria { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public double StockMinimo { get; set; }
        public string BarCode { get; set; } = string.Empty;
        public bool ConImpuesto { get; set; }
    }
}