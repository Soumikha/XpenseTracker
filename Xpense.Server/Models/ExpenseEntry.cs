namespace Xpense.Server.Controllers
{
  
        public class ExpenseEntry
        {
            public string Expense { get; set; }
            public double? Total_Amount { get; set; }
            public string MerchantName { get; set;  }
            public DateTimeOffset? ExpenseDate { get; set; }

            public string? Category { get; set; }
            public string? Subcategory { get; set; }

            public ExpenseEntry()
            {
                
            }
            public ExpenseEntry(string e, double? ta, string mn, DateTimeOffset? ed)
            {
                Expense = e;
                Total_Amount = ta;
                MerchantName = mn;
                ExpenseDate = ed; 
            }
        }
    }

