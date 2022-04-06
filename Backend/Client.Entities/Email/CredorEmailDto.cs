using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class CredorEmailDto
    {
        public int Id { get; set; }
        public int AdminUserId { get; set; }
        public int? CredorEmailDetailId { get; set; }
        public string RecipientEmailId { get; set; }
        public int UserId { get; set; }
        public int? CredorEmailProviderId { get; set; }
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
