using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class FormDReportsDto
    {
        public int OfferingId { get; set; }
        public string State { get; set; }
        public int NoOfInvestors { get; set; }
        public decimal AmountFunded { get; set; }
        public string DateFirstFundReceived {get;set;}
        public int NonAccreditedInvestors { get; set; }
    }
}
