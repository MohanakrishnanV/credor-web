using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class HeaderSummaryDto
    {
        public decimal ActiveInvestments { get; set; }
        public int TotalInvestments { get; set; }
        public decimal AverageInvestment { get; set; }
        public decimal InvestedAllTime { get; set; }
        public decimal Distributions { get; set; }
    }

    public class UserInvestorDto
    {
        public int AllUsers { get; set; }
        public int VerifiedUsers { get; set; }
        public int UnVerifiedUsers { get; set; }
        public int Investors { get; set; }
    }
}
