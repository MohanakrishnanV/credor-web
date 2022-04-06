using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class InvestmentOverviewDto
    {
        public string OfferingName { get; set; }
        public string EntityName { get; set; }
        public DateTime? Date { get; set; }
        public decimal InvestmentAmount { get; set; }
        public decimal FundedAmount { get; set; }
        public decimal Distributions { get; set; }
        public decimal EM { get; set; }
        public string Status { get; set; }
    }
    public class PortfolioDto
    {
        public int OfferingId { get; set; }
        public string OfferingName { get; set; }
        public decimal PortfolioPercentage { get; set; }
    }
}
