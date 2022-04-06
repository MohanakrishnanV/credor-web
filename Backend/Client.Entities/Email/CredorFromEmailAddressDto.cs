using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class CredorFromEmailAddressDto
    {
        public int Id { get; set; }
        public int AdminUserId { get; set; }
        public string FromName { get; set; }
        public string EmailId { get; set; }
        public int DomainId { get; set; }
        public int Status { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
