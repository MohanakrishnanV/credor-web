using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Credor.Data.Entities
{
    public class CredorEmail
    {
        [Key]
        public int Id { get; set; }
        [ForeignKey("CredorEmailDetail")]
        public int? CredorEmailDetailId { get; set; }
        public string RecipientEmailId { get; set; }
        [ForeignKey("CredorEmailProvider")]
        public int? CredorEmailProviderId { get; set; }
        [ForeignKey("UserAccount")]
        public int UserId { get; set; }
        [ForeignKey("EmailType")]
        public int? EmailTypeId { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
