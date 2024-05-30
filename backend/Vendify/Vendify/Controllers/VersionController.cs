using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Vendify.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VersionController : ControllerBase
    {


        [HttpGet(Name = "GetVErsion")]
        public string Get()
        {
            return "v1";
        }
    }
}
