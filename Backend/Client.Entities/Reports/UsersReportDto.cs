using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class UsersReportDto
    {       
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string State { get; set; }
        public string Status { get; set; }
        public string IsVerified { get; set; }
        public string IsSelfAccredited { get; set; }
        public string AccreditationVerifiedBy { get; set; }
        public string Registered { get; set; }        
        public string SignUpDate { get; set; }
        public DateTime CreatedOn { get; set; }
        public string InvestmentCapacity { get; set; }
        public string LeadSource { get; set; }
        public List<string> AdditionalUsers { get; set; }
        public List<string> Notes { get; set; }
    }
}
