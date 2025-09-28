using System;
using System.Text.Json.Serialization;
namespace Xpense.Server.Models
{
    [Obsolete]
    public class Expenses
    {

        public string MerchantName
        {
            get; set;
        }
        public DateTimeOffset? TransactionDate
        {
            get; set;
        }
        public double? Total
        {
            get; set;
        }

        public List<LineItem> Items
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

        public Expenses()
        {


        }
    }
}
