using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class EmailRecipientGroupDto
    {       
        public int Id { get; set; }       
        public int AdminUserId { get; set; }
        public int CredorEmailDetailId { get; set; }       
        public int? EmailRecipientId { get; set; }  
        public string EmailRecipientGroupName { get; set; }
        public int? TagId { get; set; }
        public string TagName { get; set; }
        public string EmailId { get; set; }
        public string EmailRecipientName { get; set; }
        public int? UserId { get; set; }
        public int Status { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
