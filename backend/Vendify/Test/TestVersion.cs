using Microsoft.AspNetCore.Mvc;
using Vendify.Controllers;

namespace Test
{
    public class TestVersion
    {
        private readonly VersionController _controller;

        public TestVersion()
        {
            _controller = new VersionController();
        }


        [Fact]
        public void Get_OK()
        {
            var result = _controller.Get();

            Assert.IsType<string>(result);
        }
    }
}