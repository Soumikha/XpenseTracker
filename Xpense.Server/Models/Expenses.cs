using System;
namespace Xpense.Server.Models
{
    public class Expenses
    {
        private string MerchantName
        {
            get; set;
        }
        private DateTimeOffset? TransactionDate
        {
            get; set;
        }
        private double? Total
        {
            get; set;
        }
       
        private List<LineItem> Items
        {
            get; set;
        }

        public Expenses(string merchantName, DateTimeOffset? transactionDate, double? total, List<LineItem> items)
        {
            MerchantName = merchantName;
            TransactionDate = transactionDate;
            Total = total;
            Items = items;
        }

    }
}
