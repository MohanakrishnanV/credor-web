using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Credor.Data.Entities
{
    public class CredorFromEmailAddress
    {
        [Key]
        public int Id { get; set; }       
        public string FromName { get; set; }
        public string EmailId { get; set; }
        [ForeignKey("CredorDomain")]
        public int DomainId { get; set; }
        public string Password { get; set; }
        public bool Active { get; set; }
        public int Status { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
    }
}
