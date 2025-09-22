using System;
namespace Xpense.Server.Models
{
	public class LineItem
	{
		private string Description
		{
			get; set;
		}
		private double? TotalPrice
		{
			get; set;
		}
		public LineItem(string d, double? tp)
		{
			Description = d;
			TotalPrice = tp;
	
		}
	}
}
