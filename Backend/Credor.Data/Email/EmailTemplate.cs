using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Credor.Data.Entities
{
    public class EmailTemplate
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Template { get; set; }
        public string Design { get; set; }
        public string Description { get; set; }
        public bool IsDefault { get; set; }
        public bool Active { get; set; }
        public int Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
