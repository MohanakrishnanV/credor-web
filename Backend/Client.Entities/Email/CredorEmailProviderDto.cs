using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Client.Entities
{
    public class CredorEmailProviderDto
    {
        public int Id { get; set; }
        public int AdminUserId { get; set; }
        public string EmailId { get; set; }
        public string IMAPHost { get; set; }
        public string SMTPHost { get; set; }
        public string Password { get; set; }
        public string DisplayName { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
        public DateTime ModifiedOn { get; set; }
        public string ModifiedBy { get; set; }
    }
}
