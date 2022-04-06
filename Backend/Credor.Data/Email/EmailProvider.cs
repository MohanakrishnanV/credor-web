using System;
using System.Collections.Generic;
using System.Text;

namespace Credor.Data.Entities
{
    public class EmailProvider
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string IMAP { get; set; }
        public string SMTP { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CreatedBy { get; set; }
    }
}
    