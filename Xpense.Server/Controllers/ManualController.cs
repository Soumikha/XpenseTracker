using Azure;
using Azure.AI.OpenAI;
using Azure.AI.OpenAI.Chat;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Hosting;
using OpenAI.Chat;
using System.ComponentModel;
using System.Text.Json;
using Xpense.Server.Helpers;
using Xpense.Server.Models;
using static System.Net.Mime.MediaTypeNames;

namespace Xpense.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public partial class ManualController : ControllerBase
    {
        
        /*MANUAL 

Create manual API
Post desc and cost to API
*for now* return Okay from API

* Later on save desc and and merchantName cost to Database*
*/
      
        // If you’re in a console app:
         // only inside async Main
                          // or RunAsync().GetAwaiter().GetResult();

        [HttpPost("EnterDC")]
        public async Task <IActionResult> PostData([FromBody] ExpenseEntry entry)
        {
            if (entry == null)
                return BadRequest("Invalid input");

            //categorize Expense
            var categorizedExpense = await CategorizingHelper.CategorizeExpense(entry);

            using SqlConnection conn = new SqlConnection("Server=tcp:xtrerversql.database.windows.net,1433;Initial Catalog=XT;Persist Security Info=False;User ID=soumikha;Password=Pass1w0rd!;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;");
            SqlCommand cmd = new SqlCommand("INSERT INTO expense (item, amount, merchant, expense_date,category,subcategory) VALUES (@item, @amount, @merchant, @expenseDate,@category,@subcategory)", conn);
            cmd.Parameters.AddWithValue("@item", categorizedExpense.Expense);
            cmd.Parameters.AddWithValue("@amount", categorizedExpense.Total_Amount);
            cmd.Parameters.AddWithValue("@merchant", categorizedExpense.MerchantName);
            cmd.Parameters.AddWithValue("@expenseDate", categorizedExpense.ExpenseDate);
            cmd.Parameters.AddWithValue("@category", categorizedExpense.Category);
            cmd.Parameters.AddWithValue("@subcategory", categorizedExpense.Subcategory);

            conn.Open();
            cmd.ExecuteNonQuery();
            conn.Close();


            // Do something with model.Field1 and model.Field2
            return Ok(new { message = "Data received!", data = entry });
        }
    }
}
