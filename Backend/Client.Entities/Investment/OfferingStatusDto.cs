using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class OfferingStatusDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool Active { get; set; }
    }
}
