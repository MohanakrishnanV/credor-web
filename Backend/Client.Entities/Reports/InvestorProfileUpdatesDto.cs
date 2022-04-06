using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class InvestorProfileUpdatesDto
    {
        public string OfferingIds { get; set; }
        public string InvestorName { get; set; }
        public string ProfileName { get; set; }
        public string ProfileType { get; set; }
        public string Investments { get; set; }
        public string OldDetails {get;set;}
        public string NewDetails { get; set; }
        public DateTime UpdatedOn { get; set; }
        public string UpdatedBy { get; set; }
    }
}
