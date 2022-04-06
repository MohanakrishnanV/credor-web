using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Credor.Data.Entities
{
    public class EmailRecipientGroup
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("CredorEmailDetail")]
        public int CredorEmailDetailId { get; set; }
        [ForeignKey("EmailRecipient")]
        public int? EmailRecipientId { get; set; }
        [ForeignKey("Tag")]
        public int? TagId { get; set; }
        [ForeignKey("UserAccount")]
        public int? UserId { get; set; }
        public string EmailId { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
