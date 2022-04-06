using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class DistributionsReportsDto
    {
        public string OfferingName { get; set; }
        public string Status { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string ProfileName { get; set; }
        public string ProfileId { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string ZipCode { get; set; }
        public string DisregardedEntity { get; set; }
        public string IRALLC { get; set; }
        public string ProfileTaxId { get; set; }
        public decimal InvestmentAmount { get; set; }
        public decimal PaymentAmount { get; set; }
        public decimal PercentageFunded { get; set; }
        public decimal PercentageOwnership { get; set; }
        public string SignedUpDate { get; set; }
        public DateTime PaymentDate { get; set; }
        public string FundedDate { get; set; }
        public string IsVerified { get; set; }
        public string IsSelfAccredited { get; set; }
        public string AccreditationVerifiedBy { get; set; }
        public string DistributionMethod { get; set; }
        public string BankName { get; set; }
        public string AccountType { get; set; }
        public string AccountNumber { get; set; }
        public string RoutingNumber { get; set; }
        public string OtherDetails { get; set; }
    }
}
