using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using static System.Net.Mime.MediaTypeNames;

namespace Xpense.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManualController : ControllerBase
    {
        public class InputModel
        {
            public string Expense { get; set; }
            public decimal Cost { get; set; }
        }
        /*MANUAL 

Create manual API
Post desc and cost to API
*for now* return Okay from API

* Later on save desc and cost to Database*
*/
        [HttpPost("EnterDC")]
        public IActionResult PostData([FromBody] InputModel model)
        {
            if (model == null)
                return BadRequest("Invalid input");

            // Do something with model.Field1 and model.Field2
            return Ok(new { message = "Data received!", data = model });
        }
    }
}
