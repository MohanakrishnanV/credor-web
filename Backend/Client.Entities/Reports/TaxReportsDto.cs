using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities        
{
    public class TaxReportsDto
    {
        public string OfferingName { get; set; }
        public int OfferingId { get; set; }
        public string Name { get; set; }
        public string ProfileName { get; set; }
        public string ProfileType { get; set; }
        public string IsDisregardedEntity { get; set; }
        public string IsIRALLC { get; set; }
        public string ProfileDisplayId { get; set; }
        public string ProfileTaxId { get; set; }
        public decimal InvestmentAmount { get; set; }
        public decimal OperatingIncome { get; set; }
        public decimal RetainedEarnings { get; set; }
        public decimal ProceedsFromrRefi { get; set; }
        public decimal GainFromSales { get; set; }
        public decimal TotalReturnOfCapital { get; set; }
        public decimal PreferredReturn { get; set; }
        public decimal Interest { get; set; }
        public decimal InvestmentBalance { get; set; }
        public string FundedDate { get; set; }
        public decimal PercentageFunded { get; set; }
        public decimal PercentageOwnerShip { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
