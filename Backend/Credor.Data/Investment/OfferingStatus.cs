using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Data.Entities
{
    public class OfferingStatus
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }           
        public bool Active { get; set; }
    }
}
