using System;
namespace Xpense.Server.Models
{
	[Obsolete]
	public class LineItem
	{
		public string Description
		{
			get; set;
		}
		public double? TotalPrice
		{
			get; set;
		}
		public LineItem(string d, double? tp)
		{
			Description = d;
			TotalPrice = tp;
	
		}

		public LineItem()
		{

		}
	}
}
