using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace Credor.Data.Entities
{
    public class CredorEmailDetail
    {
        [Key]
        public int Id { get; set; }
        public string Subject { get; set; }
        public DateTime? ScheduledOn { get; set; }
        public string FromName { get; set; }
        public string FromEmail { get; set; }
        public string ReplyTo { get; set; }
        public int EmailTypeId { get; set; }
        public int? EmailTemplateId { get; set; }
        public string EmailTemplate { get; set; }
        public string EmailDesign { get; set; }
        public int? FromEmailAddressId { get; set; }
        public int? SentTo { get; set; }
        public int? Delivered { get; set; }
        public int? Opened { get; set; }
        public int? Clicked { get; set; }
        public int? Bounced { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
